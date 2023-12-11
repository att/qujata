import os
import uuid
import json
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import Blueprint, Flask, jsonify, current_app
from flask_cors import cross_origin
from src.models.test_suite import TestSuite
from src.exceptions.exceptions import ApiException
import src.services.tests_service as tests_service
import json

api = Blueprint('qujata-api', __name__)
# TODO: handle not fond!!!!
# constants
HTTP_STATUS_NOT_FOUND = 404

@api.route('/test_suites', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_suites():
    return jsonify([ts.to_dict() for ts in tests_service.get_test_suites()])

@api.route('/test_suites/<int:test_suite_id>', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_suite(test_suite_id):
    return jsonify(tests_service.get_test_suite(test_suite_id).to_dict())

@api.route('/test_suites/<int:test_suite_id>/test_runs', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_runs(test_suite_id):
    return jsonify([tr.to_dict() for tr in tests_service.get_test_runs(test_suite_id)])

@api.route('/test_suites/<int:test_suite_id>/test_runs/<int:test_run_id>', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_test_run(test_suite_id, test_run_id):
    return jsonify(tests_service.get_test_run(test_suite_id, test_run_id).to_dict())

