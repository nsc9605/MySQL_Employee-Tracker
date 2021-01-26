
INSERT INTO department (department_name) 
VALUES
    ("Engineer"),
    ("Advertising"),
    ("Information Technology"),
    ("Legal"),
    ("Finance"),
    ("Marketing"),
    ("Human Relations");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Senior Software Engineer", 130000, 1),
    ("Front End Software Engineer", 120000, 1),
    ("Campaign Manager", 100000, 2),
    ("Database Administrator", 93750, 3),
    ("Computer Network Administrator", 100000, 3),
    ("Lawyer", 180000, 4),
    ("Financial Manager", 127000, 5),
    ("Head Social Media", 50000, 6),
    ("Human Resource Manager", 130000, 7);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ("Triona", "Sherlock", 3, null),
    ("Amy", "Cody", 8, 1),
    ("Jessica", "Deck", 2, null),
    ("Sam", "Leone", 7, null),
    ("Ciaran", "McGlade", 2, 3);


