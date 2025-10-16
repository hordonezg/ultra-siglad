import React, { useState, useEffect } from 'react';
import { declarationService } from '../../services/declarationService.js';
import Swal from 'sweetalert2'; // ✅ IMPORTAR SWEETALERT2

const ValidacionDeclaraciones = () => {
  const [declaraciones, setDeclaraciones] = useState([]);
  const [selectedDeclaracion, setSelectedDeclaracion] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [tokenDisponible, setTokenDisponible] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);

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
        actions: 'sweetalert-actions-spaced'
      },
      buttonsStyling: false,
      backdrop: 'rgba(0, 0, 0, 0.8)'
    });
  };

  useEffect(() => {
    const verificarSesionAgente = () => {
      const token = localStorage.getItem('siglad_token');
      const user = localStorage.getItem('user');
      
      console.log('🔐 CU-004 - Validación Declaraciones');
      console.log('🔐 Precondición - Rol Agente Aduanero');
      console.log('🔐 Token (siglad_token):', !!token);
      console.log('🔐 User:', !!user);
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log('🔐 Usuario:', userData.nombre);
          console.log('🔐 Rol:', userData.rol);
          
          if (userData.rol === 'Agente Aduanero') {
            console.log('✅ Precondición CU-004 cumplida - Usuario es Agente Aduanero');
            setTokenDisponible(true);
            cargarDeclaracionesPendientesCU04();
          } else {
            console.error('❌ Usuario no tiene rol de Agente Aduanero');
            setErrorCarga('No tienes permisos para validar declaraciones');
          }
        } catch (error) {
          console.error('❌ Error verificando sesión:', error);
          setErrorCarga('Error en datos de sesión');
        }
      } else {
        console.log('⏳ Esperando autenticación...');
        setTimeout(() => {
          const currentToken = localStorage.getItem('siglad_token');
          if (!currentToken) {
            console.log('🔐 ❌ Aún no hay token después del reintento');
            setErrorCarga('No se pudo cargar la sesión. Por favor, inicie sesión nuevamente.');
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          }
        }, 2000);
      }
    };

    verificarSesionAgente();
  }, []);

  // ✅ FLUJO NORMAL CU-04 - PASO 3: CONSULTA LISTA DE PENDIENTES
  const cargarDeclaracionesPendientesCU04 = async () => {
    try {
      setLoading(true);
      setErrorCarga(null);
      
      console.log('🔄 CU-04 Paso 3: Consultando declaraciones CONFIRMADAS del CU-03...');
      
      const response = await declarationService.getDeclaracionesPendientes();
      console.log('✅ Respuesta CU-03 -> CU-04:', response.data);
      
      // ✅ CORREGIDO: FILTRAR POR AMBOS CAMPOS POSIBLES
      const declaracionesConfirmadas = response.data.declaraciones?.filter(
        dec => dec.estado_documento === 'CONFIRMADO' || dec.estadoDocumento === 'CONFIRMADO'
      ) || [];
      
      console.log(`🎯 ${declaracionesConfirmadas.length} declaraciones CONFIRMADAS listas para validación CU-04`);
      setDeclaraciones(declaracionesConfirmadas);
      
      // ✅ CARGAR ESTADÍSTICAS DEL AGENTE
      await cargarEstadisticasAgente();
      
    } catch (error) {
      console.error('❌ FA01 CU-04: Error cargando declaraciones:', error);
      
      let errorMessage = 'Error de conexión al cargar declaraciones.';
      if (error.response?.status === 401) {
        errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'No tiene permisos de Agente Aduanero.';
      }
      
      setErrorCarga(errorMessage);
      showAlert('error', '❌ Error', errorMessage, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticasAgente = async () => {
    try {
      const response = await declarationService.getEstadisticasAgente();
      setEstadisticas(response.data.estadisticas);
    } catch (error) {
      console.warn('⚠️ Estadísticas no disponibles, continuando...');
    }
  };

  // ✅ FUNCIÓN PROFESIONAL: NORMALIZAR DATOS DEL BACKEND
  const normalizarDeclaracion = (declaracion) => {
    console.log('🔍 Normalizando declaración:', declaracion);
    
    return {
      // ✅ CONVERTIR snake_case a camelCase (estándar frontend)
      id: declaracion.id,
      numeroDocumento: declaracion.numero_documento || declaracion.numeroDocumento,
      fechaEmision: declaracion.fecha_emision || declaracion.fechaEmision,
      paisEmisor: declaracion.pais_emisor || declaracion.paisEmisor,
      tipoOperacion: declaracion.tipo_operacion || declaracion.tipoOperacion,
      estadoDocumento: declaracion.estado_documento || declaracion.estadoDocumento,
      firmaElectronica: declaracion.firma_electronica || declaracion.firmaElectronica,
      estado: declaracion.estado,
      created_at: declaracion.created_at,
      
      // ✅ MANTENER OBJETOS COMPLEJOS (ya vienen en formato correcto)
      exportador: declaracion.exportador || {},
      importador: declaracion.importador || {},
      transporte: declaracion.transporte || {},
      mercancias: declaracion.mercancias || {},
      valores: declaracion.valores || {},
      
      // ✅ DATOS ADICIONALES DEL BACKEND
      transportista_nombre: declaracion.transportista_nombre,
      transportista_correo: declaracion.transportista_correo
    };
  };

  // ✅ FLUJO NORMAL CU-04 - PASO 4: SELECCIONA DECLARACIÓN
  const cargarDetalleDeclaracion = async (id) => {
    try {
      setLoading(true);
      
      console.log(`🔍 CU-04 Paso 4: Seleccionando declaración ID: ${id}`);
      
      const response = await declarationService.getDeclaracionForAgente(id);
      const declaracion = response.data.declaracion;
      
      // ✅ NORMALIZAR DECLARACIÓN ANTES DE VALIDAR
      const declaracionNormalizada = normalizarDeclaracion(declaracion);
      console.log('✅ Declaración normalizada:', declaracionNormalizada);
      
      // ✅ VALIDAR ESTRUCTURA COMPLETA SEGÚN ANEXO II CU-03
      if (!validarEstructuraCompleta(declaracionNormalizada)) {
        showAlert('error', '❌ Estructura Incompleta', 'FA02 CU-04: Declaración con estructura incompleta. No puede ser procesada.', '#dc2626');
        return;
      }
      
      setSelectedDeclaracion(declaracion);
      console.log('✅ Declaración cargada para validación CU-04');
      
    } catch (error) {
      console.error('❌ Error cargando detalle CU-04:', error);
      showAlert('error', '❌ Error', 'Error al cargar detalle de declaración: ' + (error.response?.data?.error || error.message), '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  // ✅ VALIDACIÓN FA02 CU-04: ESTRUCTURA COMPLETA SEGÚN ANEXO II CU-03
  const validarEstructuraCompleta = (declaracion) => {
    console.log('🔍 Validando estructura de declaración:', declaracion);
    
    const camposObligatorios = [
      'numeroDocumento', 'fechaEmision', 'paisEmisor', 'tipoOperacion',
      'exportador', 'importador', 'transporte', 'mercancias', 'valores',
      'estadoDocumento', 'firmaElectronica'
    ];
    
    const camposFaltantes = camposObligatorios.filter(campo => {
      const valor = declaracion[campo];
      return valor === undefined || valor === null || valor === '' || 
             (typeof valor === 'object' && Object.keys(valor).length === 0);
    });
    
    if (camposFaltantes.length > 0) {
      console.warn('FA02 CU-04: Campos obligatorios faltantes:', camposFaltantes);
      console.warn('🔍 Declaración recibida:', declaracion);
      return false;
    }
    
    // ✅ VALIDAR SUB-CAMPOS OBLIGATORIOS SEGÚN ANEXO III
    // Usar notación segura con ?.
    const exportador = declaracion.exportador || {};
    const importador = declaracion.importador || {};
    const transporte = declaracion.transporte || {};
    const mercancias = declaracion.mercancias || {};
    const valores = declaracion.valores || {};
    
    if (!exportador.nombreExportador || !importador.nombreImportador) {
      console.warn('FA02 CU-04: Datos de exportador/importador incompletos');
      console.warn('🔍 Exportador:', exportador);
      console.warn('🔍 Importador:', importador);
      return false;
    }
    
    if (!transporte.medioTransporte || !transporte.placaVehiculo) {
      console.warn('FA02 CU-04: Datos de transporte incompletos');
      console.warn('🔍 Transporte:', transporte);
      return false;
    }
    
    if (!mercancias.items || !Array.isArray(mercancias.items) || mercancias.items.length === 0) {
      console.warn('FA02 CU-04: No hay items de mercancía');
      console.warn('🔍 Mercancías:', mercancias);
      return false;
    }
    
    if (!valores.valorAduanaTotal || !valores.moneda) {
      console.warn('FA02 CU-04: Valores incompletos');
      console.warn('🔍 Valores:', valores);
      return false;
    }
    
    console.log('✅ Validación de estructura completada exitosamente');
    return true;
  };

  // ✅ FLUJO NORMAL CU-04 - PASO 5: VERIFICA INFORMACIÓN Y APRUEBA/RECHAZA
  const handleValidarDeclaracion = async (accion) => {
    if (accion === 'rechazar' && !motivoRechazo.trim()) {
      showAlert('warning', '⚠️ Motivo Requerido', 'FA02 CU-04: Debe proporcionar un motivo para el rechazo', '#d97706');
      return;
    }

    try {
      setLoading(true);
      
      console.log(`⚡ CU-04 Paso 5: ${accion.toUpperCase()} declaración ${selectedDeclaracion.numero_documento || selectedDeclaracion.numeroDocumento}`);
      
      await declarationService.validarDeclaracion(selectedDeclaracion.id, {
        accion,
        motivoRechazo: accion === 'rechazar' ? motivoRechazo : undefined
      });
      
      // ✅ POSTCONDICIONES CU-04
      console.log(`✅ CU-04 Postcondición: Declaración ${selectedDeclaracion.numero_documento || selectedDeclaracion.numeroDocumento} → ${accion === 'aprobar' ? 'VALIDADA' : 'RECHAZADA'}`);
      console.log('✅ CU-04 Postcondición: Registro en bitácora del sistema');
      
      await showAlert('success', '✅ Éxito', `Declaración ${accion === 'aprobar' ? 'validada' : 'rechazada'} correctamente`, '#059669');
      
      // ✅ LIMPIAR Y RECARGAR LISTA ACTUALIZADA
      setSelectedDeclaracion(null);
      setMotivoRechazo('');
      await cargarDeclaracionesPendientesCU04();
      
    } catch (error) {
      console.error('❌ FA01 CU-04: Error en validación:', error);
      showAlert('error', '❌ Error', 'Error al procesar la validación: ' + (error.response?.data?.error || error.message), '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FORMATEADORES PARA DATOS CU-03
  const formatCurrency = (valor, moneda) => {
    if (!valor) return 'N/A';
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: moneda || 'USD'
    }).format(valor);
  };

  const formatDate = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-GT');
  };

  // ✅ MANEJAR RECARGA MANUAL
  const handleRecargar = () => {
    window.location.reload();
  };

  return (
    <div className="validacion-page-wrapper">
      {/* Fondo borroso COMPLETAMENTE AISLADO */}
      <div className="validacion-background">
        <div className="background-blur"></div>
      </div>
      
      {/* Container principal SOBRE el fondo borroso */}
      <div className="validacion-container">
        <div className="validacion-header">
          <h2>🚛 CU-004 - Validación de Declaraciones Aduaneras</h2>
          <p><strong>Agente Aduanero:</strong> <strong>INFORMACION SENCIBLE</strong> </p>
          
          {/* ✅ DEBUG VISIBLE MEJORADO */}
          <div className="debug-info">
            <strong>✅ SESIÓN ACTIVA - AGENTE ADUANERO</strong>
            <br />
            <strong>Token:</strong> {localStorage.getItem('siglad_token') ? '✅ Disponible' : '❌ No disponible'}
            <br />
            <strong>Usuario:</strong> {localStorage.getItem('user') ? '✅ Disponible' : '❌ No disponible'}
            <br />
            <strong>Declaraciones cargadas:</strong> {declaraciones.length}
            <br />
            <strong>Estado requerido:</strong> CONFIRMADO
          </div>
          
          {!tokenDisponible && !errorCarga && (
            <div className="loading-message">
              <div className="loading">⏳ Verificando permisos de Agente Aduanero...</div>
            </div>
          )}
          
          {tokenDisponible && estadisticas && (
            <div className="estadisticas-grid">
              <div className="estadistica-card total">
                <h3>Total</h3>
                <span>{estadisticas.total}</span>
              </div>
              <div className="estadistica-card pendientes">
                <h3>Pendientes</h3>
                <span>{estadisticas.pendientes}</span>
              </div>
              <div className="estadistica-card validadas">
                <h3>Validadas</h3>
                <span>{estadisticas.validadas}</span>
              </div>
              <div className="estadistica-card rechazadas">
                <h3>Rechazadas</h3>
                <span>{estadisticas.rechazadas}</span>
              </div>
            </div>
          )}
        </div>

        {errorCarga && (
          <div className="error-message">
            <h4>❌ Error de Autenticación</h4>
            <p>{errorCarga}</p>
            <div className="error-actions">
              <button 
                onClick={handleRecargar}
                className="btn-reintentar"
              >
                🔄 Reintentar
              </button>
              <button 
                onClick={() => window.location.href = '/login'}
                className="btn-login"
              >
                🚪 Ir al Login
              </button>
            </div>
          </div>
        )}

        {tokenDisponible && (
          <div className="validacion-content">
            {/* FLUJO NORMAL CU-04 - PASO 3: LISTA DE PENDIENTES */}
            <div className="declaraciones-section">
              <h3>📋 Declaraciones CONFIRMADAS para Validación ({declaraciones.length})</h3>
              <p><em>Declaraciones registradas por transportistas (CU-003) pendientes de validación</em></p>
              
              {loading && <div className="loading">🔄 Cargando declaraciones CU-03...</div>}
              
              {!loading && declaraciones.length === 0 && (
                <div className="empty-state">
                  🎉 No hay declaraciones CONFIRMADAS pendientes de validación
                </div>
              )}

              <div className="declaraciones-grid">
                {declaraciones.map((declaracion, index) => (
                  <div key={declaracion.id} className="declaracion-card">
                    <div className="declaracion-header">
                      <h4>DUCA: {declaracion.numero_documento || declaracion.numeroDocumento}</h4>
                      <span className="estado-badge confirmado">CONFIRMADO</span>
                    </div>
                    
                    <div className="declaracion-info">
                      <div className="info-row">
                        <span className="label">Exportador:</span>
                        <span>{declaracion.nombre_exportador || declaracion.exportador?.nombreExportador}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Importador:</span>
                        <span>{declaracion.nombre_importador || declaracion.importador?.nombreImportador}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Operación:</span>
                        <span>{declaracion.tipo_operacion || declaracion.tipoOperacion}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Medio:</span>
                        <span>{declaracion.medio_transporte || declaracion.transporte?.medioTransporte}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Valor Aduana:</span>
                        <span className="valor">
                          {formatCurrency(
                            declaracion.valor_aduana_total || declaracion.valores?.valorAduanaTotal, 
                            declaracion.moneda || declaracion.valores?.moneda
                          )}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Items:</span>
                        <span>{declaracion.mercancias?.items?.length || 0} productos</span>
                      </div>
                    </div>

                    <div className="declaracion-actions">
                      <button 
                        className="btn-ver-detalle"
                        onClick={() => cargarDetalleDeclaracion(declaracion.id)}
                        disabled={loading}
                      >
                        👁️ Ver Detalle Completo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FLUJO NORMAL CU-04 - PASO 4-5: DETALLE Y VALIDACIÓN */}
            {selectedDeclaracion && (
              <div className="detalle-section">
                <h3>🔍 Validación CU-004: {selectedDeclaracion.numero_documento || selectedDeclaracion.numeroDocumento}</h3>
                
                <div className="detalle-grid">
                  {/* INFORMACIÓN BÁSICA SEGÚN ANEXO II CU-03 */}
                  <div className="detalle-card">
                    <h4>📄 Información Básica DUCA</h4>
                    <div className="info-grid">
                      <div><strong>Número DUCA:</strong> {selectedDeclaracion.numero_documento || selectedDeclaracion.numeroDocumento}</div>
                      <div><strong>Fecha Emisión:</strong> {formatDate(selectedDeclaracion.fecha_emision || selectedDeclaracion.fechaEmision)}</div>
                      <div><strong>País Emisor:</strong> {selectedDeclaracion.pais_emisor || selectedDeclaracion.paisEmisor}</div>
                      <div><strong>Tipo Operación:</strong> {selectedDeclaracion.tipo_operacion || selectedDeclaracion.tipoOperacion}</div>
                      <div><strong>Estado:</strong> 
                        <span className="estado-badge confirmado">{selectedDeclaracion.estado_documento || selectedDeclaracion.estadoDocumento}</span>
                      </div>
                      <div><strong>Firma Electrónica:</strong> 
                        <code>{selectedDeclaracion.firma_electronica || selectedDeclaracion.firmaElectronica?.substring(0, 16)}...</code>
                      </div>
                    </div>
                  </div>

                  {/* EXPORTADOR */}
                  <div className="detalle-card">
                    <h4>📤 Exportador</h4>
                    <div className="info-grid">
                      <div><strong>Nombre:</strong> {selectedDeclaracion.exportador?.nombreExportador}</div>
                      <div><strong>ID:</strong> {selectedDeclaracion.exportador?.idExportador}</div>
                      <div><strong>Dirección:</strong> {selectedDeclaracion.exportador?.direccionExportador}</div>
                      <div><strong>Contacto:</strong> {selectedDeclaracion.exportador?.contactoExportador?.email}</div>
                    </div>
                  </div>

                  {/* IMPORTADOR */}
                  <div className="detalle-card">
                    <h4>📥 Importador</h4>
                    <div className="info-grid">
                      <div><strong>Nombre:</strong> {selectedDeclaracion.importador?.nombreImportador}</div>
                      <div><strong>ID:</strong> {selectedDeclaracion.importador?.idImportador}</div>
                      <div><strong>Dirección:</strong> {selectedDeclaracion.importador?.direccionImportador}</div>
                      <div><strong>Contacto:</strong> {selectedDeclaracion.importador?.contactoImportador?.email}</div>
                    </div>
                  </div>

                  {/* TRANSPORTE */}
                  <div className="detalle-card">
                    <h4>🚚 Transporte</h4>
                    <div className="info-grid">
                      <div><strong>Medio:</strong> {selectedDeclaracion.transporte?.medioTransporte}</div>
                      <div><strong>Placa:</strong> {selectedDeclaracion.transporte?.placaVehiculo}</div>
                      <div><strong>Conductor:</strong> {selectedDeclaracion.transporte?.conductor?.nombreConductor}</div>
                      <div><strong>Ruta:</strong> {selectedDeclaracion.transporte?.ruta?.aduanaSalida} → {selectedDeclaracion.transporte?.ruta?.aduanaEntrada}</div>
                      <div><strong>Destino:</strong> {selectedDeclaracion.transporte?.ruta?.paisDestino}</div>
                    </div>
                  </div>

                  {/* VALORES */}
                  <div className="detalle-card">
                    <h4>💰 Valores Declarados</h4>
                    <div className="info-grid">
                      <div><strong>Valor Factura:</strong> {formatCurrency(selectedDeclaracion.valores?.valorFactura, selectedDeclaracion.valores?.moneda)}</div>
                      <div><strong>Gastos Transporte:</strong> {formatCurrency(selectedDeclaracion.valores?.gastosTransporte, selectedDeclaracion.valores?.moneda)}</div>
                      <div><strong>Seguro:</strong> {formatCurrency(selectedDeclaracion.valores?.seguro, selectedDeclaracion.valores?.moneda)}</div>
                      <div><strong>Valor Aduana Total:</strong> 
                        <strong className="valor-destacado">
                          {formatCurrency(selectedDeclaracion.valores?.valorAduanaTotal, selectedDeclaracion.valores?.moneda)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* MERCANCÍAS */}
                  <div className="detalle-card full-width">
                    <h4>📦 Mercancías ({selectedDeclaracion.mercancias?.items?.length || 0} items)</h4>
                    <div className="items-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Línea</th>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Valor Unitario</th>
                            <th>País Origen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDeclaracion.mercancias?.items?.map(item => (
                            <tr key={item.linea}>
                              <td>{item.linea}</td>
                              <td>{item.descripcion}</td>
                              <td>{item.cantidad}</td>
                              <td>{item.unidadMedida}</td>
                              <td>{formatCurrency(item.valorUnitario, selectedDeclaracion.valores?.moneda)}</td>
                              <td>{item.paisOrigen}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* FLUJO NORMAL CU-04 - PASO 5: ACCIONES DE VALIDACIÓN */}
                <div className="acciones-validacion">
                  <h4>⚡ Acciones de Validación - CU-004 Paso 5</h4>
                  
                  <div className="acciones-buttons">
                    <button 
                      className="btn-aprobar"
                      onClick={() => handleValidarDeclaracion('aprobar')}
                      disabled={loading}
                    >
                      ✅ Aprobar Declaración
                    </button>
                    
                    <div className="rechazo-section">
                      <textarea
                        placeholder="📝 Motivo de rechazo (obligatorio según FA02 CU-004)"
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        rows="3"
                        disabled={loading}
                      />
                      <button 
                        className="btn-rechazar"
                        disabled={!motivoRechazo.trim() || loading}
                        onClick={() => handleValidarDeclaracion('rechazar')}
                      >
                        ❌ Rechazar Declaración
                      </button>
                    </div>
                  </div>

                  <button 
                    className="btn-cerrar"
                    onClick={() => {
                      setSelectedDeclaracion(null);
                      setMotivoRechazo('');
                    }}
                    disabled={loading}
                  >
                    ✖️ Cerrar Detalle
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidacionDeclaraciones;