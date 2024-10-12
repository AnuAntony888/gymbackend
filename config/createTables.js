const db = require("../utils/db");

const createTables = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      visibility TINYINT DEFAULT 1
    );
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

  // Function to run the queries
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
};

module.exports = createTables;

// Call the createTables function to execute the table creation
createTables();
