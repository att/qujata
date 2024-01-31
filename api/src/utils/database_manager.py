from config.mysql_config import MySQLConfig
from flask_sqlalchemy import SQLAlchemy

class DatabaseManager:
    def __init__(self, app):
        app.config.from_object(MySQLConfig)
        db = SQLAlchemy(app)
        self.__db = db

    def create(self, instance):
        self.__db.session.add(instance)
        self.__db.session.commit()

    def delete(self, instance):
        self.__db.session.delete(instance)
        self.__db.session.commit()

    def delete_by_ids(self, model, ids):
        self.__db.session.query(model).filter(model.id.in_(ids)).delete(synchronize_session='fetch')
        self.__db.session.commit()

    def update(self, instance):
        self.__db.session.commit()

    def list(self, model, filter_conditions=None):
        query = self.__db.session.query(model)
        
        if filter_conditions:
            query = query.filter(*filter_conditions)
            
        return query.all()

    def get(self, model, filter_conditions=None):
        query = self.__db.session.query(model)
        
        if filter_conditions:
            query = query.filter(*filter_conditions)
            
        return query.first()

    def get_by_id(self, model, id):
        return self.__db.session.query(model).get(id)

    def get_latest(self, model):
        last_record = self.__db.session.query(model).order_by(model.id.desc()).first()
        return last_record
