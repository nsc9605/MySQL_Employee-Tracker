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

      default:
        "Exit";
        connection.end();
    }
  } catch (err) {
    console.log(err);
    startProgram();
  }
};

// ========== Add new department ==========
var addDepartment = async () => {
  try {
    var answer = await inquirer
    .prompt([{
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
          return false;
        }
      },
  ]);
      // console.log("department");
      var result = await connection.query("INSERT INTO department SET ?", {
        department_name: answer.department
      });
      console.log(`This department has been added: ${result.department}`);
      startProgram();
    } catch (err) {
        console.log(err);
        startProgram();  
    };
};

// ========== Add new role ==========
var addRole = async () => {
  try {
      var answer = await inquirer
          .prompt([{
            name: "title",
            type: "input",
            message: "What is the title of the new role?",
            validate: function(answer) {
              if (answer !== "") {
                  return true;
              }
              return "The role must contain at least one character!"
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
              var roleArray = [];
              for (var i = 0; i < res.length, i++) {
                roleArray.push(res[i].department_id);
              }
              return roleArray;
            },
        }]);    
      var rolesResult = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary || 0,
            department_id: answer.department_id || 0,
      }); 
      console.log(`This role has been added: ${answer.role_title}`);
      startProgram();  
    } catch (err) {
      console.log(err);
      startProgram();
    }
};
  
// ========== Add new employee ==========
var addEmployee = async () => {
  try {
    var answer = await inquirer
      .prompt([{
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
        validate: (answer) => {
          if (answer !== false) {
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
          if (answer !== false) {
              return true;
          }
            return "The department must contain at least one character!";
        },
      },
      {
        name: "role_id",
        type: "list",
        message: "What type of role does the employee have?",
        validate: (answer) => {
          if (isNaN(answer) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "manager_id",
        type: "list",
        message: "Who is the employee's manager?",
        choices: function () {
          var empArray = [];
          for (var i = 0; i < res.length, i++) {
            empArray.push(res[i].manager_id);
          }
          return empArray;
        },
    }]);
    var result = await connection.query("INSERT INTO employee SET ?", {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.role_id || 0,
        manager_id: answer.manager_id || 0,
        });
        console.log(`The employee has been added ${result.employees}`)
        startProgram();
      } catch (err) {
    console.log(err);
    startProgram();
    };
   }

   // ========== VIEW all departments ==========
function viewDepartments() {
  connection.query("SELECT * FROM departments", function(err, res) {
    if (err) throw err;
    console.log("Departments:"), 
    console.table("res"),
    startProgram();
  }
  );
}

  // ========== VIEW all roles ==========
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.log("roles");
    {{ cTable }}
    console.table("res")
  });
  } 

  // ========== VIEW all employees ==========
function viewEmployees() {
  connection.query("SELECT * FROM employees", function(err, res) {
    if (err) throw err;
    console.log("Employees");
    console.table("res")
  });
}

  // ========== UPDATE all employee roles ==========
function updateEmployeeRoles() {
  connection.query("UPDATE roles SET ? WHERE ?", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([{
        name: "update_role",
        type: "list",
        message: "Which employee's role would you like to update?",
        choices: function() {
          var empList = [];
          res.forEach(result => {
            empList.push(result.last_name);
          })
          return empList;
        }
      }
    ]).then(function(answer) {
      let name = answer.update_role;
    },
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      inquirer
      .prompt([{
        name: "change_role",
        type: "list",
        message: "What is the employee's new role?",
        choices: function() {
          changeRoleList = [];
          res.forEach(res => {
            changeRoleList.push(res.title)
          })
          return changeRoleList;
        }
      }])
  }))})}
