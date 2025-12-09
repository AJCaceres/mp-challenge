import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

function Layout({ children, fullWidth = false }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/expedientes', label: 'Expedientes', icon: '📁' },
    { path: '/reportes', label: 'Reportes', icon: '📊' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const mainClass = fullWidth
    ? 'layout-main-content layout-main-content--full'
    : 'layout-main-content';

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <div className="layout-brand">
            <span className="layout-brand-icon">⚖️</span>
            <h1 className="layout-brand-name">MP - Gestión de Expedientes</h1>
          </div>
          
          {user && (
            <div className="layout-user">
              <div className="layout-user-info">
                <span className="layout-user-name">{user.nombre}</span>
                <span className="layout-user-role badge badge-primary">
                  {user.rol}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-sm btn-ghost"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <nav className="layout-nav">
        <div className="layout-nav-content">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`layout-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="layout-nav-icon">{item.icon}</span>
              <span className="layout-nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="layout-main">
        <div className={mainClass}>
          {children}
        </div>
      </main>

      <footer className="layout-footer">
        <div className="layout-footer-content">
          <p className="text-sm text-secondary">
            2025 Ministerio Público - Sistema de Gestión de Expedientes - Alvaro Cáceres
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
