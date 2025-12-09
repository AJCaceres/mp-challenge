# Backend Unit Tests - MP Challenge

## Descripción

Suite de pruebas unitarias para los servicios y controladores principales del backend.

## Pruebas Incluidas

### 1. Auth Service (`auth.service.test.js`)
- ✅ Login exitoso con credenciales válidas
- ✅ Error cuando el usuario no existe
- ✅ Error cuando la contraseña es incorrecta
- ✅ Manejo de passwordHash en formato Buffer
- ✅ Generación correcta de JWT con expiración 24h
- ✅ Verificación de status de error (401)

### 2. Auth Controller (`auth.controller.test.js`)
- ✅ Validación de campos obligatorios (usuario y password)
- ✅ Retorno de token y datos de usuario en login exitoso
- ✅ Manejo de errores con status desde el servicio
- ✅ Delegación de errores sin status al middleware

### 3. Expedientes Controller (`expedientes.controller.test.js`)
- ✅ Creación exitosa de expediente
- ✅ Listado sin filtros
- ✅ Listado con filtros (estado, fechas)
- ✅ Aprobación de expediente
- ✅ Rechazo con justificación
- ✅ Manejo de errores

### 4. Indicios Controller (`indicios.controller.test.js`)
- ✅ Creación de indicio con datos completos
- ✅ Listado de indicios por expediente
- ✅ Actualización de indicio
- ✅ Eliminación de indicio
- ✅ Manejo de errores
- ✅ Retorno de lista vacía cuando no hay indicios

## Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm test -- --coverage

# Ejecutar una prueba específica
npm test -- auth.service.test.js

# Modo watch (rerun on file change)
npm test -- --watch
```

## Cobertura

La suite cubre:
- **Auth Service**: 100% (login, validación, JWT)
- **Auth Controller**: 100% (validación, errores)
- **Expedientes Controller**: Funciones principales
- **Indicios Controller**: Funciones principales

## Mocking

Las pruebas utilizan mocks para:
- Repositorios de base de datos
- Servicio de JWT
- Servicios de negocio

Esto permite pruebas rápidas, aisladas e independientes de conexiones a BD.

## Estructura

```
backend/src/tests/
├── auth.service.test.js        # Pruebas de autenticación
├── auth.controller.test.js     # Pruebas de endpoint de login
├── expedientes.controller.test.js
└── indicios.controller.test.js
```

## Próximos Pasos

Para ampliar la cobertura:
1. Agregar tests para `expedientes.service.js`
2. Agregar tests para `indicios.service.js`
3. Agregar tests de integración con BD
4. Agregar tests de validación de middleware
