// ============================================================
//  Auth routes - login, register, logout, and profile.
//  Each URL is matched to a function in authController.js.
// ============================================================
const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/auth");
const authController = require("../controllers/authController");

// Show the login page and handle the login form
router.get("/login", authController.showLogin);
router.post("/login", authController.login);

// Show the register page and handle the sign-up form
router.get("/register", authController.showRegister);
router.post("/register", authController.register);

// Log the user out
router.get("/logout", authController.logout);

// View logged-in user's profile
router.get("/profile", authController.showProfile);

//Edit logged-in user's profile
router.post("/profile", requireLogin, authController.updateProfile);

module.exports = router;
