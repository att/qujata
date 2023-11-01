import os
import uuid
import json
import time
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import requests
# from dotenv import load_dotenv

# Load environment variables from .env file
# load_dotenv()

app = Flask(__name__)
CORS(app,origin=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

# Load configuration
qujata_curl_target = os.environ.get('CURL_URL')
request_timeout = os.environ.get('REQUEST_TIMEOUT', 900)
test_is_running = False

@app.route('/analyze', methods=['POST'])
@cross_origin(origin=['*'],supports_credentials=True)
def get_algorithms_analysis():
    global test_is_running
    print('analysis route was triggered.')
    start_time = int(datetime.timestamp(datetime.now() - timedelta(seconds=60)) * 1000)
    data = request.get_json()
    print(test_is_running)
    if not data or 'algorithms' not in data:
        return jsonify({'error': 'Invalid data provided'}), 400
    if test_is_running:
        return jsonify({'error': 'Analisys test is running now'}), 409
    test_is_running = True

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
        
    test_is_running = False

   
    # Print response details
    print('Status code:', response.status_code)
    print('Headers:', response.headers)
    # print('Content (JSON): ', json.dumps(response.json(), indent=2))
    end_time = int(datetime.timestamp(datetime.now() + timedelta(seconds=90)) * 1000)
    run_id = str(uuid.uuid4())
    
    return jsonify({
        'run_id': run_id,
        'from': start_time,
        'to': end_time
    })

if __name__ == '__main__':
    # app.run(debug=True, port=3020)
    app.run(host='0.0.0.0',port=3020)
