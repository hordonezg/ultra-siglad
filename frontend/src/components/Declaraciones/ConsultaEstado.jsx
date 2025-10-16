import React, { useState, useEffect } from 'react';
import { declarationService } from '../../services/declarationService.js';
import Swal from 'sweetalert2'; // ✅ IMPORTAR SWEETALERT2

const ConsultaEstado = () => {
  const [declaraciones, setDeclaraciones] = useState([]);
  const [declaracionSeleccionada, setDeclaracionSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargarDeclaraciones();
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

  const cargarDeclaraciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Cargando declaraciones para consulta de estado...');
      
      const response = await declarationService.getDeclaracionesTransportista();
      console.log('✅ Respuesta completa:', response);
      console.log('✅ Datos recibidos:', response.data);
      
      // ✅ CORRECCIÓN: Verificar la estructura real de la respuesta
      if (response.data && response.data.success) {
        setDeclaraciones(response.data.declaraciones || []);
        console.log('📊 Declaraciones establecidas:', response.data.declaraciones);
      } else {
        // Si la respuesta tiene estructura diferente
        setDeclaraciones(response.data || []);
        console.log('📊 Declaraciones (estructura alternativa):', response.data);
      }
      
    } catch (error) {
      console.error('❌ Error cargando declaraciones:', error);
      const errorMessage = 'Error al cargar las declaraciones: ' + (error.response?.data?.error || error.message);
      setError(errorMessage);
      showAlert('error', '❌ Error', errorMessage, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const consultarEstadoEspecifico = async (id) => {
    try {
      setLoading(true);
      
      console.log(`🔍 Consultando estado específico de declaración: ${id}`);
      
      const response = await declarationService.consultarEstadoDeclaracion(id);
      console.log('✅ Estado consultado:', response.data);
      
      // ✅ CORRECCIÓN: Asegurar que usamos la estructura correcta
      const declaracion = response.data.declaracion || response.data;
      setDeclaracionSeleccionada(declaracion);
      
    } catch (error) {
      console.error('❌ Error consultando estado:', error);
      const errorMessage = 'Error al consultar el estado: ' + (error.response?.data?.error || error.message);
      showAlert('error', '❌ Error', errorMessage, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const getColorEstado = (estado) => {
    switch (estado) {
      case 'Validada': return '#4CAF50';
      case 'Pendiente': return '#FF9800';
      case 'Rechazada': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getIconoEstado = (estado) => {
    switch (estado) {
      case 'Validada': return '✅';
      case 'Pendiente': return '⏳';
      case 'Rechazada': return '❌';
      default: return '❓';
    }
  };

  const formatDate = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-GT');
  };

  // ✅ CORRECCIÓN MEJORADA: Manejar ambos formatos de campos (snake_case y camelCase)
  const getCampo = (declaracion, campo) => {
    return declaracion[campo] || 
           declaracion[campo.toLowerCase()] ||
           declaracion[campo.replace(/_/g, '')] || 
           'N/A';
  };

  // Filtrar declaraciones según el estado seleccionado
  const declaracionesFiltradas = declaraciones.filter(declaracion => {
    if (filtroEstado === 'todos') return true;
    const estado = getCampo(declaracion, 'estado');
    return estado === filtroEstado;
  });

  return (
    <div className="consulta-estado-container">
      {/* HEADER */}
      <div className="consulta-header">
        <h2>📊 CU-005 - Consulta de Estado de Declaraciones</h2>
        <p>Consulta el estado actual de todas tus declaraciones aduaneras</p>
        
        {/* ESTADÍSTICAS RÁPIDAS */}
        <div className="estadisticas-rapidas">
          <div className="estadistica-rapida total">
            <span className="numero">{declaraciones.length}</span>
            <span className="label">Total</span>
          </div>
          <div className="estadistica-rapida pendientes">
            <span className="numero">{declaraciones.filter(d => getCampo(d, 'estado') === 'Pendiente').length}</span>
            <span className="label">Pendientes</span>
          </div>
          <div className="estadistica-rapida validadas">
            <span className="numero">{declaraciones.filter(d => getCampo(d, 'estado') === 'Validada').length}</span>
            <span className="label">Validadas</span>
          </div>
          <div className="estadistica-rapida rechazadas">
            <span className="numero">{declaraciones.filter(d => getCampo(d, 'estado') === 'Rechazada').length}</span>
            <span className="label">Rechazadas</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={cargarDeclaraciones}>🔄 Reintentar</button>
        </div>
      )}

      {/* FILTROS */}
      <div className="filtros-section">
        <div className="filtro-estados">
          <label>Filtrar por estado:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            disabled={loading}
          >
            <option value="todos">Todos los estados</option>
            <option value="Pendiente">⏳ Pendientes</option>
            <option value="Validada">✅ Validadas</option>
            <option value="Rechazada">❌ Rechazadas</option>
          </select>
        </div>
        
        <button 
          className="btn-actualizar"
          onClick={cargarDeclaraciones}
          disabled={loading}
        >
          {loading ? '🔄 Actualizando...' : '🔄 Actualizar Lista'}
        </button>
      </div>

      {/* LISTA DE DECLARACIONES */}
      <div className="declaraciones-lista">
        <h3>📋 Mis Declaraciones ({declaracionesFiltradas.length})</h3>
        
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            Cargando declaraciones...
          </div>
        )}

        {!loading && declaracionesFiltradas.length === 0 && (
          <div className="empty-state">
            {declaraciones.length === 0 ? 
              '🎉 No tienes declaraciones registradas' : 
              '🔍 No hay declaraciones con el estado seleccionado'
            }
          </div>
        )}

        {!loading && declaracionesFiltradas.length > 0 && (
          <div className="tabla-declaraciones">
            <table>
              <thead>
                <tr>
                  <th>DUCA</th>
                  <th>Fecha Emisión</th>
                  <th>Tipo Operación</th>
                  <th>Estado</th>
                  <th>Fecha Validación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {declaracionesFiltradas.map((declaracion) => (
                  <tr key={declaracion.id} className="fila-declaracion">
                    <td className="duca-cell">
                      <strong>{getCampo(declaracion, 'numero_documento')}</strong>
                    </td>
                    <td>{formatDate(getCampo(declaracion, 'fecha_emision'))}</td>
                    <td>
                      <span className="badge-tipo">
                        {getCampo(declaracion, 'tipo_operacion')}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="estado-badge"
                        style={{ 
                          backgroundColor: getColorEstado(getCampo(declaracion, 'estado')),
                          color: 'white'
                        }}
                      >
                        {getIconoEstado(getCampo(declaracion, 'estado'))} {getCampo(declaracion, 'estado')}
                      </span>
                    </td>
                    <td>
                      {getCampo(declaracion, 'fecha_validacion') !== 'N/A' ? 
                        formatDate(getCampo(declaracion, 'fecha_validacion')) : 
                        <em>Pendiente</em>
                      }
                    </td>
                    <td>
                      <button
                        className="btn-consultar"
                        onClick={() => consultarEstadoEspecifico(declaracion.id)}
                        disabled={loading}
                        title="Consultar detalles del estado"
                      >
                        👁️ Consultar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETALLE DE ESTADO */}
      {declaracionSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔍 Detalle de Estado - {getCampo(declaracionSeleccionada, 'numero_documento')}</h3>
              <button 
                className="btn-cerrar-modal"
                onClick={() => setDeclaracionSeleccionada(null)}
              >
                ✖️
              </button>
            </div>

            <div className="modal-body">
              <div className="info-grid">
                <div className="info-item">
                  <label>Número DUCA:</label>
                  <span>{getCampo(declaracionSeleccionada, 'numero_documento')}</span>
                </div>
                <div className="info-item">
                  <label>Fecha Emisión:</label>
                  <span>{formatDate(getCampo(declaracionSeleccionada, 'fecha_emision'))}</span>
                </div>
                <div className="info-item">
                  <label>Tipo Operación:</label>
                  <span>{getCampo(declaracionSeleccionada, 'tipo_operacion')}</span>
                </div>
                <div className="info-item">
                  <label>Estado:</label>
                  <span 
                    className="estado-detalle"
                    style={{ backgroundColor: getColorEstado(getCampo(declaracionSeleccionada, 'estado')) }}
                  >
                    {getIconoEstado(getCampo(declaracionSeleccionada, 'estado'))} {getCampo(declaracionSeleccionada, 'estado')}
                  </span>
                </div>
                
                {getCampo(declaracionSeleccionada, 'fecha_validacion') !== 'N/A' && (
                  <div className="info-item">
                    <label>Fecha Validación:</label>
                    <span>{formatDate(getCampo(declaracionSeleccionada, 'fecha_validacion'))}</span>
                  </div>
                )}
                
                {getCampo(declaracionSeleccionada, 'agente_validador_id') !== 'N/A' && (
                  <div className="info-item">
                    <label>Agente Validador ID:</label>
                    <span>{getCampo(declaracionSeleccionada, 'agente_validador_id')}</span>
                  </div>
                )}
                
                {getCampo(declaracionSeleccionada, 'motivo_rechazo') !== 'N/A' && (
                  <div className="info-item full-width">
                    <label>Motivo de Rechazo:</label>
                    <div className="motivo-rechazo">
                      {getCampo(declaracionSeleccionada, 'motivo_rechazo')}
                    </div>
                  </div>
                )}
                
                <div className="info-item">
                  <label>Fecha Registro:</label>
                  <span>{formatDate(getCampo(declaracionSeleccionada, 'created_at'))}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cerrar"
                onClick={() => setDeclaracionSeleccionada(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultaEstado;