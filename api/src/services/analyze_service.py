import os
import uuid
import time
import requests
import logging
import json

from datetime import datetime, timedelta
from flask import jsonify, current_app
import src.services.test_suites_service as test_suites_service
import src.services.metrics_service as metrics_service
from src.enums.status import Status

# constants
WAIT_MS = 15

def analyze(data):
    test_suite = test_suites_service.create_test_suite(data)
    # start time is now - 60 sec, to show the graph before the test for sure started running
    start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
    iterations_count = data['iterationsCount']
    algorithms = data['algorithms']
    message_sizes = data['messageSizes']
    first_run = True
    for algorithm in algorithms:
        for iterations in iterations_count:
            for message_size in message_sizes:
                if not first_run:
                    time.sleep(WAIT_MS)
                else:
                    first_run = False
                __create_test_run(algorithm, iterations, message_size, test_suite.id)

    # end time is now + 90 sec, to show the graph after the test for sure finished running
    end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
    
    test_suite.start_time = start_time
    test_suite.end_time = end_time
    test_suites_service.update_test_suite(test_suite)

    return jsonify({'test_suite_id': test_suite.id})


def __create_test_run(algorithm, iterations, message_size, test_suite_id):
    start_time = datetime.now()
    metrics_service.start_collecting()
    status, status_message = __run(algorithm, iterations, message_size)
    metrics_service.stop_collecting()
    end_time = datetime.now()
    test_suites_service.create_test_run(start_time, end_time, algorithm, iterations, message_size, test_suite_id, status, status_message, *metrics_service.get_metrics())
    

def __run(algorithm, iterations, message_sizes):
    logging.debug('Running test for algorithm: %s ', algorithm)
    payload = {
        'algorithm': algorithm,
        'iterationsCount': iterations,
        'messageSizes': message_sizes
    }
    headers = { 'Content-Type': 'application/json' }
    response = requests.post(current_app.configurations.curl_url + "/curl", headers=headers, json=payload, timeout=int(current_app.configurations.request_timeout))

    return __validate_response(response)
        

def __validate_response(response):
    if response.status_code < 200 or response.status_code  > 299:
        return Status.FAILED, json.dumps(response.json())
    else:
        return Status.SUCCESS, ""