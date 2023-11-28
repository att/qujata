import os
from dotenv import load_dotenv
def load_config(app):
    load_dotenv()
    app.allowedAlgorithms = os.environ.get('DEFAULT_GROUPS',"kyber512:frodo640aes").split(":")
    app.qujata_curl_target = os.environ.get('CURL_URL', "http://localhost:3010")
    app.request_timeout = os.environ.get('REQUEST_TIMEOUT', 900)
    app.min_iterations = int(os.environ.get('MIN_ITERATIONS', 500))
    app.max_iterations = int(os.environ.get('MAX_ITERATIONS', 100000))
    app.dbHost = os.environ.get('DB_HOST', "localhost")
    app.dbPort = os.environ.get('DB_PORT', "3306")
    app.dbUser = os.environ.get('DB_USER', "root")
    app.dbPass = os.environ.get('DB_PASS', "qujata")
    app.dbName = os.environ.get('DB_NAME', "qujata")