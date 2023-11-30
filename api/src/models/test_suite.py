
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
# from src.models.env_info import EnvInfo
# from src.models.test_run import TestRun
from . import Base


class TestSuite(Base):
    __tablename__ = 'test_suites'
    id = Column(Integer, primary_key=True)
    protocol = Column(String)
    description = Column(String)
    env_info_id = Column(ForeignKey("env_info.id"),primary_key=True)
    env_info = relationship('EnvInfo', back_populates='test_suites')
    code_release = Column(String)
    created_by = Column(String)
    created_date = Column(Date)
    updated_by = Column(String)
    updated_date = Column(Date)
    test_runs = relationship('TestRun', back_populates='test_suite')



