const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

async function login({ usuario, password }) {
  const user = await authRepository.getUsuarioPorNombre(usuario);

  if (!user) {
    throw new AuthError('Credenciales inválidas', 401);
  }

  // Convertir Buffer a string si es necesario
  let passwordHash = user.passwordHash;
  if (Buffer.isBuffer(passwordHash)) {
    passwordHash = passwordHash.toString('utf8');
  }
  if (typeof passwordHash === 'string') {
    passwordHash = passwordHash.trim();
  }

  // Comparar password con bcrypt
  const passwordValida = await bcrypt.compare(password, passwordHash);

  if (!passwordValida) {
    throw new AuthError('Credenciales inválidas', 401);
  }

  const payload = {
    idUsuario: user.idUsuario,
    nombre: user.nombre,
    rol: user.rol,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  return {
    token,
    usuario: payload,
  };
}

module.exports = {
  login,
  AuthError,
};