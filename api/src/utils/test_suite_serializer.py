from src.enums.metric import Metric

def serialize(test_suite):
    response_data = {
        "id": test_suite.id,
        "name": test_suite.name,
        "description": test_suite.description,
        "code_release": test_suite.code_release,
        "start_time": test_suite.start_time,
        "end_time": test_suite.end_time,
        "environment_info": __get_environment_info(test_suite.env_info),
        "test_runs": __get_test_runs_metrics(test_suite.test_runs)
    }
    return response_data


def __get_environment_info(env_info):
    return {
        "resource_name": env_info.resource_name,
        "operating_system": env_info.operating_system,
        "cpu": env_info.cpu,
        "cpu_architecture": env_info.cpu_architecture,
        "cpu_cores": env_info.cpu_cores,
        "cpu_clock_speed": env_info.clock_speed,
        "node_size": env_info.node_size
    }


def __get_test_runs_metrics(test_runs):
    test_runs_list = []
    for test_run in test_runs:
        metrics = test_run.test_run_metrics
        cpu_avg, memory_avg = __calculate_cpu_memory_avg(metrics)
        request_throughput, bytes_throughput = get_throughput_metrics(metrics)
        results = {
            "id": test_run.id,
            "algorithm": test_run.algorithm,
            "iterations": test_run.iterations,
            "message_size": test_run.message_size,
            "results": {
                "average_cpu": round(cpu_avg, 2),
                "average_memory": int(memory_avg),
                "request_throughput": int(request_throughput),
                "bytes_throughput": int(bytes_throughput)
            }
        }
        test_runs_list.append(results)
    return test_runs_list


def __calculate_cpu_memory_avg(test_run_metrics):
    cpu_avg, memory_avg = 0.00, 0

    for metric in test_run_metrics:
        if metric.metric_name in (Metric.CLIENT_AVERAGE_CPU, Metric.SERVER_AVERAGE_CPU):
            cpu_avg += metric.value
        elif metric.metric_name in (Metric.CLIENT_AVERAGE_MEMORY, Metric.SERVER_AVERAGE_MEMORY):
            memory_avg += metric.value

    return cpu_avg, memory_avg


def get_throughput_metrics(test_run_metrics):
    return __find_metric(test_run_metrics, Metric.MESSAGES_THROUGHPUT_PER_SECOND), __find_metric(test_run_metrics, Metric.BYTES_THROUGHPUT_PER_SECOND)


def __find_metric(test_run_metrics, metric_name):
    return next((metric.value for metric in test_run_metrics if metric.metric_name == metric_name), 0)