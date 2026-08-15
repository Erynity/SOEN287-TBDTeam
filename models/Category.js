// Database functions for the categories table.
const db = require("../database/db");

// Get all categories (for dropdowns and the filter).
function getAll() {
  return db.prepare("SELECT * FROM categories ORDER BY category_name").all();
}

// Add a new category if it doesn't already exist.
function add(name) {
  const query = db.prepare(
    "INSERT OR IGNORE INTO categories (category_name) VALUES (?)",
  );
  return query.run(name);
}

module.exports = { getAll, add };
