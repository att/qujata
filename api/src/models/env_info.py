from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from .base import Base

class EnvInfo(Base):
    __tablename__ = 'env_info'
    id = Column(Integer, primary_key=True, autoincrement=True)
    resource_name = Column(String(255))
    operating_system = Column(String(255))
    cpu = Column(String(255))
    cpu_architecture = Column(String(255))
    cpu_cores = Column(Integer)
    clock_speed = Column(String(255))
    node_size = Column(String(255))
    test_suites = relationship('TestSuite', back_populates='env_info')

    def to_dict(self):
        return {
            'id': self.id,
            'resource_name': self.resource_name,
            'operating_system': self.operating_system,
            'cpu': self.cpu,
            'cpu_architecture': self.cpu_architecture,
            'cpu_cores': self.cpu_cores,          
            'clock_speed': self.clock_speed,           
            'node_size': self.node_size
        }