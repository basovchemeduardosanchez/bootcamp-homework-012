-- The line below is commented out to prevent data loss, uncomment if necessary 
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;
CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE role (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE, 
    PRIMARY KEY (id)
);
CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE, 
    FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE CASCADE, 
    PRIMARY KEY (id)
);
