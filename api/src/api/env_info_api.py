from flask import Blueprint, jsonify, request, current_app
from flask_cors import cross_origin
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.models.test_run_result import TestRunResult


api = Blueprint('qujata-api', __name__)

# Define the expected keys
expected_keys = ['resourceName', 'operatingSystem', 'cpu', 'cpuArchitecture', 'cpuCores', 'clockSpeed', 'nodeSize']


@api.route('/env-info', methods=['POST'])
@cross_origin(origins=['*'], supports_credentials=True)
def insert_env_info():
    # Extract data from the request
    data = request.get_json()

    # Check that at least one expected key-value pair exists in the JSON payload
    if data and any(key in data and data[key] is not None for key in expected_keys):
        new_env_info = EnvInfo(
            resource_name=data.get('resourceName'),
            operating_system=data.get('operatingSystem'),
            cpu=data.get('cpu'),
            cpu_architecture=data.get('cpuArchitecture'),
            cpu_cores=data.get('cpuCores'),
            clock_speed=data.get('clockSpeed'),
            node_size=data.get('nodeSize')
        )
        try:
            current_app.database_manager.add_to_db(new_env_info)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        return jsonify({'message': 'Inserted env info successfully'}), 200
    else:
        return jsonify({'error': 'Invalid or empty JSON payload or missing expected values'}), 400