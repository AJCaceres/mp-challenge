GitHub Copilot:

Este es el frontend del proyecto MP DICRI.

Requisitos:
- React (con Vite).
- React Router para navegación.
- Contexto de autenticación que guarde el token JWT (localStorage) y el rol del usuario.
- Axios configurado con un interceptor para enviar el token en el header Authorization.
- Páginas principales: Login, Dashboard, Expedientes, Detalle de expediente (con indicios), Revisión (para COORDINADOR), Reportes.

Estructura deseada:

src/
  api/         // funciones para llamar a la API (auth, expedientes, indicios, reportes)
  components/  // tablas, formularios, modals
  pages/
    Login/
    Dashboard/
    Expedientes/
    Indicios/
    Revision/
    Reportes/
  context/
    AuthContext.jsx
  router/
    AppRouter.jsx

Comienza generando:
- AuthContext básico.
- AppRouter con rutas públicas (Login) y privadas (resto).
- Un wrapper API con Axios que lea el token de AuthContext/localStorage.