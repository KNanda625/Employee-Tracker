const mysql = require("mysql");
const inquirer = require("inquirer")
const consoleTable = require("console.table")


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // your MySQL username
  user: "node",
  // your MySQL password
  password: "12345",
  // database name
  database: "employees_db",
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

function start(){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Welcome to the Employee Tracker. What would you like to do?",
            choices: [
                "View All Employees", 
                "View All Departments",
                "View All Roles",
                "View All Employees by Department", 
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manger",
                "EXIT"
            ]
        }).then(function(res){
            switch(res.action){
                case "View All Employees":
                    return allEmployees();
                case "View All Departments":
                    return allDepartments();
                case "View All Roles":
                    return allRoles();
                case "View All Employees by Department":
                    return employeesByDepartment();
                case "View All Employees by Manager":
                    return employeesByManager();
                case "Add Employee":
                    return addEmployee();
                case "Remove Employee":
                    return removeEmployee();
                case "Update Employee Role":
                    return updateRole();
                case "Update Employee Manger":
                    return updateManager();
                case "EXIT":
                    return exit();
            };

        });
};

function allEmployees(){
    let query = "SELECT table1.id, first_name, last_name, title FROM employees AS table1 LEFT JOIN role AS table2 ON table1.role_id = table2.id"
    connection.query(query, function(err,res){
        if(err) throw err;
        console.table(res);
        start();
    })
}

function allDepartments(){
    let query = "SELECT * FROM department"
    connection.query(query, function(err,res){
        if(err) throw err;
        console.table(res);
        start();
    })
}
function allRoles(){
    let query = "SELECT * FROM role"
    connection.query(query, function(err,res){
        if(err) throw err;
        console.table(res);
        start();
    })
}

function addEmployee(){
    // Run role query to gather possible roles available
    connection.query("SELECT title, id FROM role", function(errRole, resRole){
        if (errRole) throw errRole;
        // Run employee query to gather possible managers available
        connection.query("SELECT id, CONCAT(first_name,' ',last_name) AS name FROM employees", function(errMan, resMan){
            inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the new employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the new employee's last name?"
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "What is this new employee's role?",
                    choices: resRole.map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        };
                    })
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Who is this new employee's manager?",
                    choices: resMan.map((employee) => {
                        return {
                            name: employee.name,
                            value: employee.id
                        };
                    })
                }
                ]).then(function(res){
                    // console.log(res);
                    connection.query(
                        "INSERT INTO employees SET ?",
                        [{
                            first_name: res.first_name,
                            last_name: res.last_name,
                            role_id: res.role_id,
                            manager_id: res.manager_id
                        }],
                        function (err,res){
                            if (err) throw err
                            console.log("The employee was added!")
                            start();
                        });
                });
        });
    });
    
};

function employeesByDepartment(){
    connection.query("SELECT * FROM department", function(err,res){
        if (err) throw err;
        inquirer.prompt({
            type: "list",
            name: "department_id",
            message: "Which department would you like to select from?",
            choices: res.map((department) => {
                return {
                    name: department.name,
                    value: department.id
                };
            })
        }).then(function(res){
            console.log(res);
            let query = "SELECT table1.id, first_name,last_name,title FROM employees AS table1 LEFT JOIN role AS table2 ON table1.role_id = table2.id WHERE table2.department_id = ?;"
            connection.query(query,[res], function(err,res){
                if (err) throw err;
                console.table(res);
                start();
            });
        });
    });
    
    
};

function employeesByManager(){
    connection.query("SELECT id, CONCAT(first_name,' ',last_name) AS name FROM employees", function(err, res){
        if (err) throw err;
        inquirer.prompt({
            type: "list",
            name: "manager_id",
            message: "Which manager would you like to search by?",
            choices: res.map((employee) => {
                return {
                    name: employee.name,
                    value: employee.id
                };
            })
        }).then(function(res){
            console.log(res);
            let query = "SELECT table1.id, table1.first_name, table1.last_name FROM employees AS table1 LEFT JOIN employees AS table2 ON table1.manager_id = table2.id WHERE table1.?;"
            connection.query(query,[res], function(err,res){
                if (err) throw err;
                console.table(res);
                start();
            });
        });
    });
};

function removeEmployee(){
    connection.query("SELECT id, CONCAT(first_name,' ',last_name) AS name FROM employees", function(err, res){
        if (err) throw err;
        inquirer.prompt({
            type: "list",
            name: "id",
            message: "Who's information would you like to remove from the company?",
            choices: res.map((employee) => {
                return {
                    name: employee.name,
                    value: employee.id
                };
            })
        }).then(function(res){
            let query = "DELETE FROM employees WHERE ?"
            connection.query(query,[res], function(err,res){
                if (err) throw err;
                console.table("Great! " + res.affectedRows + " employee was deleted");
                start();
            });
        });
    });
};

function updateRole(){
    // Run role query to gather possible roles available
    connection.query("SELECT title, id FROM role", function(errRole, resRole){
        if (errRole) throw errRole;
        // Run employee query to gather possible managers available
        connection.query("SELECT id, CONCAT(first_name,' ',last_name) AS name FROM employees", function(errEmp, resEmp){
            if(errEmp) throw errEmp;
            inquirer.prompt([
                {
                    type: "list",
                    name: "id",
                    message: "Who's role would you like to update?",
                    choices: resEmp.map((employee) => {
                        return {
                            name: employee.name,
                            value: employee.id
                        };
                    })
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "What is this employee's new role?",
                    choices: resRole.map((role) => {
                        return {
                            name: role.title,
                            value: role.id
                        };
                    })
                }
                ]).then(function(res){
                    // console.log(res);
                    connection.query(
                        "UPDATE employees SET role_id = ? Where id = ?",
                        [res.role_id, res.id],
                        function (err,res){
                            if (err) throw err
                            console.log("The employee's role was updated! " + res.affectedRows + " row changed.")
                            start();
                        });
                });
        });
    });
};

function updateManager(){
    connection.query("SELECT id, CONCAT(first_name,' ',last_name) AS name FROM employees", function(errEmp, resEmp){
        if(errEmp) throw errEmp;
        inquirer.prompt([
            {
                type: "list",
                name: "id",
                message: "Who's manager would you like to update?",
                choices: resEmp.map((employee) => {
                    return {
                        name: employee.name,
                        value: employee.id
                    };
                })
            },
            {
                type: "list",
                name: "manager_id",
                message: "Who is this employee's new manager?",
                choices: resEmp.map((manager) => {
                    return {
                        name: manager.name,
                        value: manager.id
                    };
                })
            }
            ]).then(function(res){
                // console.log(res);
                connection.query(
                    "UPDATE employees SET manager_id = ? Where id = ?",
                    [res.manager_id, res.id],
                    function (err,res){
                        if (err) throw err
                        console.log("The employee's manager was updated! " + res.affectedRows + " row changed.")
                        start();
                    });
            });
    });
}

function exit(){
    connection.end
    console.log("You've ended your session, please enter 'node index.js' in the command line to start another session.")
};