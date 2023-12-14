import unittest
from unittest.mock import Mock
from flask import Flask

from src.models.env_info import EnvInfo
from src.api.env_info_api import api

from src.utils.database_manager import DatabaseManager


class TestEnvInfoAPI(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api, url_prefix='/api')
        self.client = self.app.test_client()
        self.app.database_manager = Mock(spec=DatabaseManager)

    def test_insert_env_info_success(self):
        request_data = {
            'resource_name': 'Test Resource',
            'operating_system': 'Test OS',
            'cpu': 'Test CPU',
            'cpu_architecture': 'Test Architecture',
            'cpu_cores': 4,
            'clock_speed': '2.4 GHz',
            'node_size': 'Medium'
        }
        response = self.client.post('/api/env-info', json=request_data)

        expected_env_info = EnvInfo(**request_data)
        self.assertEqual(self.app.database_manager.add_to_db.call_count, 1)
        actual_call_args = self.app.database_manager.add_to_db.call_args.args
        actual_dict = {key: value for key, value in vars(actual_call_args[0]).items() if key != '_sa_instance_state'}
        expected_dict = {key: value for key, value in vars(expected_env_info).items() if key != '_sa_instance_state'}
        self.assertEqual(actual_dict, expected_dict)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Inserted env info successfully'})

    def test_insert_env_info_missing_fields(self):
        request_data = {
            'resource_name': 'Test Resource',
            'operating_system': 'Test OS',
            'cpu': 'Test CPU',
            'node_size': 'Medium'
        }
        response = self.client.post('/api/env-info', json=request_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.app.database_manager.add_to_db.call_count, 1)

    def test_insert_env_info_empty_payload(self):
        request_data = {}
        response = self.client.post('/api/env-info', json=request_data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)
        self.assertEqual(self.app.database_manager.add_to_db.call_count, 0)

    def test_insert_env_info_invalid_payload(self):
        request_data = {
            'invalid_key': 'Invalid Value'
        }
        response = self.client.post('/api/env-info', json=request_data)

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json)
        self.assertEqual(self.app.database_manager.add_to_db.call_count, 0)

    def test_insert_env_info_db_throws_error(self):
        request_data = {
            'resource_name': 'Test Resource',
            'operating_system': 'Test OS',
            'cpu': 'Test CPU',
            'node_size': 'Medium'
        }
        self.app.database_manager.add_to_db.side_effect = Exception('Test Exception')

        response = self.client.post('/api/env-info', json=request_data)

        self.assertEqual(response.status_code, 500)
        self.assertIn('error', response.json)
        self.assertEqual(self.app.database_manager.add_to_db.call_count, 1)


if __name__ == '__main__':
    unittest.main()
