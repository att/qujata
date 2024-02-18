import src.services.k8s_service as k8s_service
import requests
import pandas as pd
from src.enums.environment import Environment

DOCKER_METRICS_URL = "{}/api/v1.3/docker/{}"
K8S_DOCKER_CRI_METRCIS_URL = "http://{}:8080/api/v1.3/containers/kubepods/kubepods/besteffort/pod{}/{}"
K8S_CONTAINERD_CRI_METRCIS_URL = "http://{}:8080/api/v1.3/containers/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod{}.slice/cri-containerd-{}.scope"

CADVISOR_SERVICE_NAME = "qujata-cadvisor"
LABEL="app"
ONE_MEGABYTE = 1024 * 1024

__environment = None
__cadvisor_url = None


def init(environment, cadvisor_url):
    global __environment, __cadvisor_url
    __environment = environment
    __cadvisor_url = cadvisor_url


def get_metrics_url(service_name):
    if __environment == Environment.DOCKER.value:
        return __build_docker_metrics_url(service_name)
    elif __environment == Environment.KUBERNETES.value:
        return __build_k8s_metrics_url(service_name)
    else:
        raise RuntimeError("Invalid Environment: " + __environment)


def __build_docker_metrics_url(service_name):
    return DOCKER_METRICS_URL.format(__cadvisor_url, service_name)


def __build_k8s_metrics_url(service_name):
    pod = k8s_service.get_pod_by_label(LABEL, service_name)
    cadvisor_pod = k8s_service.get_pod_by_label_and_host(LABEL, CADVISOR_SERVICE_NAME, pod.status.host_ip)
    pod_uid = pod.metadata.uid
    cri, container_id = pod.status.container_statuses[0].container_id.split("://")
    cadvisor_host = cadvisor_pod.status.pod_ip

    if cri == "docker":
        return K8S_DOCKER_CRI_METRCIS_URL.format(cadvisor_host, pod_uid, container_id)
    elif cri == "containerd":
        return K8S_CONTAINERD_CRI_METRCIS_URL.format(cadvisor_host, pod_uid.replace("-","_"), container_id)
    else:
        raise RuntimeError("cri: " + cri + " not supported")

        
def get_metrics(metrics_url):
    stats = __get_stats(metrics_url)
    data = {}
    for i in range(1, len(stats)):
        cur = stats[i]
        prev = stats[i - 1]
        interval_ns = __get_interval(cur['timestamp'], prev['timestamp'])
        cpu_cores_val = (cur['cpu']['usage']['total'] - prev['cpu']['usage']['total']) / interval_ns
        cpu_val = cpu_cores_val / len(cur['cpu']['usage']['per_cpu_usage'])
        memory_val = cur['memory']['usage'] / ONE_MEGABYTE
        data[cur['timestamp']] = {"cpu_cores": cpu_cores_val, "cpu": cpu_val, "memory": memory_val}
    return data


def  __get_stats(metrics_url):
    body = {"num_stats":10,"num_samples":0}
    headers = { 'Content-Type': 'application/json' }
    response = requests.post(metrics_url, headers=headers, json=body)
    result = response.json()
    return result["stats"] if "stats" in result else list(result.values())[0]["stats"]


def __get_interval(current, previous):
    cur = pd.Timestamp(current)
    prev = pd.Timestamp(previous)
    return (int(cur.value/1000000) - int(prev.value/1000000)) * 1000000
