DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE departments (
    id INT NOT NULL,
    name VARCHAR(30) NULL,
    PRIMARY KEY(id),
);

CREATE TABLE roles (
    id INT NOT NULL,
    title VARCHAR(30) NULL,
    salary DECIMAL NULL,
    department_id INT NULL,
    PRIMARY KEY(id),
);

CREATE TABLE employees (
    id INT NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id),
);

SELECT * FROM departments;

SELECT * FROM roles;

SELECT * FROM employees;

