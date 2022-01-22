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
            } else if(answers.home === "View all employees"){
                viewAllEmployees();
            } else if(answers.home === "Add a department"){
                addDepartment();
            } else if(answers.home === "Add a role"){
                addRole();
            } else if(answers.home === "Add an employee"){
                addEmployee();
            } else if (answers.home === "Update an employee role"){
                updateEmployeeRole();
            }
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
    db.query("SELECT R.id, R.title, R.salary, D.name AS department FROM role R INNER JOIN department D ON R.department_id = D.id;", (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allQuestions();
    });
};

// viewAllEmployees function
const viewAllEmployees = () => {
    db.query(`SELECT E.id, E.first_name AS 'First Name', E.last_name AS 'Last Name', R.title, D.name department, R.salary,
        CONCAT(manager_id.first_name, " ", manager_id.last_name) AS manager FROM employee
        FROM employee E 
        INNER JOIN role R ON E.role_id = R.id
        INNER JOIN department D ON R.department_id = D.id
        INNER JOIN employee manager ON employee.manager_id = manager.id;
        `
// still need to add manager name from employee Table
//         CONCAT(manager.first_name, " ", manager.last_name) AS manager_id FROM employee
        , (err, result) => {
        if (err) { console.log(err) }
        console.table(result)
        allQuestions();
    });
};

// addDepartment function
const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'addDept'
            }
        ])
        .then(answers => {
            const newDepartment = answers.addDept;
            db.query(`INSERT INTO department (name) VALUES(?);`, [newDepartment], (err, result) => {
                if(err) { console.log(err) }
            });
            allQuestions();
        });
};

// addRole function
const addRole = async () => {
    let roles = [];
    let choices =
        db.promise().query(`SELECT * FROM department;`)
            .then(results => {
                results[0].forEach(result => {
                    roles.push(result.name);
                });
            })
            .catch(err => console.log(err));
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'addRole'
        },
        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'addSalary'
        },
        {
            type: 'list',
            message: 'Which department does the role belong to?',
            // add choices or pull from 
            choices: roles,
            name: 'addToDept'
        }
    ])
    .then(answers => {
        const newRole = answers.addRole;
        const newRoleSalary = answers.addSalary;
        const addRoleToDept = answers.addToDept;
        db.query(`INSERT INTO role (name, salary, department_id) VALUES(?, ?, ?);`, [newRole, newRoleSalary, newRoleToDept], (err, result) => {
            if(err) { console.log(err) }
        });
        allQuestions();
    });
};

// addEmployee function
const addEmployee = () => {
    db.query(`SELECT * FROM role;`, (err, result) => {
        if(err) { console.log(err) }
    })
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'addFirstName'
        },
        {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'addLastName'
        },
        {
            type: 'list',
            message: 'What is the employee\'s role?',
            choices: [],
            name: 'addEmployeeRole'
        },
        {
            type: 'list',
            message: 'Who is the employee\'s manager?',
            choices: [],
            name: 'addEmployeeMng'
        },
    ])
    .then(answers => {
        const newEmployee = answers.addFirstName;
        const newEmployeeLastName = answers.addLastName;
        const newEmployeeRole = answers.addEmployeeRole;
        const newEmployeeManager = answers.addEmployeeMng;
        db.query(`INSERT INTO employee (name) VALUES(?);`, [], (err, result) => {
            if(err) { console.log(err) }
        });
        allQuestions();
    });
};

// updateEmployeeRole
const updateEmployeeRole = () => {
    db.query(`SELECT * FROM employee;`, (err, result) => {
        if(err) { console.log(err) }
    })
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Which employee\'s role do you want to update?',
            choices: [],
            name: 'updateEmployeeRole'
        },
        {
            type: 'list',
            message: 'Which role do you want to assign the selected employee?',
            choices: [],
            name: 'updateRoleOfEmployee'
        },
    ])
    .then(answers => {
        const updatedEmployee = answers.updateEmployeeRole;
        const updatedEmployeeRole = answers.updateRoleOfEmployee;
        db.query(`INSERT INTO employee (name) VALUES(?);`, [updatedEmployee, updatedEmployeeRole], (err, result) => {
            if(err) { console.log(err) }
        });
        allQuestions();
    });

};

allQuestions();

