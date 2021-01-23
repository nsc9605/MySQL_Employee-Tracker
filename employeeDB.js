const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
// const cTable = require("console.table");
const { table } = require("console.table");


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
  // console.log("connected as id" + connection.threadId);
  // throw err;
  console.log("Successfully connected to MySQL server!");
  console.table(`Welcome to the MySQL Employee Tracker!`);
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

      case "Update employee roles":
        updateEmployeeRoles();
        break;

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
      // {
      //   name: "id",
      //   type: "input",
      //   message: "What is the id number of the new department?",
      //   validate: numVal,
      // },
    ]);
    // console.log("department");
    var result = await connection.query("INSERT INTO department SET ?", {
      // id: answer.id,
      department_name: answer.department,
    });
    console.log(`This department has been added: ${department_name}`);
    console.table(department_name);
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
    // await connection.query
    var choicesArr = deptRow.map((deptID) => {
      return { 
        name: deptID.department_name,
        value: deptID.id
      }
    }) 
      
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
        name: "department_id",
        type: "list",
        choices: choicesArr,
        message: "Which department does this role belong in?"
      },
    ]);
    var result = await connection.query("INSERT INTO role SET ?", { 
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department_id,
    });
    console.log(`This role has been added: ${title}`);
    console.log(err);
       // console.table(`This role has been added: ${title}`);
    startProgram();
   } catch (err) {
    //  console.log(result)
    console.table(result);
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
          value: employeeRole.id
        }
      })
        console.log(employeeRole);
        
      // }
   var answer = await inquirer.prompt([
      // {
      //   name: "id",
      //   type: "input",
      //   message: "What is the employee's id number?",
      //   validate: numVal,
      // },
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

    // var addEmp;
    // for (var i = 0; i < empRow.length; i++) {
    //   if (
    //     empRow[i].role_id === answer.role_id &&
    //     empRow[i].manager_id === answer.manager_id
    //   ) 
    //     addEmp = empRow[i];
      
    // }

    var result = await connection.query("INSERT INTO employees ", {
      id: answer.id,
      first_name: answer.first_name,
      last_name: answer.last_name,
      role_id: answer.role_id || 0,
      // manager_id: answer.manager_id,
    });
    startProgram();

  } catch (err) {
    console.log(err);
    startProgram();
  }
}

  // ========== VIEW all departments ==========
  var viewDepartments = async () => {
    try {
      var showTable = await connection.query("SELECT * FROM department");
      console.table(showTable);
      startProgram();
    }
    catch (err) {
      console.log(err);
      startProgram();
    }
  };
  
  // ========== VIEW all roles ==========
  var viewRoles = async () => {
    try {
      var showTable = await connection.query("SELECT * FROM role");
      console.table(showTable);
      startProgram();
    }
    catch (err) {
      console.log(err);
      startProgram();
    }
  };
  

  // ========== VIEW all employees ==========
  var viewEmployees = async () => {
    try {
      var showTable = await connection.query("SELECT * FROM employees");
      console.table(showTable);
      startProgram();
    }
    catch (err) {
      console.log(err);
      startProgram();
    }
  };
  

// ========== UPDATE all employee roles ==========
var updateEmployeeRoles = async () => {
  // try {
  //   connection.query("SELECT roles FROM employees")
  // }
  connection.query("SELECT * FROM employees", (err, res));
  if (err) throw err;
  let department = res[0].department_id;
  inquirer.prompt([
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
  ]);
};

