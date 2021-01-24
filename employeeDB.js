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

      // case "Update employee roles":
      //   updateEmployeeRoles();
      //   break;

      default:
        "Exit";
        connection.end();
    }
  } catch (err) {
    console.log(err);
    console.table(answer);
    startProgram();
  }
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
    var result = await connection.query("INSERT INTO department SET ?", {
      id: answer.id,
      department_name: answer.department,
    });
    console.log(`Success! This department has been added to your database: ${answer.department}`);
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
    var result = await connection.query("INSERT INTO role SET ?", {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department,
    });
    console.log(`This role has been added: ${answer.title}`);
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== Add new employee ===========
var addEmployee = async () => {
  try {
    var empRow = await connection.query("SELECT * FROM role");
    var choicesArr = empRow.map((employeeRole) => {
      return {
        name: employeeRole.first_name + employeeRole.last_name,
        value: employeeRole.id,
      };
    });
    // console.log(choicesArr);
    var managerInfo = await connection.query("SELECT * FROM employees");
    var managerArr = managerInfo.map((empManager) => {
      return {
        name: empManager.first_name + empManager.last_name,
        value: empManager.id,
      };
    });

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

    var result = await connection.query("INSERT INTO employees SET ?", {
      id: answer.id,
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role_id || 0,
      manager_id: answer.manager_id,
    });
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== VIEW all departments ==========
var viewDepartments = async () => {
  try {
    var showTable = await connection.query("SELECT * FROM department");
    console.table(
      "=================================================",
      "               ALL DEPARTMENTS",
      "=================================================",
      showTable,
      "=================================================",
      );;
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== VIEW all roles ==========
var viewRoles = async () => {
  try {
    var showTable = await connection.query("SELECT * FROM role");
    console.table(
      "=================================================",
      "               ALL ROLES",
      "=================================================",
      showTable,
      "=================================================",
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
    var showTable = await connection.query("SELECT * FROM employees");
    
    console.table(
      "=================================================",
      "               ALL EMPLOYEES",
      "=================================================",
      showTable,
      "=================================================",
      );
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== UPDATE all employee roles ==========
// var updateEmployeeRoles = async () => {
//   try {
//     var updateEmp = await connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS emp");
//     var empChoices = addEmployee.map(({ id, first_name, last_name }) => ({
//       name: `${first_name} ${last_name}`,
//       value: id,
//     }));

//     //  var choicesArr = updateEmp.map((roleUpdate) => {
//     //    return {
//     //      name: employeeRole.first_name + employeeRole.last_name,
//     //      value: roleUpdate.id
//     //    }
//     //  })
//     //  console.log(roleUpdate);

//     // var answer = await connection.query("UPDATE employees SET employees.role_id = ? WHERE employees.first_name, employees.last_name, employees.id", (err, res));
//     var updateEmpId = await prompt([
//       {
//         name: "employee_id",
//         type: "list",
//         message: "Which employee's role would you like to update?",
//         choices: empChoices,
//       },
//     ]);

//     var rolesChoice = roles.map(({ id, title }) => ({
//       name: title,
//       value: id,
//     }));
//     var { roles } = await prompt([
//       {
//         name: "role_id",
//         type: "list",
//         message: "Which role would you like to change?",
//         choices: rolesChoice,
//       },
//     ]);
//     var result = await connection.query("UPDATE");
//     console.log("Success! Role updated!");
//     startProgram();
//   } catch (err) {
//     console.log(err);
//     startProgram();
//   }
// };
