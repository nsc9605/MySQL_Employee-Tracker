USE employeeDB;

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


INSERT INTO employees (first_name, last_name)
VALUES 
    ("Triona", "Sherlock"),
    ("Amy", "Cody"),
    ("Archie", "Dolan"),
    ("Dahlia", "Anagnostakos"),
    ("Rondal","Robinson"),
    ("Steise","Moira")
    ("Kristin","Manning")
    ("Andrew","Simons"),
    ("Diana","Pikarski");
