# 📋 Sistema de Gestión de Expedientes - Ministerio Público

Sistema fullstack para la gestión de expedientes del Ministerio Público con roles de Técnico y Coordinador.

## 🎯 Características

- ✅ **Autenticación JWT** con bcrypt
- ✅ **Gestión de Expedientes** (crear, editar, eliminar, enviar a revisión)
- ✅ **Gestión de Indicios** (crear, actualizar, eliminar)
- ✅ **Control de Roles** (TECNICO, COORDINADOR)
- ✅ **Reportes y Estadísticas**
- ✅ **Interface moderna con React**
- ✅ **Completamente containerizado con Docker**
- ✅ **Suite de pruebas unitarias**

## 📦 Stack Tecnológico

### Backend
- **Node.js** con Express.js
- **SQL Server** para base de datos
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **Jest** para pruebas unitarias

### Frontend
- **React** 18
- **Vite** (build tool)
- **React Router** para navegación
- **Recharts** para gráficas
- **Nginx** en producción

### DevOps
- **Docker** & **Docker Compose** para containerización

---

## 🚀 Inicio Rápido (con Docker)

### Requisitos
- Docker >= 28.0
- Docker Compose >= 2.0
- Git

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/AJCaceres/mp-challenge.git
cd mp-challenge
```

### Paso 2: Construir las Imágenes
```bash
docker-compose build
```

**Esto crea 3 imágenes:**
- `mp-challenge-api` (Backend Node.js)
- `mp-challenge-web` (Frontend React + Nginx)
- `mssql/server` (SQL Server)

### Paso 3: Levantar los Contenedores
```bash
docker-compose up -d
```

**Espera ~10-15 segundos a que SQL Server inicie.**

### Paso 4: Inicializar la Base de Datos
```bash
# Crear tablas
docker exec -i mp_dicri_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MpStrongPass123*' -d mp_challenge -C < db/schema.sql

# Crear procedimientos almacenados
docker exec -i mp_dicri_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MpStrongPass123*' -d mp_challenge -C < db/procedures.sql

# Insertar datos de prueba
docker exec -i mp_dicri_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'MpStrongPass123*' -d mp_challenge -C < db/seed.sql
```

### Paso 5: Acceder a la Aplicación
Abre tu navegador y ve a:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

### Paso 6: Iniciar Sesión
Usa las credenciales de prueba:

**Técnico:**
- Usuario: `user-tec`
- Contraseña: `1234`

**Coordinador:**
- Usuario: `user-coord`
- Contraseña: `4321`

---

## 🛑 Detener la Aplicación

```bash
# Detener los contenedores
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v
```

---

## 🧪 Pruebas Unitarias

Ejecutar todas las pruebas del backend:
```bash
docker exec mp_dicri_api npm test
```

Con cobertura:
```bash
docker exec mp_dicri_api npm test -- --coverage
```

Ver detalles en: [`backend/TESTS.md`](backend/TESTS.md)

---

## 📚 Estructura del Proyecto

```
mp-challenge/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── controllers/       # Manejadores de rutas
│   │   ├── services/          # Lógica de negocio
│   │   ├── repositories/      # Acceso a datos
│   │   ├── middlewares/       # Autenticación, validación
│   │   ├── routes/            # Definición de rutas
│   │   ├── db/               # Conexión a BD
│   │   └── tests/            # Pruebas unitarias
│   ├── Dockerfile             # Imagen Docker
│   ├── package.json
│   └── .env                   # Variables de entorno
│
├── frontend/                   # Aplicación React
│   ├── src/
│   │   ├── pages/            # Páginas (Home, Expedientes, etc.)
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # Context API (Auth)
│   │   ├── styles/           # CSS global
│   │   └── api/              # Cliente axios
│   ├── Dockerfile             # Multi-stage build
│   ├── nginx.conf             # Configuración Nginx
│   ├── vite.config.js
│   └── package.json
│
├── db/                         # Scripts SQL
│   ├── schema.sql             # Definición de tablas
│   ├── procedures.sql         # Procedimientos almacenados
│   └── seed.sql               # Datos iniciales
│
├── docker-compose.yml          # Orquestación de contenedores
├── README.md                   # Este archivo
├── DOCKER.md                   # Guía detallada de Docker
└── .gitignore
```

---

## 🔐 Seguridad

### Contraseñas Hasheadas
- Las contraseñas se hashean con **bcryptjs** (10 rondas)
- Las contraseñas de prueba están hasheadas en `db/seed.sql`

### JWT
- Token expira en **24 horas**
- Secret en variable `JWT_SECRET` (cambiar en producción)

### Variables Sensibles
- Archivo `.env` es ignorado por git
- Ver `.env.example` para variables necesarias

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# Esperar a que SQL Server inicie (15-20 segundos)
# Luego reiniciar el backend
docker-compose restart api
```

### "Port already in use"
```bash
# Cambiar puertos en docker-compose.yml o liberar:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :1433 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Frontend muestra HTML sin CSS/JS
```bash
# Reconstruir las imágenes sin cache
docker-compose build --no-cache
docker-compose up -d
```

### No puedo iniciar sesión
```bash
# Verificar que los datos fueron insertados
docker exec mp_dicri_db /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P 'MpStrongPass123*' -d mp_challenge \
  -C -Q "SELECT usuario, rol FROM Usuarios"
```

---

## 📖 Documentación Adicional

- **[DOCKER.md](DOCKER.md)** - Guía completa de Docker y contenedores
- **[backend/TESTS.md](backend/TESTS.md)** - Suite de pruebas unitarias
- **[instructions.md](instructions.md)** - Requisitos del proyecto

---

## 🔄 Flujo de Uso

### Como Técnico (user-tec)
1. Crear nuevos expedientes
2. Editar expedientes en estado BORRADOR
3. Registrar indicios para expedientes
4. Enviar expedientes a revisión
5. Ver reportes

### Como Coordinador (user-coord)
1. Ver expedientes en revisión
2. Ver indicios de expedientes
3. Aprobar expedientes
4. Rechazar expedientes con justificación
5. Ver reportes

---

## 🚀 Despliegue a Producción

Para producción, considera:
- Cambiar `JWT_SECRET` a un valor seguro
- Usar variables de entorno sensibles desde un gestor secretos
- Configurar un proxy inverso (Nginx, Traefik)
- Habilitar `encrypt: true` en conexión SQL Server
- Implementar HTTPS
- Configurar backups automáticos de BD
- Usar registros privados de Docker

---

## 📝 Licencia

Proyecto académico para Ministerio Público.

---

## 👨‍💻 Autor

**AJCaceres**

---

## ❓ Preguntas o Reportar Bugs

Abre un issue en el repositorio.

