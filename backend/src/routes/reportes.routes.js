const { Router } = require('express');
const controller = require('../controllers/reportes.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = Router();

// Todos los usuarios autenticados pueden ver reportes
router.use(authMiddleware);

// GET /api/reportes/expedientes-por-estado?fechaDesde=2025-01-01&fechaHasta=2025-12-31
router.get('/expedientes-por-estado', controller.expedientesPorEstado);

module.exports = router;