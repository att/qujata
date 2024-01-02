from sqlalchemy import create_engine, Column, Integer, String, Date, Enum, ForeignKey, Double
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from src.enums.metric import Metric
from .base import Base

class TestRunMetric(Base):
    __tablename__ = 'test_run_metrics'
    metric_name = Column(Enum(Metric, values_callable=lambda x: [e.value for e in x]), primary_key=True)
    value = Column(Double)
    test_run_id = Column(Integer, ForeignKey('test_runs.id'), primary_key=True)
    test_run = relationship('TestRun', back_populates='test_run_metrics')
