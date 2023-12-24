import threading
import requests
import time
from datetime import datetime
import pandas as pd
import logging
import json

from src.exceptions.exceptions import ApiException

ONE_MEGABYTE = 1024 * 1024

class MetricsCollector:
    def __init__(self, container_name):
        self.__data = {}
        self.__is_running = False
        self.__container_name = container_name
        self.__cadvisor_url = "http://localhost:8080" # TODO: use current_app.configurations.cadvisor_url

    def start(self):
        logging.error("start")
        if self.__is_running is True:
            raise ApiException('calculator already is running', '', 409)
        self.__data = {}
        self.__is_running = True
        thread = threading.Thread(target=self.__run_collector)
        thread.start()
        
    def stop(self):
        self.__is_running = False

    def get_data(self):
        if self.__is_running is True:
            raise ApiException('calculator is running', '', 409)
        return self.__data

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
        # url = "http://localhost:8080/api/v1.3/docker/" + self.__container_name
        url = self.__cadvisor_url + "/api/v1.3/docker/" + self.__container_name
        body = {"num_stats":10,"num_samples":0}
        headers = { 'Content-Type': 'application/json' }
        response = requests.post(url, headers=headers, json=body)
        return list(response.json().values())[0]["stats"]


    def __get_interval(self, current, previous):
        cur = pd.Timestamp(current)
        prev = pd.Timestamp(previous)
        # ms -> ns.
        return (int(cur.value/1000000) - int(prev.value/1000000)) * 1000000



