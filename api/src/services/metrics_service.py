import requests
from flask import current_app
from src.models.test_run_result import TestRunResult
from src.enums.metric import Metric



def __query_prometheus_avg_metric(metric, service, start_time, end_time):
    if current_app.configurations.environment == 'docker':
        metric_expr = f'{metric}{{name="{service}"}}'
    elif current_app.configurations.environment == 'kubernetes':
        metric_expr = f'{metric}{{pod=~"{service}.*"}}'
    else:
        print("Unsupported environment")
        return None

    start_timestamp = int(start_time.timestamp())
    end_timestamp = int(end_time.timestamp())
    time_diff = end_timestamp-start_timestamp
    if time_diff <= 0:
        time_diff = 1
    time_diff_str = str(time_diff)

    metric_query = f'avg_over_time(rate({metric_expr}[30s])[{time_diff_str}s:1s])'

    params = {
        "query": metric_query,
        "time": end_timestamp
    }

    try:
        # request_url = f"{current_app.prometheus_url}/api/v1/query"
        # print(f"Prometheus Request URL: {request_url}?{params}")
        response = requests.get(f"{current_app.configurations.prometheus_url}/api/v1/query", params=params)
        response.raise_for_status()

        data = response.json()

        if 'data' in data and 'result' in data['data']:
            results = data['data']['result']

            if results:
                averages = []
                for result in results:
                    value = result.get('value', [])

                    if value and len(value) == 2:
                        avg_value = float(value[1])
                        averages.append(avg_value)

                overall_average = sum(averages) / len(averages) if len(averages) > 0 else 0
                return overall_average
        else:
            print(f"Invalid response")
            return 0
    except requests.exceptions.RequestException as e:
        print(f"Error querying Prometheus: {e}")
        return None


def __save_metric_to_db(test_run_id, metric_name, metric_value, metric_type):
    if metric_type == 'cpu':
        metric_value = round(metric_value, 2)
    elif metric_type == 'memory':
        metric_value = round(metric_value, 0)

    test_run_result = TestRunResult(
        test_run_id=test_run_id,
        metric_name=metric_name,
        value=metric_value
    )
    current_app.database_manager.create(test_run_result)


def aggregate(test_run):
    metrics_to_query = {
        Metric.CLIENT_AVERAGE_CPU: ('container_cpu_usage_seconds_total', 'qujata-curl', 'cpu'),
        Metric.CLIENT_AVERAGE_MEMORY: ('container_memory_usage_bytes', 'qujata-curl', 'memory'),
        Metric.SERVER_AVERAGE_CPU: ('container_cpu_usage_seconds_total', 'qujata-nginx', 'cpu'),
        Metric.SERVER_AVERAGE_MEMORY: ('container_memory_usage_bytes', 'qujata-nginx', 'memory')
    }

    for metric_name, (metric, service, metric_type) in metrics_to_query.items():
        avg_value = __query_prometheus_avg_metric(metric, service, test_run.start_time, test_run.end_time)
        if avg_value is not None:
            __save_metric_to_db(test_run.id, metric_name, avg_value, metric_type)


def calculate_cpu_memory_avg(test_run_id):
    test_run_results = current_app.database_manager.get_records(TestRunResult, [TestRunResult.test_run_id == test_run_id])

    cpu_avg = 0.00
    memory_avg = 0

    for result in test_run_results:
        if result.metric_name in (Metric.CLIENT_AVERAGE_CPU, Metric.SERVER_AVERAGE_CPU):
            cpu_avg += result.value
        elif result.metric_name in (Metric.CLIENT_AVERAGE_MEMORY, Metric.SERVER_AVERAGE_MEMORY):
            memory_avg += result.value

    return cpu_avg, memory_avg