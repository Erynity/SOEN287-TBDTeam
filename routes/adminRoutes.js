const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

router.get("/events", requireAdmin, adminController.listMyEvents);
router.get(
  "/events/:id/registrations",
  requireAdmin,
  adminController.listEventRegistrations,
);
router.get("/stats", requireAdmin, adminController.getStats);

router.post(
  "/registrations/:id/attendance",
  requireAdmin,
  adminController.markAttendance,
);

module.exports = router;
