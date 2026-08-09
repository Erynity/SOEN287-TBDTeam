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

module.exports = { listMyEvents, listEventRegistrations };
