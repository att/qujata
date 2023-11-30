import os
import uuid
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import jsonify, current_app
from src.models.test_suite import TestSuite
from src.exceptions.exceptions import ApiException

def analyze(data):
    # start time is now - 60 sec, to show the graph before the test for sure started running
    start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
    __start_analyze(data)
    
    # end time is now + 90 sec, to show the graph after the test for sure finished running
    end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
    process_is_running = False

    run_id = str(uuid.uuid4())

    return jsonify({
        'run_id': run_id,
        'from': start_time,
        'to': end_time
    })


def __start_analyze(data):
    iterations_count = data['iterationsCount']
    headers = { 'Content-Type': 'application/json' }
    first_run = True
    for algorithm in data['algorithms']:
        if not first_run:
            time.sleep(15)
        else:
            first_run = False
        logging.debug('Running test for algorithm: ', algorithm)
        payload = {
            'algorithm': algorithm,
            'iterationsCount': iterations_count
        }
        response = requests.post(current_app.curl_url + "/curl", headers=headers, json=payload, timeout=int(current_app.request_timeout))
        __validate_response(response.status_code, algorithm)
        


def __validate_response(response_code, algorithm):
    if(response_code < 200 or response_code > 299):
        raise ApiException('Error occurred while running algorithm ' + algorithm, 'Analyze test failed to complete', response_code)
