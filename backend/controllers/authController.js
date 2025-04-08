const { query } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registro de usuario
const register = async (req, res) => {
  const { firebase_uid, email, name, role = 'employee' } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1 OR firebase_uid = $2',
      [email, firebase_uid]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Insertar el nuevo usuario en la base de datos
    const result = await query(
      'INSERT INTO users (firebase_uid, email, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [firebase_uid, email, name, role]
    );

    // Crear y firmar el token JWT
    const token = jwt.sign(
      { 
        user_id: result.rows[0].user_id,
        firebase_uid: result.rows[0].firebase_uid,
        email: result.rows[0].email,
        role: result.rows[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta exitosa con token y datos del usuario
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        role: result.rows[0].role
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Login de usuario (usando Firebase UID)
const login = async (req, res) => {
  const { firebase_uid } = req.body;

  try {
    // Buscar usuario por Firebase UID
    const result = await query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [firebase_uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Crear y firmar el token JWT
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        firebase_uid: user.firebase_uid,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Actualizar la última actividad del usuario
    await query(
      'UPDATE users SET last_activity_date = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );

    // Enviar respuesta exitosa con token y datos del usuario
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        total_score: user.total_score,
        streak_days: user.streak_days
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Verificar token de autenticación (para validar sesiones)
const verifyToken = async (req, res) => {
  try {
    // El middleware de autenticación ya habrá verificado el token
    // y añadido el user_id a req.user

    // Obtener información actualizada del usuario
    const result = await query(
      'SELECT user_id, name, email, role, total_score, streak_days FROM users WHERE user_id = $1',
      [req.user.user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Token is valid',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error in verifyToken:', error);
    res.status(500).json({ error: 'Server error during token verification' });
  }
};

module.exports = {
  register,
  login,
  verifyToken
};