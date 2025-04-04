import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";

// Crear la instancia de Express
const app = express();

// Conectar con la base de datos SQLite
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

app.use(cors());
app.use(bodyParser.json());

// Crear la tabla si no existe
db.run(
  "CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, correo TEXT)"
);

// Ruta para guardar datos en la base de datos
app.post("/guardar", (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: "Nombre y correo son obligatorios" });
  }

  db.run(
    "INSERT INTO usuarios (nombre, correo) VALUES (?, ?)",
    [nombre, correo],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ mensaje: "Datos guardados correctamente", id: this.lastID });
      }
    }
  );
});

// Ruta para obtener los usuarios guardados
app.get("/usuarios", (req, res) => {
  db.all("SELECT * FROM usuarios", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("¡Servidor funcionando correctamente! 🚀");
});
