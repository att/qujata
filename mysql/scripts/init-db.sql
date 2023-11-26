-- Create the qujata schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS qujata;

-- Switch to the qujata schema
USE qujata;

-- Create the env_info table
CREATE TABLE env_info (
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
CREATE TABLE test_suites (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             description VARCHAR(255),
                             protocol VARCHAR(50),
                             env_info_id INT,
                             code_release VARCHAR(255),
                             created_by VARCHAR(255),
                             created_date TIMESTAMP,
                             updated_by VARCHAR(255),
                             updated_date TIMESTAMP
);

-- Create the test_runs table
CREATE TABLE test_runs (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           test_suite_id INT,
                           start_time TIMESTAMP,
                           end_time TIMESTAMP,
                           algorithm VARCHAR(255),
                           iterations INT,
                           message_size INT
);

-- Add foreign key constraints
ALTER TABLE test_suites ADD FOREIGN KEY (env_info_id) REFERENCES env_info(id);
ALTER TABLE test_runs ADD FOREIGN KEY (test_suite_id) REFERENCES test_suites(id);
