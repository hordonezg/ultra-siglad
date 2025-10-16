import React, { useState } from 'react';
import { DeclaracionManagement } from '../Declaraciones/DeclaracionManagement.jsx';
import ConsultaEstado from '../Declaraciones/ConsultaEstado.jsx';
import { authService } from '../../services/authService.js'; // ✅ IMPORTAR AUTH SERVICE
import Swal from 'sweetalert2'; // ✅ IMPORTAR SWEETALERT2
import '../../components/LogoutButton.css'; // ✅ IMPORTAR CSS DEL LOGOUT

export function TransportistaPanel() {
  const [vistaActiva, setVistaActiva] = useState('gestion'); // 'gestion' o 'consulta'

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
      'Sí, salir'
    );
    
    if (result.isConfirmed) {
      authService.logout();
    }
  };

  return (
    <div className="transportista-panel">
      <div className="transportista-header">
        {/* ✅ HEADER CON LOGOUT */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div>
            <h1>🚛 Panel de Transportista - SIGLAD</h1>
            <p>Gestión de declaraciones aduaneras y seguimiento de envíos</p>
          </div>
          
          {/* ✅ BOTÓN LOGOUT */}
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Logout
          </button>
        </div>
        
        {/* ✅ NAVEGACIÓN ENTRE VISTAS */}
        <div className="navegacion-vistas">
          <button 
            className={`btn-vista ${vistaActiva === 'gestion' ? 'activo' : ''}`}
            onClick={() => setVistaActiva('gestion')}
          >
            📝 Gestión de Declaraciones
          </button>
          <button 
            className={`btn-vista ${vistaActiva === 'consulta' ? 'activo' : ''}`}
            onClick={() => setVistaActiva('consulta')}
          >
            📊 Consulta de Estado
          </button>
        </div>
      </div>
      
      <div className="transportista-content">
        {vistaActiva === 'gestion' ? (
          <DeclaracionManagement />
        ) : (
          <ConsultaEstado />
        )}
      </div>
    </div>
  );
}