import os
import uuid
import json
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import Blueprint, Flask, jsonify
from flask_cors import cross_origin
from src.models.test_suite import TestSuite
import src.services.tests_service as tests_service
import json

api = Blueprint('qujata-api', __name__)
# constants
HTTP_STATUS_NOT_FOUND = 404

@api.route('/test_suites', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_suites():
    test_suites = tests_service.get_test_suites()
    return jsonify([ts.to_dict() for ts in test_suites])

@api.route('/test_suites/<int:test_suite_id>', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_suite(test_suite_id):
    test_suite = tests_service.get_test_suite(test_suite_id)
    if test_suite != None:
        return jsonify(test_suite.to_dict())
    else:
        return jsonify({'error': 'Not Found', 'message': 'Test suite with id: ' + str(test_suite_id) + ' not found'}), HTTP_STATUS_NOT_FOUND

@api.route('/test_suites/<int:test_suite_id>/test_runs', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_runs(test_suite_id):
    return jsonify([tr.to_dict() for tr in tests_service.get_test_runs(test_suite_id)])

@api.route('/test_suites/<int:test_suite_id>/test_runs/<int:test_run_id>', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_run(test_suite_id, test_run_id):
    test_run = tests_service.get_test_run(test_suite_id, test_run_id)
    if test_run != None:
        return jsonify(test_run.to_dict())
    else:
        return jsonify({'error': 'Not Found', 'message':'Test run with id: ' + str(test_run_id) +' and test suite id: '+ str(test_suite_id) +' not found'}), HTTP_STATUS_NOT_FOUND

