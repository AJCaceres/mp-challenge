import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui';
import './HomePage.css';

// Copilot: convierte este HomePage en un dashboard simple pero más agradable.
// Requisitos:
// - Mantener el header con el nombre del sistema y el usuario logueado (nombre + rol).
// - Agregar una barra de navegación lateral o superior con links a: Inicio, Expedientes, Reportes.
// - Agregar 2 o 3 tarjetas informativas (placeholders) con texto genérico, por ejemplo:
//   "Total de expedientes", "Expedientes en revisión", "Expedientes aprobados".
//   Por ahora pueden ser números estáticos o dejar listo el espacio para luego integrar datos reales.
// - Mantén los estilos simples usando estilos inline o clases CSS básicas (sin frameworks de UI externos).
// - Mantener el botón de "Cerrar sesión".

function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: '📁',
      title: 'Gestión de Expedientes',
      description: 'Crear, editar y administrar expedientes según tu rol en el sistema.',
      roles: ['TECNICO', 'COORDINADOR']
    },
    {
      icon: '🔍',
      title: 'Registro de Indicios',
      description: 'Documentar y gestionar indicios asociados a cada expediente.',
      roles: ['TECNICO']
    },
    {
      icon: '✓',
      title: 'Revisión y Aprobación',
      description: 'Revisar, aprobar o rechazar expedientes en proceso.',
      roles: ['COORDINADOR']
    },
    {
      icon: '📊',
      title: 'Reportes y Estadísticas',
      description: 'Visualizar reportes detallados del estado de los expedientes.',
      roles: ['TECNICO', 'COORDINADOR']
    }
  ];

  const userFeatures = features.filter(f => f.roles.includes(user?.rol));

  return (
    <Layout fullWidth>
      <div className="home-welcome">
        <h1 className="home-title">¡Bienvenido, {user?.nombre}!</h1>
        <p className="home-subtitle">
          Sistema de Gestión de Expedientes del Ministerio Público
        </p>
      </div>

      <div className="home-features">
        {userFeatures.map((feature, index) => (
          <Card key={index} className="home-feature-card">
            <div className="home-feature-icon">{feature.icon}</div>
            <h3 className="home-feature-title">{feature.title}</h3>
            <p className="home-feature-description">{feature.description}</p>
          </Card>
        ))}
      </div>

      <Card title="Información del Sistema">
        <div className="home-info">
          <div className="home-info-item">
            <span className="home-info-label">Usuario:</span>
            <span className="home-info-value">{user?.nombre}</span>
          </div>
          <div className="home-info-item">
            <span className="home-info-label">Rol:</span>
            <span className="badge badge-primary">{user?.rol}</span>
          </div>
          <div className="home-info-item">
            <span className="home-info-label">Permisos:</span>
            <span className="home-info-value">
              {user?.rol === 'TECNICO' 
                ? 'Crear y editar expedientes, registrar indicios'
                : 'Revisar y aprobar expedientes, consultar reportes'}
            </span>
          </div>
        </div>
      </Card>
    </Layout>
  );
}

export default HomePage;