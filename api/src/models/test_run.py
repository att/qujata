from sqlalchemy import create_engine, Column, Integer, String, Date, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from src.enums.status import Status
from .base import Base

class TestRun(Base):
    __tablename__ = 'test_runs'
    id = Column(Integer, primary_key=True, autoincrement=True)
    start_time = Column(String)
    end_time = Column(TIMESTAMP)
    algorithm = Column(TIMESTAMP)
    iterations = Column(Integer)
    message_size = Column(Integer)
    status = Column(Enum(Status, values_callable=lambda x: [e.value for e in x]))
    status_message = Column(String)
    test_suite_id = Column(Integer, ForeignKey('test_suites.id'))
    test_suite = relationship('TestSuite', back_populates='test_runs')
    test_run_results = relationship('TestRunResult', back_populates='test_run')

  
    def to_dict(self):
        return {
            'id': self.id,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'algorithm': self.algorithm,
            'iterations': self.iterations,
            'message_size': self.message_size            
        }
