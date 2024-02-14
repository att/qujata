import unittest
import time
from unittest.mock import patch, Mock

import requests
from flask import Flask
from config.settings import load_config
import src.utils.metrics_collection_manager as metrics_collection_manager
import src.services.k8s_service as k8s_service
import src.services.cadvisor_service as cadvisor_service
from src.utils.database_manager import DatabaseManager
from kubernetes.client import CoreV1Api, V1PodList, V1Pod, V1PodStatus, V1ObjectMeta, V1ContainerStatus

CADVISOR_URL = 'http://localhost:8080'
LIST_NAMESPACED_POD = 'kubernetes.client.CoreV1Api.list_namespaced_pod'
KUBERNETES_CONFIG = 'kubernetes.config.load_incluster_config'
POST_REQUEST = 'requests.post'


docker_response = { "docker": { "id": "id", "name": "/docker", "aliases": [ "docker", "docker" ], "namespace": "docker", "spec": { "creation_time": "2023-12-15T01:08:18.235177452Z", "labels": { "io.cri-containerd.kind": "container", "io.kubernetes.container.name": "curl", "io.kubernetes.pod.name": "qujata-curl-5565f95dbc-wf4dt", "io.kubernetes.pod.namespace": "qujata", "io.kubernetes.pod.uid": "9422c26d-d44c-4f7c-9901-b05c2d0d908d" }, "has_cpu": True, "cpu": { "limit": 2, "max_limit": 0, "mask": "0-3", "period": 100000 }, "has_memory": True, "memory": { "limit": 18446744073709551615, "swap_limit": 18446744073709551615 }, "has_hugetlb": False, "has_network": False, "has_processes": True, "processes": { "limit": 19178 }, "has_filesystem": False, "has_diskio": True, "has_custom_metrics": False, "image": "docker.io/qujata/curl:1.0.0" }, "stats": [ { "timestamp": "2023-12-25T21:07:14.471924967Z", "cpu": { "usage": { "total": 275599403000, "per_cpu_usage": [1, 1, 1, 1 ,1, 1], "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:18.546007469Z", "cpu": { "usage": { "total": 275599403000, "per_cpu_usage": [1, 1, 1, 1 ,1, 1], "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:58.564316069Z", "cpu": { "usage": { "total": 275599566000, "per_cpu_usage": [1, 1, 1, 1 ,1, 1], "user": 193932511000, "system": 81667054000 }, "load_average": 0 }, "memory": { "usage": 38428672 } } ] }}
k8s_response = { "id": "id", "name": "/kubepods.slice/xxx", "aliases": [ "a57b1eb676f6d93426d58ed45e063f76f67d23d1f42bf543d8e851af952d5a67", "/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod9422c26d_d44c_4f7c_9901_b05c2d0d908d.slice/cri-containerd-a57b1eb676f6d93426d58ed45e063f76f67d23d1f42bf543d8e851af952d5a67.scope" ], "namespace": "containerd", "spec": { "creation_time": "2023-12-15T01:08:18.235177452Z", "labels": { "io.cri-containerd.kind": "container", "io.kubernetes.container.name": "curl", "io.kubernetes.pod.name": "qujata-curl-5565f95dbc-wf4dt", "io.kubernetes.pod.namespace": "qujata", "io.kubernetes.pod.uid": "9422c26d-d44c-4f7c-9901-b05c2d0d908d" }, "has_cpu": True, "cpu": { "limit": 2, "max_limit": 0, "mask": "0-3", "period": 100000 }, "has_memory": True, "memory": { "limit": 18446744073709551615, "swap_limit": 18446744073709551615 }, "has_hugetlb": False, "has_network": False, "has_processes": True, "processes": { "limit": 19178 }, "has_filesystem": False, "has_diskio": True, "has_custom_metrics": False, "image": "docker.io/qujata/curl:1.0.0" }, "stats": [ { "timestamp": "2023-12-25T21:07:14.471924967Z", "cpu": { "usage": { "total": 275599403000, "per_cpu_usage": [1, 1, 1, 1 ,1, 1], "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:18.546007469Z", "cpu": { "usage": { "total": 275599403000, "per_cpu_usage": [1, 1, 1, 1 ,1, 1], "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:58.564316069Z", "cpu": { "usage": { "total": 275599566000, "per_cpu_usage": [1, 1, 1, 1 ,1, 1], "user": 193932511000, "system": 81667054000 }, "load_average": 0 }, "memory": { "usage": 38428672 } } ] }
expected_curl_metrics_collector_data = {'2023-12-25T21:07:18.546007469Z': {'cpu_cores': 0.0, 'cpu': 0.0, 'memory': 36.6484375}, '2023-12-25T21:07:58.564316069Z': {'cpu_cores': 4.073167074816332e-06, 'cpu': 6.788611791360554e-07, 'memory': 36.6484375}}
expected_nginx_metrics_collector_data = {'2023-12-25T21:07:18.546007469Z': {'cpu_cores': 0.0, 'cpu': 0.0, 'memory': 36.6484375}, '2023-12-25T21:07:58.564316069Z': {'cpu_cores': 4.073167074816332e-06, 'cpu': 6.788611791360554e-07, 'memory': 36.6484375}}

class TestMetricsService(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)


    def test_collecting_docker(self):
        cadvisor_service.init('docker', CADVISOR_URL)
        with patch(POST_REQUEST) as mock_post:
            mock_post.return_value.status_code = 200
            mock_post.return_value.json.return_value = docker_response
            metrics_collection_manager.start_collecting()
            self.assertTrue(metrics_collection_manager.client_collector._MetricsCollector__locked)
            self.assertTrue(metrics_collection_manager.server_collector._MetricsCollector__locked)
            time.sleep(5)
            metrics_collection_manager.stop_collecting()
            self.assertEqual(mock_post.call_count, 10) # 10: 5 for curl, and 5 for nginx (2 requests per sec)
            actual_curl, actual_nginx = metrics_collection_manager.get_metrics()
            self.assertEqual(actual_curl, expected_curl_metrics_collector_data)
            self.assertEqual(actual_nginx, expected_nginx_metrics_collector_data)

      
    def test_collecting_k8s_with_cri_containerd(self):
        cadvisor_service.init('kubernetes', CADVISOR_URL)
        k8s_service.__kubernetes_client = Mock(spec=CoreV1Api)
        mock_container_status = V1ContainerStatus(
            container_id="containerd://mockedcontainerid",
            image="dockerimage",
            image_id="imageid",
            name="name",
            ready="ready",
            restart_count=1
        )

        mock_pod = V1Pod(
            status=V1PodStatus(
                phase="Running",
                host_ip="192.168.1.2",
                pod_ip="192.168.1.2",
                container_statuses=[mock_container_status]
            ),
            metadata=V1ObjectMeta(
                name="test-pod",
                namespace="test-namespace",
                uid="caaed639-9b30-4540-b4f4-7e0f119ad172"
            )
        )
        mock_pod_list = V1PodList(
            items=[mock_pod],
        )
        with patch(LIST_NAMESPACED_POD) as mock_list_pod:
            with patch(KUBERNETES_CONFIG):
                k8s_service.init_cluster()
                with patch(POST_REQUEST) as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_collection_manager.start_collecting()
                    self.assertTrue(metrics_collection_manager.client_collector._MetricsCollector__locked)
                    self.assertTrue(metrics_collection_manager.server_collector._MetricsCollector__locked)
                    time.sleep(5)
                    metrics_collection_manager.stop_collecting()
                    self.assertEqual(mock_post.call_count, 10) # 10: 5 for curl, and 5 for nginx (2 requests per sec)
                    actual_curl, actual_nginx = metrics_collection_manager.get_metrics()
                    self.assertEqual(actual_curl, expected_curl_metrics_collector_data)
                    self.assertEqual(actual_nginx, expected_nginx_metrics_collector_data)


    def test_collecting_k8s_with_cri_docker(self):
        cadvisor_service.init('kubernetes', CADVISOR_URL)
        k8s_service.__kubernetes_client = Mock(spec=CoreV1Api)
        mock_container_status = V1ContainerStatus(
            container_id="docker://mockedcontainerid",
            image="dockerimage",
            image_id="imageid",
            name="name",
            ready="ready",
            restart_count=1
        )

        mock_pod = V1Pod(
            status=V1PodStatus(
                phase="Running",
                host_ip="192.168.1.2",
                pod_ip="192.168.1.2",
                container_statuses=[mock_container_status]
            ),
            metadata=V1ObjectMeta(
                name="test-pod",
                namespace="test-namespace",
                uid="caaed639-9b30-4540-b4f4-7e0f119ad172"
            )
        )
        mock_pod_list = V1PodList(
            items=[mock_pod],
        )
        with patch(LIST_NAMESPACED_POD) as mock_list_pod:
            with patch(KUBERNETES_CONFIG):
                k8s_service.init_cluster()
                with patch(POST_REQUEST) as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_collection_manager.start_collecting()
                    self.assertTrue(metrics_collection_manager.client_collector._MetricsCollector__locked)
                    self.assertTrue(metrics_collection_manager.server_collector._MetricsCollector__locked)
                    time.sleep(5)
                    metrics_collection_manager.stop_collecting()
                    self.assertEqual(mock_post.call_count, 10) # 10: 5 for curl, and 5 for nginx (2 requests per sec)
                    actual_curl, actual_nginx = metrics_collection_manager.get_metrics()
                    self.assertEqual(actual_curl, expected_curl_metrics_collector_data)
                    self.assertEqual(actual_nginx, expected_nginx_metrics_collector_data)


    @patch('logging.error')           
    def test_collecting_k8s_with_unsupported_cri(self, mock_log):
        cadvisor_service.init('kubernetes', CADVISOR_URL)
        k8s_service.__kubernetes_client = Mock(spec=CoreV1Api)
        mock_container_status = V1ContainerStatus(
            container_id="unsupported-cri://mockedcontainerid",
            image="dockerimage",
            image_id="imageid",
            name="name",
            ready="ready",
            restart_count=1
        )

        mock_pod = V1Pod(
            status=V1PodStatus(
                phase="Running",
                host_ip="192.168.1.2",
                pod_ip="192.168.1.2",
                container_statuses=[mock_container_status]
            ),
            metadata=V1ObjectMeta(
                name="test-pod",
                namespace="test-namespace",
                uid="caaed639-9b30-4540-b4f4-7e0f119ad172"
            )
        )
        mock_pod_list = V1PodList(
            items=[mock_pod],
        )
        with patch(LIST_NAMESPACED_POD) as mock_list_pod:
            with patch(KUBERNETES_CONFIG):
                k8s_service.init_cluster()
                with patch(POST_REQUEST) as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_collection_manager.start_collecting()
                    self.assertFalse(metrics_collection_manager.client_collector._MetricsCollector__locked)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', RuntimeError('cri: unsupported-cri not supported'), exc_info=True)")


    @patch('logging.error')     
    def test_collecting_when_locked(self, mock_log):
        cadvisor_service.init('docker', CADVISOR_URL)
        with patch(POST_REQUEST) as mock_post:
            mock_post.return_value.status_code = 200
            mock_post.return_value.json.return_value = docker_response
            metrics_collection_manager.client_collector._MetricsCollector__locked = True
            metrics_collection_manager.server_collector._MetricsCollector__locked = True
            metrics_collection_manager.start_collecting()
            self.assertEqual(mock_post.call_count, 0)
            metrics_collection_manager.client_collector._MetricsCollector__locked = False
            metrics_collection_manager.client_collector._MetricsCollector__locked = False
            self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] collector is already running', exc_info=True)")


    @patch('logging.error')
    def test_collecting_when_init_k8s_failed(self, mock_log):
        cadvisor_service.init('kubernetes', CADVISOR_URL)
        with patch(KUBERNETES_CONFIG):
            with patch(LIST_NAMESPACED_POD, side_effect=requests.exceptions.RequestException("Test exception")):
                with patch(POST_REQUEST) as mock_post:
                    k8s_service.init_cluster()
                    metrics_collection_manager.start_collecting()
                    self.assertEqual(mock_post.call_count, 0)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', RequestException('Test exception'), exc_info=True)")


    @patch('logging.error')
    def test_collecting_k8s_when_pod_items_is_empty(self, mock_log):
        cadvisor_service.init('kubernetes', CADVISOR_URL)
        k8s_service.__kubernetes_client = Mock(spec=CoreV1Api)
        
        mock_pod_list = V1PodList(
            items=[],
        )
        with patch(LIST_NAMESPACED_POD) as mock_list_pod:
            with patch(KUBERNETES_CONFIG):
                k8s_service.init_cluster()
                with patch(POST_REQUEST) as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_collection_manager.start_collecting()
                    self.assertEqual(mock_post.call_count, 0)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', RuntimeError('qujata-curl pod not found'), exc_info=True)")
                    self.assertEqual(str(mock_log.call_args_list[1]), "call('[MetricCollector] Failed to collect metrics with error: %s', RuntimeError('qujata-nginx pod not found'), exc_info=True)")


    @patch('logging.error')
    def test_collecting_k8s_when_cadvisor_pod_not_found(self, mock_log):
        cadvisor_service.init('kubernetes', CADVISOR_URL)
        k8s_service.__kubernetes_client = Mock(spec=CoreV1Api)
        
        mock_container_status = V1ContainerStatus(
            container_id="unsupported-cri://mockedcontainerid",
            image="dockerimage",
            image_id="imageid",
            name="name",
            ready="ready",
            restart_count=1
        )

        mock_pod1 = V1Pod(
            status=V1PodStatus(
                phase="Running",
                host_ip="192.168.1.2",
                pod_ip="192.168.1.2",
                container_statuses=[mock_container_status]
            ),
            metadata=V1ObjectMeta(
                name="test-pod",
                namespace="test-namespace",
                uid="caaed639-9b30-4540-b4f4-7e0f119ad172"
            )
        )
        mock_pod2 = V1Pod(
            status=V1PodStatus(
                phase="Running",
                host_ip="192.168.1.3",
                pod_ip="192.168.1.3",
                container_statuses=[mock_container_status]
            ),
            metadata=V1ObjectMeta(
                name="test-pod",
                namespace="test-namespace",
                uid="caaed639-9b30-4540-b4f4-7e0f119ad172"
            )
        )
        mock_pod_list1 = V1PodList(
            items=[mock_pod1],
        )
        mock_pod_list2 = V1PodList(
            items=[mock_pod2],
        )
        with patch(LIST_NAMESPACED_POD) as mock_list_pod:
            mock_list_pod.side_effect = [mock_pod_list1, mock_pod_list2, mock_pod_list1, mock_pod_list2]
            with patch(KUBERNETES_CONFIG):
                k8s_service.init_cluster()
                with patch(POST_REQUEST) as mock_post:
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_collection_manager.start_collecting()
                    self.assertEqual(mock_post.call_count, 0)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', RuntimeError('qujata-cadvisor pod not found with host_ip: 192.168.1.2'), exc_info=True)")
                    self.assertEqual(str(mock_log.call_args_list[1]), "call('[MetricCollector] Failed to collect metrics with error: %s', RuntimeError('qujata-cadvisor pod not found with host_ip: 192.168.1.2'), exc_info=True)")


if __name__ == '__main__':
    unittest.main()
