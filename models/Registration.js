const db = require("../database/db");

function countForEvent(eventId) {
  const query = db.prepare(
    "SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status = 'Registered'",
  );
  return query.get(eventId).count;
}

function findByUserAndEvent(userId, eventId) {
  const query = db.prepare(
    "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?",
  );
  return query.get(userId, eventId);
}

function create(userId, eventId) {
  const query = db.prepare(
    "INSERT INTO registrations(user_id, event_id) VALUES (?, ?)",
  );
  const result = query.run(userId, eventId);
  return result.lastInsertRowid;
}

function cancel(id) {
  const query = db.prepare(
    "UPDATE registrations SET status = 'Cancelled' WHERE id = ?",
  );
  return query.run(id);
}

function reactivate(id) {
  const query = db.prepare(
    "UPDATE registrations SET status = 'Registered' WHERE id = ?",
  );
  return query.run(id);
}

function findByUser(userId) {
  const query = db.prepare(
    `SELECT r.*, e.title, e.event_date, e.location, e.category
    FROM registrations r 
    JOIN events e 
    ON r.event_id = e.id 
    WHERE r.user_id = ?`,
  );
  return query.all(userId);
}

function getById(id) {
  const query = db.prepare("SELECT * FROM registrations WHERE id = ?");
  return query.get(id);
}

module.exports = {
  countForEvent,
  findByUserAndEvent,
  create,
  reactivate,
  cancel,
  findByUser,
  getById,
};
