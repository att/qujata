
# from sqlalchemy import create_engine, Column, Integer, String, Date
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from src.enums.metric import Metric
# Base = declarative_base()

# class TestRunMetricResult(Base):
#     __tablename__ = 'test_run_metric_results'
#     id = Column(Integer, primary_key=True)
#     metric_name = Column(Enum(Metric))
#     value = Column(Integer)
#     test_run_id = Column(Integer, ForeignKey('test_runs.id'))
#     test_run = relationship('TestRun', back_populates='test_run_metric_results')
# TestRun.test_run_metric_results = relationship('TestRunMetricResult', back_populates='test_run')

