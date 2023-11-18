import os
import uuid
import json
import time
import requests
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from algorithms import QuantumSafeAlgorithms, ClassicAlgorithms, HybridAlgorithms
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app,origin=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

# Load configuration
allowedAlgorithms = os.environ.get('DEFAULT_GROUPS',"kyber512").split(":")
qujata_platform_exporter_target = os.environ.get('PLATFORM_EXPORTER_URL', "http://localhost:8888")
qujata_curl_target = os.environ.get('CURL_URL')
request_timeout = os.environ.get('REQUEST_TIMEOUT', 900)
min_iterations = int(os.environ.get('MIN_ITERATIONS', 500))
max_iterations = int(os.environ.get('MAX_ITERATIONS', 100000))
process_is_running = False

# constants
LOCKED = 423
BAD_REQUEST = 400

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
    global process_is_running
    data = request.get_json()

    __export_platform_data()
    error = __validate(data)
    if error != None:
        return error

    process_is_running = True
    start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
    error = __start_analyze(data)
    if error != None:
        return error
    end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
    process_is_running = False

    run_id = str(uuid.uuid4())
    
    return jsonify({
        'run_id': run_id,
        'from': start_time,
        'to': end_time
    })

def __export_platform_data():
    requests.post(qujata_platform_exporter_target + "/export-platform-info")


def __validate(data):
    print(process_is_running)
    if not data or 'algorithms' not in data:
        return jsonify({'error': 'Invalid data provided', 'message': 'missing algorithms'}), BAD_REQUEST
    if data['iterationsCount'] < min_iterations or data['iterationsCount'] > max_iterations:
        return jsonify({'error': 'Invalid data provided', 'message': 'iterationsCount must be greater then ' + str(min_iterations) + ' and less then ' + str(max_iterations)}), BAD_REQUEST
    if process_is_running:
        return jsonify({'error': 'Current test is still running', 'message':'The previous test is still running. Please try again in few minutes'}), LOCKED
    for algorithm in data['algorithms']:
        if algorithm not in allowedAlgorithms:
            return jsonify({'error': 'Invalid data provided', 'message': 'algorithm: ' + algorithm + ' is not supported'}), BAD_REQUEST


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
        __validate_response(response.status_code)
        
        
def __validate_response(response_code):
    if(response_code < 200 or response_code > 299):
        return jsonify({'error': 'Analyze test failed to complete', 'message': 'Error occured when running algorithm' + algorithm}), response_code
        

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3020)