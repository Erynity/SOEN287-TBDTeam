//required models
const Registration = require("../models/Registration");
const Event = require("../models/Event");

//list events for Admin user
function listMyEvents(req, res) {
  const adminId = req.session.userId;
  const events = Event.getAllWithCounts();
  res.json(events.filter((e) => e.organizer_id === adminId));
}

//list registrations for events 
function listEventRegistrations(req, res) {
  const eventId = req.params.id;
  const adminId = req.session.userId;
  const event = Event.getById(eventId);
  //error handling event not found
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  //error handling for event not owned by admin user
  if (event.organizer_id !== adminId) {
    return res.status(403).json({ error: "This is not your event" });
  }

  res.json(Registration.findByEvent(eventId));
}

//mark attendance
function markAttendance(req, res) {
  const registrationId = req.params.id;
  const attended = req.body.attended;
  const adminId = req.session.userId;

  const registration = Registration.getById(registrationId);
  //if not registered
  if (!registration) {
    return res.status(404).json({ error: "Attendance not found" });
  }

  const event = Event.getById(registration.event_id);
  //if event not owned by admin user
  if (event.organizer_id !== adminId) {
    return res.status(403).json({ error: "This is not your Attendance" });
  }
//sets attendance to attended for a specific registrationID
  Registration.setAttendance(registrationId, attended);
  res.json({ success: true });
}

//get admin stats: total events, full events, total registrations, attendance rate, most registered and least registered
function getStats(req, res) {
  const adminId = req.session.userId;
  const events = Event.getAllWithCounts().filter(
    (e) => e.organizer_id === adminId,
  );
  const attendance = Registration.countAttendance();
  const sorted = [...events].sort((a, b) => b.registered - a.registered);
  const perCategory = Registration.mostPopularByCategory();
  const topPerCategory = [];
  perCategory.forEach((row) => {
    if (!topPerCategory.some((t) => t.category === row.category)) {
      topPerCategory.push(row);
    }
  });
  topPerCategory.sort((a, b) => b.total - a.total);

  res.json({
    topPerCategory,
    totalEvents: events.length,
    fullEvents: events.filter((e) => e.registered >= e.capacity).length,
    totalRegistrations: events.reduce((sum, e) => sum + e.registered, 0),
    categories: Registration.countByCategory(),
    attendanceRate:
      attendance.total > 0
        ? Math.round(((attendance.attended || 0) / attendance.total) * 100)
        : 0,
    mostRegistered: sorted.length ? sorted[0].title : "None",
    leastRegistered: sorted.length ? sorted[sorted.length - 1].title : "None",
  });
}

//export
module.exports = {
  listMyEvents,
  listEventRegistrations,
  markAttendance,
  getStats,
};
