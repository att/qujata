from kubernetes import client, config

NAMESPACE = 'qujata'

__kubernetes_client = None

def init_cluster():
    global __kubernetes_client
    config.load_incluster_config()
    __kubernetes_client = client.CoreV1Api()

def get_pod_by_label(label_name, label_value):
    pods = __get_pods_by_label("=".join([label_name, label_value]))
    if pods.items is False:
        raise Exception(label_value + " pod not found")
    return pods.items[0] # for now, we handle only one running pod. in the future, we should handle multiple pods.


def get_pod_by_label_and_host(label_name, label_value, host):
    pods = __get_pods_by_label("=".join([label_name, label_value]))
    for pod in pods.items:
        if pod.status.host_ip == host:
            return pod
    raise Exception(label_value + " pod not found with host_ip: " + host)


def __get_pods_by_label(label):
    return __kubernetes_client.list_namespaced_pod(NAMESPACE, label_selector=label)
