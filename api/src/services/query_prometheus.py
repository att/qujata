import requests

def query_prometheus_metric(metric_name, start_time, end_time):
    # Replace with your Prometheus server address
    prometheus_url = "http://qujata-prometheus:9090"

    # Prometheus query API endpoint for range queries
    query_range_endpoint = f"{prometheus_url}/api/v1/query_range"

    # Query parameters
    params = {
        "query": metric_name,
        "start": start_time,
        "end": end_time,
        "step": "1h"  # Adjust the step based on your needs
    }

    try:
        # Sending GET request to Prometheus
        response = requests.get(query_range_endpoint, params=params)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Parse the JSON response
        data = response.json()

        # Extract and print relevant information
        if 'data' in data and 'result' in data['data']:
            results = data['data']['result']
            for result in results:
                metric_values = result['values']
                for timestamp, value in metric_values:
                    print(f"Timestamp: {timestamp}, Value: {value}")

    except requests.exceptions.RequestException as e:
        print(f"Error querying Prometheus: {e}")

# Example usage
start_time = "2023-01-01T00:00:00Z"
end_time = "2023-01-02T00:00:00Z"
query_prometheus_metric("up", start_time, end_time)
