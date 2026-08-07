// Opens the one shared database connection.
// Every model imports this so they all use the same database.
const Database = require("better-sqlite3");
const path = require("path");

// open the database file created by setup.js
const db = new Database(path.join(__dirname, "campus.sqlite"));

// make foreign keys actually enforced (SQLite has them off by default)
db.pragma("foreign_keys = ON");

// hand this connection to whoever imports this file
module.exports = db;
