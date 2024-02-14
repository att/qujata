from src.utils.metrics_collector import MetricsCollector
import logging

client_collector = MetricsCollector("qujata-curl")
server_collector = MetricsCollector("qujata-nginx")

# TODO: add lock validation
def start_collecting():
    client_collector.start()
    server_collector.start()

def stop_collecting():
    client_collector.stop()
    server_collector.stop()
    # print collectors results
    logging.info(server_collector.to_pretty_table())
    logging.info(client_collector.to_pretty_table())
    
def get_metrics():
    client_data = client_collector.get_data()
    server_data = server_collector.get_data()
    return client_data, server_data
