const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//traemos las rutas de autenticacion y las usamos con el prefijo /api/auth 
// Esto significa que todas las rutas definidas en auth.routes.js estarán disponibles bajo el prefijo /api/auth
const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);

//comprobamos que la base de datos esta conextada
const db = require("./db");

db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected successfully");
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "DevHub API running" });
});

// Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});