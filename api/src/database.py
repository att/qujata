from flask import current_app

db = current_app.db

def add_to_db(instance):
    db.session.add(instance)
    db.session.commit()

def delete_from_db(instance):
    db.session.delete(instance)
    db.session.commit()

def update_db():
    db.session.commit()