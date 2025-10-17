import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService.js';
import Swal from 'sweetalert2'; // ✅ IMPORTAR SWEETALERT2
import '../../components/LogoutButton.css'; // ✅ IMPORTAS TU CSS AQUÍ
import { API_URL } from '../../config/config.js';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'Transportista',
    activo: true
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ CONFIGURACIÓN SWEETALERT2 CON ESTILO DARK SUAVE
  const showAlert = (icon, title, text, confirmButtonColor = '#4f46e5') => {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor,
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#e2e8f0',
      confirmButtonText: 'Aceptar',
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
      },
      customClass: {
        popup: 'sweetalert-dark-popup',
        confirmButton: 'sweetalert-confirm-btn-soft',
        title: 'sweetalert-title-soft',
        htmlContainer: 'sweetalert-text-soft'
      },
      buttonsStyling: false,
      backdrop: 'rgba(0, 0, 0, 0.7)'
    });
  };

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
        actions: 'sweetalert-actions-spaced' // ✅ SEPARACIÓN DE BOTONES
      },
      buttonsStyling: false,
      backdrop: 'rgba(0, 0, 0, 0.8)'
    });
  };

  // ✅ FUNCIÓN LOGOUT AGREGADA
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

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error cargando usuarios');
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'No se pudieron cargar los usuarios: ' + error.message, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = authService.getToken();
      const url = editingUser ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;
      const method = editingUser ? 'PUT' : 'POST';

      // Preparar datos para enviar
      const userData = editingUser ? {
        nombre: form.nombre,
        correo: form.correo,
        rol: form.rol,
        activo: form.activo
      } : {
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        rol: form.rol,
        activo: form.activo
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      // Verificar si la respuesta es JSON válido
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      await showAlert('success', '✅ Éxito', data.message || 'Operación completada correctamente', '#059669');
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'Error al procesar la solicitud: ' + error.message, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      correo: '',
      password: '',
      rol: 'Transportista',
      activo: true
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const editUser = (user) => {
    setForm({
      nombre: user.nombre,
      correo: user.correo,
      password: '', // No mostramos la contraseña al editar
      rol: user.rol,
      activo: user.activo
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const deleteUser = async (user) => {
    const result = await showConfirm(
      '🗑️ Eliminar Usuario', 
      `¿Estás seguro de eliminar al usuario "${user.nombre}" (${user.correo})? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Error eliminando usuario');
      }

      await showAlert('success', '✅ Eliminado', data.message || 'Usuario eliminado exitosamente', '#059669');
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'No se pudo eliminar el usuario: ' + error.message, '#dc2626');
    }
  };

  const toggleUserStatus = async (user) => {
    const action = user.activo ? 'desactivar' : 'activar';
    const result = await showConfirm(
      user.activo ? '⏸️ Desactivar Usuario' : '▶️ Activar Usuario',
      `¿Estás seguro de ${action} al usuario "${user.nombre}"?`,
      `Sí, ${action}`
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
          activo: !user.activo
        })
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        throw new Error('Respuesta inválida del servidor');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Error actualizando usuario');
      }

      await showAlert('success', '✅ Estado Actualizado', `Usuario ${!user.activo ? 'activado' : 'desactivado'} exitosamente`, '#059669');
      loadUsers();
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'No se pudo actualizar el estado: ' + error.message, '#dc2626');
    }
  };

  return (
    <div className="user-management">
      <div className="user-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h2>👥 Gestión de Usuarios</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

            <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
                disabled={loading}
              >
                + Nuevo Usuario
              </button>
              <button
                className="btn btn-secondary"
                onClick={loadUsers}
                disabled={loading}
              >
                🔄 Actualizar
              </button>
            </div>

            {/* ✅ BOTÓN CON CLASE CSS */}
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingUser ? '✏️ Editar Usuario' : '👤 Crear Nuevo Usuario'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                  placeholder="Ingrese el nombre completo"
                />
              </div>

              <div className="form-group">
                <label>Correo electrónico *</label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  required
                  placeholder="usuario@ejemplo.com"
                  disabled={!!editingUser}
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>Contraseña *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength="6"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Rol *</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  required
                >
                  <option value="Transportista">🚛 Transportista</option>
                  <option value="Agente Aduanero">📋 Agente Aduanero</option>
                  <option value="Administrador">🛡️ Administrador</option>
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  />
                  Usuario activo
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? '⏳ Guardando...' : (editingUser ? '💾 Actualizar' : '✅ Crear Usuario')}
                </button>
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={resetForm}
                  disabled={loading}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading">⏳ Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="no-users">
            <p>No hay usuarios registrados</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={!user.activo ? 'inactive-user' : ''}>
                  <td>{user.nombre}</td>
                  <td>{user.correo}</td>
                  <td>
                    <span className={`role-badge role-${user.rol.toLowerCase().replace(' ', '-')}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${user.activo ? 'active' : 'inactive'}`}>
                      {user.activo ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                  <td>
                    {user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString('es-MX') : 'N/A'}
                  </td>
                  <td className="actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => editUser(user)}
                      title="Editar usuario"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-action btn-toggle"
                      onClick={() => toggleUserStatus(user)}
                      title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                    >
                      {user.activo ? '⏸️' : '▶️'}
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => deleteUser(user)}
                      disabled={user.correo === 'admin@siglad.com'}
                      title={user.correo === 'admin@siglad.com' ? 'No se puede eliminar el admin principal' : 'Eliminar usuario'}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}