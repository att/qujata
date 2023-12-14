import os
import uuid
import json
import time
import requests
import logging

from flask import Blueprint, current_app
from flask_cors import cross_origin
from src.enums.algorithms import QuantumSafeAlgorithms, ClassicAlgorithms, HybridAlgorithms

api = Blueprint('qujata-api', __name__)

@api.route('/algorithms', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_algorithms():
    return {
        "quantumSafe": [algorithm.value for algorithm in QuantumSafeAlgorithms if algorithm.value in current_app.configurations.allowedAlgorithms],
        "classic": [algorithm.value for algorithm in ClassicAlgorithms if algorithm.value in current_app.configurations.allowedAlgorithms],
        "hybrid": [algorithm.value for algorithm in HybridAlgorithms if algorithm.value in current_app.configurations.allowedAlgorithms],
    }


@api.route('/iterations', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_iterations_list():
    return { "iterations": current_app.configurations.iterations_options }

