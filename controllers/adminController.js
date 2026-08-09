const Registration = require("../models/Registration");
const Event = require("../models/Event");

function listMyEvents(req, res) {
  const adminId = req.session.userId;
  const events = Event.getAllWithCounts();
  res.json(events.filter((e) => e.organizer_id === adminId));
}

function listEventRegistrations(req, res) {
  const eventId = req.params.id;
  const adminId = req.session.userId;
  const event = Event.getById(eventId);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (event.organizer_id !== adminId) {
    return res.status(403).json({ error: "This is not your event" });
  }

  res.json(Registration.findByEvent(eventId));
}

function markAttendance(req, res) {
  const registrationId = req.params.id;
  const attended = req.body.attended;
  const adminId = req.session.userId;

  const registration = Registration.getById(registrationId);
  if (!registration) {
    return res.status(404).json({ error: "Attendance not found" });
  }

  const event = Event.getById(registration.event_id);
  if (event.organizer_id !== adminId) {
    return res.status(403).json({ error: "This is not your Attendance" });
  }

  Registration.setAttendance(registrationId, attended);
  res.json({ success: true });
}
module.exports = { listMyEvents, listEventRegistrations, markAttendance };
