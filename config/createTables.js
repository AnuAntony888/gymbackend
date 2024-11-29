const db = require("../utils/db");

const createTables = () => {
  const createMasterTable = `
  CREATE TABLE IF NOT EXISTS mastertabele (
    master_id VARCHAR(255) PRIMARY KEY,
    entityName VARCHAR(255) NOT NULL,
    entityAddress VARCHAR(255) NOT NULL,
    entityPhone VARCHAR(255) NOT NULL,  
    visibility TINYINT DEFAULT 1
  );
`;
const master = `
ALTER TABLE mastertabele
ADD COLUMN created_by VARCHAR(255) DEFAULT NULL;

`;
  
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      visibility TINYINT DEFAULT 1
    );
  `;
  const addMasterIdColumnAndForeignKey = `
  ALTER TABLE users 
  ADD COLUMN master_id VARCHAR(255) DEFAULT NULL,
  ADD CONSTRAINT fk_master_id FOREIGN KEY (master_id) REFERENCES mastertabele(master_id);
`;
const rolles = `
ALTER TABLE users 
ADD COLUMN Rolles VARCHAR(255) DEFAULT NULL;

`;
  
const createEmployeeTable = `
CREATE TABLE IF NOT EXISTS employeetable (
  employee_id VARCHAR(255) PRIMARY KEY,
  employeeName VARCHAR(255) NOT NULL,
  employeeAddress VARCHAR(255) NOT NULL,
  employeePhone VARCHAR(255) NOT NULL,
  employeeEmail VARCHAR(255) NOT NULL UNIQUE,
  master_id VARCHAR(255) NOT NULL,
  rolles VARCHAR(255) NOT NULL,
  monthsalary VARCHAR(255) DEFAULT NULL,
  visibility TINYINT DEFAULT 1,
  created_timestamp DATETIME DEFAULT NULL,
  created_by VARCHAR(255) DEFAULT 'unknown',
  updated_timestamp DATETIME DEFAULT NULL,
  updated_by VARCHAR(255) DEFAULT 'unknown',
  deleted_timestamp DATETIME DEFAULT NULL,
  deleted_by VARCHAR(255) DEFAULT 'unknown',
  FOREIGN KEY (master_id) REFERENCES mastertabele(master_id)
);
`;
const roll = `
ALTER TABLE employeetable
ADD COLUMN monthsalary VARCHAR(255) DEFAULT NULL;

`;

  const createCustomerTable = `
  CREATE TABLE IF NOT EXISTS customertabele (
  customer_id VARCHAR(255) PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
customerContactNo VARCHAR(255) NOT NULL,
customerEmail VARCHAR(255) NOT NULL UNIQUE,
customerAddress VARCHAR(255) NOT NULL  ,
customerOption VARCHAR(255) NOT NULL  ,
user_id VARCHAR(255),
    visibility TINYINT DEFAULT 1,
       created_timestamp VARCHAR(255) DEFAULT NULL,
  created_by VARCHAR(255) DEFAULT 'unknown',
  updated_timestamp VARCHAR(255) DEFAULT NULL,
  updated_by VARCHAR(255) DEFAULT 'unknown',
  deleted_timestamp VARCHAR(255) DEFAULT NULL,
  deleted_by VARCHAR(255) DEFAULT 'unknown',
  FOREIGN KEY (user_id) REFERENCES users(user_id) 
  );
`;

  const addMasteridcustomertabel = `
ALTER TABLE customertabele
  ADD COLUMN master_id VARCHAR(255) DEFAULT NULL,
ADD CONSTRAINT fk_master_id FOREIGN KEY (master_id) REFERENCES mastertabele(master_id);
`;

const modifymasterTable = `
ALTER TABLE customertabele  
  MODIFY COLUMN master_id VARCHAR(255) DEFAULT NULL,
`;
  
  // Function to run the queriesmaster_id VARCHAR(255) DEFAULT NULL,
  const runQuery = (query, successMessage, errorMessage, callback) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error(errorMessage, err);
      } else {
        console.log(successMessage);
        if (callback) callback();
      }
    });
  };

  // Create tables and set AUTO_INCREMENT value
  runQuery(
    createUsersTable,
    "User table created successfully.",
    "Error creating user table."
  );
  runQuery(createCustomerTable, "create customer table");
  runQuery(createMasterTable, "create master table");
  runQuery(createEmployeeTable, "create employee table");
  //  runQuery(roll, "montlysalary");
  // runQuery(master, "master");
  // runQuery(rolles, "add rolles to users");
  // runQuery(addMasterIdColumnAndForeignKey, "add mastertable");
  // runQuery(addMasteridcustomertabel, "addcustomertable to masterid");
  // runQuery(modifymasterTable, "modifymasterTable ");
};

module.exports = createTables;

// Call the createTables function to execute the table creation
createTables();
