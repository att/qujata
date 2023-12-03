from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
# from src.models.test_suite import TestSuite
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
