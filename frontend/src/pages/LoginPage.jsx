import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { useToast } from '../components/ui/Toast';
import api from '../../api/client';
import './LoginPage.css';

// Copilot: mejora este formulario de login para que se vea más profesional, tipo panel administrativo.
// Respeta la lógica actual (usa api.post('/auth/login'), usa el contexto AuthContext y navigate('/')).
// Agrega:
// - Título claro y subtítulo breve.
// - Bordes suaves, sombrita ligera, inputs alineados verticalmente.
// - Estado de error visible debajo del formulario.
// - Deshabilita el botón mientras está cargando.
// - Opcional: mostrar debajo de login un texto pequeño con el rol del usuario después de loguearse si se desea reutilizar.

function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { usuario, password });
      login(response.data);
      toast.success(`Bienvenido ${response.data.usuario.nombre}`);
      navigate('/');
    } catch (err) {
      toast.error(err.userMessage || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <span className="login-icon">⚖️</span>
          <h1 className="login-title">Ministerio Público</h1>
          <p className="login-subtitle">Sistema de Gestión de Expedientes</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              placeholder="Ingrese su usuario"
              disabled={loading}
            />
            
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingrese su contraseña"
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Ingresar
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;