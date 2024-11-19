import express from "express";
import { createConnection } from "mysql2";
import cors from "cors";
import json from "body-parser";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(cors());
app.use(json());

const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

const db = createConnection({
  host: "localhost",
  user: dbUser, // Replace with your MySQL username
  password: dbPass, // Replace with your MySQL password
  database: dbName, // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

const PORT = 3001; // Backend server port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/data", (req, res) => {
  db.query("SELECT * FROM testData", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.post("/add", (req, res) => {
  const { name } = req.body;

  db.query("INSERT INTO testData(name) VALUES(?)", [name], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({
      message: "Data added successfully",
      data: { id: results.insertId, name },
    });
  });
});

app.delete("/delete", (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: "Name is required to delete" });
  }

  const placeholders = ids.map(() => "?").join(",");

  db.query(
    `DELETE FROM testData WHERE id IN (${placeholders})`,
    ids,
    (err, results) => {
      if (err) {
        console.error("Error deleting data: ", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ message: "No matching data found to delete" });
      }
    }
  );
});
