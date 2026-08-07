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
app.use(
  session({
    secret: "campus-events-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Import routes
const authRoutes = require("./routes/authRoutes");
/*const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const adminRoutes = require("./routes/adminRoutes");*/

app.use("/auth", authRoutes);
/*app.use("/events", eventRoutes);
app.use("/registrations", registrationRoutes);
app.use("/admin", adminRoutes);*/

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
