const db = require("./database/db");
console.log(
  db
    .prepare("SELECT id, title, event_date, organizer_id, status FROM events")
    .all(),
);
