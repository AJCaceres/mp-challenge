import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Adjunta el token desde localStorage si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o no es válido, redirigir al login
    // pero solo si no estamos ya en la página de login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Solo redirigir si no estamos en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Formatear el mensaje de error
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   error.message || 
                   'Ocurrió un error inesperado';

    error.userMessage = message;
    
    return Promise.reject(error);
  }
);

export default api;