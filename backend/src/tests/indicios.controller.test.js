const indiciosService = require('../../src/services/indicios.service');
const indiciosController = require('../../src/controllers/indicios.controller');

// Mock del servicio
jest.mock('../../src/services/indicios.service');

describe('Indicios Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { idUsuario: 1 }
    };

    res = {
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('crear', () => {
    it('debería crear un indicio exitosamente', async () => {
      const mockIndicio = {
        idIndicio: 1,
        idExpediente: 1,
        descripcion: 'Evidencia de prueba',
        fechaRegistro: new Date()
      };

      req.body = {
        idExpediente: 1,
        descripcion: 'Evidencia de prueba',
        color: 'Rojo',
        tamano: '10cm',
        peso: '500g',
        ubicacion: 'Sala principal'
      };

      indiciosService.crearIndicio.mockResolvedValue(mockIndicio);

      await indiciosController.crear(req, res, next);

      expect(indiciosService.crearIndicio).toHaveBeenCalledWith({
        idExpediente: 1,
        descripcion: 'Evidencia de prueba',
        color: 'Rojo',
        tamano: '10cm',
        peso: '500g',
        ubicacion: 'Sala principal',
        idTecnicoRegistro: 1
      });
      expect(res.json).toHaveBeenCalledWith(mockIndicio);
    });

    it('debería manejar errores del servicio', async () => {
      const error = new Error('Error al crear indicio');
      req.body = { idExpediente: 1, descripcion: 'Test' };
      indiciosService.crearIndicio.mockRejectedValue(error);

      await indiciosController.crear(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('listarPorExpediente', () => {
    it('debería listar indicios de un expediente', async () => {
      const mockIndicios = [
        { idIndicio: 1, descripcion: 'Evidencia 1' },
        { idIndicio: 2, descripcion: 'Evidencia 2' }
      ];

      req.params = { idExpediente: 1 };
      indiciosService.obtenerIndiciosPorExpediente.mockResolvedValue(mockIndicios);

      await indiciosController.listarPorExpediente(req, res, next);

      expect(indiciosService.obtenerIndiciosPorExpediente).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(mockIndicios);
    });

    it('debería retornar lista vacía si no hay indicios', async () => {
      req.params = { idExpediente: 1 };
      indiciosService.obtenerIndiciosPorExpediente.mockResolvedValue([]);

      await indiciosController.listarPorExpediente(req, res, next);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('actualizar', () => {
    it('debería actualizar un indicio', async () => {
      req.params = { id: 1 };
      req.body = {
        descripcion: 'Evidencia actualizada',
        color: 'Azul',
        tamano: '20cm',
        peso: '1kg',
        ubicacion: 'Habitación'
      };

      indiciosService.actualizarIndicio.mockResolvedValue();

      await indiciosController.actualizar(req, res, next);

      expect(indiciosService.actualizarIndicio).toHaveBeenCalledWith({
        idIndicio: 1,
        descripcion: 'Evidencia actualizada',
        color: 'Azul',
        tamano: '20cm',
        peso: '1kg',
        ubicacion: 'Habitación'
      });
      expect(res.json).toHaveBeenCalledWith({ message: 'Indicio actualizado' });
    });
  });

  describe('eliminar', () => {
    it('debería eliminar un indicio', async () => {
      req.params = { id: 1 };
      indiciosService.eliminarIndicio.mockResolvedValue();

      await indiciosController.eliminar(req, res, next);

      expect(indiciosService.eliminarIndicio).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Indicio eliminado' });
    });
  });
});
