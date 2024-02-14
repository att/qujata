from flask import Blueprint, current_app
from flask_cors import cross_origin
from src.enums.algorithms import QuantumSafeAlgorithms, ClassicAlgorithms, HybridAlgorithms

api = Blueprint('qujata-api', __name__)

@api.route('/algorithms', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_algorithms():
    return {
        "quantumSafe": [algorithm.value for algorithm in QuantumSafeAlgorithms if algorithm.value in current_app.configurations.allowed_algorithms],
        "classic": [algorithm.value for algorithm in ClassicAlgorithms if algorithm.value in current_app.configurations.allowed_algorithms],
        "hybrid": [algorithm.value for algorithm in HybridAlgorithms if algorithm.value in current_app.configurations.allowed_algorithms],
    }


@api.route('/iterations', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_iterations_list():
    return { "iterations": current_app.configurations.iterations_options }


@api.route('/message_sizes', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_message_sizes_list():
    return { "message_sizes": current_app.configurations.message_sizes_options }


@api.route('/message_sizes', methods=['GET'])
@cross_origin(origins=['*'], supports_credentials=True)
def get_message_sizes_list():
    return { "message_sizes": current_app.configurations.message_sizes_options }

