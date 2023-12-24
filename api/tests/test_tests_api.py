import unittest
from datetime import datetime
import json

import requests
from flask import Flask, jsonify
from unittest.mock import Mock, MagicMock, patch

from src.api.tests_api import api
from config.settings import load_config
from src.utils.database_manager import DatabaseManager
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.models.test_run_result import TestRunResult
from src.models.env_info import EnvInfo
from src.enums.metric import Metric

import logging


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
            env_info_id=1,
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
            id=1
        )

    def __test_run_results(self):
        return [TestRunResult(metric_name=Metric.CLIENT_AVERAGE_CPU,value=3),
                TestRunResult(metric_name=Metric.CLIENT_AVERAGE_MEMORY,value=5),
                TestRunResult(metric_name=Metric.SERVER_AVERAGE_CPU,value=6),
                TestRunResult(metric_name=Metric.SERVER_AVERAGE_MEMORY,value=9)]

    def test_get_test_suites(self):
        self.app.database_manager.get_records.return_value = [self.__test_suite()]
        response = self.client.get('/api/test_suites')
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_get_test_suite(self):
        env_info =  self.__env_info()
        test_suite =  self.__test_suite()
        test_run_results =  self.__test_run_results()
        self.app.database_manager.get_record_by_id.side_effect = test_suite, env_info
        self.app.database_manager.get_records.return_value = test_run_results
        response = self.client.get('/api/test_suites/1')
        result = json.loads(response.data)
        expected = {'description': 'description', 'end_time': None, 'environment_info': {'codeRelease': '1.1.0', 'cpu': None, 'cpuArchitecture': None, 'cpuClockSpeed': None, 'cpuCores': None, 'nodeSize': None, 'operatingSystem': None, 'resourceName': None}, 'id': None, 'name': 'name', 'start_time': None, 'testRuns': [{'algorithm': None, 'id': 1, 'iterations': None, 'results': {'averageCPU': 9.0, 'averageMemory': 14}}]}
        self.assertEqual(result, expected)

    def test_get_test_suite_return_not_found(self):
        self.app.database_manager.get_record_by_id.return_value = None
        response = self.client.get('/api/test_suites/1')
        result = json.loads(response.data)
        self.assertEqual(result, {'error': 'Not Found', 'message': 'Test suite with id: 1 not found'})
        self.assertEqual(response.status_code, 404)

    def test_update_test_suite(self):
        env_info =  self.__env_info()
        test_suite =  self.__test_suite()
        test_run_results =  self.__test_run_results()
        self.app.database_manager.get_record_by_id.return_value = test_suite
        input_data = {"name": "new name", "description": "new description"}
        response = self.client.put('/api/test_suites/1', data=json.dumps(input_data), content_type='application/json')
        result = json.loads(response.data)
        self.assertEqual(result['name'], 'new name')
        self.assertEqual(result['description'], 'new description')
        self.assertEqual(self.app.database_manager.update.call_count, 1)

    def test_update_test_suite_return_not_found(self):
        env_info =  self.__env_info()
        test_suite =  self.__test_suite()
        test_run_results =  self.__test_run_results()
        self.app.database_manager.get_record_by_id.return_value = None
        input_data = {"name": "new name", "description": "new description"}
        response = self.client.put('/api/test_suites/1', data=json.dumps(input_data), content_type='application/json')
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(result, {'error': 'Not Found', 'message': 'Test suite with id: 1 not found'})
        self.assertEqual(self.app.database_manager.update.call_count, 0)
    
    def test_delete_test_suite(self):
        env_info =  self.__env_info()
        test_suite =  self.__test_suite()
        test_run_results =  self.__test_run_results()
        self.app.database_manager.get_record_by_id.return_value = test_suite
        response = self.client.delete('/api/test_suites/1')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.app.database_manager.delete.call_count, 1)

    def test_delete_test_suite_return_not_found(self):
        env_info =  self.__env_info()
        test_suite =  self.__test_suite()
        test_run_results =  self.__test_run_results()
        self.app.database_manager.get_record_by_id.return_value = None
        response = self.client.delete('/api/test_suites/1')
        result = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(result, {'error': 'Not Found', 'message': 'Test suite with id: 1 not found'})
        self.assertEqual(self.app.database_manager.delete.call_count, 0)

    def test_get_test_runs(self):
        self.app.database_manager.get_records.return_value = [self.__test_run()]
        response = self.client.get('/api/test_suites/1/test_runs')
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_get_test_run(self):
        test_run =  self.__test_run()
        self.app.database_manager.get_record.return_value = test_run
        response = self.client.get('/api/test_suites/1/test_runs/1')
        result = json.loads(response.data)
        expected = test_run.to_dict()
        self.assertEqual(result, expected)

    def test_get_test_run_return_not_found(self):
        self.app.database_manager.get_record.return_value = None
        response = self.client.get('/api/test_suites/1/test_runs/1')
        result = json.loads(response.data)
        self.assertEqual(result, {'error': 'Not Found', 'message': 'Test run with id: 1 and test suite id: 1 not found'})
        self.assertEqual(response.status_code, 404)


