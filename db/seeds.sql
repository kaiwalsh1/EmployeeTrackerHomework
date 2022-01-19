INSERT INTO department (id, name)
VALUES (1, "Sales"),
    (2, "Engineering"),
    (3, "Legal"),
    (4, "Finance"),
    (5, "Marketing");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Lead", 100000, 1),
    (2, "Salesperson", 80000, 1),
    (3, "Lead Engineer", 150000, 2),
    (4, "Software Engineer", 120000, 2),
    (5, "Account Manager", 160000, 4),
    (6, "Accountant", 125000, 4),
    (7, "Legal Team Lead", 250000, 3),
    (8, "Lawyer", 190000, 3),
    (9, "Marketing Lead", 90000, 5),
    (10, "Marketing Intern", 40000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, NULL),
    (2, "Mike", "Chan", 2, 1),
    (3, "Ashley", "Rodriguez", 3, NULL),
    (4, "Kevin", "Tupik", 4, 3),
    (5, "Kunal", "Singh", 5, NULL),
    (6, "Malia", "Brown", 6, 5),
    (7, "Sarah", "Lourd", 7, NULL),
    (8, "Tom", "Allen", 8, 7),
    (9, "Kai", "Walsh", 9, NULL),
    (10, "Lara", "Vanderbilt", 10, 9);