const db = require("./database/db");
db.prepare(
  "UPDATE registrations SET status = 'Registered', attended = 0",
).run();
console.log(db.prepare("SELECT * FROM registrations").all());
