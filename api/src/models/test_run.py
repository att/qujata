
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
Base = declarative_base()

class TestRun(Base):
    __tablename__ = 'test_runs'
    id = Column(Integer, primary_key=True)
    start_time = Column(String)
    end_time = Column(String)
    alhorithm = Column(String)
    iterations = Column(Integer)
    message_size = Column(Integer)
    test_suite_id = Column(Integer, ForeignKey('test_suites.id'))
    test_suite = relationship('TestSuite', back_populates='test_runs')
TestSuite.test_runs = relationship('TestRun', back_populates='test_suite')

