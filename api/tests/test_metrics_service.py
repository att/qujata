import unittest
from datetime import datetime, timezone
from unittest.mock import patch, MagicMock, Mock, call, ANY

import requests
from flask import Flask
from src.services.metrics_service import aggregate, __query_prometheus_avg_metric, __save_metric_to_db
from src.models.test_run_result import TestRunResult
from src.enums.metric import Metric

from src.utils.database_manager import DatabaseManager

class TestMetricsService(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)
        self.app.prometheus_url = 'http://example.com/prometheus'
        self.client = self.app.test_client()
        self.app.database_manager = Mock(spec=DatabaseManager)

    def test_aggregate_docker(self):
        self.app.environment = 'docker'
        test_run_id = 1
        start_time = datetime(2023, 12, 6, 11, 45, 0, tzinfo=timezone.utc)
        end_time = datetime(2023, 12, 6, 11, 45, 30, tzinfo=timezone.utc)
        test_run = MagicMock(id=test_run_id, start_time=start_time, end_time=end_time)

        query_responses = {
            'status': 'success',
            'data':
                {
                    'resultType': 'vector',
                    'result': [
                        {
                            'value': [1701866456, '0.001311722311087755']
                        }
                    ]
                }
        }

        with self.app.test_request_context():
            with patch('requests.get') as mock_get:
                mock_get.return_value.status_code = 200
                mock_get.return_value.json.return_value = query_responses
                aggregate(test_run)

                # Verify that requests.get was called 4 times with the expected parameters
                expected_calls = [
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_cpu_usage_seconds_total{name="qujata-curl"}[30s])[30s:1s])', 'time': 1701863130}),
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_memory_usage_bytes{name="qujata-curl"}[30s])[30s:1s])', 'time': 1701863130}),
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_cpu_usage_seconds_total{name="qujata-nginx"}[30s])[30s:1s])', 'time': 1701863130}),
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_memory_usage_bytes{name="qujata-nginx"}[30s])[30s:1s])', 'time': 1701863130}),
                ]
                mock_get.assert_has_calls(expected_calls, any_order=True)

            self.assertEqual(self.app.database_manager.add_to_db.call_count, 4)

    def test_aggregate_kubernetes(self):
        self.app.environment = 'kubernetes'
        test_run_id = 1
        start_time = datetime(2023, 12, 6, 11, 45, 0, tzinfo=timezone.utc)
        end_time = datetime(2023, 12, 6, 11, 45, 30, tzinfo=timezone.utc)
        test_run = MagicMock(id=test_run_id, start_time=start_time, end_time=end_time)

        with self.app.test_request_context():
            with patch('requests.get') as mock_get:
                query_responses = [
                    {'status': 'success', 'data': {'resultType': 'vector', 'result': [{'value': [1701866456, '0.01454']}]}},
                    {'status': 'success', 'data': {'resultType': 'vector', 'result': [{'value': [1701866457, '1457.023']}]}},
                    {'status': 'success', 'data': {'resultType': 'vector', 'result': [{'value': [1701866456, '0.23454']}]}},
                    {'status': 'success', 'data': {'resultType': 'vector', 'result': [{'value': [1701866457, '74852.000']}]}},
                ]

                # Configure the mock to return responses from the list
                mock_get.side_effect = lambda *args, query_responses=query_responses, **kwargs: MagicMock(
                    status_code=200,
                    json=MagicMock(return_value=query_responses.pop(0))
                )
                aggregate(test_run)

                expected_calls = [
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_cpu_usage_seconds_total{pod=~"qujata-curl.*"}[30s])[30s:1s])', 'time': 1701863130}),
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_memory_usage_bytes{pod=~"qujata-curl.*"}[30s])[30s:1s])', 'time': 1701863130}),
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_cpu_usage_seconds_total{pod=~"qujata-nginx.*"}[30s])[30s:1s])', 'time': 1701863130}),
                    call(f"{self.app.prometheus_url}/api/v1/query", params={'query': 'avg_over_time(rate(container_memory_usage_bytes{pod=~"qujata-nginx.*"}[30s])[30s:1s])', 'time': 1701863130}),
                ]
                mock_get.assert_has_calls(expected_calls, any_order=True)

                self.assertEqual(self.app.database_manager.add_to_db.call_count, 4)

                calls = self.app.database_manager.add_to_db.mock_calls

                expected_metrics = {
                    Metric.CLIENT_AVERAGE_CPU: 0.01,
                    Metric.CLIENT_AVERAGE_MEMORY: 1457,
                    Metric.SERVER_AVERAGE_CPU: 0.23,
                    Metric.SERVER_AVERAGE_MEMORY: 74852,
                }

                for i, call_args in enumerate(calls):
                    _, args, _ = call_args
                    metric_name = args[0].metric_name
                    value = args[0].value
                    expected_value = expected_metrics[metric_name]

                    self.assertEqual(value, expected_value, f"Mismatch in call {i + 1}: {metric_name} - expected {expected_value}, got {value}")

    def test_aggregate_non_supported_env(self):
        self.app.environment = 'environment'
        test_run_id = 1
        start_time = datetime(2023, 12, 6, 11, 45, 0, tzinfo=timezone.utc)
        end_time = datetime(2023, 12, 6, 11, 45, 30, tzinfo=timezone.utc)
        test_run = MagicMock(id=test_run_id, start_time=start_time, end_time=end_time)

        with self.app.test_request_context():
            with patch('requests.get') as mock_get:
                aggregate(test_run)
                self.assertEqual(self.app.database_manager.add_to_db.call_count, 0)
                self.assertEqual(mock_get.call_count, 0)

    def test_aggregate_invalid_response(self):
        self.app.environment = 'docker'
        test_run_id = 1
        start_time = datetime(2023, 12, 6, 11, 45, 0, tzinfo=timezone.utc)
        end_time = datetime(2023, 12, 6, 11, 45, 30, tzinfo=timezone.utc)
        test_run = MagicMock(id=test_run_id, start_time=start_time, end_time=end_time)

        invalid_response = {'status': 'failure', 'data': {'error': 'Invalid response'}}
        with self.app.test_request_context():
            with patch('requests.get') as mock_get:
                mock_get.return_value.status_code = 200
                mock_get.return_value.json.return_value = invalid_response
                aggregate(test_run)

                calls_made = self.app.database_manager.add_to_db.mock_calls

                self.assertEqual(len(calls_made), 4)

                for call_args in calls_made:
                    _, args, _ = call_args
                    self.assertEqual(args[0].value, 0)


    def test_aggregate_request_exception(self):
        self.app.environment = 'docker'
        test_run_id = 1
        start_time = datetime(2023, 12, 6, 11, 45, 0, tzinfo=timezone.utc)
        end_time = datetime(2023, 12, 6, 11, 45, 30, tzinfo=timezone.utc)
        test_run = MagicMock(id=test_run_id, start_time=start_time, end_time=end_time)

        with self.app.test_request_context():
            with patch('requests.get') as mock_get:
                mock_get.side_effect = requests.exceptions.RequestException('Request failed')
                aggregate(test_run)

                # Assert that add_to_db was not called due to a request exception
                self.assertEqual(self.app.database_manager.add_to_db.call_count, 0)

if __name__ == '__main__':
    unittest.main()
