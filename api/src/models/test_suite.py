
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
Base = declarative_base()

class TestSuite(Base):
    __tablename__ = 'test_suites'
    id = Column(Integer, primary_key=True)
    protocol = Column(String)
    name = Column(String)
    env_info_id = Column(Integer, ForeignKey('env_info.id'))
    code_release = Column(String)
    created_by = Column(String)
    created_at = Column(Date)
    updated_by = Column(String)
    updated_at = Column(Date)

    # author = relationship('User', back_populates='posts')
# User.posts = relationship('Post', back_populates='author')

