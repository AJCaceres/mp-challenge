const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login, AuthError } = require('../../src/services/auth.service');
const authRepository = require('../../src/repositories/auth.repository');

// Mock del repositorio
jest.mock('../../src/repositories/auth.repository');

// Mock del JWT para tests
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('login', () => {
    const mockUser = {
      idUsuario: 1,
      nombre: 'Test User',
      rol: 'TECNICO',
      passwordHash: '$2b$10$IJCtWyWG2LWOXa9y4VDYSOJ1qoJUYZnERiK2GIkWiJLApXO2Rteoq' // bcrypt hash de '1234'
    };

    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

    it('debería retornar token y usuario cuando las credenciales son válidas', async () => {
      authRepository.getUsuarioPorNombre.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      const result = await login({ usuario: 'user-tec', password: '1234' });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
      expect(result.usuario).toEqual({
        idUsuario: 1,
        nombre: 'Test User',
        rol: 'TECNICO'
      });
      expect(result.token).toBe(mockToken);
    });

    it('debería lanzar AuthError cuando el usuario no existe', async () => {
      authRepository.getUsuarioPorNombre.mockResolvedValue(null);

      await expect(
        login({ usuario: 'nonexistent', password: '1234' })
      ).rejects.toThrow(AuthError);

      await expect(
        login({ usuario: 'nonexistent', password: '1234' })
      ).rejects.toThrow('Credenciales inválidas');
    });

    it('debería lanzar AuthError cuando la contraseña es incorrecta', async () => {
      authRepository.getUsuarioPorNombre.mockResolvedValue(mockUser);

      await expect(
        login({ usuario: 'user-tec', password: 'wrongpassword' })
      ).rejects.toThrow(AuthError);

      await expect(
        login({ usuario: 'user-tec', password: 'wrongpassword' })
      ).rejects.toThrow('Credenciales inválidas');
    });

    it('debería manejar passwordHash como Buffer', async () => {
      const userWithBufferHash = {
        ...mockUser,
        passwordHash: Buffer.from(mockUser.passwordHash)
      };

      authRepository.getUsuarioPorNombre.mockResolvedValue(userWithBufferHash);
      jwt.sign.mockReturnValue(mockToken);

      const result = await login({ usuario: 'user-tec', password: '1234' });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('usuario');
    });

    it('debería llamar a jwt.sign con expiración de 24h', async () => {
      authRepository.getUsuarioPorNombre.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue(mockToken);

      await login({ usuario: 'user-tec', password: '1234' });

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          idUsuario: 1,
          nombre: 'Test User',
          rol: 'TECNICO'
        },
        'test-secret-key',
        { expiresIn: '24h' }
      );
    });

    it('debería lanzar AuthError con status 401', async () => {
      authRepository.getUsuarioPorNombre.mockResolvedValue(null);

      try {
        await login({ usuario: 'user', password: 'pass' });
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect(error.status).toBe(401);
      }
    });
  });

  describe('AuthError', () => {
    it('debería crear un error con mensaje y status', () => {
      const error = new AuthError('Test error', 403);
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(403);
    });

    it('debería tener status 401 por defecto', () => {
      const error = new AuthError('Test error');
      expect(error.status).toBe(401);
    });
  });
});
