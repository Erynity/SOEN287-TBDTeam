// Handles everything events: showing pages, sending event data,
// and creating/editing/deleting events.
// Uses the Event model to talk to the database.
const Event = require("../models/Event");

// Send every event as JSON. The frontend fetches this to fill the events grid.
function listEvents(req, res) {
  const events = Event.getAll();
  res.json(events);
}

// Send one event as JSON, looked up by ?id= in the URL.
function getEvent(req, res) {
  const event = Event.getById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
}

// Create a new event from the create-event form, then go to manage events.
function createEvent(req, res) {
  const {
    title,
    description,
    category,
    event_date,
    start_time,
    end_time,
    location,
    capacity,
  } = req.body;
  const organizer_id = req.session.userId; // ← from the logged-in admin, not the form

  //event date must not be in the past when creating
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  if (event_date < today) {
    return res.send("Event date cannot be in the past.");
  }

  Event.create(
    title,
    description,
    category,
    event_date,
    start_time,
    end_time,
    location,
    capacity,
    organizer_id,
    "Open", //new events start open
    null, //no image
  );
  res.redirect("/manage-events");
}

// Update an existing event from the edit-event form.
function updateEvent(req, res) {
  const id = req.params.id;
  const {
    title,
    description,
    category,
    event_date,
    start_time,
    end_time,
    location,
    capacity,
    status,
  } = req.body;
  const organizer_id = req.session.userId;

  Event.update(
    id,
    title,
    description,
    category,
    event_date,
    start_time,
    end_time,
    location,
    capacity,
    organizer_id,
    status,
    null,
  );

  res.redirect("/manage-events");
}

// Delete an event, then go back to manage events.
function deleteEvent(req, res) {
  Event.remove(req.params.id);
  res.redirect("/manage-events");
}

// Cancel an event (marks it Cancelled, keeps it in the database).
function cancelEvent(req, res) {
  Event.cancel(req.params.id);
  res.redirect("/manage-events");
}

// Show the create-event page
function showCreateForm(req, res) {
  res.sendFile("create-event.html", { root: "./views" });
}

// Show the edit-event page (the data is fetched by the frontend via ?id=)
function showEditForm(req, res) {
  res.sendFile("edit-event.html", { root: "./views" });
}

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  cancelEvent,
  showCreateForm,
  showEditForm,
};
