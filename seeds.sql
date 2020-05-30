INSERT INTO department (department_name) VALUES
("Manager"), ("Employee"), ("Intern");

INSERT INTO roles (title, salary, department_id) VALUES
("Manager", 100000.00, 1), ("Employee", 90000.00, 2), ("Intern", 40000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("Buffy", "Summers", 1, null),
("Anya", "Jenkins", 2, 1),
("Willow", "Rosenberg", 2, 1),
("William", "Pratt", 3, 2),
("Inara", "Serra", 2, 2),
("Faith", "Lehane", 2, 2),
("Winifred", "Burkle", 2, 2),
("Xander", "Harris", 2, 2),
("Hoban", "Washburne", 3, 2),
("River", "Tam", 3, 2),
("Rupert", "Giles", 1, 2),
("Tara", "Maclay", 3, 3),
("Andrew", "Wells", 3, 3),
("Cordelia", "Chase", 3, 3),
("Charles", "Gunn", 2, 3),
("Wesley", "Wyndam-Pryce", 2, 3),
("Kathy", "Newman", 3, 3),
("Nikki", "Wood", 1, 1),
("Caroline", "Farrell", 2, 2);