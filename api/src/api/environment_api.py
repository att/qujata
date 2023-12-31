import logging

from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.exceptions.exceptions import ApiException
import src.services.environment_service as environment_service

# constants
HTTP_STATUS_BAD_REQUEST = 400
HTTP_STATUS_INTERNAL_SERVER_ERROR = 500

api = Blueprint('qujata-api', __name__)

# Define the expected keys
__expected_keys = ['resource_name', 'operating_system', 'cpu', 'cpu_architecture', 'cpu_cores', 'clock_speed', 'node_size']


@api.route('/env-info', methods=['POST'])
@cross_origin(origins=['*'], supports_credentials=True)
def insert_env_info():
    try:
        data = request.get_json()
        __validate_create_env_info(data)
        environment_service.create(data)
        return jsonify({'message': 'Inserted env info successfully'})
    except ApiException as e:
        return jsonify({'error': e.error, 'message': e.message}), e.status_code
    except Exception as e:
        logging.error("Exception: Failed to insert env info with error: " + str(e))
        return jsonify({'error': 'An error occurred while processing the request', 'message': ''}), HTTP_STATUS_INTERNAL_SERVER_ERROR


def __validate_create_env_info(data):
    # Check that at least one expected key-value pair exists in the JSON payload
    if data is None or all(data.get(key) is None for key in __expected_keys):
        raise ApiException('Invalid or empty JSON payload or missing expected values', 'Invalid data provided', HTTP_STATUS_BAD_REQUEST)