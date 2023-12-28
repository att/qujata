from kubernetes import client, config

NAMESPACE = 'qujata'

__kuberenetes_client = None

def init_cluster():
    config.load_incluster_config()
    __kuberenetes_client = client.CoreV1Api()

def get_pod_by_prefix(pod_prefix):
    pod = get_pod_by_condition(lambda pod: pod.metadata.name.startswith(service_name))
    if pod is None:
        raise Exception(pod_prefix + " pod not found")
    return pod

def get_pod_by_prefix_and_host(pod_prefix, host):
    pod = get_pod_by_condition(lambda pod: pod.metadata.name.startswith("qujata-cadvisor") and pod.status.host_ip == host)
    if pod is None:
        raise Exception(pod_prefix + " pod not found with host_ip: " + host)
    return pod


def get_pod_by_condition(condition):
    pods = __kuberenetes_client.list_namespaced_pod(NAMESPACE)
    pod = None
    for p in pods.items:
        if condition(p):
            pod = p
            break
    return pod
