const cTable = require('console.table');
const res = require('express/lib/response');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'cms_db',
});

// const viewTable = ( table ) => {
// 	console.log( '\n' );
// 	console.table( table );
// 	console.log( '\n' );
// };

// ALL QUESTIONS - ask what action the user wants to take
const allQuestions = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
                name: 'home'
            },
        ])
        .then(answers => {
            if(answers.home === "View all departments"){
                viewAllDepartments();
            } else if(answers.home === "View all roles"){
                viewAllRoles();
            } 
            else if(answers.home === "View all employees"){
                viewAllEmployees();
            } 
            // else if(answers.home === "Add a department"){
                // addDepartment();
            // } else if(answers.home === "Add a role"){
                // addRole();
            // } else if(answers.home === "Add an employee"){
                // addEmployee();
            // } else if (answers.home === "Update an employee role"){
                // updateEmployeeRole();
            // }
        });
};

// viewAllDepartments function
const viewAllDepartments = () => {
    db.query("SELECT * FROM department;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allQuestions();
    });
};

// viewAllRoles function
const viewAllRoles = () => {
// db query request to get all the things from that
    db.query("SELECT R.id, R.title, R.salary, D.name department FROM role R INNER JOIN department D ON R.department_id = D.id;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allQuestions();
    });
};

// viewAllEmployees function
const viewAllEmployees = () => {
    db.query(`SELECT E.id, E.first_name, E.last_name, R.title, D.name department, R.salary, E.manager_id 
        FROM employee E 
        INNER JOIN role R ON E.role_id = R.id
        INNER JOIN department D ON R.department_id = D.id
        ;
        `
        // still need to add manager name from 
        , (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allQuestions();
    });
};

// addDepartment function
// const addDepartment = () => {

    // allQuestions();
// };

// const addRole = () => {
// allQuestions();
// };

// const addEmployee = () => {
// allQuestions();
// };

// const updateEmployeeRole = () => {
// allQuestions();
// };

allQuestions();

