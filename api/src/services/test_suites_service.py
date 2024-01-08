from datetime import datetime
from flask import current_app
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.models.test_run_metric import TestRunMetric
from src.enums.metric import Metric
from src.exceptions.exceptions import ApiException, NotFoundException
import src.utils.test_suite_serializer as test_suite_serializer
import pytz
from dateutil import parser
import logging


# constants
HTTP_STATUS_UNPROCESSABLE_ENTITY = 422
TYPE_CPU = "cpu"
TYPE_MEMORY = "memory"

def create_test_suite(data):
    env_info = current_app.database_manager.get_latest(EnvInfo)
    if env_info is None:
        raise ApiException('Missing env info in database', 'Analyze test failed to complete', HTTP_STATUS_UNPROCESSABLE_ENTITY)

    test_suite = TestSuite(
        protocol=current_app.configurations.protocol,
        name=data["experimentName"],
        description=data["description"],
        env_info_id=env_info.id,
        code_release=current_app.configurations.code_release,
        created_by="",
        created_date=datetime.now(),
        updated_by="",
        updated_date=datetime.now(),
    )    
    current_app.database_manager.create(test_suite)
    return test_suite

def create_test_run(start_time, end_time, algorithm, iterations, test_suite_id, status, status_message, client_metrics, server_metrics):
    test_run = TestRun(
        start_time=start_time,
        end_time=end_time,
        algorithm=algorithm,
        iterations=iterations,
        status=status,
        status_message=status_message,
        # message_size=1024,
        test_suite_id=test_suite_id
    )    
    current_app.database_manager.create(test_run)
    __create_test_run_metrics(test_run, client_metrics, server_metrics)
    return test_run

def update_test_suite(test_suite):
    return current_app.database_manager.update(test_suite)

def update_test_suite_name_and_description(test_suite_id, name, description):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        raise NotFoundException('Test suite with id: ' + str(test_suite_id) +' not found', 'Not Found')
    test_suite.name = name
    test_suite.description = description
    current_app.database_manager.update(test_suite)
    return test_suite

def get_test_suites():
    return current_app.database_manager.list(TestSuite)

def get_test_suite(test_suite_id):
    return current_app.database_manager.get_by_id(TestSuite, test_suite_id)

def get_test_runs(test_suite_id):
    return current_app.database_manager.list(TestRun, [TestRun.test_suite_id == test_suite_id])

def get_test_run(test_suite_id, test_run_id):
    return current_app.database_manager.get(TestRun, [TestRun.id == test_run_id, TestRun.test_suite_id == test_suite_id])

def get_test_suite_results(test_suite_id):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        return None
    return test_suite_serializer.serialize(test_suite)

def delete_test_suite(test_suite_id):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        raise NotFoundException('Test suite with id: ' + str(test_suite_id) +' not found', 'Not Found')
    current_app.database_manager.delete(test_suite)


def __create_test_run_metrics(test_run, client_metrics, server_metrics):
    __save_metrics(Metric.CLIENT_AVERAGE_CPU, Metric.CLIENT_AVERAGE_MEMORY, client_metrics, test_run)
    __save_metrics(Metric.SERVER_AVERAGE_CPU, Metric.SERVER_AVERAGE_MEMORY, server_metrics, test_run)


def __save_metrics(cpu_metric_name, memory_metric_name, metrics, test_run):
    cpu, memory = __calculate_average(metrics, test_run.start_time)
    __save_metric_to_db(test_run, cpu_metric_name, cpu, TYPE_CPU)
    __save_metric_to_db(test_run, memory_metric_name, memory, TYPE_MEMORY)


def __calculate_average(metrics, start_time):
    cpu, memory = 0, 0
    counter = 0
    for ts, value in metrics.items():
        if parser.parse(ts) >= start_time.astimezone(pytz.UTC):
            cpu += value["cpu"]
            memory += value["memory"]
            counter += 1

    if counter == 0:
        return 0, 0 
    return cpu/counter, memory/counter

def __save_metric_to_db(test_run, metric_name, metric_value, metric_type):
    if metric_type == TYPE_CPU:
        metric_value = round(metric_value, 2)
    elif metric_type == TYPE_MEMORY:
        metric_value = round(metric_value, 0)
    test_run_metric = TestRunMetric(
        test_run_id=test_run.id,
        metric_name=metric_name,
        value=metric_value
    )
    current_app.database_manager.create(test_run_metric)
