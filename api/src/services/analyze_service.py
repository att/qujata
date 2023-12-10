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
from src.services.metrics_service import aggregate

def analyze(data):
    # start time is now - 60 sec, to show the graph before the test for sure started running
    test_suite = __create_test_suite(data)
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

def __create_test_suite(data):
    env_info = current_app.database_manager.get_last_record(EnvInfo)
    if env_info == None:
        raise ApiException('Missing env info in database', 'Analyze test failed to complete', 422)

    test_suite = TestSuite(
        protocol="TLS 1.3",
        name=data["experimentName"],
        env_info_id=env_info.id,
        code_release=current_app.code_release,
        created_by="",
        created_date=datetime.now(),
        updated_by="",
        updated_date=datetime.now(),
    )    
    current_app.database_manager.add_to_db(test_suite)
    return test_suite
 

def __save_test_run_result(test_run):
    aggregate(test_run)


def __create_test_run(algorithm, iterations, test_suite_id):
    test_run = TestRun(
        start_time=datetime.now(),
        algorithm=algorithm,
        iterations=iterations,
        # message_size=1024,
        test_suite_id=test_suite_id
    )    
    __start_analyze(test_run)
    test_run.end_time=datetime.now()
    current_app.database_manager.add_to_db(test_run)
    __save_test_run_result(test_run)


def __start_analyze(test_run):
    logging.debug('Running test for algorithm: ', test_run.algorithm)
    payload = {
        'algorithm': test_run.algorithm,
        'iterationsCount': test_run.iterations
    }
    headers = { 'Content-Type': 'application/json' }
    response = requests.post(current_app.curl_url + "/curl", headers=headers, json=payload, timeout=int(current_app.request_timeout))

    __validate_response(response.status_code, test_run.algorithm, test_run.iterations)
        


def __validate_response(response_code, algorithm, iterations):
    if(response_code < 200 or response_code > 299):
        raise ApiException('Error occurred while running algorithm: ' + algorithm + ' iterations: ' + str(iterations), 'Analyze test failed to complete', response_code)
