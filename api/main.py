from flask import Flask
from src.controllers.api import api as api_blueprint
from src.controllers.env_info_api import env_info_api as env_api_blueprint
from config.settings import load_config
from flask_cors import CORS
from src.utils.database_manager import DatabaseManager

app = Flask(__name__)
# load config
load_config(app)
# create db manager
app.database_manager = DatabaseManager(app)
# init routes
app.register_blueprint(api_blueprint, url_prefix='/qujata-api', name='api')
app.register_blueprint(env_api_blueprint, url_prefix='/qujata-api', name='env_info_api')

CORS(app, origins=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3020)
