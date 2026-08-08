const Registration = require("../models/Registration");
const Event = require("../models/Event");

function register(req, res) {
  const eventId = req.body.eventId;
  const userId = req.session.userId;

  const event = Event.getById(eventId);
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (["Cancelled", "Completed", "Disabled"].includes(event.status)) {
    return res
      .status(400)
      .json({ error: "Registration is closed for this event" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (event.event_date < today) {
    return res.status(400).json({ error: "Event already happened" });
  }

  const existing = Registration.findByUserAndEvent(userId, eventId);
  if (existing && existing.status === "Registered") {
    return res
      .status(400)
      .json({ error: "You are already registered for this event" });
  }

  const count = Registration.countForEvent(eventId);
  if (count >= event.capacity) {
    return res.status(400).json({ error: "The event is full" });
  }

  if (existing) {
    Registration.reactivate(existing.id);
  } else {
    Registration.create(userId, eventId);
  }
  res.json({ success: true, message: "Registered!" });
}

function cancelRegistration(req, res) {
  const registrationId = req.body.registrationId;
  const userId = req.session.userId;

  const registration = Registration.getById(registrationId);
  if (!registration) {
    return res.status(404).json({ error: "Registration not found" });
  }

  if (registration.user_id !== userId) {
    return res
      .status(403)
      .json({ error: "Registration doesnt belong to you." });
  }

  if (registration.status !== "Registered") {
    return res.status(400).json({ error: "Already cancelled" });
  }
  Registration.cancel(registrationId);
  res.json({ success: true, message: "Registration cancelled" });
}

module.exports = {
  register,
  cancelRegistration,
};
