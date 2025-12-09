# Sistema de Gestión de Expedientes - Ministerio Público

Sistema completo de gestión de expedientes para el Ministerio Público con autenticación basada en roles, gestión de indicios y reportes.

## 🎯 Características Principales

### Autenticación y Autorización
- Login con JWT
- Dos roles de usuario: **TÉCNICO** y **COORDINADOR**
- Control de acceso basado en roles

### Gestión de Expedientes (TÉCNICO)
- ✅ Crear expedientes en estado BORRADOR
- ✅ Editar expedientes en BORRADOR
- ✅ Eliminar expedientes en BORRADOR
- ✅ Enviar expedientes a revisión
- ✅ Ver todos los expedientes

### Gestión de Indicios (TÉCNICO)
- ✅ Agregar indicios a expedientes en BORRADOR
- ✅ Editar indicios existentes
- ✅ Eliminar indicios
- ✅ Visualizar indicios por expediente

### Revisión de Expedientes (COORDINADOR)
- ✅ Aprobar expedientes en revisión
- ✅ Rechazar expedientes con motivo
- ✅ Ver todos los expedientes

### Reportes y Estadísticas
- ✅ Reportes de expedientes por estado
- ✅ Filtros por rango de fechas
- ✅ Visualización en tabla y gráficos

## 🛠️ Stack Tecnológico

### Backend
- Node.js + Express
- SQL Server con procedimientos almacenados
- JWT para autenticación
- Arquitectura en capas (Controllers, Services, Repositories)

### Frontend
- React 19
- Vite
- React Router para navegación
- Axios para peticiones HTTP
- Recharts para gráficos
- CSS moderno con variables CSS

## 📁 Estructura del Proyecto

```
mp-challenge/
├── backend/
│   └── src/
│       ├── controllers/      # Controladores HTTP
│       ├── services/          # Lógica de negocio
│       ├── repositories/      # Acceso a datos
│       ├── routes/            # Definición de rutas
│       ├── middlewares/       # Middlewares (auth, etc)
│       └── db/                # Configuración BD
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/            # Componentes reutilizables
        │   │   ├── Button.jsx
        │   │   ├── Input.jsx
        │   │   ├── Table.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Card.jsx
        │   │   ├── Loading.jsx
        │   │   └── Toast.jsx
        │   ├── Layout/        # Layout principal
        │   └── ProtectedRoute.jsx
        │
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── HomePage.jsx
        │   ├── ExpedientesPage.jsx
        │   ├── ExpedienteDetailPage.jsx
        │   └── ReportsPage.jsx
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── styles/
        │   ├── variables.css  # Variables de diseño
        │   └── global.css     # Estilos globales
        │
        └── api/
            └── client.js      # Cliente Axios configurado
```

## 🎨 Sistema de Diseño

### Componentes UI Creados

#### Button
```jsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```
Variantes: `primary`, `secondary`, `success`, `danger`, `outline`, `ghost`

#### Input
```jsx
<Input 
  label="Usuario" 
  type="text" 
  required 
  error="Campo requerido"
/>
```

#### Table
```jsx
<Table 
  columns={columns} 
  data={data} 
  loading={false}
  emptyMessage="No hay datos"
/>
```

#### Modal
```jsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Título"
  footer={<Button>Guardar</Button>}
>
  Contenido
</Modal>
```

#### Card
```jsx
<Card 
  title="Título" 
  subtitle="Subtítulo"
  actions={<Button>Acción</Button>}
>
  Contenido
</Card>
```

#### Toast (Notificaciones)
```jsx
const toast = useToast();
toast.success('Operación exitosa');
toast.error('Error al guardar');
toast.warning('Advertencia');
toast.info('Información');
```

### Paleta de Colores

- **Primary**: `#2563eb` (Azul)
- **Success**: `#16a34a` (Verde)
- **Warning**: `#f59e0b` (Amarillo)
- **Danger**: `#dc2626` (Rojo)
- **Gray**: Escalas del 50 al 900

## 🚀 Instalación y Ejecución

### Backend

```bash
cd backend
npm install
# Configurar .env con conexión a SQL Server
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🔐 Usuarios de Prueba

### Técnico
- **Usuario**: tecnico1
- **Contraseña**: (definida en BD)
- **Permisos**: Crear, editar, eliminar expedientes e indicios

### Coordinador
- **Usuario**: coordinador1
- **Contraseña**: (definida en BD)
- **Permisos**: Aprobar/rechazar expedientes, ver reportes

## 📊 Flujo de Trabajo

1. **Técnico crea expediente** → Estado: BORRADOR
2. **Técnico agrega indicios** al expediente
3. **Técnico envía a revisión** → Estado: EN_REVISION
4. **Coordinador revisa**:
   - Aprobar → Estado: APROBADO
   - Rechazar → Estado: RECHAZADO (con motivo)
5. Si es rechazado, el técnico puede editarlo y reenviar

## 🎯 Funcionalidades por Rol

### TÉCNICO puede:
- ✅ Ver todos los expedientes
- ✅ Crear nuevos expedientes
- ✅ Editar expedientes en BORRADOR
- ✅ Eliminar expedientes en BORRADOR
- ✅ Enviar expedientes a revisión
- ✅ Agregar/editar/eliminar indicios en BORRADOR
- ✅ Ver reportes

### COORDINADOR puede:
- ✅ Ver todos los expedientes
- ✅ Aprobar expedientes EN_REVISION
- ✅ Rechazar expedientes EN_REVISION
- ✅ Ver indicios de expedientes
- ✅ Ver reportes

## 🔄 Estados de Expedientes

- **BORRADOR**: Expediente en creación (editable por técnico)
- **EN_REVISION**: Enviado para aprobación (solo lectura)
- **APROBADO**: Expediente aprobado por coordinador (solo lectura)
- **RECHAZADO**: Expediente rechazado (puede volver a BORRADOR)

## 🎨 Características de UI/UX

- ✅ Diseño responsive (móvil y escritorio)
- ✅ Sistema de diseño consistente con variables CSS
- ✅ Feedback visual con toasts
- ✅ Estados de carga en todas las operaciones
- ✅ Validación de formularios
- ✅ Manejo global de errores
- ✅ Navegación intuitiva con breadcrumbs
- ✅ Tablas con acciones contextuales según rol
- ✅ Modales para formularios
- ✅ Filtros y búsqueda en listados
- ✅ Gráficos interactivos en reportes

## 📝 Notas Técnicas

### Interceptores Axios
- **Request**: Adjunta automáticamente el token JWT
- **Response**: Maneja errores 401 y redirige al login

### Context API
- **AuthContext**: Maneja estado de autenticación global
- **ToastContext**: Sistema de notificaciones global

### Protección de Rutas
Todas las rutas (excepto login) están protegidas con `ProtectedRoute`

### Validaciones
- Formularios con validación required
- Control de permisos por rol en UI y backend
- Validación de estados antes de operaciones

## 🐛 Manejo de Errores

- Interceptor global en axios
- Toast notifications para feedback
- Mensajes de error amigables
- Redirección automática en 401

## 📦 Dependencias Principales

### Backend
- express
- mssql
- jsonwebtoken
- bcryptjs
- cors
- dotenv

### Frontend
- react
- react-router-dom
- axios
- recharts

## 🔧 Configuración

### Variables de Entorno Backend (.env)
```
DB_SERVER=localhost
DB_DATABASE=MP_Expedientes
DB_USER=sa
DB_PASSWORD=tu_password
JWT_SECRET=tu_secret_key
PORT=3001
```

## 📄 Licencia

Proyecto de prueba técnica para Ministerio Público.

---

Desarrollado con ❤️ para el Ministerio Público
