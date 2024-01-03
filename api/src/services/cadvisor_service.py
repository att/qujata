import src.services.k8s_service as k8s_service

DOCKER_METRCIS_URL = "{}/api/v1.3/docker/{}"
K8S_DOCKER_CRI_METRCIS_URL = "http://{}:8080/api/v1.3/containers/kubepods/kubepods/besteffort/pod{}/{}"
K8S_CONTAINERD_CRI_METRCIS_URL = "http://{}:8080/api/v1.3/containers/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod{}.slice/cri-containerd-{}.scope"

CADVISOR_SERVICE_NAME = "qujata-cadvisor"
APP_LABEL="app"

__environment = None
__cadvisor_url = None


def init(environment, cadvisor_url):
    global __environment, __cadvisor_url
    __environment = environment
    __cadvisor_url = cadvisor_url

def get_metrics_url(service_name):
    if __environment == "docker":
        return __build_docker_metrics_url(service_name)
    else: #__environment == 'kubernetes'
        return __build_k8s_metrics_url(service_name)


def __build_docker_metrics_url(service_name):
    return DOCKER_METRCIS_URL.format(__cadvisor_url, service_name)

def __build_k8s_metrics_url(service_name):
    pod = k8s_service.get_pod_by_label(APP_LABEL, service_name)
    cadvisor_pod = k8s_service.get_pod_by_label_and_host(APP_LABEL, CADVISOR_SERVICE_NAME, pod.status.host_ip)
    
    pod_uid = pod.metadata.uid
    cri, container_id = pod.status.container_statuses[0].container_id.split("://")
    cadvisor_host = cadvisor_pod.status.pod_ip

    if cri == "docker":
        return K8S_DOCKER_CRI_METRCIS_URL.format(cadvisor_host, pod_uid, container_id)
    elif cri == "containerd":
        return K8S_CONTAINERD_CRI_METRCIS_URL.format(cadvisor_host, pod_uid.replace("-","_"), container_id)
    else:
        raise RuntimeError("cri: " + cri + " not supported")

        







