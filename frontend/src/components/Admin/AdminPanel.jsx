import React from 'react';
import { UserManagement } from '../Users/UserManagement.jsx';

export function AdminPanel() {
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛡️ Panel de Administrador - SIGLAD</h1>
        <p>Bienvenido al sistema de gestión administrativa</p>
      </div>
      
      <div className="admin-content">
        <UserManagement />
      </div>
    </div>
  );
}