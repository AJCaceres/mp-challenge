GitHub Copilot: 

Este proyecto es una prueba técnica para el Ministerio Público de Guatemala (DICRI). 
Objetivo: construir una aplicación web para gestionar expedientes de evidencia criminalística, indicios, y un flujo de aprobación entre técnicos y coordinadores.

Arquitectura general:
- Frontend: ReactJS (SPA) con React Router, manejo de autenticación por JWT, llamadas a API mediante Axios.
- Backend: Node.js con Express, autenticación JWT, bcrypt para hash de contraseñas, pruebas unitarias con Jest/Supertest.
- Base de datos: SQL Server con procedimientos almacenados (SP) para TODO el acceso a datos (CRUD, reportes, cambios de estado).
- Infraestructura: Docker + docker-compose para levantar backend, frontend y SQL Server.

Entidades principales:
- Usuario: idUsuario, nombre, usuario, passwordHash, rol (TECNICO, COORDINADOR).
- Expediente: idExpediente, numeroExpediente, fechaRegistro, idTecnicoRegistro, estado, justificacionRechazo, fechaAprobacion, idCoordinadorAprobacion.
- Indicio: idIndicio, idExpediente, descripcion, color, tamano, peso, ubicacion, idTecnicoRegistro, fechaRegistro.
- Catalogo EstadosExpediente: BORRADOR, EN_REVISION, APROBADO, RECHAZADO.

Flujo funcional:
1. El técnico crea expediente (estado BORRADOR).
2. Registra indicios asociados.
3. Envía el expediente a revisión (estado EN_REVISION).
4. El coordinador aprueba o rechaza:
   - Si aprueba: estado APROBADO.
   - Si rechaza: estado RECHAZADO y se guarda justificacionRechazo.
5. El técnico puede corregir y reenviar.
6. Reportes: registros, aprobaciones y rechazos filtrados por fecha y estado.

Requisitos técnicos:
- Toda operación a base de datos se hace mediante procedimientos almacenados de SQL Server.
- Backend expone API RESTful protegida por JWT.
- Frontend consume la API y muestra pantallas de: login, expedientes, indicios, revisión, reportes.
- Proyecto contenerizado con Docker (servicio web, api y db).
- Debe ser fácil de explicar en una entrevista (código limpio, modular y documentado).

A partir de estas instrucciones, ayuda a generar código y archivos coherentes para backend, frontend, base de datos y Docker.