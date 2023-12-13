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
    

