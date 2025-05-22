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
const userRoutes = require("./routes/userRoutes")

// Inicializar app
const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://reto-software-happy-faces-tl5a.vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan("dev"))
}

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "HappyFaces API is running", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  })
})

// Rutas API
app.use("/api/auth", authRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/leaderboard", leaderboardRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)

// Ruta de prueba
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    message: "API is running correctly",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method
  })
})

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  })
})

module.exports = app