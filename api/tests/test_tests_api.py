import unittest
from datetime import datetime
import json

import requests
from flask import Flask, jsonify
from unittest.mock import Mock, MagicMock, patch

from src.controllers.tests_api import api
from config.settings import load_config
from src.utils.database_manager import DatabaseManager
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.models.env_info import EnvInfo
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
            code_release=self.app.code_release,
            created_by="",
            created_date=datetime.now(),
            updated_by="",
            updated_date=datetime.now(),
        )

    def __env_info(self):
        return EnvInfo(
            id=1
        )

    def __test_run(self):
        return TestRun(
            id=1
        )


    def test_get_test_suites(self):
        self.app.database_manager.get_records.return_value = [self.__test_suite()]
        response = self.client.get('/api/test_suites')
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_get_test_suite(self):
        test_suite =  self.__test_suite()
        self.app.database_manager.get_record_by_id.return_value = test_suite
        response = self.client.get('/api/test_suites/1')
        result = json.loads(response.data)
        expected = test_suite.to_dict()
        expected['created_date'] = expected['created_date'].strftime("%a, %d %b %Y %H:%M:%S GMT")
        expected['updated_date'] = expected['updated_date'].strftime("%a, %d %b %Y %H:%M:%S GMT")
        self.assertEqual(result, expected)

    def test_get_test_runs(self):
        self.app.database_manager.get_records.return_value = [self.__test_run()]
        response = self.client.get('/api/test_suites/1/test_runs')
        result = json.loads(response.data)
        self.assertEqual(len(result), 1)

    def test_get_test_run(self):
        test_run =  self.__test_run()
        self.app.database_manager.get_record_by_id.return_value = test_run
        response = self.client.get('/api/test_suites/1/test_runs/1')
        result = json.loads(response.data)
        expected = test_run.to_dict()
        self.assertEqual(result, expected)



    # def test_analyze(self):
    #     response = self.client.get('/api/test_suites')

        
    #     # self.assertEqual(self.app.database_manager.add_to_db.call_count, 3)# 1 for the test suite, and the other for the 2 test runs
        
    #     self.assertEqual(response.status_code, 200)
    #     # Check the response content
    #     response_data = json.loads(response.data)
    #     self.assertIn('from', response_data)
    #     self.assertIn('to', response_data)
