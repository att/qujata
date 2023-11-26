# mysql/Dockerfile

FROM mysql:latest

# Copy the SQL script into the Docker image
COPY scripts/init-db.sql /docker-entrypoint-initdb.d/

# Copy the Bash script into the Docker image
COPY scripts/insert-env-info.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/insert-env-info.sh

# Expose MySQL default port
EXPOSE 3306
