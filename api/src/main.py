from flask import Flask
from src.api import api
from config.settings import load_config
from flask_cors import CORS

app = Flask(__name__)
load_config(app)
app.register_blueprint(api, url_prefix='/qujata-api')

CORS(app,origins=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=3020)