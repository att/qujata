import os
import uuid
import time
import requests
import logging

from datetime import datetime, timedelta
from flask import jsonify, current_app
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.exceptions.exceptions import ApiException

def get_test_suites():
    return current_app.database_manager.get_records(TestSuite)

def get_test_suite(test_suite_id):
    return current_app.database_manager.get_record_by_id(TestSuite, test_suite_id)

def get_test_runs(test_suite_id):
    return current_app.database_manager.get_records(TestRun, [TestRun.test_suite_id == test_suite_id])

def get_test_run(test_suite_id, test_run_id):
    return current_app.database_manager.get_record_by_id(TestRun, test_run_id)
    

