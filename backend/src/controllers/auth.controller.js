const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        message: 'usuario y password son obligatorios',
      });
    }

    const data = await authService.login({ usuario, password });
    return res.json(data);
  } catch (err) {
    // Si el servicio lanzó error con status, respétalo
    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }
    return next(err);
  }
}

module.exports = {
  login,
};