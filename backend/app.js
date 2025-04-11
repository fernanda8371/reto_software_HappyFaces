// app.js - Configuración de Express

const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
require("dotenv").config()

// Importar rutas
const authRoutes = require("./routes/authRoutes")
const challengeRoutes = require("./routes/challengeRoutes")
const leaderboardRoutes = require("./routes/leaderboardRoutes")
const adminRoutes = require("./routes/adminRoutes")

// Inicializar app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Rutas API
app.use("/api/auth", authRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/admin", adminRoutes)
// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running correctly" })
})

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

module.exports = app
