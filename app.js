/* Create the app and pick a port */
const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Set up the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up middleware
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "campus-events-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Import routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { requireLogin, requireAdmin } = require("./middleware/auth");
const registrationRoutes = require("./routes/registrationRoutes");
/*const adminRoutes = require("./routes/adminRoutes");*/

app.use("/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/registrations", registrationRoutes);
/*app.use("/admin", adminRoutes);*/

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Student dashboard route (protected)
app.get("/student-dashboard", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "student-dashboard.html"));
});

// Admin dashboard route (protected)
app.get("/admin-dashboard", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-dashboard.html"));
});

// Reports the logged-in user's role from the session (guest if not logged in)
app.get("/api/me", (req, res) => {
  res.json({ role: req.session.role || "guest" });
});

// Events page (the styled page; its data comes from /api/events)
app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "events.html"));
});

// ---- Public pages ----
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});
app.get("/event-details", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "event-details.html"));
});

// ---- Student pages (must be logged in) ----
app.get("/my-registrations", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "my-registrations.html"));
});
app.get("/student-profile", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "student-profile.html"));
});

// ---- Admin pages (must be admin) ----
app.get("/manage-events", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "manage-events.html"));
});
app.get("/create-event", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "create-event.html"));
});
app.get("/edit-event", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "edit-event.html"));
});
app.get("/admin-registrations", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-registrations.html"));
});
app.get("/admin-statistics", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-statistics.html"));
});
app.get("/admin-profile", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-profile.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
