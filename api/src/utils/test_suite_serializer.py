import logging

from src.enums.metric import Metric

def serialize(test_suite):
    response_data = {
        "id": test_suite.id,
        "name": test_suite.name,
        "description": test_suite.description,
        "codeRelease": test_suite.code_release,
        "start_time": test_suite.start_time,
        "end_time": test_suite.end_time,
        "environment_info": __get_environment_info(test_suite.env_info),
        "testRuns": __get_test_runs_metrics(test_suite.test_runs)
    }
    return response_data


def __get_environment_info(env_info):
    return {
        "resourceName": env_info.resource_name,
        "operatingSystem": env_info.operating_system,
        "cpu": env_info.cpu,
        "cpuArchitecture": env_info.cpu_architecture,
        "cpuCores": env_info.cpu_cores,
        "cpuClockSpeed": env_info.clock_speed,
        "nodeSize": env_info.node_size
    }



def __get_test_runs_metrics(test_runs):
    test_runs_list = []
    for test_run in test_runs:
        cpu_avg, memory_avg = __calculate_cpu_memory_avg(test_run.test_run_metrics)
        results = {
            "id": test_run.id,
            "algorithm": test_run.algorithm,
            "iterations": test_run.iterations,
            "results": {
                "averageCPU": round(cpu_avg, 2),
                "averageMemory": int(memory_avg),
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
