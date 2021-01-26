const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeDB",
});

// Use built-in utils to have connection.query
connection.query = util.promisify(connection.query);

// Connect to the MySQL server and SQL Database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Successfully connected to MySQL server!");
  startProgram();
});

// var to prompt start questions
var startProgram = async () => {
  try {
    var answer = await inquirer.prompt({
      name: "task",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        "View all departments",
        "View all roles",
        "View all employees",
        "Update employee roles",
        "Exit",
      ],
    });
    switch (answer.task) {
      case "Add a new department":
        addDepartment();
        break;

      case "Add a new role":
        addRole();
        break;

      case "Add a new employee":
        addEmployee();
        break;

      case "View all departments":
        viewDepartments();
        break;

      case "View all roles":
        viewRoles();
        break;

      case "View all employees":
        viewEmployees();
        break;

      case "Update employee roles":
        updateEmployeeRoles();
        break;

      case "Exit":
        exit();
        break;

      default:
        connection.end();
    }
  } catch (err) {
    console.log(err);
    console.table(answer.task);
    startProgram();
  }
};

// Global functions to alert user to use appropriate characters
const inputVal = (input) => {
  if (input !== "") {
    return true;
  }
  return "This input can not be empty! Please enter valid characters.";
};

const numVal = (input) => {
  if (isNaN(input) === false) {
    return true;
  }
  return "Please enter a numerical id number";
};

// ========== Add new department ==========
var addDepartment = async () => {
  try {
    var answer = await inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What is the name of the new department?",
        validate: inputVal,
      },
    ]);

    // Prevention of repetition of departments being added to database
    var listOfDepartments = await connection.query("SELECT * FROM department");
    var doesDepartmentExist = listOfDepartments.some(
      (each) => each.department_name === answer.department
    );
    if (doesDepartmentExist) {
      console.log("Department already exists, please try another department!");
      startProgram();
      return;
    }
    var result = await connection.query("INSERT INTO department SET ?", {
      id: answer.id,
      department_name: answer.department,
    });
    console.log(
      `Success! This department has been added to your database: ${answer.department}`
    );
    // viewDepartments();
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== Add new role ==========
var addRole = async () => {
  try {
    var deptRow = await connection.query("SELECT * FROM department");
    var choicesArr = deptRow.map((deptID) => {
      return {
        name: deptID.department_name,
        value: deptID.id,
      };
    });

    var answer = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the new role?",
        validate: inputVal,
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
        validate: numVal,
      },
      {
        name: "department",
        type: "list",
        choices: choicesArr,
        message: "Which department does this role belong in?",
      },
    ]);
    // To prevent repetition of roles being added to database
    var listOfRoles = await connection.query("SELECT * FROM role");
    var doesRoleExist = listOfRoles.some((each) => each.title === answer.title);
    if (doesRoleExist) {
      console.log("Role already exists, please try another role!");
      startProgram();
      return;
    }
    var result = await connection.query("INSERT INTO role SET ?", {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department,
    });
    console.log(`This role has been added: ${answer.title}`);
    // viewRoles();
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== Add new employee ===========
var addEmployee = async () => {
  try {
    // List of roles for choices array to choose from
    var empRow = await connection.query("SELECT * FROM role");
    var choicesArr = empRow.map((employeeRole) => {
      return {
        name: employeeRole.title,
        value: employeeRole.id,
      };
    });
    // List of employees to choose from for manager
    var managerInfo = await connection.query("SELECT * FROM employees");
    var managerArr = managerInfo.map((empManager) => {
      return {
        name: empManager.first_name + " " + empManager.last_name,
        value: empManager.id,
      };
    });

    // Create a default employee if there are none in the DB
    if (managerArr.length === 0) {
      managerArr = [{ name: "None", value: null }];
    }
    // If the employee has no manager / is the manager, allow a "None" option
    let noManager = managerArr;
    noManager.push({ name: "None", value: null });

    var answer = await inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
        validate: inputVal,
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
        validate: inputVal,
      },
      {
        name: "role_id",
        type: "list",
        choices: choicesArr,
        message: "What type of role does the employee have?",
      },
      {
        name: "manager_id",
        type: "list",
        choices: managerArr,
        message: "Who is the employee's manager?",
      },
    ]);
    console.table(
      "--------------------------",
      "--------------------------",
      "        Just Added        ",
      answer,
      "--------------------------"
    );
    var result = await connection.query("INSERT INTO employees SET ?", {
      id: answer.id,
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role_id,
      manager_id: answer.manager_id,
    });
    console.log(
      `Success! This employee has been added to your database: ${
        answer.first_name + " " + answer.last_name
      }`
    );
    // viewEmployees();
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== VIEW all departments ==========
var viewDepartments = async () => {
  try {
    // var showTable = await connection.query("SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS employee, department.department_name AS department FROM employees LEFT JOIN role ON employees.role_id = role.id LEFT JOIN department on role.department_id = department.id");
    var showTable = await connection.query(
      "SELECT * FROM department ORDER BY id"
    );
    console.table(
      "=================================================",
      "               ALL DEPARTMENTS",
      "=================================================",
      showTable,
      "================================================="
    );
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== VIEW all roles ==========
var viewRoles = async () => {
  try {
    var showTable = await connection.query(
      "SELECT role.id, title, salary, department_name AS department FROM role INNER JOIN department ON role.department_id = department.id"
    );
    console.table(
      "==================================================================",
      "                          ALL ROLES",
      "==================================================================",
      showTable,
      "=================================================================="
    );
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== VIEW all employees ==========
var viewEmployees = async () => {
  try {
    var showTable = await connection.query(
      "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN role on employees.role_id = role.id LEFT JOIN department on role.id = department.id LEFT JOIN employees manager on manager.manager_id = employees.manager_id"
    );
    // var showTable = await connection.query("SELECT  FROM employees");

    console.table(
      "===========================================================================================================",
      "                                              ALL EMPLOYEES",
      "===========================================================================================================",
      showTable,
      "==========================================================================================================="
    );
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== UPDATE all employee roles ==========
var updateEmployeeRoles = async () => {
  try {
    var empRow = await connection.query("SELECT * FROM employees");
    var choicesArr = empRow.map((employeeName) => {
      return {
        name: employeeName.first_name + " " + employeeName.last_name,
        value: employeeName.id,
      };
    });

    var employeeAnswer = await inquirer.prompt([
      {
        name: "employee_id",
        type: "list",
        message: "Which employee would you like to update?",
        choices: choicesArr,
      },
    ]);
    var roleRow = await connection.query("SELECT * FROM role");
    var roleChoicesArr = roleRow.map((employeeRole) => {
      return {
        name: employeeRole.title,
        value: employeeRole.id,
      };
    });
    var roleAnswer = await inquirer.prompt([
      {
        name: "role_id",
        type: "list",
        message: "Choose a new role",
        choices: roleChoicesArr,
      },
    ]);
    // List of employees to choose from for manager
    var managerInfo = await connection.query("SELECT * FROM employees");
    var managerArr = managerInfo.map((empManager) => {
      return {
        name: empManager.first_name + " " + empManager.last_name,
        value: empManager.id,
      };
    });

    // Create a default employee if there are none in the DB
    if (managerArr.length === 0) {
      managerArr = [{ name: "None", value: null }];
    }
    // If the employee has no manager / is the manager, allow a "None" option
    let noManager = managerArr;
    noManager.push({ name: "None", value: null });

    var managerAnswer = await inquirer.prompt([
      {
        name: "manager_id",
        type: "list",
        message: "Choose a new manager",
        choices: managerArr,
      },
    ]);

    console.log(employeeAnswer);
    console.log(managerAnswer);

    // var result = await connection.query(`UPDATE employees SET role_id = ${roleAnswer.role_id} WHERE id = ${employeeAnswer.employee_id}`);
    var result = await connection.query(`UPDATE employees SET ? WHERE ?`, [
      { role_id: roleAnswer.role_id },
      { id: employeeAnswer.employee_id },
    ]);

    console.log("Success! Role updated!");
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========= EXIT PROGRAM ===============
var exit = async () => {
  console.log("Nothing more to add, exiting program now!");
  connection.end();
};
