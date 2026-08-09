const db = require("../database/db");

function countForEvent(eventId) {
  const query = db.prepare(
    "SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status IN ('Registered', 'Attended', 'Missed')",
  );
  return query.get(eventId).count;
}

function countByCategory() {
  const query = db.prepare(`SELECT e.category, COUNT(r.id) AS total
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE r.status IN ('Registered', 'Attended', 'Missed')
GROUP BY e.category
ORDER BY total DESC`);
  return query.all();
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

function setAttendance(id, attended) {
  const status = attended ? "Attended" : "Missed";
  const query = db.prepare(
    `UPDATE registrations SET attended = ?, status = ?
     WHERE id = ?`,
  );
  return query.run(attended ? 1 : 0, status, id);
}

function countAttendance() {
  const query = db.prepare(
    `SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'Attended' THEN 1 ELSE 0 END) AS attended
FROM registrations
WHERE status IN ('Registered', 'Attended', 'Missed')`,
  );
  return query.get();
}

function findByUser(userId) {
  const query = db.prepare(
    `SELECT r.*, e.title, e.start_time, e.event_date, e.location, e.category
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

function findByEvent(eventId) {
  const query = db.prepare(`SELECT r.*, u.first_name, u.last_name, u.email
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    WHERE r.event_id = ? AND r.status IN ('Registered', 'Attended', 'Missed')`);
  return query.all(eventId);
}

function mostPopularByCategory() {
  const query = db.prepare(`SELECT e.category, e.title, COUNT(r.id) AS total
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE r.status IN ('Registered', 'Attended', 'Missed')
GROUP BY e.category, e.id
ORDER BY e.category, total DESC`);
  return query.all();
}

module.exports = {
  countForEvent,
  countByCategory,
  findByUserAndEvent,
  create,
  reactivate,
  cancel,
  findByUser,
  getById,
  findByEvent,
  setAttendance,
  countAttendance,
  mostPopularByCategory,
};
