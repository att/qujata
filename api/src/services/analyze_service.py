import os
import uuid
import time
import requests
import logging
import json

from concurrent.futures import ThreadPoolExecutor

from datetime import datetime, timedelta
from flask import jsonify, current_app
import src.services.test_suites_service as test_suites_service
import src.services.metrics_service as metrics_service
import src.services.k8s_service as k8s_service
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.enums.status import Status
from src.enums.environment import Environment
from src.exceptions.exceptions import ApiException

from src.utils.metrics_collector import MetricsCollector


# constants
WAIT_MS = 15
CURL_PORT = 3010 # should be taken from config current_app.configurations.curl_port

def analyze(data):
    test_suite = test_suites_service.create_test_suite(data)
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
    test_suites_service.update_test_suite(test_suite)

    return jsonify({'test_suite_id': test_suite.id})


def __create_test_run(algorithm, iterations, test_suite_id):
    start_time = datetime.now()
    requests_data = _get_requests_data(iterations, 100) #TODO - should be taken from config
    nginx_metrics, curls_metrics, status, status_message = __run(algorithm, requests_data)
    end_time = datetime.now()
    test_suites_service.create_test_run(start_time, end_time, algorithm, iterations, test_suite_id, status, status_message, nginx_metrics, curls_metrics)
    

def __run(algorithm, requests_data):
    logging.debug('Running test for algorithm: %s ', algorithm)

    nginx_collector = MetricsCollector("qujata-nginx")  
    nginx_collector.start()

    logging.info("requests_data--------")
    logging.info(requests_data)
    timeout = int(current_app.configurations.request_timeout)
    with ThreadPoolExecutor(max_workers=len(requests_data)) as executor:
        futures = executor.map(lambda request_data: __run_request(*request_data, algorithm, timeout), requests_data)
    
    nginx_collector.stop()
    nginx_metrics = nginx_collector.get_data()
    curls_metrics = []
    final_status =  Status.SUCCESS
    final_status_message = ""
    for curl_metrics, status, status_message in futures:
        if status is Status.FAILED:
            final_status = Status.FAILED
            final_status_message += status_message + ";"
            # break?
        curls_metrics.append(curl_metrics)

    return nginx_metrics, curls_metrics, final_status, final_status_message

        
def __run_request(host_ip, node_ip, iterations, algorithm, timeout):
    logging.debug('Running test for algorithm: %s ', algorithm)
    payload = {
        'algorithm': algorithm,
        'iterationsCount': iterations
    }
    headers = { 'Content-Type': 'application/json' }
    curl_collector = MetricsCollector("qujata-curl", node_ip)
    curl_collector.start()
    # add try and cacth and stop collector if failed
    response = requests.post("http://" + host_ip + ":" + str(CURL_PORT) + "/curl", headers=headers, json=payload, timeout=timeout)
    curl_collector.stop()
    metrics = curl_collector.get_data()
    status, status_message = __validate_response(response)
    return metrics, status, status_message


def _get_requests_data(iterations, max_concurrency_per_node):
    requests_data = []
    if current_app.configurations.environment == Environment.KUBERNETES.value:
        pods = k8s_service.get_pods_by_label("app", "qujata-curl").items
        iterations_per_pod = get_iterations_per_pod(len(pods), iterations, max_concurrency_per_node)
        _iterations = 0
        for pod in pods:
            if _iterations < iterations:
                requests_data.append([pod.status.pod_ip, pod.status.host_ip, iterations_per_pod])
                _iterations += iterations_per_pod
            else:
                break
    else:
        requests_data.append([current_app.configurations.curl_host, current_app.configurations.cadvisor_host, iterations])
    logging.info("requests_data")
    logging.info(requests_data)
    return requests_data
   

def get_iterations_per_pod(pods_size, iterations, max_concurrency_per_node):
    logging.info("get_iterations_per_pod")
    logging.info(pods_size)
    logging.info(iterations)
    logging.info(max_concurrency_per_node)
    logging.info(max_concurrency_per_node * pods_size)
    if iterations >= (max_concurrency_per_node * pods_size):
        logging.info("in if")
        return iterations / pods_size
    else:
        logging.info("in else")
        return max_concurrency_per_node
 

def __validate_response(response):
    if response.status_code < 200 or response.status_code  > 299:
        return Status.FAILED, json.dumps(response.json())
    else:
        return Status.SUCCESS, ""