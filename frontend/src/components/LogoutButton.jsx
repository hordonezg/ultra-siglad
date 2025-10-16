import React from 'react';
import { authService } from '../services/authService'; // ✅ Importar tu servicio

const LogoutButton = ({ className = '', showIcon = true, showText = true, variant = 'default' }) => {
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      authService.logout();
    }
  };

  // Estilos en línea para simplicidad
  const getButtonStyles = () => {
    const baseStyle = {
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    switch (variant) {
      case 'small':
        return {
          ...baseStyle,
          padding: '6px 12px',
          fontSize: '12px'
        };
      case 'icon-only':
        return {
          ...baseStyle,
          padding: '8px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          justifyContent: 'center'
        };
      default:
        return {
          ...baseStyle,
          padding: '10px 20px',
          fontSize: '14px'
        };
    }
  };

  return (
    <button
      style={getButtonStyles()}
      className={className}
      onClick={handleLogout}
      title="Cerrar Sesión"
    >
      {showIcon && '🚪'}
      {showIcon && showText && ' '}
      {showText && 'Cerrar Sesión'}
    </button>
  );
};

export default LogoutButton;