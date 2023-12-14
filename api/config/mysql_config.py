import os

class MySQLConfig:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI','mysql+pymysql://root:qujata@localhost:3306/qujata')
    SQLALCHEMY_TRACK_MODIFICATIONS = False