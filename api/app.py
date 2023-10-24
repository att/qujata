import os
import uuid
import json
from datetime import datetime
from flask import Flask, jsonify, request
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Load configuration
pqc_curl_target = os.environ.get('pqc_curl_target')

@app.route('/analysis', methods=['POST'])
def get_algorithms_analysis():
    print('analysis route was triggered.')
    start_time = int(datetime.timestamp(datetime.now()) * 1000)
    data = request.get_json()

    if not data or 'algorithms' not in data:
        return jsonify({'error': 'Invalid data provided'}), 400

    iterations_count = data['iterationsCount']
    headers = {'Content-Type': 'application/json'}

    for algorithm in data['algorithms']:
      payload = {
          'algorithm': algorithm,
          'iterationsCount': iterations_count
      }
      
      response = requests.post(pqc_curl_target, headers=headers, json=payload)
      # Print response details
      print("Status code:", response.status_code)
      print("Headers:", response.headers)
      print("Content (JSON):", json.dumps(response.json(), indent=2))

    end_time = int(datetime.timestamp(datetime.now()) * 1000)
    run_id = str(uuid.uuid4())
    
    return jsonify({
        'run_id': run_id,
        'from': start_time,
        'to': end_time
    })

if __name__ == '__main__':
    # app.run(debug=True, port=3020)
    app.run(port=3020)
