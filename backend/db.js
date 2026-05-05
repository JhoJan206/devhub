const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "20061102",
  database: "devhub"
});

module.exports = db;