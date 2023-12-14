import unittest
from datetime import datetime
import json

import requests
from flask import Flask
from unittest.mock import Mock, MagicMock, patch

from src.api.analyze_api import api
from src.enums.status import Status
import src.api.analyze_api
from config.settings import load_config
from src.utils.database_manager import DatabaseManager
import logging


class TestAnalyzeAPI(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api, url_prefix='/api')
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)

    def test_analyze(self):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000, 2000],
            "experimentName": "name",
            "description": "name"
        }
        # Mock the requests.post call
        with patch('requests.post') as mock_post:
            mock_post.return_value = MagicMock(status_code=200, json=lambda: {'result': 'success'})

            response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')

           
            self.assertEqual(self.app.database_manager.add_to_db.call_count, 3)# 1 for the test suite, and the other for the 2 test runs
           
            self.assertEqual(response.status_code, 200)
            # Check the response content
            response_data = json.loads(response.data)
            self.assertIn('from', response_data)
            self.assertIn('to', response_data)

    def test_analyze_return_general_error(self):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"

        }
        # Mock the requests.post call to raise an exception
        with patch('requests.post', side_effect=requests.exceptions.RequestException("Mocked exception")) as mock_post:
            response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')
            self.assertEqual(response.status_code, 500)
            response_json = json.loads(response.data)
            self.assertEqual(response_json["error"], "An error occurred while processing the request")
            self.assertEqual(response_json["message"], "")

    def test_analyze_with_invalid_iterations_count(self):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [-1],
            "experimentName": "name",
            "description": "name"
        }
        response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Invalid data provided")
        self.assertEqual(response_json["message"], "The number of iterations should be greater than 0")


    def test_analyze_with_invalid_algorithm(self):
        input_data = {
            "algorithms":["invalid_algorithm"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }        
        response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Invalid data provided")
        self.assertEqual(response_json["message"], "Algorithm \"invalid_algorithm\" is not supported")

   
    def test_analyze_with_invalid_body(self):   
        input_data = {
            "iterationsCount": 1000,
            "experimentName": "name",
            "description": "name"
        }
        response = self.client.post('/api/analyze',
                                data=json.dumps(input_data),
                                content_type='application/json')
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Invalid data provided")
        self.assertEqual(response_json["message"], "Missing properties, required properties: algorithms, iterationsCount, experimentName")

    def test_analyze_with_curl_failure(self):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        # Mock the requests.post call
        with patch('requests.post') as mock_post:
            mock_post.return_value = MagicMock(status_code=423, json=lambda: {'result': 'failed'})
            response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')
            self.assertEqual(response.status_code, 200)
            actual_test_suite = self.app.database_manager.add_to_db.call_args.args
            self.assertEqual(actual_test_suite[0].status, Status.FAILED)
            self.assertEqual(actual_test_suite[0].status_message, '{"result": "failed"}')


    def test_analyze_with_missing_env_info(self):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        self.app.database_manager.get_last_record.return_value = None
        response = self.client.post('/api/analyze',
                                data=json.dumps(input_data),
                                content_type='application/json')
        self.assertEqual(response.status_code, 422)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Analyze test failed to complete")
        self.assertEqual(response_json["message"], "Missing env info in database")


    def test_analyze_with_423(self):
        # global process_is_running
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        src.api.analyze_api.process_is_running = True
        # Mock the requests.post call
        response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 423)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Current test is still running")
        src.api.analyze_api.process_is_running = False

    def test_analyze_sleep_between_tests(self):
        input_data = {
            "algorithms":["kyber512","frodo640aes"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name"
        }
        # Mock the requests.post call
        with patch('requests.post') as mock_post:
            mock_post.return_value = MagicMock(status_code=200, json=lambda: {'result': 'success'})
            timestamp1 = datetime.now()

            response = self.client.post('/api/analyze',
                                    data=json.dumps(input_data),
                                    content_type='application/json')

            timestamp2 = datetime.now()
            time_difference = timestamp2 - timestamp1

            self.assertEqual(response.status_code, 200)
            self.assertGreaterEqual(time_difference.seconds, 15)


if __name__ == '__main__':
    unittest.main()
