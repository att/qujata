import threading
import time
import logging

import src.services.cadvisor_service as cadvisor_service
from prettytable import PrettyTable

WAIT_MS = 1
class MetricsCollector:

    def __init__(self, service_name, metrics_url=None):
        self.__data = {}
        self.__locked = False # collector status
        self.__is_running = False # thread status
        self.__metrics_url = metrics_url
        self.__service_name = service_name


    def start(self):
        try: 
            if self.__locked is True:
                logging.exception("[MetricCollector] collector is already running")
                return
            self.__data = {}
            if self.__is_running is True: # handle case when collector is unlocked but previous thread is stil running (could take a 1 second for a thread to stop)
                time.sleep(WAIT_MS)
            self.__is_running = True
            self.__locked = True

            self.__metrics_url = cadvisor_service.get_metrics_url(self.__service_name, self.__metrics_url)

            thread = threading.Thread(target=self.__run_collector)
            thread.start()
        except Exception as e:
            self.__locked = False
            self.__is_running = False
            logging.exception("[MetricCollector] Failed to collect metrics with error: %s", e)


    def stop(self):
        self.__locked = False
        logging.info(self.to_pretty_table())


    def get_data(self):
        return self.__data


    def to_pretty_table(self):
        table = PrettyTable()
        table.title = self.__service_name + " - " + self.__metrics_url
        table.field_names = ["Timestamp", "CPU", "Memory"]
        for timestamp, values in self.__data.items():
            table.add_row([timestamp, values["cpu"], values["memory"]])
        return "\n" + str(table)


    def __run_collector(self):
        while self.__locked is True:
            thread = threading.Thread(target=self.__collect_metrics)
            thread.start()
            time.sleep(WAIT_MS)
        self.__is_running = False


    def __collect_metrics(self):
        self.__data.update(cadvisor_service.get_metrics(self.__metrics_url))
       