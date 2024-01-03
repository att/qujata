import unittest
import time
from datetime import datetime, timezone
from unittest.mock import patch, MagicMock, Mock, call, ANY

import requests
from flask import Flask
from config.settings import load_config
import src.services.metrics_service as metrics_service
import src.services.k8s_service as k8s_service
import src.services.cadvisor_service as cadvisor_service
from src.models.test_run_metric import TestRunMetric
from src.enums.metric import Metric
from src.models.test_run import TestRun
import logging
from src.utils.database_manager import DatabaseManager
from kubernetes.client import CoreV1Api, V1PodList, V1Pod, V1PodStatus, V1ObjectMeta, V1ContainerStatus



docker_response = { "docker":{ "id": "id", "name": "/docker", "aliases": [ "docker", "docker" ], "namespace": "docker", "spec": { "creation_time": "2023-12-15T01:08:18.235177452Z", "labels": { "io.cri-containerd.kind": "container", "io.kubernetes.container.name": "curl", "io.kubernetes.pod.name": "qujata-curl-5565f95dbc-wf4dt", "io.kubernetes.pod.namespace": "qujata", "io.kubernetes.pod.uid": "9422c26d-d44c-4f7c-9901-b05c2d0d908d" }, "has_cpu": True, "cpu": { "limit": 2, "max_limit": 0, "mask": "0-3", "period": 100000 }, "has_memory": True, "memory": { "limit": 18446744073709551615, "swap_limit": 18446744073709551615 }, "has_hugetlb": False, "has_network": False, "has_processes": True, "processes": { "limit": 19178 }, "has_filesystem": False, "has_diskio": True, "has_custom_metrics": False, "image": "docker.io/qujata/curl:1.0.0" }, "stats": [ { "timestamp": "2023-12-25T21:07:14.471924967Z", "cpu": { "usage": { "total": 275599403000, "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:18.546007469Z", "cpu": { "usage": { "total": 275599403000, "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:58.564316069Z", "cpu": { "usage": { "total": 275599566000, "user": 193932511000, "system": 81667054000 }, "load_average": 0 }, "memory": { "usage": 38428672 } } ] }}
k8s_response = { "id": "id", "name": "/kubepods.slice/xxx", "aliases": [ "a57b1eb676f6d93426d58ed45e063f76f67d23d1f42bf543d8e851af952d5a67", "/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod9422c26d_d44c_4f7c_9901_b05c2d0d908d.slice/cri-containerd-a57b1eb676f6d93426d58ed45e063f76f67d23d1f42bf543d8e851af952d5a67.scope" ], "namespace": "containerd", "spec": { "creation_time": "2023-12-15T01:08:18.235177452Z", "labels": { "io.cri-containerd.kind": "container", "io.kubernetes.container.name": "curl", "io.kubernetes.pod.name": "qujata-curl-5565f95dbc-wf4dt", "io.kubernetes.pod.namespace": "qujata", "io.kubernetes.pod.uid": "9422c26d-d44c-4f7c-9901-b05c2d0d908d" }, "has_cpu": True, "cpu": { "limit": 2, "max_limit": 0, "mask": "0-3", "period": 100000 }, "has_memory": True, "memory": { "limit": 18446744073709551615, "swap_limit": 18446744073709551615 }, "has_hugetlb": False, "has_network": False, "has_processes": True, "processes": { "limit": 19178 }, "has_filesystem": False, "has_diskio": True, "has_custom_metrics": False, "image": "docker.io/qujata/curl:1.0.0" }, "stats": [ { "timestamp": "2023-12-25T21:07:14.471924967Z", "cpu": { "usage": { "total": 275599403000, "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:18.546007469Z", "cpu": { "usage": { "total": 275599403000, "user": 193932396000, "system": 81667006000 } }, "memory": { "usage": 38428672 } }, { "timestamp": "2023-12-25T21:07:58.564316069Z", "cpu": { "usage": { "total": 275599566000, "user": 193932511000, "system": 81667054000 }, "load_average": 0 }, "memory": { "usage": 38428672 } } ] }


class TestMetricsService(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)

    def __test_run(self):
        return TestRun(
            id=1,
            start_time = datetime(2023, 12, 25, 21, 6, 0, tzinfo=timezone.utc)
        )

    def test_collecting_docker(self):
        cadvisor_service.init('docker', 'http://localhost:8080')
        with patch('requests.post') as mock_post:
            mock_post.return_value.status_code = 200
            mock_post.return_value.json.return_value = docker_response
            metrics_service.start_collecting()
            self.assertTrue(metrics_service.client_collector._MetricsCollector__locked)
            self.assertTrue(metrics_service.server_collector._MetricsCollector__locked)
            time.sleep(5)
            metrics_service.stop_collecting()
            self.assertEqual(mock_post.call_count, 10) # 10: 5 for curl, and 5 for nginx (2 requests per sec)
            expected_curl_data = {'2023-12-25T21:07:18.546007469Z': {'cpu': 0.0, 'memory': 36.6484375}, '2023-12-25T21:07:58.564316069Z': {'cpu': 4.073167074816332e-06, 'memory': 36.6484375}}
            self.assertEqual(metrics_service.client_collector.get_data(), expected_curl_data)
            with self.app.app_context():
                metrics_service.save(self.__test_run())
                metrics = self.app.database_manager.create.call_args_list
                self.assertEqual(metrics[0].args[0].metric_name, Metric.CLIENT_AVERAGE_CPU)
                self.assertEqual(metrics[0].args[0].value, 0.0)
                self.assertEqual(metrics[1].args[0].metric_name, Metric.CLIENT_AVERAGE_MEMORY)
                self.assertEqual(metrics[1].args[0].value, 37.0)
                self.assertEqual(metrics[2].args[0].metric_name, Metric.SERVER_AVERAGE_CPU)
                self.assertEqual(metrics[2].args[0].value, 0.0)
                self.assertEqual(metrics[3].args[0].metric_name, Metric.SERVER_AVERAGE_MEMORY)
                self.assertEqual(metrics[3].args[0].value, 37.0)
                self.assertEqual(self.app.database_manager.create.call_count, 4)# cpu & memory for curl & nginx = 4
      
    def test_collecting_k8s_with_cri_containerd(self):
        cadvisor_service.init('kubernetes', 'http://localhost:8080')
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
        with patch('kubernetes.client.CoreV1Api.list_namespaced_pod') as mock_list_pod:
            with patch('kubernetes.config.load_incluster_config') as load_incluster_config:
                k8s_service.init_cluster()
                with patch('requests.post') as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_service.start_collecting()
                    self.assertTrue(metrics_service.client_collector._MetricsCollector__locked)
                    self.assertTrue(metrics_service.server_collector._MetricsCollector__locked)
                    time.sleep(5)
                    metrics_service.stop_collecting()
                    self.assertEqual(mock_post.call_count, 10) # 10: 5 for curl, and 5 for nginx (2 requests per sec)
                    expected_curl_data = {'2023-12-25T21:07:18.546007469Z': {'cpu': 0.0, 'memory': 36.6484375}, '2023-12-25T21:07:58.564316069Z': {'cpu': 4.073167074816332e-06, 'memory': 36.6484375}}
                    self.assertEqual(metrics_service.client_collector.get_data(), expected_curl_data)
                    with self.app.app_context():
                        metrics_service.save(self.__test_run())
                        metrics = self.app.database_manager.create.call_args_list
                        self.assertEqual(metrics[0].args[0].metric_name, Metric.CLIENT_AVERAGE_CPU)
                        self.assertEqual(metrics[0].args[0].value, 0.0)
                        self.assertEqual(metrics[1].args[0].metric_name, Metric.CLIENT_AVERAGE_MEMORY)
                        self.assertEqual(metrics[1].args[0].value, 37.0)
                        self.assertEqual(metrics[2].args[0].metric_name, Metric.SERVER_AVERAGE_CPU)
                        self.assertEqual(metrics[2].args[0].value, 0.0)
                        self.assertEqual(metrics[3].args[0].metric_name, Metric.SERVER_AVERAGE_MEMORY)
                        self.assertEqual(metrics[3].args[0].value, 37.0)
                        self.assertEqual(self.app.database_manager.create.call_count, 4)# cpu & memory for curl & nginx = 4


    def test_collecting_k8s_with_cri_docker(self):
        cadvisor_service.init('kubernetes', 'http://localhost:8080')
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
        with patch('kubernetes.client.CoreV1Api.list_namespaced_pod') as mock_list_pod:
            with patch('kubernetes.config.load_incluster_config') as load_incluster_config:
                k8s_service.init_cluster()
                with patch('requests.post') as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_service.start_collecting()
                    self.assertTrue(metrics_service.client_collector._MetricsCollector__locked)
                    self.assertTrue(metrics_service.server_collector._MetricsCollector__locked)
                    time.sleep(5)
                    metrics_service.stop_collecting()
                    self.assertEqual(mock_post.call_count, 10) # 10: 5 for curl, and 5 for nginx (2 requests per sec)
                    expected_curl_data = {'2023-12-25T21:07:18.546007469Z': {'cpu': 0.0, 'memory': 36.6484375}, '2023-12-25T21:07:58.564316069Z': {'cpu': 4.073167074816332e-06, 'memory': 36.6484375}}
                    self.assertEqual(metrics_service.client_collector.get_data(), expected_curl_data)
                    with self.app.app_context():
                        metrics_service.save(self.__test_run())
                        metrics = self.app.database_manager.create.call_args_list
                        self.assertEqual(metrics[0].args[0].metric_name, Metric.CLIENT_AVERAGE_CPU)
                        self.assertEqual(metrics[0].args[0].value, 0.0)
                        self.assertEqual(metrics[1].args[0].metric_name, Metric.CLIENT_AVERAGE_MEMORY)
                        self.assertEqual(metrics[1].args[0].value, 37.0)
                        self.assertEqual(metrics[2].args[0].metric_name, Metric.SERVER_AVERAGE_CPU)
                        self.assertEqual(metrics[2].args[0].value, 0.0)
                        self.assertEqual(metrics[3].args[0].metric_name, Metric.SERVER_AVERAGE_MEMORY)
                        self.assertEqual(metrics[3].args[0].value, 37.0)
                        self.assertEqual(self.app.database_manager.create.call_count, 4)# cpu & memory for curl & nginx = 4
            

    @patch('logging.error')           
    def test_collecting_k8s_with_unsupported_cri(self, mock_log):
        cadvisor_service.init('kubernetes', 'http://localhost:8080')
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
        with patch('kubernetes.client.CoreV1Api.list_namespaced_pod') as mock_list_pod:
            with patch('kubernetes.config.load_incluster_config') as load_incluster_config:
                k8s_service.init_cluster()
                with patch('requests.post') as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_service.start_collecting()
                    self.assertFalse(metrics_service.client_collector._MetricsCollector__locked)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', Exception('cri: unsupported-cri not supported'), exc_info=True)")


    @patch('logging.error')     
    def test_collecting_when_locked(self, mock_log):
        cadvisor_service.init('docker', 'http://localhost:8080')
        with patch('requests.post') as mock_post:
            mock_post.return_value.status_code = 200
            mock_post.return_value.json.return_value = docker_response
            metrics_service.client_collector._MetricsCollector__locked = True
            metrics_service.server_collector._MetricsCollector__locked = True
            metrics_service.start_collecting()
            self.assertEqual(mock_post.call_count, 0)
            metrics_service.client_collector._MetricsCollector__locked = False
            metrics_service.client_collector._MetricsCollector__locked = False
            self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] collector is already running', exc_info=True)")


    @patch('logging.error')
    def test_collecting_when_init_k8s_failed(self, mock_log):
        cadvisor_service.init('kubernetes', 'http://localhost:8080')
        with patch('kubernetes.config.load_incluster_config') as load_incluster_config:
            with patch('kubernetes.client.CoreV1Api.list_namespaced_pod', side_effect=requests.exceptions.RequestException("Test exception")) as mock_list_pod:
                with patch('requests.post') as mock_post:
                    k8s_service.init_cluster()
                    metrics_service.start_collecting()
                    self.assertEqual(mock_post.call_count, 0)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', RequestException('Test exception'), exc_info=True)")


    @patch('logging.error')
    def test_collecting_k8s_when_pod_items_is_empty(self, mock_log):
        cadvisor_service.init('kubernetes', 'http://localhost:8080')
        k8s_service.__kubernetes_client = Mock(spec=CoreV1Api)
        
        mock_pod_list = V1PodList(
            items=[],
        )
        with patch('kubernetes.client.CoreV1Api.list_namespaced_pod') as mock_list_pod:
            with patch('kubernetes.config.load_incluster_config') as load_incluster_config:
                k8s_service.init_cluster()
                with patch('requests.post') as mock_post:
                    mock_list_pod.return_value = mock_pod_list
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_service.start_collecting()
                    self.assertEqual(mock_post.call_count, 0)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', Exception('qujata-curl pod not found'), exc_info=True)")
                    self.assertEqual(str(mock_log.call_args_list[1]), "call('[MetricCollector] Failed to collect metrics with error: %s', Exception('qujata-nginx pod not found'), exc_info=True)")


    @patch('logging.error')
    def test_collecting_k8s_when_cadvisor_pod_not_found(self, mock_log):
        cadvisor_service.init('kubernetes', 'http://localhost:8080')
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
        with patch('kubernetes.client.CoreV1Api.list_namespaced_pod') as mock_list_pod:
            mock_list_pod.side_effect = [mock_pod_list1, mock_pod_list2, mock_pod_list1, mock_pod_list2]
            with patch('kubernetes.config.load_incluster_config') as load_incluster_config:
                k8s_service.init_cluster()
                with patch('requests.post') as mock_post:
                    mock_post.return_value.status_code = 200
                    mock_post.return_value.json.return_value = k8s_response
                    metrics_service.start_collecting()
                    self.assertEqual(mock_post.call_count, 0)
                    self.assertEqual(str(mock_log.call_args_list[0]), "call('[MetricCollector] Failed to collect metrics with error: %s', Exception('qujata-cadvisor pod not found with host_ip: 192.168.1.2'), exc_info=True)")
                    self.assertEqual(str(mock_log.call_args_list[1]), "call('[MetricCollector] Failed to collect metrics with error: %s', Exception('qujata-cadvisor pod not found with host_ip: 192.168.1.2'), exc_info=True)")
                    
                    


if __name__ == '__main__':
    unittest.main()
