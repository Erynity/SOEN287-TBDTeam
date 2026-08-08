// ============================================================
//  Auth routes - login, register, logout, and profile.
//  Each URL is matched to a function in authController.js.
// ============================================================
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Show the login page and handle the login form
router.get("/login", authController.showLogin);
router.post("/login", authController.login);

// Show the register page and handle the sign-up form
router.get("/register", authController.showRegister);
router.post("/register", authController.register);

// Log the user out
router.get("/logout", authController.logout);

// View and update the logged-in user's profile
router.get("/profile", authController.showProfile);
router.post("/profile", authController.showProfile);

module.exports = router;
