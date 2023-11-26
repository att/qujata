#!/bin/bash

# MySQL connection parameters
MYSQL_USER="root"
MYSQL_PASSWORD="qujata"
MYSQL_DATABASE="qujata"

source ../configs/env-info.properties

# SQL statement with command line arguments
SQL_STATEMENT="USE $MYSQL_DATABASE; INSERT INTO env_info (resource_name, operating_system, cpu, cpu_architecture, cpu_cores, clock_speed, node_size) VALUES ('$RESOURCE_NAME', '$OPERATING_SYSTEM', '$CPU', '$CPU_ARCHITECTURE', $CPU_CORES, '$CLOCK_SPEED', '$NODE_SIZE');"
# Run the MySQL command
ERROR_MESSAGE=$(echo "$SQL_STATEMENT" | mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" 2>&1)
# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Successfully inserted environment info"
else
    echo $ERROR_MESSAGE
fi
