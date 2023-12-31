import threading
import requests
import time
from datetime import datetime
import pandas as pd
import logging
import json
from src.exceptions.exceptions import ApiException
import src.services.cadvisor_service as cadvisor_service
from prettytable import PrettyTable

ONE_MEGABYTE = 1024 * 1024

class MetricsCollector:

    def __init__(self, service_name):
        self.__data = {}
        self.__is_running = False
        self.__service_name = service_name
        self.__metrics_url = None

    def start(self):
        try: 
            if self.__is_running is True:
                raise Exception('[MetricCollector] calculator already is running')
            self.__data = {}
            self.__is_running = True
            self.__metrics_url = cadvisor_service.get_metrics_url(self.__service_name)
            thread = threading.Thread(target=self.__run_collector)
            thread.start()
        except Exception as e:
            self.__is_running = False
            logging.exception("Failed to collect metrics with error: %s", e)
        
    def stop(self):
        self.__is_running = False

    def get_data(self):
        if self.__is_running is True:
            raise Exception('[MetricCollector] calculator is running')
        return self.__data

    def to_pretty_table():
        table = PrettyTable()
        table.title = self.__service_name
        table.field_names = ["Timestamp", "CPU", "Memory"]
        for timestamp, values in self.__data.items():
            table.add_row([timestamp, values["cpu"], values["memory"]])
        return table

    def __run_collector(self):
        while self.__is_running is True:
            thread = threading.Thread(target=self.__collect_metrics)
            thread.start()
            time.sleep(1)

    def __collect_metrics(self):
        stats = self.__get_stats()
        data = {}
        for i in range(1, len(stats)):
            cur = stats[i]
            prev = stats[i - 1]
            interval_ns = self.__get_interval(cur['timestamp'], prev['timestamp'])
            cpu_val = (cur['cpu']['usage']['total'] - prev['cpu']['usage']['total']) / interval_ns
            memory_val = cur['memory']['usage'] / ONE_MEGABYTE
            data[cur['timestamp']] = {"cpu": cpu_val, "memory": memory_val}
        self.__data.update(data)

    def  __get_stats(self):
        body = {"num_stats":10,"num_samples":0}
        headers = { 'Content-Type': 'application/json' }
        response = requests.post(self.__metrics_url, headers=headers, json=body)
        return self.__handle_response(response.json())

    def __handle_response(self, response):
        if "stats" in response:
            return response["stats"]
        else:
            return list(response.values())[0]["stats"]

    def __get_interval(self, current, previous):
        cur = pd.Timestamp(current)
        prev = pd.Timestamp(previous)
        return (int(cur.value/1000000) - int(prev.value/1000000)) * 1000000



