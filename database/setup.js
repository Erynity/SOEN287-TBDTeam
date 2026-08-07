// Creates the database file and builds the tables from schema.sql.
// Run this ONCE with: node database/setup.js
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// open (or create) the database file
const db = new Database(path.join(__dirname, "campus.sqlite"));

// read the schema file and run all the CREATE TABLE statements
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
db.exec(schema);

console.log("Database created and tables built.");
db.close();
