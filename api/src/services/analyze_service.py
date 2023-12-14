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

    return jsonify({
        'from': start_time,
        'to': end_time
    })

def __create_test_run(algorithm, iterations, test_suite_id):
    start_time=datetime.now()
    status, status_message = __run(algorithm, iterations)
    end_time=datetime.now()
    tests_service.create_test_run(start_time, end_time, algorithm, iterations, test_suite_id, status, status_message)

def __run(algorithm, iterations):
    logging.debug('Running test for algorithm: ', algorithm)
    payload = {
        'algorithm': algorithm,
        'iterationsCount': iterations
    }
    headers = { 'Content-Type': 'application/json' }
    response = requests.post(current_app.configurations.curl_url + "/curl", headers=headers, json=payload, timeout=int(current_app.configurations.request_timeout))

    return __validate_response(response, algorithm, iterations)
        


def __validate_response(response, algorithm, iterations):
    if(response.status_code < 200 or response.status_code  > 299):
        return Status.FAILED, json.dumps(response.json())
    else:
        return Status.SUCCESS, ""