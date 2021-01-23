USE employeeDB;

INSERT INTO department (department_name) 
VALUES
("Human Relations"),
("Sales"),
("Information Technology"),
("Legal"),
("Finance"),
("Engineer");

INSERT INTO role (title, salary, department_id)
VALUES 
    (`Human Resource Manager`, 150000, 1),
    (`Sales Leader`, 100000, 2),
    (`Database Administrator`, 93750, 3),
    (`Computer Network Administrator`, 100000, 3),
    (`Lawyer`, 180000, 4),
    (`Financial Manager`, 127000, 5),
    (`Senior Software Engineer`, 130000, 6),
    (`Front End Software Engineer` 120000, 6),

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    (`Triona`, `Sherlock`, ``),
    (`Amy`, `Cody`, ``),
    (`Archie`, `Dolan`, ``),
    ()
