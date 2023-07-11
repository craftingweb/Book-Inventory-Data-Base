const { Pool } = require("pg");
require("dotenv").config();
// pool is connection user to data base
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//  Below will create 5 columms;; no comma after last one ;; convention to give plural names for name of the table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    quantity INTEGER
  );
`;

const createTable = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("Table created successfully");
  } catch (err) {
    console.error("Error executing query", err);
  }
};

createTable();

module.exports = {
  query: (text, params, callback) => {
    console.log("QUERY:", text, params || "");
    return pool.query(text, params, callback);
  },
};
