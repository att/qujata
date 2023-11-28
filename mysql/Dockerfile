# mysql/Dockerfile

FROM mysql:latest

# Copy the SQL script into the Docker image
COPY scripts/init-db.sql /docker-entrypoint-initdb.d/

# Expose MySQL default port
EXPOSE 3306
