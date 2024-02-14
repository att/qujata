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
                             start_time BIGINT,
                             end_time BIGINT,
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
                           FOREIGN KEY (test_suite_id) REFERENCES test_suites(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS test_run_metrics (
                                  test_run_id INT,
                                  metric_name ENUM('server_avg_cpu_cores', 'server_avg_memory', 'server_avg_cpu', 'client_avg_cpu_cores', 'client_avg_memory', 'client_avg_cpu', 'error_rate', 'bytes_throughput_per_sec', 'msg_throughput_per_sec', 'avg_tls_handshake_time'),
                                  value DOUBLE,
                                  PRIMARY KEY (test_run_id, metric_name),
                                  FOREIGN KEY (test_run_id) REFERENCES test_runs(id) ON DELETE CASCADE
);

INSERT INTO env_info (resource_name, operating_system, cpu, cpu_architecture, cpu_cores, clock_speed, node_size) VALUES ('REPLACE_WITH_RESOURCE_NAME', 'REPLACE_WITH_OPERATING_SYSTEM', 'REPLACE_WITH_CPU', 'REPLACE_WITH_CPU_ARCHITECTURE', 0, 'REPLACE_WITH_CLOCK_SPEED', 'REPLACE_WITH_NODE_SIZE');