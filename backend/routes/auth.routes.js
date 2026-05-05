const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Validación básica
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "Email already exists"
        });
      }

      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "User registered successfully"
    });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const query = `
    SELECT * FROM users WHERE email = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const user = results[0];

    // ⚠️ Comparación directa (solo por ahora)
    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    // Crear token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      "SECRET_KEY",
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

module.exports = router;