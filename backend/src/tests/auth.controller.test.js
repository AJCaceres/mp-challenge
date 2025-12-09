const authService = require('../../src/services/auth.service');
const authController = require('../../src/controllers/auth.controller');

// Mock del servicio
jest.mock('../../src/services/auth.service');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('login', () => {
    it('debería retornar 400 cuando falta usuario', async () => {
      req.body = { password: '1234' };

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'usuario y password son obligatorios'
      });
    });

    it('debería retornar 400 cuando falta password', async () => {
      req.body = { usuario: 'user-tec' };

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'usuario y password son obligatorios'
      });
    });

    it('debería retornar token y usuario cuando login es exitoso', async () => {
      const mockData = {
        token: 'test-token',
        usuario: { idUsuario: 1, nombre: 'Test', rol: 'TECNICO' }
      };

      req.body = { usuario: 'user-tec', password: '1234' };
      authService.login.mockResolvedValue(mockData);

      await authController.login(req, res, next);

      expect(authService.login).toHaveBeenCalledWith({
        usuario: 'user-tec',
        password: '1234'
      });
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('debería retornar el status de error del servicio cuando hay error con status', async () => {
      const error = new Error('Credenciales inválidas');
      error.status = 401;

      req.body = { usuario: 'user-tec', password: 'wrong' };
      authService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Credenciales inválidas'
      });
    });

    it('debería pasar al middleware next cuando el error no tiene status', async () => {
      const error = new Error('Database error');

      req.body = { usuario: 'user-tec', password: '1234' };
      authService.login.mockRejectedValue(error);

      await authController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
