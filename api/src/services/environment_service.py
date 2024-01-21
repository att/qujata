from flask import current_app
from src.models.env_info import EnvInfo


def create(data):
    new_env_info = EnvInfo(
        resource_name=data.get('resource_name'),
        operating_system=data.get('operating_system'),
        cpu=data.get('cpu'),
        cpu_architecture=data.get('cpu_architecture'),
        cpu_cores=data.get('cpu_cores'),
        clock_speed=data.get('clock_speed'),
        node_size=data.get('node_size')
    )
    current_app.database_manager.create(new_env_info)
