import os
import uuid
import json
import time
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from algorithms import QuantumSafeAlgorithms, ClassicAlgorithms, HybridAlgorithms

import requests

app = Flask(__name__)
CORS(app,origin=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

# Load configuration
allowedAlgorithms = os.environ.get('DEFAULT_GROUPS',"").split(":")
qujata_platform_exporter_target = os.environ.get('PLATFORM_EXPORTER_URL')
qujata_curl_target = os.environ.get('CURL_URL')
request_timeout = os.environ.get('REQUEST_TIMEOUT', 900)
test_is_running = False


@app.route('/algorithms', methods=['GET'])
@cross_origin(origin=['*'], supports_credentials=True)
def get_algorithms():
    return {
        "quantumSafe": [algorithm.value for algorithm in QuantumSafeAlgorithms if algorithm.value in allowedAlgorithms],
        "classic": [algorithm.value for algorithm in ClassicAlgorithms if algorithm.value in allowedAlgorithms],
        "hybrid": [algorithm.value for algorithm in HybridAlgorithms if algorithm.value in allowedAlgorithms],
    }


@app.route('/analyze', methods=['POST'])
@cross_origin(origin=['*'],supports_credentials=True)
def analyze():
    global test_is_running
    data = request.get_json()

    __export_platform_data()
    error = __validate(data)
    if error != None:
        return error

    test_is_running = True
    start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
    error = __start_analyze(data)
    if error != None:
        return error
    end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
    test_is_running = False

    run_id = str(uuid.uuid4())
    
    return jsonify({
        'run_id': run_id,
        'from': start_time,
        'to': end_time
    })

def __export_platform_data():
    requests.post(qujata_platform_exporter_target + "/export-platform-info")


def __validate(data):
    global test_is_running
    if not data or 'algorithms' not in data:
        return jsonify({'error': 'Invalid data provided', 'message': 'missing algorithms'}), 400
    if data['iterationsCount'] < 500 or data['iterationsCount'] > 100000:
        return jsonify({'error': 'Invalid data provided', 'message': 'iterationsCount must be greater then 500 and less then 100000'}), 400
    if test_is_running:
        return jsonify({'error': 'Current test is still running', 'message':'The previous test is still running. Please try again in few minutes'}), 423
    for algorithm in data['algorithms']:
        if algorithm not in allowedAlgorithms:
            return jsonify({'error': 'Invalid data provided', 'message': 'algorithm: ' + algorithm + ' is not supported'}), 400


def __start_analyze(data):

    iterations_count = data['iterationsCount']
    headers = { 'Content-Type': 'application/json' }
    first_run = True
    for algorithm in data['algorithms']:
        if not first_run:
            time.sleep(30)
        else:
            first_run = False
        print('Running test for algorithm: ', algorithm)
        payload = {
            'algorithm': algorithm,
            'iterationsCount': iterations_count
        }
        response = requests.post(qujata_curl_target + "/curl", headers=headers, json=payload, timeout=request_timeout)
        # Print response details
        print('Status code:', response.status_code)
        if(response.status_code < 200 or response.status_code > 299):
            return jsonify({'error': 'Failed to run test', 'message': 'Error occured when running algorithm' + algorithm}), response.status_code
        

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3020)