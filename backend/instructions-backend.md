GitHub Copilot:

Este es el backend del proyecto. Requisitos:

- Node.js + Express.
- Conexión a SQL Server usando el paquete `mssql`.
- Todas las operaciones de datos se harán llamando procedimientos almacenados.
- Autenticación con JWT:
  - Endpoint POST /api/auth/login que valida credenciales usando un SP (sp_LoginUsuario).
  - Devuelve token JWT con idUsuario y rol.
- Middleware de autenticación que:
  - Verifica el JWT.
  - Inyecta usuario y rol en `req.user`.
- Roles: TECNICO y COORDINADOR.
  - TECNICO puede crear/editar expedientes e indicios cuando estén en BORRADOR o RECHAZADO.
  - COORDINADOR puede aprobar o rechazar expedientes que estén EN_REVISION.

Estructura esperada:

src/
  app.js          // configuración de Express (middlewares globales, rutas)
  server.js       // arranque del servidor
  db/sqlserver.js // configuración de pool de conexión a SQL Server
  routes/         // rutas agrupadas por recurso (auth, expedientes, indicios, reportes)
  controllers/    // recibe req/res y llama servicios
  services/       // lógica de negocio, validaciones de estados
  repositories/   // llamadas a SPs de SQL Server
  middlewares/    // auth JWT, manejo de errores
  tests/          // Jest + Supertest

Crea el boilerplate básico de app.js, server.js y db/sqlserver.js, dejando espacio para que después se agreguen rutas y lógica.