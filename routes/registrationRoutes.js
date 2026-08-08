const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");

const { requireLogin } = require("../middleware/auth");

router.post("/register", requireLogin, registrationController.register);
router.post("/cancel", requireLogin, registrationController.cancelRegistration);
router.get("/mine", requireLogin, registrationController.myRegistrations);

module.exports = router;
