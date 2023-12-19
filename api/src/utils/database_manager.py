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

    def get_records(self, model, filter_conditions=None):
        query = self.__db.session.query(model)
        
        if filter_conditions:
            query = query.filter(*filter_conditions)
            
        return query.all()

    def get_record(self, model, filter_conditions=None):
        query = self.__db.session.query(model)
        
        if filter_conditions:
            query = query.filter(*filter_conditions)
            
        return query.first()

    def get_record_by_id(self, model, id):
        return self.__db.session.query(model).get(id)

    def get_last_record(self, model):
        last_record = self.__db.session.query(model).order_by(model.id.desc()).first()
        return last_record

    def update_db(self):
        self.__db.session.commit()