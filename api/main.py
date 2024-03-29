from flask import Flask
from src.api.configurations_api import api as configurations_api_blueprint
from src.api.analyze_api import api as analyze_api_blueprint
from src.api.environment_api import api as env_api_blueprint
from src.api.tests_api import api as tests_blueprint
import src.services.k8s_service as k8s_service
import src.services.cadvisor_service as cadvisor_service
from src.enums.environment import Environment
from config.settings import load_config
from flask_cors import CORS
from src.utils.database_manager import DatabaseManager

URL_PREFIX = '/qujata-api'

app = Flask(__name__)
# load config
load_config(app)
# create db manager
app.database_manager = DatabaseManager(app)
# init k8s
if app.configurations.environment == Environment.KUBERNETES.value:
    k8s_service.init_cluster()
# init cadvisor_service    
cadvisor_service.init(app.configurations.environment, app.configurations.cadvisor_url)
# init routes
app.register_blueprint(configurations_api_blueprint, url_prefix=URL_PREFIX, name='configurations_api')
app.register_blueprint(analyze_api_blueprint, url_prefix=URL_PREFIX, name='analyze_api')
app.register_blueprint(env_api_blueprint, url_prefix=URL_PREFIX, name='environment_api')
app.register_blueprint(tests_blueprint, url_prefix=URL_PREFIX, name='tests_api')
# enable cors
CORS(app, origins=['*'])
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3020)
