import unittest
from unittest.mock import patch, MagicMock

from flask import Flask

from src.env_info import env_api
from config.settings import load_config


class TestEnvInfoInsertion(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(env_api, url_prefix='/qujata-api')
        self.client = self.app.test_client()
        load_config(self.app)

    @patch('env_api.mysql.connector.connect')
    @patch('env_api.request')
    def test_insert_env_info_success(self, mock_request, mock_connect):

        # Mock the database connection
        mock_cursor = MagicMock()
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        # Mock the request data
        mock_request.get_json.return_value = {
            'resource_name': 'Test Resource',
            'operating_system': 'Test OS',
            'cpu': 'Test CPU',
            'cpu_architecture': 'Test Architecture',
            'cpu_cores': 4,
            'clock_speed': '2.4 GHz',
            'node_size': 'Medium'
        }

        # Make the request to the endpoint
        response = self.client.post('/qujata-api/env-info')

        # Assert the response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Inserted env info successfully'})

        # Assert the database interactions
        mock_cursor.execute.assert_called_once()
        mock_connection.commit.assert_called_once()

    @patch('env_api.mysql.connector.connect')
    @patch('env_api.request')
    def test_insert_env_info_invalid_payload(self, mock_request, mock_connect):
        # Mock the database connection
        mock_cursor = MagicMock()
        mock_connection = MagicMock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        # Mock an invalid request data with missing keys
        mock_request.get_json.return_value = {'invalid_key': 'Invalid Value'}

        # Make the request to the endpoint
        response = self.client.post('/qujata-api/env-info')

        # Assert the response
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {'error': 'Invalid or empty JSON payload or missing expected values'})

        # Assert the database interactions (should not have been called)
        mock_cursor.execute.assert_not_called()
        mock_connection.commit.assert_not_called()


if __name__ == '__main__':
    unittest.main()
