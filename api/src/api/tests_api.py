from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import src.services.test_suites_service as test_suites_service
from src.exceptions.exceptions import ApiException, NotFoundException

api = Blueprint('qujata-api', __name__)
# constants
HTTP_STATUS_NO_CONTENT = 204
HTTP_STATUS_NOT_FOUND = 404
HTTP_STATUS_BAD_REQUEST = 400

@api.route('/test_suites', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_suites():
    test_suites = test_suites_service.get_test_suites()
    return jsonify([ts.to_dict() for ts in test_suites])


@api.route('/test_suites/<int:test_suite_id>', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_suite(test_suite_id):
    test_suite_results = test_suites_service.get_test_suite_results(test_suite_id)
    if test_suite_results is not None:
        return jsonify(test_suite_results)
    else:
        return jsonify({'error': 'Not Found', 'message':'Test suite with id: ' + str(test_suite_id) +' not found'}), HTTP_STATUS_NOT_FOUND
        

@api.route('/test_suites/<int:test_suite_id>', methods=['PUT'])
@cross_origin(origins=['*'], supports_credentials=True)
def update_test_suite(test_suite_id):
    try:
        data = request.get_json()
        __validate_update_test_suite(data)
        test_suite = test_suites_service.update_test_suite_name_and_description(test_suite_id, data["name"], data["description"])
        return jsonify(test_suite.to_dict())
    except (ApiException, NotFoundException) as e:
        return jsonify({'error': e.error, 'message': e.message}), e.status_code


@api.route('/test_suites/<int:test_suite_id>', methods=['DELETE'])
@cross_origin(origins=['*'], supports_credentials=True)
def delete_test_suite(test_suite_id):
    try:
        test_suites_service.delete_test_suite(test_suite_id)
        return jsonify(), HTTP_STATUS_NO_CONTENT
    except (ApiException, NotFoundException) as e:
        return jsonify({'error': e.error, 'message': e.message}), e.status_code
        

@api.route('/test_suites/<int:test_suite_id>/test_runs', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_runs(test_suite_id):
    return jsonify([tr.to_dict() for tr in test_suites_service.get_test_runs(test_suite_id)])


@api.route('/test_suites/<int:test_suite_id>/test_runs/<int:test_run_id>', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_run(test_suite_id, test_run_id):
    test_run = test_suites_service.get_test_run(test_suite_id, test_run_id)
    if test_run != None:
        return jsonify(test_run.to_dict())
    else:
        return jsonify({'error': 'Not Found', 'message':'Test run with id: ' + str(test_run_id) +' and test suite id: '+ str(test_suite_id) +' not found'}), HTTP_STATUS_NOT_FOUND


def __validate_update_test_suite(data):
    if not data or 'name' not in data or 'description' not in data:
        raise ApiException('Missing properties, required properties: name, description', 'Invalid data provided', HTTP_STATUS_BAD_REQUEST)