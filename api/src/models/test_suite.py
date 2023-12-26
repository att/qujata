from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from .base import Base

class TestSuite(Base):
    __tablename__ = 'test_suites'
    id = Column(Integer, primary_key=True, autoincrement=True)
    protocol = Column(String)
    name = Column(String)
    description = Column(String)
    start_time = Column(Integer)
    end_time = Column(Integer)
    env_info_id = Column(ForeignKey("env_info.id"))
    env_info = relationship('EnvInfo', back_populates='test_suites')
    code_release = Column(String)
    created_by = Column(String)
    created_date = Column(Date)
    updated_by = Column(String)
    updated_date = Column(Date)
    test_runs = relationship('TestRun', back_populates='test_suite', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'protocol': self.protocol,
            'name': self.name,
            'description': self.description,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'env_info': self.env_info.to_dict(),
            'code_release': self.code_release,
            'created_by': self.created_by,
            'created_date': self.created_date,
            'updated_by': self.updated_by,
            'updated_date': self.updated_date,
            'test_runs': [tr.to_dict() for tr in self.test_runs],
        }


