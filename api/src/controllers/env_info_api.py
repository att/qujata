from flask import Blueprint, jsonify, request, current_app
from flask_cors import cross_origin
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite


env_info_api = Blueprint('qujata-api', __name__)

# Define the expected keys
expected_keys = ['resource_name', 'operating_system', 'cpu', 'cpu_architecture', 'cpu_cores', 'clock_speed', 'node_size']


@env_info_api.route('/env-info', methods=['POST'])
@cross_origin(origins=['*'], supports_credentials=True)
def insert_env_info():
    # Extract data from the request
    data = request.get_json()

    # Check that at least one expected key-value pair exists in the JSON payload
    if data and any(key in data and data[key] is not None for key in expected_keys):

        new_env_info = EnvInfo(
            resource_name=data.get('resource_name'),
            operating_system=data.get('operating_system'),
            cpu=data.get('cpu'),
            cpu_architecture=data.get('cpu_architecture'),
            cpu_cores=data.get('cpu_cores'),
            clock_speed=data.get('clock_speed'),
            node_size=data.get('node_size')
        )
        try:
            current_app.database_manager.add_to_db(new_env_info)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        return jsonify({'message': 'Inserted env info successfully'}), 200
    else:
        return jsonify({'error': 'Invalid or empty JSON payload or missing expected values'}), 400