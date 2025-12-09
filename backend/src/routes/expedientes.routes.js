const { Router } = require('express');
const controller = require('../controllers/expedientes.controller');
const { authMiddleware, requireRole } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authMiddleware);

// Técnico
router.post('/', requireRole('TECNICO'), controller.crear);
router.put('/:id', requireRole('TECNICO'), controller.actualizar);
router.delete('/:id', requireRole('TECNICO'), controller.eliminar);
router.post('/:id/enviar', requireRole('TECNICO'), controller.enviarRevision);

// Ambos pueden listar
router.get('/', controller.listar);

// Coordinador
router.post('/:id/aprobar', requireRole('COORDINADOR'), controller.aprobar);
router.post('/:id/rechazar', requireRole('COORDINADOR'), controller.rechazar);

module.exports = router;