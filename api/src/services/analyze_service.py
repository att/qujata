import os
import uuid
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import jsonify, current_app
import src.services.tests_service as tests_service
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.exceptions.exceptions import ApiException

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
                time.sleep(15)
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
    __run_test(algorithm, iterations)
    end_time=datetime.now()
    tests_service.create_test_run(start_time, end_time, algorithm, iterations, test_suite_id)

def __run_test(algorithm, iterations):
    logging.debug('Running test for algorithm: ', algorithm)
    payload = {
        'algorithm': algorithm,
        'iterationsCount': iterations
    }
    headers = { 'Content-Type': 'application/json' }
    response = requests.post(current_app.curl_url + "/curl", headers=headers, json=payload, timeout=int(current_app.request_timeout))

    __validate_response(response.status_code, algorithm, iterations)
        


def __validate_response(response_code, algorithm, iterations):
    if(response_code < 200 or response_code > 299):
        raise ApiException('Error occurred while running algorithm: ' + algorithm + ' iterations: ' + str(iterations), 'Analyze test failed to complete', response_code)
