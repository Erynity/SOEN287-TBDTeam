// ============================================================
//  Event routes - browse, view, create, edit, delete, cancel.
//  Each URL maps to a function in eventController.js.
// ============================================================
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { requireAdmin } = require("../middleware/auth");

// ---- Data (JSON) for the frontend ----
// GET /events        -> all events as JSON
router.get("/", eventController.listEvents);

// ---- Admin: create ----
// GET  /events/create/new  -> show the create form
// POST /events/create      -> handle the create form
router.get("/create/new", requireAdmin, eventController.showCreateForm);
router.post("/create", requireAdmin, eventController.createEvent);

// ---- Admin: edit ----
// GET  /events/:id/edit    -> show the edit form
// POST /events/:id/edit    -> handle the edit form
router.get("/:id/edit", requireAdmin, eventController.showEditForm);
router.post("/:id/edit", requireAdmin, eventController.updateEvent);

// ---- Admin: delete and cancel ----
// POST /events/:id/delete  -> delete the event
// POST /events/:id/cancel  -> cancel the event
router.post("/:id/delete", requireAdmin, eventController.deleteEvent);
router.post("/:id/cancel", requireAdmin, eventController.cancelEvent);

// ---- One event's data (JSON), by id ----
// GET /events/:id  -> one event as JSON
router.get("/:id", eventController.getEvent);

module.exports = router;
