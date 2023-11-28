import mysql.connector
from flask import Blueprint, jsonify, request, current_app
from flask_cors import cross_origin

env_api = Blueprint('qujata-api', __name__)

# Define the expected keys
expected_keys = ['resource_name', 'operating_system', 'cpu', 'cpu_architecture', 'cpu_cores', 'clock_speed', 'node_size']

@env_api.route('/env-info', methods=['POST'])
@cross_origin(origins=['*'], supports_credentials=True)
def insert_env_info():
    cursor = None
    connection = None
    try:
        # Connect to the MySQL database
        db_config = {
            'host': current_app.dbHost,
            'port': current_app.dbPort,
            'user': current_app.dbUser,
            'password': current_app.dbPass,
            'database': current_app.dbName,
            'raise_on_warnings': True,
        }

        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Extract data from the request
        data = request.get_json()

        # Check that at least one expected key-value pair exists in the JSON payload
        if data and any(key in data and data[key] is not None for key in expected_keys):
            # Insert data into the table (replace 'env_info_table' with your actual table name)
            query = "INSERT INTO env_info (resource_name, operating_system, cpu, cpu_architecture, cpu_cores, clock_speed, node_size) VALUES (%s, %s, %s, %s, %s, %s, %s)"

            # Create a tuple of values based on the keys in the JSON payload
            values = (
                data.get('resource_name'),
                data.get('operating_system'),
                data.get('cpu'),
                data.get('cpu_architecture'),
                data.get('cpu_cores'),
                data.get('clock_speed'),
                data.get('node_size')
            )

            # Execute the query with the values
            cursor.execute(query, values)
        else:
            return jsonify({'error': 'Invalid or empty JSON payload or missing expected values'}), 400

        # Commit the transaction
        connection.commit()

        return jsonify({'message': 'Inserted env info successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def __validate(data):
    # Check if none of the expected key-value pairs exist in the JSON payload, or all existing key-values have a None value
    if not data or all(data.get(key) is None for key in expected_keys):
        missing_values = [key for key in expected_keys if key not in data or data.get(key) is None]
        error_message = f'Missing or all null values for the following expected keys: {", ".join(missing_values)}'
        return jsonify({'error': error_message}), 400
