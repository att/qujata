import unittest
from datetime import datetime, timedelta
import json

import requests
from flask import Flask
from unittest.mock import Mock, MagicMock, patch

from src.api.analyze_api import api
from src.enums.status import Status
from src.enums.metric import Metric
import src.api.analyze_api as analyze_api
from config.settings import load_config
from src.utils.database_manager import DatabaseManager

PATH = '/api/analyze'
CONTENT_TYPE = 'application/json'
POST_REQUEST = 'requests.post'
GET_REQUEST = 'requests.get'
INVALID_DATA_PROVIDED = "Invalid data provided"

client_metrics = {str(datetime.now() + timedelta(seconds=30)) + "123Z":{"cpu":3.6, "memory":254}, str(datetime.now() + timedelta(seconds=36))+ "123Z":{"cpu":3.8, "memory":234}}
server_metrics = {str(datetime.now() + timedelta(seconds=30))+ "123Z":{"cpu":2.3, "memory":154}, str(datetime.now() + timedelta(seconds=36))+ "123Z":{"cpu":2.7, "memory":156}}
metrics = [client_metrics, server_metrics]


@patch('src.utils.metrics_collection_manager.start_collecting', return_value=None)
@patch('src.utils.metrics_collection_manager.stop_collecting', return_value=None)
@patch('src.utils.metrics_collection_manager.get_metrics', return_value=metrics)
class TestAnalyzeAPI(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api, url_prefix='/api')
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)

    @patch('src.services.metrics_service.parser.parse', side_effect=lambda x: datetime.fromisoformat(x))
    def test_analyze(self, mock_parser, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms": ["kyber512"],
            "iterationsCount": [1000, 2000],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]
        }
        # Mock the requests.post call
        with patch(POST_REQUEST) as mock_post:
            with patch(GET_REQUEST) as mock_get:
                mock_get.return_value.status_code = 200
                mock_get.return_value.json.return_value = {}
                mock_post.return_value = MagicMock(status_code=200, json=lambda: {'result': 'success', 'totalRequestSize': 10000})
                with patch('src.services.analyze_service.datetime') as mock_datetime:
                    mock_datetime.now.side_effect = [
                        datetime(2024, 1, 1, 10, 0, 0),# test suite start time
                        datetime(2024, 1, 1, 10, 0, 0),# first test run start time
                        datetime(2024, 1, 1, 10, 2, 0),# first test run end time
                        datetime(2024, 1, 1, 10, 2, 0),# second test run start time
                        datetime(2024, 1, 1, 10, 3, 0),# second test run end time
                        datetime(2024, 1, 1, 10, 3, 0)# test suite end time
                    ]

                    response = self.client.post(PATH,
                                            data=json.dumps(input_data),
                                            content_type=CONTENT_TYPE)


                    self.assertEqual(self.app.database_manager.create.call_count, 15)# 1 for the test suite, and 2 for test runs and 6*2(12) for test run metrics
                    db_call = self.app.database_manager.create.call_args_list
                    self.assertEqual(db_call[2].args[0].metric_name, Metric.CLIENT_AVERAGE_CPU)
                    self.assertEqual(db_call[2].args[0].value, 3.7)
                    self.assertEqual(db_call[3].args[0].metric_name, Metric.CLIENT_AVERAGE_MEMORY)
                    self.assertEqual(db_call[3].args[0].value, 244.0)
                    self.assertEqual(db_call[4].args[0].metric_name, Metric.SERVER_AVERAGE_CPU)
                    self.assertEqual(db_call[4].args[0].value, 2.5)
                    self.assertEqual(db_call[5].args[0].metric_name, Metric.SERVER_AVERAGE_MEMORY)
                    self.assertEqual(db_call[5].args[0].value, 155.0)
                    self.assertEqual(db_call[6].args[0].metric_name, Metric.MESSAGES_THROUGHPUT_PER_SECOND)
                    self.assertEqual(db_call[6].args[0].value, 8.0)
                    self.assertEqual(db_call[7].args[0].metric_name, Metric.BYTES_THROUGHPUT_PER_SECOND)
                    self.assertEqual(db_call[7].args[0].value, 83.0)
                    self.assertEqual(db_call[13].args[0].metric_name, Metric.MESSAGES_THROUGHPUT_PER_SECOND)
                    self.assertEqual(db_call[13].args[0].value, 33.0)
                    self.assertEqual(db_call[14].args[0].metric_name, Metric.BYTES_THROUGHPUT_PER_SECOND)
                    self.assertEqual(db_call[14].args[0].value, 167.0)

                    self.assertEqual(response.status_code, 200)
                    # Check the response content
                    response_data = json.loads(response.data)
                    self.assertIn('test_suite_id', response_data)
                    self.assertEqual(mock_start_collecting.call_count, 2)
                    self.assertEqual(mock_stop_collecting.call_count, 2)



    def test_analyze_return_general_error(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]

        }
        # Mock the requests.post call to raise an exception
        with patch(GET_REQUEST) as mock_get:
            mock_get.return_value.status_code = 200
            with patch(POST_REQUEST, side_effect=requests.exceptions.RequestException("Test exception")):
                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)
                self.assertEqual(response.status_code, 500)
                response_json = json.loads(response.data)
                self.assertEqual(response_json["error"], "An error occurred while processing the request")
                self.assertEqual(response_json["message"], "")

    def test_analyze_with_invalid_iterations_count(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms": ["kyber512"],
            "iterationsCount": [-1],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]
        }
        response = self.client.post(PATH,
                                    data=json.dumps(input_data),
                                    content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], INVALID_DATA_PROVIDED)
        self.assertEqual(response_json["message"], "The number of iterations should be greater than 0")

    def test_analyze_with_invalid_message_sizes(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms": ["kyber512"],
            "iterationsCount": [10],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [-1]
        }
        response = self.client.post(PATH,
                                    data=json.dumps(input_data),
                                    content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], INVALID_DATA_PROVIDED)
        self.assertEqual(response_json["message"], "The message size should be greater than -1")


    def test_analyze_with_invalid_algorithm(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms":["invalid_algorithm"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]
        }        
        response = self.client.post(PATH,
                                    data=json.dumps(input_data),
                                    content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], INVALID_DATA_PROVIDED)
        self.assertEqual(response_json["message"], "Algorithm \"invalid_algorithm\" is not supported")

   
    def test_analyze_with_invalid_body(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):  
        input_data = {
            "iterationsCount": 1000,
            "experimentName": "name",
            "description": "name"
        }
        response = self.client.post(PATH,
                                data=json.dumps(input_data),
                                content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 400)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], INVALID_DATA_PROVIDED)
        self.assertEqual(response_json["message"], "Missing properties, required properties: algorithms, iterationsCount, experimentName, description")

    def test_analyze_with_curl_failure(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms":["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]
        }
        # Mock the requests.post call
        with patch(POST_REQUEST) as mock_post:
            with patch(GET_REQUEST) as mock_get:
                mock_get.return_value.status_code = 200
                mock_post.return_value = MagicMock(status_code=423, json=lambda: {'result': 'failed'})
                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(self.app.database_manager.create.call_count, 2) #dont save metrics for when curl request failed
                actual_test_run = self.app.database_manager.create.call_args_list[1].args
                self.assertEqual(actual_test_run[0].status, Status.FAILED)
                self.assertEqual(actual_test_run[0].status_message, '{"result": "failed"}')


    def test_analyze_with_missing_env_info(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms": ["kyber512"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]
        }
        self.app.database_manager.get_latest.return_value = None
        response = self.client.post(PATH,
                                data=json.dumps(input_data),
                                content_type=CONTENT_TYPE)
        self.assertEqual(response.status_code, 422)
        response_json = json.loads(response.data)
        self.assertEqual(response_json["error"], "Analyze test failed to complete")
        self.assertEqual(response_json["message"], "Missing env info in database")


    def test_analyze_with_423(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        with patch(GET_REQUEST) as mock_get:
            mock_get.return_value.status_code = 200
            input_data = {
                "algorithms":["kyber512"],
                "iterationsCount": [1000],
                "experimentName": "name",
                "description": "name",
                "messageSizes": [100]
            }
            analyze_api.process_is_running = True
            # Mock the requests.post call
            response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)

            self.assertEqual(response.status_code, 423)
            response_json = json.loads(response.data)
            self.assertEqual(response_json["error"], "Current test is still running")
            analyze_api.process_is_running = False

    def test_analyze_sleep_between_tests(self, mock_start_collecting, mock_stop_collecting, mock_get_metrics):
        input_data = {
            "algorithms":["kyber512","frodo640aes"],
            "iterationsCount": [1000],
            "experimentName": "name",
            "description": "name",
            "messageSizes": [100]
        }
        with patch(GET_REQUEST) as mock_get:
            mock_get.return_value.status_code = 200
            with patch(POST_REQUEST) as mock_post:
                mock_post.return_value = MagicMock(status_code=200, json=lambda: {'result': 'success'})
                timestamp1 = datetime.now()
                response = self.client.post(PATH,
                                        data=json.dumps(input_data),
                                        content_type=CONTENT_TYPE)


                timestamp2 = datetime.now()
                time_difference = timestamp2 - timestamp1

                self.assertEqual(response.status_code, 200)
                self.assertGreaterEqual(time_difference.seconds, 15)


if __name__ == '__main__':
    unittest.main()
