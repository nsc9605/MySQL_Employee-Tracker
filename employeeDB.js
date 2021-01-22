const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
// const { start } = require("repl");

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
  if (err) throw err;
  console.log("Successfully connected to MySQL server!");
  console.table(`Welcome to the MySQL Employee Tracker!`);
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
        addDepartment(data);
        break;

      case "Add a new role":
        addRole();
        break;

      case "Add a new employee":
        addEmployee();
        break;

      case "View all departments":
        viewDepartments(data);
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

      default:
        "Exit";
        connection.end();
    }
  } catch (err) {
    console.log(err);
    table(answer);
    startProgram();
  }
};

// ========== Add new department ==========
var addDepartment = async (data) => {
  try {
    var answer = await inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What is the name of the new department?",
        validate: (answer) => {
          if (answer !== false) {
            return true;
          }
          return "The department must contain at least one character!";
        },
      },
      {
        name: "id",
        type: "input",
        message: "What is the id number of the new department?",
        validate: (answer) => {
          if (isNaN(answer) === false) {
            return true;
          }
          return ("Please enter a numerical id number");
        },
      },
    ]);
    // console.log("department");
    var result = await connection.query("INSERT INTO department SET ?", {
      department_name: answer.department,
      id: answer.id,
    });
    console.log(`This department has been added: ${result.department}`);
    console.table(result)
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== Add new role ==========
var addRole = async () => {
  try {
    var answer = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the new role?",
        validate: function (answer) {
          if (answer !== "") {
            return true;
          }
          return "The role must contain at least one character!";
        },
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
      },
      {
        name: "department_id",
        type: "input",
        message: "Which department does this role belong in?",
        choices: function () {
          let choiceArr = [];
          for (var i = 0; i < answer.length; i++) {
            choiceArr.push({
              name: answer[i].name,
              id: answer[i].id
          })
          return choiceArr;
        }}
      }
    ]);
    var result = await connection.query("INSERT INTO role SET ?", {
      title: answer.title,
      salary: answer.salary || 0,
      id: answer.id || 0,
    });
    console.log(`This role has been added: ${result.role}`);
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== Add new employee ==========
var addEmployee = async () => {
  try {
    var answer = await inquirer.prompt([
      {
        name: "id",
        type: "input",
        message: "What is the employee\'s id number?",
        validate: (answer) => {
          if (isNaN(answer) === false) {
            return true;
          }
          return ("Please enter a numerical id number");
        },
      },
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "The department must contain at least one character!";
        },
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "The department must contain at least one character!";
        },
      },
      {
        name: "role_id",
        type: "list",
        message: "What type of role does the employee have?",
        choices: function (answer) {
          let choiceArr = [];
          for (var i = 0; i < answer.length; i++) {
            choiceArr.push({
              name: answer[i].name,
              value: answer[i].id
          })
          return choiceArr;
        }}
      },
      {
        name: "manager_id",
        type: "list",
        message: "Who is the employee's manager?",
        choices: function () {
          var managerIdArr = [];
          for (var i = 0; i < answer.length; i++) {
            managerIdArr.push(answer[i].manager_id);
          }
          return managerIdArr;
        },
      },
    ]);
    var result = await connection.query("INSERT INTO employee SET ?", {
      id: answer.id,
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role_id || 0,
      manager_id: answer.manager_id || 0,
    });
    console.log(`Success! ${first_name} ${last_name} has been added to your employees database!`);
    console.table(`Success! ${result.employees} has been added to your employees database!`);
    startProgram();
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== VIEW all departments ==========
function viewDepartments(data) {
  connection.query(`SELECT ${result.department} * FROM departments`, function (err, res) {
    if (err) throw err;
    console.log("Departments: "), console.table(res), startProgram();
  });
}

// ========== VIEW all roles ==========
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.log("roles");
    console.table(res),
    startProgram();
    data(error, results)
    {
      {
        cTable;
      }
    }
    console.table(res);
  });
}

// ========== VIEW all employees ==========
function viewEmployees() {
  connection.query(`SELECT ${result.employees} * FROM employees`, (err, res) => {
    if (err) throw err;
    console.log(res);
    console.table(res);
  });
}

// ========== UPDATE all employee roles ==========
function updateEmployeeRoles() {
  connection.query("UPDATE roles SET ? WHERE ?", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "update_role",
          type: "list",
          message: "Which employee's role would you like to update?",
          choices: function () {
            var empList = [];
            res.forEach((result) => {
              empList.push(result.last_name);
            });
            return empList;
          },
        },
      ])
    })
  }
