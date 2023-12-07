import os
import uuid
import json
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import Blueprint, Flask, jsonify, request, current_app
from flask_cors import cross_origin
from src.enums.algorithms import QuantumSafeAlgorithms, ClassicAlgorithms, HybridAlgorithms
from src.models.test_suite import TestSuite
import src.services.analyze_service as analyze_service
from src.exceptions.exceptions import ApiException

api = Blueprint('qujata-api', __name__)

# constants
HTTP_STATUS_LOCKED = 423
HTTP_STATUS_BAD_REQUEST = 400
HTTP_STATUS_INTERNAL_SERVER_ERROR = 500

@api.route('/algorithms', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_algorithms():
    return {
        "quantumSafe": [algorithm.value for algorithm in QuantumSafeAlgorithms if algorithm.value in current_app.allowedAlgorithms],
        "classic": [algorithm.value for algorithm in ClassicAlgorithms if algorithm.value in current_app.allowedAlgorithms],
        "hybrid": [algorithm.value for algorithm in HybridAlgorithms if algorithm.value in current_app.allowedAlgorithms],
    }


@api.route('/iterations', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_iterations_list():
    return { "iterations": current_app.iterations_options }

