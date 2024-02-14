from datetime import datetime
from flask import current_app
from src.models.env_info import EnvInfo
from src.models.test_suite import TestSuite
from src.models.test_run import TestRun
from src.exceptions.exceptions import ApiException, NotFoundException
import src.utils.test_suite_serializer as test_suite_serializer
import src.services.metrics_service as metrics_service
from src.enums.status import Status

# constants
HTTP_STATUS_UNPROCESSABLE_ENTITY = 422
TYPE_CPU = "cpu"
TYPE_MEMORY = "memory"

def create_test_suite(data):
    env_info = current_app.database_manager.get_latest(EnvInfo)
    if env_info is None:
        raise ApiException('Missing env info in database', 'Analyze test failed to complete', HTTP_STATUS_UNPROCESSABLE_ENTITY)

    test_suite = TestSuite(
        protocol=current_app.configurations.protocol,
        name=data["experimentName"],
        description=data["description"],
        env_info_id=env_info.id,
        code_release=current_app.configurations.code_release,
        created_by="",
        created_date=datetime.now(),
        updated_by="",
        updated_date=datetime.now(),
    )    
    current_app.database_manager.create(test_suite)
    return test_suite

def create_test_run(start_time, end_time, algorithm, iterations, message_size, test_suite_id, status, status_message, requests_size, client_metrics, server_metrics):
    test_run = TestRun(
        start_time=start_time,
        end_time=end_time,
        algorithm=algorithm,
        iterations=iterations,
        status=status,
        status_message=status_message,
        message_size=message_size,
        test_suite_id=test_suite_id
    )    
    current_app.database_manager.create(test_run)
    if status == Status.SUCCESS:
        metrics_service.create(test_run, client_metrics, server_metrics, requests_size, start_time, end_time)
    return test_run

def update_test_suite(test_suite):
    return current_app.database_manager.update(test_suite)

def update_test_suite_name_and_description(test_suite_id, name, description):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        raise NotFoundException('Test suite with id: ' + str(test_suite_id) +' not found', 'Not Found')
    test_suite.name = name
    test_suite.description = description
    current_app.database_manager.update(test_suite)
    return test_suite

def get_test_suites():
    return current_app.database_manager.list(TestSuite)

def get_test_suite(test_suite_id):
    return current_app.database_manager.get_by_id(TestSuite, test_suite_id)

def get_test_runs(test_suite_id):
    return current_app.database_manager.list(TestRun, [TestRun.test_suite_id == test_suite_id])

def get_test_run(test_suite_id, test_run_id):
    return current_app.database_manager.get(TestRun, [TestRun.id == test_run_id, TestRun.test_suite_id == test_suite_id])

def get_test_suite_results(test_suite_id):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        return None
    return test_suite_serializer.serialize(test_suite)

def delete_test_suite(test_suite_id):
    test_suite = get_test_suite(test_suite_id)
    if test_suite is None:
        raise NotFoundException('Test suite with id: ' + str(test_suite_id) +' not found', 'Not Found')
    current_app.database_manager.delete(test_suite)

def delete_test_suites(test_suite_ids):
    current_app.database_manager.delete_by_ids(TestSuite, test_suite_ids)
