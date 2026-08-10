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
function create(firstName, lastName, email, password_hash, role) {
  const query = db.prepare(
    "INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
  );
  const result = query.run(firstName, lastName, email, password_hash, role);
  return findById(result.lastInsertRowid);
}

//Update profile
function updateProfile(id, firstName, lastName, email) {
  const query = db.prepare(
    "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?",
  );
  query.run(firstName, lastName, email, id);
  return findById(id);
}

//Update password
function updatePassword(id, passwordHash) {
  const query = db.prepare("UPDATE users SET password_hash = ? WHERE id = ?");
  query.run(passwordHash, id);
}

// Export the functions so they can be used in other files.
module.exports = {
  findByEmail,
  findById,
  create,
  updateProfile,
  updatePassword,
};
