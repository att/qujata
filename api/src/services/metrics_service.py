from flask import current_app
from src.models.test_run_metric import TestRunMetric
from src.enums.metric import Metric
import pytz
from dateutil import parser


def create(test_run, client_metrics, server_metrics, requests_size, start_time, end_time):
    __save_resources_metrics(Metric.CLIENT_AVERAGE_CPU_CORES, Metric.CLIENT_AVERAGE_CPU, Metric.CLIENT_AVERAGE_MEMORY, client_metrics, test_run)
    __save_resources_metrics(Metric.SERVER_AVERAGE_CPU_CORES, Metric.SERVER_AVERAGE_CPU, Metric.SERVER_AVERAGE_MEMORY, server_metrics, test_run)
    __save_throughput_metrics(Metric.MESSAGES_THROUGHPUT_PER_SECOND, Metric.BYTES_THROUGHPUT_PER_SECOND, start_time,
                              end_time, requests_size, test_run)


def __save_resources_metrics(cpu_cores_metric_name, cpu_metric_name, memory_metric_name, metrics, test_run):
    cpu_cores, cpu, memory = __calculate_average_usage(metrics, test_run.start_time)
    __save_metric_to_db(test_run, cpu_cores_metric_name, cpu_cores)
    __save_metric_to_db(test_run, memory_metric_name, memory)
    __save_metric_to_db(test_run, cpu_metric_name, cpu)


def __save_throughput_metrics(requests_metric_name, bytes_metric_name, start_time, end_time, requests_size, test_run):
    requests_throughput, bytes_throughput = __calculate_throughput(test_run.iterations, start_time, end_time, requests_size)
    __save_metric_to_db(test_run, requests_metric_name, requests_throughput)
    __save_metric_to_db(test_run, bytes_metric_name, bytes_throughput)


def __save_metric_to_db(test_run, metric_name, metric_value):
    test_run_metric = TestRunMetric(
        test_run_id=test_run.id,
        metric_name=metric_name,
        value=metric_value
    )
    current_app.database_manager.create(test_run_metric)


def __calculate_average_usage(metrics, start_time):
    cpu_cores, cpu, memory = 0, 0, 0
    counter = 0
    for ts, value in metrics.items():
        if parser.parse(ts) >= start_time.astimezone(pytz.UTC):
            cpu_cores += value["cpu_cores"]
            cpu += value["cpu"]
            memory += value["memory"]
            counter += 1

    if counter == 0:
        return 0, 0, 0
    return round(cpu_cores/counter, 2), round(cpu/counter, 2), round(memory/counter, 0)


def __calculate_throughput(iterations, start_time, end_time, requests_size):
    seconds = (end_time - start_time).total_seconds()
    request_throughput = 0 if seconds == 0 else iterations / seconds
    bytes_throughput = 0 if seconds == 0 or requests_size is None else int(requests_size) / seconds
    return round(request_throughput, 2), round(bytes_throughput, 0)

