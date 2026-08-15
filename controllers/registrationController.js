//required imports
const Registration = require("../models/Registration");
const Event = require("../models/Event");

//handles registration for an event
function register(req, res) {
  const eventId = req.body.eventId;
  const userId = req.session.userId;

  const event = Event.getById(eventId);
  //event not found error
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  //if registration is closed
  if (["Cancelled", "Completed", "Disabled"].includes(event.status)) {
    return res
      .status(400)
      .json({ error: "Registration is closed for this event" });
  }
  //checks if event has passed
  const today = new Date().toISOString().split("T")[0];
  if (event.event_date < today) {
    return res.status(400).json({ error: "Event already happened" });
  }
  //checks if registered already
  const existing = Registration.findByUserAndEvent(userId, eventId);
  if (existing && existing.status === "Registered") {
    return res
      .status(400)
      .json({ error: "You are already registered for this event" });
  }
  //checks if event is full
  const count = Registration.countForEvent(eventId);
  if (count >= event.capacity) {
    return res.status(400).json({ error: "The event is full" });
  }
  //registers student with userID and eventId
  if (existing) {
    Registration.reactivate(existing.id);
  } else {
    Registration.create(userId, eventId);
  }
  res.json({ success: true, message: "Registered!" });
}

//handles cancelling registration for an event
function cancelRegistration(req, res) {
  const registrationId = req.body.registrationId;
  const userId = req.session.userId;

  //checks that the registration exists
  const registration = Registration.getById(registrationId);
  if (!registration) {
    return res.status(404).json({ error: "Registration not found" });
  }
  //checks if registration is for that User
  if (registration.user_id !== userId) {
    return res
      .status(403)
      .json({ error: "Registration doesnt belong to you." });
  }

  //checks if already cancelled
  if (registration.status !== "Registered") {
    return res.status(400).json({ error: "Already cancelled" });
  }
  //cancels registration
  Registration.cancel(registrationId);
  res.json({ success: true, message: "Registration cancelled" });
}
//finds all registrations for student users
function myRegistrations(req, res) {
  const userId = req.session.userId;
  const registrations = Registration.findByUser(userId);
  res.json(registrations);
}

//exports
module.exports = {
  register,
  cancelRegistration,
  myRegistrations,
};
