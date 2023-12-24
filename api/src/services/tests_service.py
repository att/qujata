import os
import uuid
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import jsonify, current_app
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.exceptions.exceptions import ApiException, NotFoundException
import src.services.metrics_service as metrics_service

def create_test_suite(data):
    env_info = current_app.database_manager.get_last_record(EnvInfo)
    if env_info is None:
        raise ApiException('Missing env info in database', 'Analyze test failed to complete', 422)

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

def create_test_run(start_time, end_time, algorithm, iterations, test_suite_id, status, status_message):
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
    return current_app.database_manager.get_records(TestSuite)

def get_test_suite(test_suite_id):
    return current_app.database_manager.get_record_by_id(TestSuite, test_suite_id)

def get_test_runs(test_suite_id):
    return current_app.database_manager.get_records(TestRun, [TestRun.test_suite_id == test_suite_id])

def get_test_run(test_suite_id, test_run_id):
    return current_app.database_manager.get_record(TestRun, [TestRun.id == test_run_id, TestRun.test_suite_id == test_suite_id])
    
def get_test_suite_results(test_suite_id):
    try:
        test_suite = get_test_suite(test_suite_id)
        response_data = {
            "id": test_suite.id,
            "name": test_suite.name,
            "description": test_suite.description,
            "start_time": test_suite.start_time,
            "end_time": test_suite.end_time,
            "environment_info": __get_environment_info(test_suite),
            "testRuns": __get_test_runs_results(test_suite.test_runs)
        }
        return response_data
    except Exception as e:
        print(f"Error getting test run results: {e}")
        return None


def delete_test_suite(test_suite_id):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        raise NotFoundException('Test suite with id: ' + str(test_suite_id) +' not found', 'Not Found')
    current_app.database_manager.delete(test_suite)

def __get_environment_info(test_suite):
    env_info = current_app.database_manager.get_record_by_id(EnvInfo, test_suite.env_info_id)
    return {
        "resourceName": env_info.resource_name,
        "operatingSystem": env_info.operating_system,
        "cpu": env_info.cpu,
        "cpuArchitecture": env_info.cpu_architecture,
        "cpuCores": env_info.cpu_cores,
        "cpuClockSpeed": env_info.clock_speed,
        "codeRelease": test_suite.code_release,
        "nodeSize": env_info.node_size
    }

def __get_test_runs_results(test_runs):
    test_runs_list = []
    for test_run in test_runs:
        cpu_avg, memory_avg = metrics_service.get_cpu_memory_avg(test_run.id)
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
