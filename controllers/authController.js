// Handles register, login, logout, and profile.
// Uses the User model for the database and bcrypt for passwords.
const User = require("../models/User");
const bcrypt = require("bcrypt");

const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])\S{8,}$/;

const emailPattern = /^(\S+@)(gmail|outlook|campus)\.(com|ca)$/i;

// Show the registration form
function showRegister(req, res) {
  res.sendFile("register.html", { root: "./views" });
}

// Handle registration form submission
async function register(req, res) {
  const { firstName, lastName, email, password, role } = req.body;

  //Checks
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  // Check if the email is already registered
  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: "Email is already registered." });
  }

  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      error:
        "Password must be 8+ characters with a capital letter, lowercase letter, number, and special character.",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  User.create(firstName, lastName, email, hashedPassword, role);

  res.json({ success: true });
}

// Show the login page
function showLogin(req, res) {
  res.sendFile("login.html", { root: "./views" });
}

// Handle login form submission
async function login(req, res) {
  const { email, password } = req.body;

  // Find the user by their email
  const user = User.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  // Regenerate the session ID after login (prevents session fixation)
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: "Login failed, please try again." });
    }
    req.session.userId = user.id;
    req.session.role = user.role;
    res.json({ success: true, role: user.role });
  });
}

// Handle logout and profile stubs
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.redirect("/student-dashboard");
    }
    res.redirect("/auth/login");
  });
}

function showProfile(req, res) {
  // This is a stub for showing the profile page and edit it.
  res.sendFile("student-profile.html", { root: "./views" });
}

async function updateProfile(req, res) {
  const userId = req.session.userId;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;
  const currentPassword = req.body["current-password"];
  const newPassword = req.body["new-password"];

  const user = User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isMatch) {
    return res.status(403).json({ error: "Current password is incorrect" });
  }

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existing = User.findByEmail(email);
  if (existing && existing.id !== userId) {
    return res.status(400).json({ error: "Email already in use" });
  }

  User.updateProfile(userId, firstName, lastName, email);

  if (newPassword && !passwordPattern.test(newPassword)) {
    return res.status(400).json({
      error:
        "Password must be 8+ characters with a capital letter, lowercase letter, number, and special character.",
    });
  }

  if (newPassword) {
    const hash = await bcrypt.hash(newPassword, 10);
    User.updatePassword(userId, hash);
  }

  res.json({ success: true });
}

// Export the functions so they can be used in routes
module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout,
  showProfile,
  updateProfile,
};
