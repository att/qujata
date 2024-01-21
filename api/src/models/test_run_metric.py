from sqlalchemy import Column, Integer, Enum, ForeignKey, Double
from sqlalchemy.orm import relationship
from src.enums.metric import Metric
from .base import Base

class TestRunMetric(Base):
    __tablename__ = 'test_run_metrics'
    metric_name = Column(Enum(Metric, values_callable=lambda x: [e.value for e in x]), primary_key=True)
    value = Column(Double)
    test_run_id = Column(Integer, ForeignKey('test_runs.id'), primary_key=True)
    test_run = relationship('TestRun', back_populates='test_run_metrics')
