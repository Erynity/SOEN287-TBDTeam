// Handles register, login, logout, and profile.
// Uses the User model for the database and bcrypt for passwords.
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Show the registration form
function showRegister(req, res) {
  res.sendFile("register.html", { root: "./views" });
}

// Handle registration form submission
async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  // Check if the email is already registered
  const existingUser = User.findByEmail(email);
  if (existingUser) {
    return res.send("Email is already registered.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const newUser = User.create(
    firstName,
    lastName,
    email,
    hashedPassword,
    "student",
  );

  // Redirect to the login page
  res.redirect("/auth/login");
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
    return res.send("Invalid email or password.");
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send("Invalid email or password.");
  }

  // Store the user in the session
  req.session.userId = user.id;
  req.session.role = user.role;

  if (user.role === "admin") {
    // Redirect to the admin dashboard
    res.redirect("/admin-dashboard");
  } else {
    res.redirect("/student-dashboard");
  }
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
  // This is a stub for showing the profile page.
  res.sendFile("student-profile.html", { root: "./views" });
}

// This is a stub for updating the profile. In a real application, you would handle form submission and update the database.
function updateProfile(req, res) {
  res.send("Profile update coming soon!");
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
