// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para verificar token de autenticación
router.get('/verify-token', authenticateUser, verifyToken);

// Importante: exporta el router correctamente
module.exports = router;