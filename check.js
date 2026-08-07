// Temporary: list all users in the database. Run: node check.js
const db = require("./database/db");
const users = db
  .prepare("SELECT id, first_name, last_name, email, role FROM users")
  .all();
console.log(users);
