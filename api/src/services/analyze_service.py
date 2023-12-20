import os
import uuid
import time
import requests
import logging
import json

from datetime import datetime, timedelta
from flask import jsonify, current_app
import src.services.tests_service as tests_service
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.enums.status import Status
from src.exceptions.exceptions import ApiException
from src.services.metrics_service import aggregate

# constants
WAIT_MS = 15

def analyze(data):
    test_suite = tests_service.create_test_suite(data)
    # start time is now - 60 sec, to show the graph before the test for sure started running
    start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
    iterations_count = data['iterationsCount']
    algorithms = data['algorithms']
    first_run = True
    for algorithm in algorithms:
        for iterations in iterations_count:
            if not first_run:
                time.sleep(WAIT_MS)
            else:
                first_run = False
            __create_test_run(algorithm, iterations, test_suite.id)

    # end time is now + 90 sec, to show the graph after the test for sure finished running
    end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
    
    test_suite.start_time = start_time
    test_suite.end_time = end_time
    tests_service.update_test_suite(test_suite)

    return jsonify({'test_suite_id': test_suite.id})


def __create_test_run(algorithm, iterations, test_suite_id):
    start_time=datetime.now()
    status, status_message = __run(algorithm, iterations)
    end_time=datetime.now()
    test_run = tests_service.create_test_run(start_time, end_time, algorithm, iterations, test_suite_id, status, status_message)
    __save_test_run_result(test_run)


def __run(algorithm, iterations):
    logging.debug('Running test for algorithm: ', algorithm)
    payload = {
        'algorithm': algorithm,
        'iterationsCount': iterations
    }
    headers = { 'Content-Type': 'application/json' }
    response = requests.post(current_app.configurations.curl_url + "/curl", headers=headers, json=payload, timeout=int(current_app.configurations.request_timeout))

    return __validate_response(response, algorithm, iterations)
        

def __save_test_run_result(test_run):
    aggregate(test_run)


def __validate_response(response, algorithm, iterations):
    if(response.status_code < 200 or response.status_code  > 299):
        return Status.FAILED, json.dumps(response.json())
    else:
        return Status.SUCCESS, ""