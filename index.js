const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'cms_db',
}).promise();

const viewTable = ( table ) => {
	console.log( '\n' );
	console.table( table );
	console.log( '\n' );
};

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
            console.log(answers);
            // if(answers.home === "View all departments"){
            //     viewAllDepartments();
            // } else if(answers.home === "View all roles"){

            // } else if(answers.home === "View all employees"){

            // } else if(answers.home === "Add a department"){

            // } else if(answers.home === "Add a role"){

            // } else if(answers.home === "Add an employee"){

            // } else if (answers.home === "Update an employee role"){

            // }
        });
};

const viewAllDepartments = async () => {
    try {
        const table = await db.query(queries.department);
        viewTable(table);
        return 
    } catch (e) {
        console.log(e);
    }
};

// const viewAllRoles = () => {

// };

// const viewAllEmployees = () => {

// };

// const addDepartment = () => {

// };

// const addRole = () => {

// };

// const addEmployee = () => {

// };

// const updateEmployeeRole = () => {

// };