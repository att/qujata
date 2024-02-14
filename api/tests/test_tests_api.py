import unittest
from datetime import datetime
import json

from flask import Flask
from unittest.mock import Mock

from src.api.tests_api import api
from config.settings import load_config
from src.utils.database_manager import DatabaseManager
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.models.test_run_metric import TestRunMetric
from src.models.env_info import EnvInfo
from src.enums.metric import Metric
from src.exceptions.exceptions import ApiException


CONTENT_TYPE_APPLICATION_JSON = 'application/json'
TEST_SUITE_NAME = "new name"
TEST_SUITE_NOT_FOUND_MSG = 'Test suite with id: 1 not found'
NOT_FOUND = 'Not Found'
TEST_SUITES_GET_URL = '/api/test_suites/1'
TEST_SUITES_DELETE_URL = '/api/test_suites/delete'

class TestTestsAPI(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api, url_prefix='/api')
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)

    def __test_suite(self):
        return TestSuite(
            protocol="TLS 1.3",
            name="name",
            description="description",
            env_info=self.__env_info(),
            code_release=self.app.configurations.code_release,
            created_by="",
            created_date=datetime.now(),
            updated_by="",
            updated_date=datetime.now(),
            test_runs=[self.__test_run()]
        )

    def __env_info(self):
        return EnvInfo(
            id=1
        )

    def __test_run(self):
        return TestRun(
            id=1,
            test_run_metrics=self.__test_run_metrics()
        )

    def __test_run_metrics(self):
        return [TestRunMetric(metric_name=Metric.CLIENT_AVERAGE_CPU_CORES, value=3),
                TestRunMetric(metric_name=Metric.CLIENT_AVERAGE_CPU, value=0.3),
                TestRunMetric(metric_name=Metric.CLIENT_AVERAGE_MEMORY, value=5),
                TestRunMetric(metric_name=Metric.SERVER_AVERAGE_CPU_CORES, value=6),
                TestRunMetric(metric_name=Metric.SERVER_AVERAGE_CPU, value=0.5),
                TestRunMetric(metric_name=Metric.SERVER_AVERAGE_MEMORY, value=9),
                TestRunMetric(metric_name=Metric.MESSAGES_THROUGHPUT_PER_SECOND, value=50),
                TestRunMetric(metric_name=Metric.BYTES_THROUGHPUT_PER_SECOND, value=4500)]

    def test_get_test_suites(self):
        self.app.database_manager.list.return_value = [self.__test_suite()]
        response = self.client.get('/api/test_suites')
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_get_test_suite(self):
        test_suite =  self.__test_suite()
        self.app.database_manager.get_by_id.return_value = test_suite
        response = self.client.get(TEST_SUITES_GET_URL)
        result = json.loads(response.data)
        expected = {'code_release': '1.1.0', 'description': 'description', 'end_time': None, 'environment_info': {'cpu': None, 'cpu_architecture': None, 'cpu_clock_speed': None, 'cpu_cores': None, 'node_size': None, 'operating_system': None, 'resource_name': None}, 'id': None, 'name': 'name', 'start_time': None, 'test_runs': [{'algorithm': None, 'id': 1, 'iterations': None, 'message_size': None, 'results': {'average_cpu': 0.8, 'average_cpu_cores': 9.0, 'average_memory': 14, 'request_throughput': 50, 'bytes_throughput': 4500}}]}
        self.assertEqual(result, expected)

    def test_get_test_suite_return_not_found(self):
        self.app.database_manager.get_by_id.return_value = None
        response = self.client.get(TEST_SUITES_GET_URL)
        result = json.loads(response.data)
        self.assertEqual(result, {'error': NOT_FOUND, 'message': TEST_SUITE_NOT_FOUND_MSG})
        self.assertEqual(response.status_code, 404)

    def test_update_test_suite(self):
        test_suite =  self.__test_suite()
        self.app.database_manager.get_by_id.return_value = test_suite
        input_data = {"name": TEST_SUITE_NAME, "description": "new description"}
        response = self.client.put(TEST_SUITES_GET_URL, data=json.dumps(input_data), content_type=CONTENT_TYPE_APPLICATION_JSON)
        result = json.loads(response.data)
        self.assertEqual(result['name'], 'new name')
        self.assertEqual(result['description'], 'new description')
        self.assertEqual(self.app.database_manager.update.call_count, 1)

    def test_update_test_suite_request_missing_properties(self):
        input_data = {"name": TEST_SUITE_NAME}
        response = self.client.put(TEST_SUITES_GET_URL, data=json.dumps(input_data), content_type=CONTENT_TYPE_APPLICATION_JSON)
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(result, {'error': 'Invalid data provided', 'message': 'Missing properties, required properties: name, description'})
        self.assertEqual(self.app.database_manager.update.call_count, 0)

    def test_update_test_suite_return_not_found(self):
        self.app.database_manager.get_by_id.return_value = None
        input_data = {"name": TEST_SUITE_NAME, "description": "new description"}
        response = self.client.put(TEST_SUITES_GET_URL, data=json.dumps(input_data), content_type=CONTENT_TYPE_APPLICATION_JSON)
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(result, {'error': NOT_FOUND, 'message': TEST_SUITE_NOT_FOUND_MSG})
        self.assertEqual(self.app.database_manager.update.call_count, 0)

    def test_delete_test_suite(self):
        test_suite =  self.__test_suite()
        self.app.database_manager.get_by_id.return_value = test_suite
        response = self.client.delete(TEST_SUITES_GET_URL)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.app.database_manager.delete.call_count, 1)

    def test_delete_test_suite_return_not_found(self):
        self.app.database_manager.get_by_id.return_value = None
        response = self.client.delete(TEST_SUITES_GET_URL)
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(result, {'error': NOT_FOUND, 'message': TEST_SUITE_NOT_FOUND_MSG})
        self.assertEqual(self.app.database_manager.delete.call_count, 0)

    def test_get_test_runs(self):
        self.app.database_manager.list.return_value = [self.__test_run()]
        response = self.client.get('/api/test_suites/1/test_runs')
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_get_test_run(self):
        test_run =  self.__test_run()
        self.app.database_manager.get.return_value = test_run
        response = self.client.get('/api/test_suites/1/test_runs/1')
        result = json.loads(response.data)
        expected = test_run.to_dict()
        self.assertEqual(result, expected)

    def test_get_test_run_return_not_found(self):
        self.app.database_manager.get.return_value = None
        response = self.client.get('/api/test_suites/1/test_runs/1')
        result = json.loads(response.data)
        self.assertEqual(result, {'error': NOT_FOUND, 'message': 'Test run with id: 1 and test suite id: 1 not found'})
        self.assertEqual(response.status_code, 404)

    def test_delete_test_suites(self):
        input_data = {"ids": [1, 2, 3]}
        self.app.database_manager.delete_by_ids.return_value = None
        response = self.client.post(TEST_SUITES_DELETE_URL, data=json.dumps(input_data), content_type=CONTENT_TYPE_APPLICATION_JSON)
        self.assertEqual(response.status_code, 204)
        self.app.database_manager.delete_by_ids.assert_called_once_with(TestSuite, [1, 2, 3])

    def test_delete_test_suites_missing_ids(self):
        input_data = {}  # Missing 'ids' key
        response = self.client.post(TEST_SUITES_DELETE_URL, data=json.dumps(input_data), content_type=CONTENT_TYPE_APPLICATION_JSON)
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(result, {'error': 'Invalid data provided', 'message': 'Missing properties, required property: ids'})
        self.assertEqual(self.app.database_manager.delete_by_ids.call_count, 0)

    def test_delete_test_suites_api_exception(self):
        input_data = {"ids": [1, 2, 3]}
        error_message = 'Some error message'
        self.app.database_manager.delete_by_ids.side_effect = ApiException(error_message, 'Some error', status_code=500)
        response = self.client.post(TEST_SUITES_DELETE_URL, data=json.dumps(input_data), content_type=CONTENT_TYPE_APPLICATION_JSON)
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(result, {'error': 'Some error', 'message': 'Some error message'})
        self.app.database_manager.delete_by_ids.assert_called_once_with(TestSuite, [1, 2, 3])

