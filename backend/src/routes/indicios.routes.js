const { Router } = require('express');
const controller = require('../controllers/indicios.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

// Crear indicio (técnico)
router.post('/', requireRole('TECNICO'), controller.crear);

// Listar indicios por expediente (cualquier autenticado)
router.get('/por-expediente/:idExpediente', controller.listarPorExpediente);

// Actualizar indicio (técnico)
router.put('/:id', requireRole('TECNICO'), controller.actualizar);

// Eliminar indicio (técnico)
router.delete('/:id', requireRole('TECNICO'), controller.eliminar);

module.exports = router;