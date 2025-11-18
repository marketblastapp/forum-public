const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const db = new sqlite3.Database("./database.sqlite");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get("/api/messages", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

app.post("/api/messages", (req, res) => {
  const { username, content } = req.body;
  db.run(
    "INSERT INTO messages (username, content) VALUES (?, ?)",
    [username, content],
    () => res.json({ success: true })
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server berjalan");
});
