import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Login } from './components/Auth/Login.jsx';
import { AdminPanel } from './components/Admin/AdminPanel.jsx';
import { TransportistaPanel } from './components/Transportista/TransportistaPanel.jsx';
import AgentePanel from './components/Agente/AgentePanel.jsx';
import ValidacionDeclaraciones from './components/Agente/ValidacionDeclaraciones.jsx';

// Componente para rutas protegidas
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">⏳ Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ✅ DEBUG TEMPORAL - VER QUÉ ROL TIENE EL USUARIO
  console.log('🔍 DEBUG ProtectedRoute:');
  console.log('- Usuario:', user);
  console.log('- Rol del usuario:', user?.rol);
  console.log('- Rol requerido:', requiredRole);
  console.log('- Coinciden?', user?.rol === requiredRole);

  // ✅ ACEPTAR MÚLTIPLES FORMAS DEL ROL
  const allowedRoles = {
    'Agente Aduanero': ['Agente Aduanero', 'Agente', 'Aduanero', 'agente'],
    'Transportista': ['Transportista', 'Transportador', 'transportista'],
    'Administrador': ['Administrador', 'Admin', 'administrador']
  };

  const userHasAccess = !requiredRole || 
    allowedRoles[requiredRole]?.includes(user.rol) || 
    user.rol === requiredRole;

  if (!userHasAccess) {
    console.log('🚫 Acceso denegado. Rol usuario:', user.rol, 'Rol requerido:', requiredRole);
    return (
      <div className="access-denied">
        <h2>🚫 No tienes permisos para acceder a esta página</h2>
        <p>Tu rol: <strong>{user.rol}</strong></p>
        <p>Rol requerido: <strong>{requiredRole}</strong></p>
        <button onClick={() => window.history.back()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Volver
        </button>
      </div>
    );
  }

  return children;
}

// Componente para redirección del dashboard
function DashboardRedirect() {
  const { user } = useAuth();
  
  console.log('🔍 DashboardRedirect - Rol del usuario:', user?.rol);
  
  if (user?.rol === 'Administrador') {
    return <Navigate to="/admin" replace />;
  } else if (user?.rol === 'Transportista') {
    return <Navigate to="/transportista" replace />;
  } else if (user?.rol === 'Agente Aduanero' || user?.rol === 'Agente' || user?.rol === 'agente') {
    return <Navigate to="/agente" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

function AppContent() {
  const { user } = useAuth();

  // ✅ DEBUG del usuario global
  console.log('🔍 AppContent - Usuario global:', user);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta de admin */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="Administrador">
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          {/* Ruta de transportista */}
          <Route path="/transportista/*" element={
            <ProtectedRoute requiredRole="Transportista">
              <TransportistaPanel />
            </ProtectedRoute>
          } />
          
          {/* Ruta de agente - ACEPTA MÚLTIPLES ROLES */}
          <Route path="/agente/*" element={
            <ProtectedRoute requiredRole="Agente Aduanero">
              <AgentePanel />
            </ProtectedRoute>
          } />
          
          {/* Ruta específica para validación */}
          <Route path="/agente/validacion" element={
            <ProtectedRoute requiredRole="Agente Aduanero">
              <ValidacionDeclaraciones />
            </ProtectedRoute>
          } />
          
          {/* Ruta dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } />
          
          {/* Redirección automática según rol */}
          <Route path="/" element={
            <ProtectedRoute>
              {user?.rol === 'Administrador' && <Navigate to="/admin" replace />}
              {user?.rol === 'Transportista' && <Navigate to="/transportista" replace />}
              {(user?.rol === 'Agente Aduanero' || user?.rol === 'Agente' || user?.rol === 'agente') && <Navigate to="/agente" replace />}
              <Navigate to="/login" replace />
            </ProtectedRoute>
          } />
          
          {/* Ruta de fallback para cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;