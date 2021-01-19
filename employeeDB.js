const mysql = require('mysql');
// const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'pickles',
  database: 'employeeDB'
});

// connect to the mysql server and sql database

connection.connect((err) => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  connection.end();
});
