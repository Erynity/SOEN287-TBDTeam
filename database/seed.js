const Event = require("../models/Event");
const bcrypt = require("bcrypt");
const User = require("../models/User");

User.create(
  "Admin",
  "User",
  "admin@campus.ca",
  bcrypt.hashSync("Admin123!", 10),
  "admin",
);

User.create(
  "Student",
  "User",
  "student@campus.ca",
  bcrypt.hashSync("Student123!", 10),
  "student",
);

Event.create(
  "Fall Hackathon",
  "24-hour coding competition open to all students.",
  "Career events",
  "2026-09-15",
  "18:00",
  "22:00",
  "A-120",
  2,
  1,
  "Open",
  null,
);

Event.create(
  "Movie Night",
  "Movie open to all students.",
  "Club activities",
  "2026-01-15",
  "12:00",
  "15:00",
  "H-20",
  10,
  1,
  "Open",
  null,
);

Event.create(
  "Fall Hackaway lecture",
  "Coding lecture open to all students.",
  "Guest lectures",
  "2026-12-10",
  "16:00",
  "21:00",
  "H-820",
  10,
  1,
  "Cancelled",
  null,
);

Event.create(
  "Marathon",
  "running open to all students.",
  "Sports events",
  "2026-10-12",
  "18:00",
  "22:00",
  "H-40",
  1,
  1,
  "Open",
  null,
);

console.log("Seeded 4 events.");
