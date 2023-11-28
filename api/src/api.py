import os
import uuid
import json
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import Blueprint, Flask, jsonify, request, current_app
from flask_cors import cross_origin
from src.algorithms import QuantumSafeAlgorithms, ClassicAlgorithms, HybridAlgorithms

api = Blueprint('qujata-api', __name__)
process_is_running = False

# constants
HTTP_STATUS_LOCKED = 423
HTTP_STATUS_BAD_REQUEST = 400
HTTP_STATUS_INTERNAL_SERVER_ERROR = 500

@api.route('/algorithms', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_algorithms():
    return {
        "quantumSafe": [algorithm.value for algorithm in QuantumSafeAlgorithms if algorithm.value in current_app.allowedAlgorithms],
        "classic": [algorithm.value for algorithm in ClassicAlgorithms if algorithm.value in current_app.allowedAlgorithms],
        "hybrid": [algorithm.value for algorithm in HybridAlgorithms if algorithm.value in current_app.allowedAlgorithms],
    }


@api.route('/analyze', methods=['POST'])
@cross_origin(origins=['*'],supports_credentials=True)
def analyze():
    global process_is_running
    data = request.get_json()
    try:
        __export_platform_data()
        error = __validate(data)
        if error != None:
            return error

        process_is_running = True
        # start time is now - 60 sec, to show the graph before the test for sure started running
        start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
        error = __start_analyze(data)
        if error != None:
            process_is_running = False
            return error
        # end time is now + 90 sec, to show the graph after the test for sure finished running 
        end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
        process_is_running = False

        run_id = str(uuid.uuid4())
        
        return jsonify({
            'run_id': run_id,
            'from': start_time,
            'to': end_time
        })
    except Exception as e:
        process_is_running = False
        logging.error("Failed to run analyze request with error: " + str(e))
        return jsonify({'error': 'An error occured while processing the request', 'message':''}), HTTP_STATUS_INTERNAL_SERVER_ERROR

def __export_platform_data():
    requests.post(current_app.qujata_platform_exporter_target + "/export-platform-info")


def __validate(data):
    if not data or 'algorithms' not in data:
        return jsonify({'error': 'Invalid data provided', 'message': 'missing algorithms'}), HTTP_STATUS_BAD_REQUEST
    if data['iterationsCount'] < current_app.min_iterations or data['iterationsCount'] > current_app.max_iterations:
        return jsonify({'error': 'Invalid data provided', 'message': 'iterationsCount must be greater then ' + str(current_app.min_iterations) + ' and less then ' + str(current_app.max_iterations)}), HTTP_STATUS_BAD_REQUEST
    if process_is_running:
        return jsonify({'error': 'Current test is still running', 'message':'The previous test is still running. Please try again in few minutes'}), HTTP_STATUS_LOCKED
    for algorithm in data['algorithms']:
        if algorithm not in current_app.allowedAlgorithms:
            return jsonify({'error': 'Invalid data provided', 'message': 'algorithm: ' + algorithm + ' is not supported'}), HTTP_STATUS_BAD_REQUEST


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
        response = requests.post(current_app.qujata_curl_target + "/curl", headers=headers, json=payload, timeout=current_app.request_timeout)
        error = __validate_response(response.status_code, algorithm)
        if error != None:
            return error
        

def __validate_response(response_code, algorithm):
    if(response_code < 200 or response_code > 299):
        return jsonify({'error': 'Analyze test failed to complete', 'message': 'Error occured when running algorithm' + algorithm}), response_code
        