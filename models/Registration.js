const db = require("../database/db");

//count registrations for an event
function countForEvent(eventId) {
  const query = db.prepare(
    "SELECT COUNT(*) AS count FROM registrations WHERE event_id = ? AND status IN ('Registered', 'Attended')",
  );
  return query.get(eventId).count;
}

//count events by category
function countByCategory() {
  const query = db.prepare(`SELECT e.category, COUNT(r.id) AS total
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE r.status IN ('Registered', 'Attended')
GROUP BY e.category
ORDER BY total DESC`);
  return query.all();
}

//find all events registrations for a specific user
function findByUserAndEvent(userId, eventId) {
  const query = db.prepare(
    "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?",
  );
  return query.get(userId, eventId);
}
//create a new registration for a specific user and event
function create(userId, eventId) {
  const query = db.prepare(
    "INSERT INTO registrations(user_id, event_id) VALUES (?, ?)",
  );
  const result = query.run(userId, eventId);
  return result.lastInsertRowid;
}

//cancel registration
function cancel(id) {
  const query = db.prepare(
    "UPDATE registrations SET status = 'Cancelled' WHERE id = ?",
  );
  return query.run(id);
}

//re register for an event
function reactivate(id) {
  const query = db.prepare(
    "UPDATE registrations SET status = 'Registered' WHERE id = ?",
  );
  return query.run(id);
}

//mark attendance
function setAttendance(id, attended) {
  const status = attended ? "Attended" : "Registered";
  const query = db.prepare(
    `UPDATE registrations SET attended = ?, status = ?
     WHERE id = ?`,
  );
  return query.run(attended ? 1 : 0, status, id);
}

//count attendances
function countAttendance() {
  const query = db.prepare(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN r.status = 'Attended' THEN 1 ELSE 0 END) AS attended
     FROM registrations r
     JOIN events e ON e.id = r.event_id
     WHERE r.status IN ('Registered', 'Attended')
       AND e.status NOT IN ('Cancelled', 'Disabled')`,
  );
  return query.get();
}

//find registrations for a specific user
function findByUser(userId) {
  const query = db.prepare(
    `SELECT r.*, e.title, e.event_date, e.location, e.category, e.start_time, e.status AS event_status    
    FROM registrations r 
    JOIN events e 
    ON r.event_id = e.id 
    WHERE r.user_id = ?`,
  );
  return query.all(userId);
}

//find registrations by id
function getById(id) {
  const query = db.prepare("SELECT * FROM registrations WHERE id = ?");
  return query.get(id);
}

//find registrations for a specific event
function findByEvent(eventId) {
  const query = db.prepare(`SELECT r.*, u.first_name, u.last_name, u.email
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    WHERE r.event_id = ? AND r.status IN ('Registered', 'Attended')`);
  return query.all(eventId);
}

//find most popular event by category
function mostPopularByCategory() {
  const query = db.prepare(`SELECT e.category, e.title, COUNT(r.id) AS total
FROM registrations r
JOIN events e ON r.event_id = e.id
WHERE r.status IN ('Registered', 'Attended')
GROUP BY e.category, e.id
ORDER BY e.category, total DESC`);
  return query.all();
}

//export
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
