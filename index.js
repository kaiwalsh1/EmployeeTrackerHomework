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
            if (answers.home === "View all departments") {
                viewAllDepartments();
            } else if (answers.home === "View all roles") {
                viewAllRoles();
            } else if (answers.home === "View all employees") {
                viewAllEmployees();
            } else if (answers.home === "Add a department") {
                addDepartment();
            } else if (answers.home === "Add a role") {
                addRole();
            } else if (answers.home === "Add an employee") {
                addEmployee();
            } else if (answers.home === "Update an employee role") {
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
    db.query(`SELECT employee.id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', R.title, D.name AS department, R.salary,
        CONCAT(manager_id.first_name, " ", manager_id.last_name) AS manager FROM employee
        INNER JOIN role R ON employee.role_id = R.id
        INNER JOIN department D ON R.department_id = D.id
        LEFT JOIN employee manager_id ON manager_id.id = employee.manager_id;
        `
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
                if (err) { console.log(err) }
            });
            allQuestions();
        });
};

// addRole function
const addRole = async () => {
    let roles = [];
    db.promise().query(`SELECT * FROM department;`)
        .then(results => {
            results[0].forEach(result => {
                roles.push({
                    name: result.name,
                    value: result.id
                });
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
                choices: roles,
                name: 'addToDept'
            }
        ])
        .then(answers => {
            const newRole = answers.addRole;
            const newRoleSalary = answers.addSalary;
            const newRoleToDept = answers.addToDept;
            db.query(`INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?);`, [newRole, newRoleSalary, newRoleToDept], (err, result) => {
                if (err) { console.log(err) }
            });
            allQuestions();
        });
};



// addEmployee function
const addEmployee = async () => {
    let employees = [];
    let manager = [];
    db.promise().query(`SELECT * FROM role;`)
        .then(results => {
            results[0].forEach(result => {
                employees.push({
                    name: result.title,
                    value: result.id,
                });
            });
        })
        .catch(err => console.log(err));
    db.promise().query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL;`)
        .then(results => {
            results[0].forEach(result => {
                manager.push({
                    name: result.first_name,
                    value: result.manager_id,
                })
                // E.id, E.first_name + " " + E.last_name);
            });
        })
        .catch(err => console.log(err));
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
                choices: employees,
                name: 'addEmployeeRole'
            },
            {
                type: 'list',
                message: 'Who is the employee\'s manager?',
                choices: manager,
                name: 'addEmployeeMng'
            },
        ])
        .then(answers => {
            const newEmployee = answers.addFirstName;
            const newEmployeeLastName = answers.addLastName;
            const newEmployeeRole = answers.addEmployeeRole;
            const newEmployeeManager = answers.addEmployeeMng;
            // const newRole = answers.
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);`, [newEmployee, newEmployeeLastName, newEmployeeRole, newEmployeeManager], (err, result) => {
                if (err) { console.log(err) }
                // db.query(`INSERT INTO role ()`)
            });
            allQuestions();
        });
};

// updateEmployeeRole
const updateEmployeeRole = async () => {
    var updateRole = [];
    var updateEmployee = [];
    db.promise().query(`SELECT * FROM role;`)
        .then(results => {
            results[0].forEach(result => {
                updateRole.push({
                    name: result.title,
                    value: result.id,
                });
            });
            return updateRole
        }).then(updateRole => {
            db.promise().query(`SELECT * FROM employee;`)
                .then(results => {
                    results[0].forEach(result => {
                        updateEmployee.push({
                            name: result.first_name + " " + result.last_name,
                            value: result.id,
                        });
                    });
                    return { updateRole, updateEmployee }
                }).then(updatedStuff => {
                    console.log(updatedStuff);
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                message: 'Which employee\'s role do you want to update?',
                                choices: updatedStuff.updateEmployee,
                                name: 'updaterEmployeeRole'
                            },
                            {
                                type: 'list',
                                message: 'Which role do you want to assign the selected employee?',
                                choices: updatedStuff.updateRole,
                                name: 'updaterRoleOfEmployee'
                            },
                        ])
                        .then(answers => {
                            const updatedEmployee = answers.updaterEmployeeRole;
                            const updatedEmployeeRole = answers.updaterRoleOfEmployee;
                            db.query(`UPDATE employee SET role_id = ${updatedEmployeeRole} WHERE employee.id = ${updatedEmployee};`, (err, result) => {
                                if (err) { console.log(err) }
                            });
                            allQuestions();
                        });
                })
        })
};

allQuestions();

