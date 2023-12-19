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
from src.exceptions.exceptions import ApiException
from src.services.metrics_service import calculate_cpu_memory_avg

def create_test_suite(data):
    env_info = current_app.database_manager.get_last_record(EnvInfo)
    if env_info == None:
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
    current_app.database_manager.add_to_db(test_suite)
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
    current_app.database_manager.add_to_db(test_run)
    return test_run

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
            "environment_info": __get_environment_info(test_suite),
            "testRuns": __get_test_runs_results(test_suite.test_runs)
        }
        return response_data
    except Exception as e:
        print(f"Error getting test run results: {e}")
        return None

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
        "nodeSize": env_info.node_size,
        "testSuiteId": test_suite.id,
        "testSuiteName": test_suite.name
    }

def __get_test_runs_results(test_runs):
    test_runs_list = []
    for test_run in test_runs:
        cpu_avg, memory_avg = calculate_cpu_memory_avg(test_run.id)
        results = {
            "algorithm": test_run.algorithm,
            "iterations": test_run.iterations,
            "results": {
                "averageCPU": round(cpu_avg, 2),
                "averageMemory": int(memory_avg),
            }
        }
        test_runs_list.append(results)
    return test_runs_list
