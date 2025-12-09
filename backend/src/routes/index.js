const { Router } = require('express');
const authRoutes = require('./auth.routes');
const expedientesRoutes = require('./expedientes.routes');
const indiciosRoutes = require('./indicios.routes');
const reportesRoutes = require('./reportes.routes');

const router = Router();

router.get('/status', (req, res) => {
  res.json({ ok: true, message: 'API MP DICRI funcionando' });
});

// Rutas de autenticación: /api/auth/...
router.use('/auth', authRoutes);

// Rutas de expedientes: /api/expedientes/...
router.use('/expedientes', expedientesRoutes);

// Rutas de indicios: /api/indicios/...
router.use('/indicios', indiciosRoutes);

// Rutas de reportes: /api/reportes/...
router.use('/reportes', reportesRoutes);

module.exports = router;