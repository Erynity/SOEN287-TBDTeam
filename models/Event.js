// Functions for working with the events table.
// Every function here talks to the database through db.js.
const db = require("../database/db");

// Get every event. Returns an array of all events.
function getAll() {
  const query = db.prepare("SELECT * FROM events");
  return query.all();
}

// Get one event by its id. Returns the event or undefined.
function getById(id) {
  const query = db.prepare("SELECT * FROM events WHERE id = ?");
  return query.get(id);
}

// Add a new event. Returns the newly created event.
function create(
  title,
  description,
  category,
  event_date,
  startTime,
  endTime,
  location,
  capacity,
  organizer_id,
  status,
  image,
) {
  const query = db.prepare(
    `INSERT INTO events
     (title, description, category, event_date, start_time, end_time, location, capacity, organizer_id, status, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const result = query.run(
    title,
    description,
    category,
    event_date,
    startTime,
    endTime,
    location,
    capacity,
    organizer_id,
    status,
    image,
  );
  return getById(result.lastInsertRowid);
}

// Update an existing event by id. Returns the updated event.
function update(
  id,
  title,
  description,
  category,
  event_date,
  startTime,
  endTime,
  location,
  capacity,
  organizer_id,
  status,
  image,
) {
  const query = db.prepare(
    `UPDATE events
     SET title = ?, description = ?, category = ?, event_date = ?, start_time = ?, end_time = ?,
         location = ?, capacity = ?, organizer_id = ?, status = ?, image = ?
     WHERE id = ?`,
  );
  query.run(
    title,
    description,
    category,
    event_date,
    startTime,
    endTime,
    location,
    capacity,
    organizer_id,
    status,
    image,
    id,
  );
  return getById(id);
}

// Delete an event by id.
function remove(id) {
  const query = db.prepare("DELETE FROM events WHERE id = ?");
  return query.run(id);
}

// Cancel an event by id (keeps it in the database, just marks it Cancelled).
function cancel(id) {
  const query = db.prepare("UPDATE events SET status = ? WHERE id = ?");
  query.run("Cancelled", id);
  return getById(id);
}

// Update an existing event from the edit-event form.
function updateEvent(req, res) {
  const id = req.params.id;
  const {
    title,
    description,
    category,
    event_date,
    startTime,
    endTime,
    location,
    capacity,
    organizer_id,
    status,
  } = req.body;

  Event.update(
    id,
    title,
    description,
    category,
    event_date,
    startTime,
    endTime,
    location,
    capacity,
    organizer_id,
    status,
    null,
  );

  res.redirect("/manage-events");
}

// Export the functions so they can be used in other files.
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  cancel,
};
