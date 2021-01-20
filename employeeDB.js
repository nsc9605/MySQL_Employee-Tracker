const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeDB",
});

// connect to the mysql server and sql database

connection.connect((err) => {
  if (err) throw err;
  // console.log('connected as id ' + connection.threadId);
  promptUserInput();
  // connection.end();
});

// Function to prompt start questions
function promptUserInput() {
  inquirer
    .prompt({
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
    })
    .then(function (answer) {
      switch (answer.action) {
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
      }
    });
}

// Functions for each choice
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the new department?",
  })
  .then(function(answer) {
    var 
  })
}

function addRole() {
  inquirer
    .prompt([
      {
      name: "title",
      type: "input",
      message: "What is the title of the new role?",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of the new role?",
    },
  {
      name: "department_id",
      type: "list",
      message: "Which department does this role belong in?",
      choices: [
        // add choices
      ]
  },
  ])
};

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role_id",
        type: "list",
        message: "What type of role does the employee have?",
      },
      {
        name: "manager_id",
        type: "list",
        message: "Who is the employee\'s manager?",
        choices: [
          // "managers from db"
        ]
      },
  ]);
};

function viewDepartments() {
  var query = "SELECT * FROM departments";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].name)
    }
    promptUserInput()
    // console.log("Departments:");
  });
};

function viewRoles() {
  var query = "SELECT * FROM roles";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("roles");
  });
};

function viewEmployees() {
  var query = "SELECT * FROM employees";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("employees");
  });
};

function updateEmployeeRoles() {
  var query = "UPDATE roles SET ? WHERE ?";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("");
  })
};