// Admin routes - every route here is protected by requireAdmin,
// so only logged-in admins can reach them.
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

// list this admin's events (with registration counts)
router.get("/events", requireAdmin, adminController.listMyEvents);

// list the students registered for one event
router.get(
  "/events/:id/registrations",
  requireAdmin,
  adminController.listEventRegistrations,
);

// dashboard / statistics numbers
router.get("/stats", requireAdmin, adminController.getStats);

// mark a student attended/absent for an event
router.post(
  "/registrations/:id/attendance",
  requireAdmin,
  adminController.markAttendance,
);

module.exports = router;
