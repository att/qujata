from flask import current_app
from dateutil import parser
import pytz
from src.models.test_run_metric import TestRunMetric
from src.enums.metric import Metric
from src.utils.metrics_collector import MetricsCollector
import logging

client_collector = MetricsCollector("qujata-curl")
server_collector = MetricsCollector("qujata-nginx")

# 1. unit tests

def start_collecting():
    client_collector.start()
    server_collector.start()

def stop_collecting():
    client_collector.stop()
    server_collector.stop()
    # print collectors results
    logging.info(client_collector.to_pretty_table())
    logging.info(server_collector.to_pretty_table())
    

def save(test_run):
    client_data = client_collector.get_data()
    server_data = server_collector.get_data()
    __save_metrics(Metric.CLIENT_AVERAGE_CPU, Metric.CLIENT_AVERAGE_MEMORY, client_data, test_run)
    __save_metrics(Metric.SERVER_AVERAGE_CPU, Metric.SERVER_AVERAGE_MEMORY, server_data, test_run)

def __save_metrics(cpu_metric_name, memory_metric_name, data, test_run):
    cpu, memory = __calculate_average(data, test_run.start_time)
    __save_metric_to_db(test_run, cpu_metric_name, cpu, "cpu")
    __save_metric_to_db(test_run, memory_metric_name, memory, "memory")

def __calculate_average(data, start_time):
    cpu, memory = 0, 0
    counter = 0
    for ts, value in data.items():
        if parser.parse(ts) >= start_time.astimezone(pytz.UTC):
            cpu += value["cpu"]
            memory += value["memory"]
            counter += 1
    if counter == 0:
        return 0, 0 
    return cpu/counter, memory/counter

def __save_metric_to_db(test_run, metric_name, metric_value, metric_type):
    if metric_type == 'cpu':
        metric_value = round(metric_value, 2)
    elif metric_type == 'memory':
        metric_value = round(metric_value, 0)

    test_run_metric = TestRunMetric(
        test_run_id=test_run.id,
        metric_name=metric_name,
        value=metric_value
    )
    current_app.database_manager.create(test_run_metric)
