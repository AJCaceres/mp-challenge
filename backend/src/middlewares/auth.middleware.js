const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = header.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { idUsuario, nombre, rol }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Middleware para validar rol
function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
};