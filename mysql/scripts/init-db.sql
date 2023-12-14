-- Create the qujata schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS qujata;

-- Switch to the qujata schema
USE qujata;

-- Create the env_info table
CREATE TABLE IF NOT EXISTS env_info (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          resource_name VARCHAR(255),
                          operating_system VARCHAR(255),
                          cpu VARCHAR(255),
                          cpu_architecture VARCHAR(255),
                          cpu_cores INT,
                          clock_speed VARCHAR(50),
                          node_size VARCHAR(255) NULL
);

-- Create the test_suites table
CREATE TABLE IF NOT EXISTS test_suites (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             name VARCHAR(255),
                             description VARCHAR(255),
                             protocol VARCHAR(50),
                             env_info_id INT,
                             code_release VARCHAR(255),
                             created_by VARCHAR(255),
                             created_date TIMESTAMP,
                             updated_by VARCHAR(255),
                             updated_date TIMESTAMP,
                             FOREIGN KEY (env_info_id) REFERENCES env_info(id)
);
-- Create the test_runs table
CREATE TABLE IF NOT EXISTS test_runs (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           test_suite_id INT,
                           start_time TIMESTAMP,
                           end_time TIMESTAMP,
                           algorithm VARCHAR(255),
                           iterations INT,
                           message_size INT,
                           status ENUM('SUCCESS', 'FAILED'),
                           status_message VARCHAR(255),
                           FOREIGN KEY (test_suite_id) REFERENCES test_suites(id)
);

CREATE TABLE IF NOT EXISTS test_run_results (
                                  test_run_id INT,
                                  metric_name ENUM('Average CPU', 'Average Memory', 'Error rate', 'Bytes Throughput Per Second', 'Messages Throughput Per Second', 'Average TLS Handshake Time'),
                                  value BIGINT,
                                  PRIMARY KEY (test_run_id, metric_name),
                                  FOREIGN KEY (test_run_id) REFERENCES test_runs(id)
);

INSERT INTO env_info (resource_name, operating_system, cpu, cpu_architecture, cpu_cores, clock_speed, node_size) VALUES ('RELACE_WITH_RESOURCE_NAME', 'RELACE_WITH_OPERATING_SYSTEM', 'RELACE_WITH_CPU', 'RELACE_WITH_CPU_ARCHITECTURE', 0, 'RELACE_WITH_CLOCK_SPEED', 'RELACE_WITH_NODE_SIZE');