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

module.exports = {
  listMyEvents,
  listEventRegistrations,
  markAttendance,
  getStats,
};
