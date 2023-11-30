from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from .base import Base

class TestRun(Base):
    __tablename__ = 'test_runs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    start_time = Column(String)
    end_time = Column(String)
    algorithm = Column(String)
    iterations = Column(Integer)
    message_size = Column(Integer)
    test_suite_id = Column(Integer, ForeignKey('test_suites.id'))
    test_suite = relationship('TestSuite', back_populates='test_runs')
    # test_run_metric_results = relationship('TestRunMetricResult', back_populates='test_run')

  
