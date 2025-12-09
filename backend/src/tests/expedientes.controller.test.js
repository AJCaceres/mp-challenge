const expedientesService = require('../../src/services/expedientes.service');
const expedientesController = require('../../src/controllers/expedientes.controller');

// Mock del servicio
jest.mock('../../src/services/expedientes.service');

describe('Expedientes Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      user: { idUsuario: 1 }
    };

    res = {
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('crear', () => {
    it('debería crear un expediente exitosamente', async () => {
      const mockExpediente = {
        idExpediente: 1,
        numeroExpediente: 'EXP-2025-001',
        nombreEstado: 'BORRADOR'
      };

      req.body = { numeroExpediente: 'EXP-2025-001' };
      expedientesService.crearExpediente.mockResolvedValue(mockExpediente);

      await expedientesController.crear(req, res, next);

      expect(expedientesService.crearExpediente).toHaveBeenCalledWith({
        numeroExpediente: 'EXP-2025-001',
        idTecnico: 1
      });
      expect(res.json).toHaveBeenCalledWith(mockExpediente);
    });

    it('debería manejar errores del servicio', async () => {
      const error = new Error('Error al crear');
      req.body = { numeroExpediente: 'EXP-2025-001' };
      expedientesService.crearExpediente.mockRejectedValue(error);

      await expedientesController.crear(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listar', () => {
    it('debería listar expedientes sin filtros', async () => {
      const mockExpedientes = [
        { idExpediente: 1, numeroExpediente: 'EXP-001' },
        { idExpediente: 2, numeroExpediente: 'EXP-002' }
      ];

      expedientesService.obtenerExpedientes.mockResolvedValue(mockExpedientes);

      await expedientesController.listar(req, res, next);

      expect(expedientesService.obtenerExpedientes).toHaveBeenCalledWith({
        estado: undefined,
        fechaDesde: undefined,
        fechaHasta: undefined
      });
      expect(res.json).toHaveBeenCalledWith(mockExpedientes);
    });

    it('debería listar expedientes con filtros', async () => {
      const mockExpedientes = [];
      req.query = { estado: 'APROBADO', fechaDesde: '2025-01-01' };
      expedientesService.obtenerExpedientes.mockResolvedValue(mockExpedientes);

      await expedientesController.listar(req, res, next);

      expect(expedientesService.obtenerExpedientes).toHaveBeenCalledWith({
        estado: 'APROBADO',
        fechaDesde: '2025-01-01',
        fechaHasta: undefined
      });
    });
  });

  describe('aprobar', () => {
    it('debería aprobar un expediente', async () => {
      req.params = { id: 1 };
      expedientesService.aprobarExpediente.mockResolvedValue();

      await expedientesController.aprobar(req, res, next);

      expect(expedientesService.aprobarExpediente).toHaveBeenCalledWith(1, 1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Expediente aprobado' });
    });
  });

  describe('rechazar', () => {
    it('debería rechazar un expediente con justificación', async () => {
      req.params = { id: 1 };
      req.body = { justificacion: 'Documentación incompleta' };
      expedientesService.rechazarExpediente.mockResolvedValue();

      await expedientesController.rechazar(req, res, next);

      expect(expedientesService.rechazarExpediente).toHaveBeenCalledWith(
        1,
        'Documentación incompleta',
        1
      );
      expect(res.json).toHaveBeenCalledWith({ message: 'Expediente rechazado' });
    });
  });
});
