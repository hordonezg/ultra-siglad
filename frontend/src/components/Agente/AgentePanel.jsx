import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ValidacionDeclaraciones from './ValidacionDeclaraciones';
import { authService } from '../../services/authService.js'; // ✅ IMPORTAR AUTH SERVICE
import Swal from 'sweetalert2'; // ✅ IMPORTAR SWEETALERT2
import '../../components/LogoutButton.css'; // ✅ IMPORTAR CSS DEL LOGOUT

const AgentePanel = () => {
  const location = useLocation();

  // ✅ CONFIRMACIÓN ESTILIZADA SUAVE
  const showConfirm = (title, text, confirmButtonText = 'Sí, confirmar') => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      iconColor: '#d97706',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#dc2626',
      confirmButtonText,
      cancelButtonText: 'Cancelar',
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#e2e8f0',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      },
      customClass: {
        popup: 'sweetalert-dark-popup',
        confirmButton: 'sweetalert-confirm-soft',
        cancelButton: 'sweetalert-cancel-soft',
        title: 'sweetalert-title-soft',
        htmlContainer: 'sweetalert-text-soft',
        actions: 'sweetalert-actions-spaced'
      },
      buttonsStyling: false,
      backdrop: 'rgba(0, 0, 0, 0.8)'
    });
  };

  // ✅ FUNCIÓN LOGOUT MEJORADA
  const handleLogout = async () => {
    const result = await showConfirm(
      '🚪 Cerrar Sesión', 
      '¿Estás seguro de que quieres salir del sistema?',
      'Sí, cerrar sesión'
    );
    
    if (result.isConfirmed) {
      authService.logout();
    }
  };

  return (
    <div className="panel-container">
      {/* Sidebar de Navegación */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>👮‍♂️ Agente Aduanero</h2>
          <p>Panel de Validación</p>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/agente/validacion" 
            className={`nav-link ${location.pathname === '/agente/validacion' ? 'active' : ''}`}
          >
            📋 Validar Declaraciones
          </Link>
          
          <Link 
            to="/agente/historial" 
            className={`nav-link ${location.pathname === '/agente/historial' ? 'active' : ''}`}
          >
            📊 Historial Validaciones
          </Link>
          
          <Link 
            to="/agente/estadisticas" 
            className={`nav-link ${location.pathname === '/agente/estadisticas' ? 'active' : ''}`}
          >
            📈 Estadísticas
          </Link>
          
          {/* Agrega más enlaces según necesites */}
          <Link 
            to="/agente/perfil" 
            className={`nav-link ${location.pathname === '/agente/perfil' ? 'active' : ''}`}
          >
            👤 Mi Perfil
          </Link>
        </nav>

        {/* ✅ BOTÓN LOGOUT CENTRADO Y HASTA ABAJO */}
        <div style={{ 
          marginTop: 'auto', 
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="main-content">
        <div className="content-header">
          <h1>
            {location.pathname === '/agente/validacion' && 'Validación de Declaraciones'}
            {location.pathname === '/agente/historial' && 'Historial de Validaciones'}
            {location.pathname === '/agente/estadisticas' && 'Estadísticas'}
            {location.pathname === '/agente/perfil' && 'Mi Perfil'}
          </h1>
          <div className="user-info">
            <span><strong>Bienvenido, Agente</strong></span>
          </div>
        </div>

        <div className="content-body">
          <Routes>
            <Route path="validacion" element={<ValidacionDeclaraciones />} />
            <Route path="historial" element={<div>Historial de Validaciones (Próximamente)</div>} />
            <Route path="estadisticas" element={<div>Estadísticas (Próximamente)</div>} />
            <Route path="perfil" element={<div>Mi Perfil (Próximamente)</div>} />
            {/* Ruta por defecto */}
            <Route path="/" element={<ValidacionDeclaraciones />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AgentePanel;