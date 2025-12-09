import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requireRole && user?.rol !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
