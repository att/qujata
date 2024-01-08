import unittest
import json

from flask import Flask
from unittest.mock import Mock

from src.api.configurations_api import api
from config.settings import load_config
from src.utils.database_manager import DatabaseManager


class TestConfigurationsAPI(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api, url_prefix='/api')
        self.client = self.app.test_client()
        load_config(self.app)
        self.app.database_manager = Mock(spec=DatabaseManager)

    def test_get_algorithms(self):
        response = self.client.get('/api/algorithms')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('quantumSafe', data)
        self.assertIn('classic', data)
        self.assertIn('hybrid', data)

    def test_get_iterations_list(self):
        response = self.client.get('/api/iterations')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('iterations', data)

   
if __name__ == '__main__':
    unittest.main()
