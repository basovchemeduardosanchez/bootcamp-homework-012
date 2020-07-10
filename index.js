var mysql = require( "mysql" );
var inquirer = require( "inquirer" );

// SECTION MySQL Setup
// !! Sensitive information, use this only for development purposes, this
// !! should not be committed into a production application's repository
const connection = mysql.createConnection( {
    host: "localhost",
    // Default port for MySQL is 3306
    port: 3306,
    // Default user for MySQL is root
    // !! You should not use user "root" in production environments
    user: "root",
    password: "mysql",
    database: "employee_tracker"
} );
// !SECTION MySQL Setup

connection.connect( function( err ) {
    if ( err ){
        throw err;
    }
    init();
} );

function init(){
    inquirer.prompt( [
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            when: true,
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Roles",
                "View Departments",
                "View Roles",
                "View Employees",
            ]
        }
    ] )
        .then( function( pAnswers ){
            // console.log( pAnswers );
            switch(pAnswers.action){
                case "Add Department":
                    inquirer.prompt( [
                        {
                            type: "input",
                            name: "name",
                            message: "What's the department name?",
                            when: true
                        }
                    ] )
                        .then( function( pAnswers ){
                            console.log( pAnswers );
                            addDepartment(pAnswers.name);
                            init();
                        } )
                        .catch( function( pError ){
                            throw pError;
                        } );
                    break;
                case "Add Role":
                    connection.query(
                        // STAGE
                        "SELECT id, name FROM department",
                        function( pError, pResult ){
                            if ( pError ) {
                                throw pError;
                            }

                            // STAGE
                            // TODO: From the result, get an array of strings like "<ID> - <NAME>"
                            var lDepartments = pResult.map( function( pValue, pIndex ){
                                let lNewValue = pValue;
                                // TODO: Transform the original value
                                lNewValue = lNewValue.id + " - " + lNewValue.name;
                                return lNewValue;
                            } );
                            
                            inquirer.prompt( [
                                {
                                    type: "input",
                                    name: "title",
                                    message: "What's the role's title?",
                                    when: true
                                },
                                {
                                    type: "number",
                                    name: "salary",
                                    message: "What's the income for this position?",
                                    when: true
                                },
                                {
                                    type: "list",
                                    name: "department_id",
                                    message: "Select department ",
                                    when: true,
                                    choices: lDepartments
                                }
                            ] )
                                .then( function( pAnswers ){
                                    // console.log( pAnswers );
                                    addRole(pAnswers);
                                    init();
                                } )
                                .catch( function( pError ){
                                    throw pError;
                                } );
                        }
                    )
                    break;
                case "Add Employee":
                    connection.query(
                        // STAGE
                        "SELECT id, first_name,last_name FROM employee",
                        function( pError, pResult ){
                            if ( pError ) {
                                throw pError;
                            }

                            // STAGE
                            // TODO: From the result, get an array of strings like "<ID> - <NAME>"
                            var lEmployees= pResult.map( function( pValue, pIndex ){
                                let lNewValue = pValue;
                                // TODO: Transform the original value
                                lNewValue = lNewValue.id + " - " + lNewValue.first_name +  " " + lNewValue.last_name;
                                return lNewValue;
                            } );
                            connection.query(
                                "SELECT id,title FROM role",
                                function( pError,pResult){
                                    if ( pError ) {
                                        throw pError;
                                    }
                                    var lRoles = pResult.map( function( pValue, pIndex ){
                                        let lNewValue = pValue;
                                        // TODO: Transform the original value
                                        lNewValue = lNewValue.id + " - " + lNewValue.title; 
                                        return lNewValue;
                                    } );
                                    inquirer.prompt( [
                                        {
                                            type: "input",
                                            name: "first_name",
                                            message: "What's the first name?",
                                            when: true
                                        },
                                        {
                                            type: "input",
                                            name: "last_name",
                                            message: "What's the last name?",
                                            when: true
                                        },
                                        {
                                            type: "list",
                                            name: "role_id",
                                            message: "Select role",
                                            when: true,
                                            choices: lRoles
                                        },
                                        {
                                            type: "list",
                                            name: "manager_id",
                                            message: "Select manager",
                                            when: true,
                                            choices: lEmployees                                        }
                                    ] )
                                        .then( function( pAnswers ){
                                            // console.log( pAnswers );
                                            addEmployee(pAnswers);
                                            init();
                                        } )
                                        .catch( function( pError ){
                                            throw pError;
                                        } );
                                }
                            );

                        }
                    )
                    break;
                case "Update Employee Roles":
                    connection.query(
                        // STAGE
                        "SELECT * FROM role",
                        function( pError, pResult ){
                            if ( pError ) {
                                throw pError;
                            }

                            // STAGE
                            // TODO: From the result, get an array of strings like "<ID> - <NAME>"
                            var lRoles = pResult.map( function( pValue, pIndex ){
                                let lNewValue = pValue;
                                // TODO: Transform the original value
                                lNewValue = lNewValue.id + " - " + lNewValue.title;
                                return lNewValue;
                            } );
                            
                            inquirer.prompt( [
                                {
                                    type: "list",
                                    name: "role_id",
                                    message: "Select role ",
                                    when: true,
                                    choices: lRoles
                                }
                            ] )
                                .then( function( pAnswers ){
                                    console.log( pAnswers );
                                    var lRoleId = pAnswers.role_id.match(/[0-9]+/)[0];
                                    inquirer.prompt( [
                                        {
                                            type: "input",
                                            name: "title",
                                            message: "Entre the new title",
                                            when: true
                                        },
                                        {
                                            type: "number",
                                            name: "salary",
                                            message: "Entre the new salary",
                                            when: true
                                        }
                                    ] )
                                        .then( function( pAnswers ){
                                            // console.log( pAnswers );
                                            updateEmployeeRole(lRoleId,pAnswers);
                                            init();
                                        } )
                                        .catch( function( pError ){
                                            throw pError;
                                        } );
                                } )
                                .catch( function( pError ){
                                    throw pError;
                                } );
                        }
                    )
                    break;
                case "View Departments":
                    viewDepartments();
                    init();
                    break;
                case "View Roles":
                    viewRoles();
                    init();
                    break;
                case "View Employees": 
                    viewEmployees();
                    init();
                    break;

            }
        } )
        .catch( function( pError ){
                throw pError;
        } );
}

function viewDepartments(){
    connection.query(
        "SELECT * FROM department ",
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}
function viewRoles(){
    connection.query(
        "SELECT * FROM role",
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}
function viewEmployees(){
    connection.query(
        "SELECT * FROM employee ",
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}
function addDepartment(pName){
    connection.query(
        "INSERT INTO department(name) VALUES(?) ",
        [
            pName
        ],
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}
function addRole(pColumns){
    connection.query(
        "INSERT INTO role (title,salary,department_id) VALUES(?,?,?) ",
        [
            pColumns.title,
            pColumns.salary,
            pColumns.department_id.match(/[0-9]+/)[0]
        ],
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}
function addEmployee(pColumns){
    connection.query(
        "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES(?,?,?,?) ",
        [
            pColumns.first_name,
            pColumns.last_name,
            pColumns.role_id.match(/^[0-9]+/)[0],
            pColumns.manager_id.match(/^[0-9]+/)[0]
        ],
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}
function updateEmployeeRole( pId,pColumns ){
    connection.query(
         "UPDATE role set title = ? , salary = ? WHERE id = ?", 
        [
            pColumns.title,
            pColumns.salary,
            pId
        ],
        function(pError,pResult){
            if ( pError ) {
                throw pError ;
            }
            console.table( pResult );
        }
    );
}