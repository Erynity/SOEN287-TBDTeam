// Functions for working with the users table.
// Every function here talks to the database through db.js.
const db = require("../database/db");

// Find a user by their email address. Returns the user object or undefined if not found.
function findByEmail(email) {
  const query = db.prepare("SELECT * FROM users WHERE email = ?");
  return query.get(email);
}

// Find a user by their ID. Returns the user object or undefined if not found.
function findById(id) {
  const query = db.prepare("SELECT * FROM users WHERE id = ?");
  return query.get(id);
}

// Create a new user. Returns the newly created user object.
function create(firstName, lastName, email, password, role) {
  const query = db.prepare(
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
  );
  const result = query.run(firstName, lastName, email, password, role);
  return findById(result.lastInsertRowid);
}

// Export the functions so they can be used in other files.
module.exports = {
  findByEmail,
  findById,
  create,
};
