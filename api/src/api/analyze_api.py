
import logging

from flask import Blueprint, jsonify, request, current_app
from flask_cors import cross_origin
import src.services.analyze_service as analyze_service
from src.exceptions.exceptions import ApiException

api = Blueprint('qujata-api', __name__)
process_is_running = False

# constants
HTTP_STATUS_LOCKED = 423
HTTP_STATUS_BAD_REQUEST = 400
HTTP_STATUS_INTERNAL_SERVER_ERROR = 500

INVALID_DATA_MESSAGE = 'Invalid data provided'

@api.route('/analyze', methods=['POST'])
@cross_origin(origins=['*'], supports_credentials=True)
def analyze():
    global process_is_running
    data = request.get_json()
    try:
        __validate(data)
        process_is_running = True
        result = analyze_service.analyze(data)
        process_is_running = False
        return result
    except ApiException as e:
        process_is_running = False
        return jsonify({'error': e.error, 'message': e.message}), e.status_code
    except Exception as e:
        process_is_running = False
        logging.exception("Exception: Failed to run analyze request with error: %s", e)
        return jsonify({'error': 'An error occurred while processing the request', 'message':''}), HTTP_STATUS_INTERNAL_SERVER_ERROR

def __validate(data):
    if not data or 'algorithms' not in data or 'iterationsCount' not in data or 'experimentName' not in data or 'description' not in data:
        raise ApiException('Missing properties, required properties: algorithms, iterationsCount, experimentName, description', INVALID_DATA_MESSAGE, HTTP_STATUS_BAD_REQUEST)
    for iterations in data['iterationsCount']:
        if iterations <= 0:
            raise ApiException('The number of iterations should be greater than 0', INVALID_DATA_MESSAGE, HTTP_STATUS_BAD_REQUEST)
    if process_is_running:
        raise ApiException('The previous test is still running. Please try again in few minutes', 'Current test is still running', HTTP_STATUS_LOCKED)
    for algorithm in data['algorithms']:
        if algorithm not in current_app.configurations.allowed_algorithms:
            raise ApiException('Algorithm "' + algorithm + '" is not supported', INVALID_DATA_MESSAGE, HTTP_STATUS_BAD_REQUEST)
    # validate concurrency
