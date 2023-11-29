from config.mysql_config import MySQLConfig
from flask_sqlalchemy import SQLAlchemy

class DatabaseManager:
    def __init__(self, app):
        app.config.from_object(MySQLConfig)
        db = SQLAlchemy(app)
        self.__db = db

    def add_to_db(self, instance):
        self.__db.session.add(instance)
        self.__db.session.commit()

    def delete_from_db(self, instance):
        self.__db.session.delete(instance)
        self.__db.session.commit()

    def update_db(self):
        self.__db.session.commit()