const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
const authenticateUser = (req, res, next) => {
  // Obtener el token del header de autorización
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Añadir los datos del usuario al objeto request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ error: 'Invalid token.' });
  }
};

// Middleware para verificar roles (admin)
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  next();
};

module.exports = {
  authenticateUser,
  isAdmin
};