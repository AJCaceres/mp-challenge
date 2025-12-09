import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ReportsPage from './pages/ReportsPage';
import ExpedientesPage from './pages/ExpedientesPage';
import ExpedienteDetailPage from './pages/ExpedienteDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import IndiciosPage from './pages/IndiciosPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expedientes"
              element={
                <ProtectedRoute>
                  <ExpedientesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/expedientes/:id"
              element={
                <ProtectedRoute>
                  <ExpedienteDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expedientes/:id/indicios"
              element={
                <ProtectedRoute>
                  <IndiciosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reportes"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;