from flask import Flask
from src.controllers.api import api
from config.settings import load_config
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config.mysql import Config




app = Flask(__name__)
# load config
load_config(app)
# init db
app.config.from_object(Config)
app.db = SQLAlchemy(app)
# init routes
app.register_blueprint(api, url_prefix='/qujata-api')
CORS(app,origins=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=3020)