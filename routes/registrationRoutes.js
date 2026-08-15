// Registration routes - all require the user to be logged in.
const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const { requireLogin } = require("../middleware/auth");

// student registers for an event
router.post("/register", requireLogin, registrationController.register);

// student cancels one of their registrations
router.post("/cancel", requireLogin, registrationController.cancelRegistration);

// student views their own registrations
router.get("/mine", requireLogin, registrationController.myRegistrations);

module.exports = router;
