# Docker Setup - MP Challenge

## 📦 Archivos Docker Creados

### 1. **`backend/Dockerfile`**
Crea una imagen Docker del servidor Node.js (API).

**Qué hace:**
- Usa Node.js 18 (versión ligera Alpine)
- Instala solo dependencias de producción
- Expone el puerto 3001
- Inicia con `npm start`

**Usado por:** docker-compose.yml (servicio `api`)

---

### 2. **`frontend/Dockerfile`**
Crea una imagen Docker del frontend React optimizada.

**Qué hace (2 etapas):**
1. **Build:** Compila React con `npm run build`
2. **Production:** Sirve con Nginx (servidor web rápido)

**Ventajas:**
- Imagen final pequeña (solo el código compilado)
- Mejor rendimiento que servir con Node.js
- Nginx comprime archivos (gzip)

**Usado por:** docker-compose.yml (servicio `web`)

---

### 3. **`frontend/nginx.conf`**
Configuración del servidor Nginx (el que sirve el frontend).

**Qué hace:**
- Escucha en puerto 80
- Sirve archivos estáticos (JS, CSS, imágenes)
- **Importante:** Redirige todas las rutas a `index.html` (necesario para React Router)
- Cachea archivos estáticos por 1 año
- Comprime respuestas con gzip

**Por qué es necesario:**
Sin esto, si entras a `/expedientes` directamente, Nginx no encuentra el archivo y devuelve 404. Con `try_files`, React Router puede manejar la ruta.

---

### 4. **`backend/.env` (Actualizado)**
Variables de entorno para el contenedor backend.

**Cambios importantes:**
```ini
DB_SERVER=db              # ← "db" es el nombre del servicio en docker-compose
DB_DATABASE=MP_DB         # ← Nombre de la BD (ajustado)
DB_PORT=1433              # ← Puerto interno del contenedor (no 1433:1433)
NODE_ENV=production       # ← Modo producción
```

**Por qué cambia:**
- En local: `DB_SERVER=localhost`
- En Docker: `DB_SERVER=db` (nombre del contenedor)

---

### 5. **`backend/package.json` (Actualizado)**
Se agregó el script `start`:

```json
"scripts": {
  "start": "node src/server.js",   // ← NUEVO
  "dev": "nodemon src/server.js",
  "test": "jest"
}
```

**Por qué:**
- Docker ejecuta `npm start` (no `npm run dev` con nodemon)
- El Dockerfile llama a `npm start`

---

## 🚀 Cómo Usar Docker

### **Paso 1: Construir las imágenes**
```bash
cd /Users/acaceres/Documents/mp-challenge
docker-compose build
```
Esto crea las imágenes de `api` y `web` basándose en los Dockerfiles.

### **Paso 2: Levantar los contenedores**
```bash
docker-compose up
```

**Esto inicia:**
1. `mp_dicri_db` - SQL Server (puerto 1433)
2. `mp_dicri_api` - Backend Node.js (puerto 3001)
3. `mp_dicri_web` - Frontend Nginx (puerto 3000)

**Esperar ~10 segundos** a que SQL Server esté listo.

### **Paso 3: Inicializar la BD**
En otra terminal:
```bash
docker exec mp_dicri_api node /ruta/a/tu/seed.js
```
O si tienes un script:
```bash
docker exec mp_dicri_api npm run seed
```

### **Paso 4: Acceder a la aplicación**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **SQL Server:** localhost:1433 (desde herramientas SQL)

---

## 📋 Verificar que Todo Funciona

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f api

# Ver logs solo de la BD
docker-compose logs -f db

# Ver contenedores activos
docker ps

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (borra la BD)
docker-compose down -v
```

---

## ⚠️ Importante: Inicialización de la BD

Después de `docker-compose up`, la BD está vacía. Necesitas ejecutar el seed:

```bash
# Opción 1: Si tienes un script Node.js
docker exec mp_dicri_api node db/seed.js

# Opción 2: Ejecutar el SQL manualmente
docker exec -i mp_dicri_db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'MpStrongPass123*' < db/seed.sql
```

---

## 🔧 Troubleshooting

### **"Cannot connect to database"**
```bash
# La BD tarda en iniciar. Espera 15-20 segundos y reinicia
docker-compose restart api
```

### **"Port 3000 already in use"**
```bash
# Cambiar puerto en docker-compose.yml
# De: "3000:80" → "3002:80"

# O liberar el puerto:
lsof -i :3000
kill -9 <PID>
```

### **Ver archivos dentro del contenedor**
```bash
docker exec -it mp_dicri_api sh
ls -la
exit
```

### **Reconstruir imágenes (si cambias código)**
```bash
docker-compose build --no-cache
docker-compose up
```

---

## 📊 Estructura de Contenedores

```
docker-compose up
    ↓
┌─────────────────────────────────────────────────┐
│ SQL Server (mp_dicri_db)                        │
│ - Puerto: 1433                                  │
│ - Usuario: sa / MpStrongPass123*                │
│ - Volumen: sql_data (persistencia)              │
└─────────────────────────────────────────────────┘
    ↑
    └─ (se conecta el backend)

┌─────────────────────────────────────────────────┐
│ Backend Node.js (mp_dicri_api)                  │
│ - Puerto: 3001                                  │
│ - Archivo: backend/Dockerfile                   │
│ - Env: backend/.env                             │
└─────────────────────────────────────────────────┘
    ↑
    └─ (lo consulta el frontend)

┌─────────────────────────────────────────────────┐
│ Frontend Nginx (mp_dicri_web)                   │
│ - Puerto: 3000                                  │
│ - Archivo: frontend/Dockerfile                  │
│ - Config: frontend/nginx.conf                   │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] `backend/Dockerfile` - Crea imagen del API
- [x] `frontend/Dockerfile` - Compila React y sirve con Nginx
- [x] `frontend/nginx.conf` - Configura Nginx
- [x] `backend/.env` - Variables para contenedor (DB_SERVER=db)
- [x] `backend/package.json` - Script `start` agregado
- [x] `docker-compose.yml` - Orquesta los 3 servicios

**Ahora puedes hacer:**
```bash
docker-compose build && docker-compose up
```

¡Y tu aplicación estará completamente containerizada! 🐳
