const db = require("./database/db");
db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(
  "jgill.joy@gmail.com",
);
console.log("Done - user is now admin");
