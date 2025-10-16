import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService.js';
import Swal from 'sweetalert2'; // ✅ IMPORTAR SWEETALERT2

const API_URL = 'http://localhost:3000/api';

export function DeclaracionManagement() {
  const [declaraciones, setDeclaraciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDeclaracion, setSelectedDeclaracion] = useState(null);
  const [showDetalles, setShowDetalles] = useState(false);
  const [form, setForm] = useState({
    duca: {
      numeroDocumento: '',
      fechaEmision: new Date().toISOString().split('T')[0],
      paisEmisor: 'GT',
      tipoOperacion: 'IMPORTACION',
      exportador: {
        idExportador: '',
        nombreExportador: '',
        direccionExportador: '',
        contactoExportador: {
          telefono: '',
          email: ''
        }
      },
      importador: {
        idImportador: '',
        nombreImportador: '',
        direccionImportador: '',
        contactoImportador: {
          telefono: '',
          email: ''
        }
      },
      transporte: {
        medioTransporte: 'TERRESTRE',
        placaVehiculo: '',
        conductor: {
          nombreConductor: '',
          licenciaConductor: '',
          paisLicencia: 'GT'
        },
        ruta: {
          aduanaSalida: '',
          aduanaEntrada: '',
          paisDestino: 'SV',
          kilometrosAproximados: 0
        }
      },
      mercancias: {
        numeroItems: 1,
        items: [
          {
            linea: 1,
            descripcion: '',
            cantidad: 0,
            unidadMedida: 'CAJA',
            valorUnitario: 0,
            paisOrigen: 'GT'
          }
        ]
      },
      valores: {
        valorFactura: 0,
        gastosTransporte: 0,
        seguro: 0,
        otrosGastos: 0,
        valorAduanaTotal: 0,
        moneda: 'USD'
      },
      resultadoSelectivo: {
        codigo: 'R',
        descripcion: 'Revisión documental'
      },
      estadoDocumento: 'CONFIRMADO',
      firmaElectronica: 'AB12CD34EF56GH78'
    }
  });

  useEffect(() => {
    loadDeclaraciones();
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

  const loadDeclaraciones = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/declaraciones`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error cargando declaraciones');
      }

      const data = await response.json();
      setDeclaraciones(data.declaraciones);
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'No se pudieron cargar las declaraciones: ' + error.message, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NUEVA FUNCIÓN: Ver detalles de declaración
  const verDetalles = async (id) => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/declaraciones/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error cargando detalles');
      }

      const data = await response.json();
      setSelectedDeclaracion(data.declaracion);
      setShowDetalles(true);
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'No se pudieron cargar los detalles: ' + error.message, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = authService.getToken();
      
      // Calcular valor total automáticamente
      const valorAduanaTotal = calculateValorAduanaTotal();
      const formData = {
        ...form.duca,
        valores: {
          ...form.duca.valores,
          valorAduanaTotal: valorAduanaTotal
        }
      };

      const response = await fetch(`${API_URL}/declaraciones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      await showAlert('success', '✅ Éxito', data.message || 'Declaración registrada correctamente', '#059669');
      resetForm();
      loadDeclaraciones();
    } catch (error) {
      console.error('Error:', error);
      showAlert('error', '❌ Error', 'Error al procesar la solicitud: ' + error.message, '#dc2626');
    } finally {
      setLoading(false);
    }
  };

  const calculateValorAduanaTotal = () => {
    const { valorFactura, gastosTransporte, seguro, otrosGastos } = form.duca.valores;
    return (parseFloat(valorFactura) || 0) + 
           (parseFloat(gastosTransporte) || 0) + 
           (parseFloat(seguro) || 0) + 
           (parseFloat(otrosGastos) || 0);
  };

  const resetForm = () => {
    setForm({
      duca: {
        numeroDocumento: '',
        fechaEmision: new Date().toISOString().split('T')[0],
        paisEmisor: 'GT',
        tipoOperacion: 'IMPORTACION',
        exportador: {
          idExportador: '',
          nombreExportador: '',
          direccionExportador: '',
          contactoExportador: {
            telefono: '',
            email: ''
          }
        },
        importador: {
          idImportador: '',
          nombreImportador: '',
          direccionImportador: '',
          contactoImportador: {
            telefono: '',
            email: ''
          }
        },
        transporte: {
          medioTransporte: 'TERRESTRE',
          placaVehiculo: '',
          conductor: {
            nombreConductor: '',
            licenciaConductor: '',
            paisLicencia: 'GT'
          },
          ruta: {
            aduanaSalida: '',
            aduanaEntrada: '',
            paisDestino: 'SV',
            kilometrosAproximados: 0
          }
        },
        mercancias: {
          numeroItems: 1,
          items: [
            {
              linea: 1,
              descripcion: '',
              cantidad: 0,
              unidadMedida: 'CAJA',
              valorUnitario: 0,
              paisOrigen: 'GT'
            }
          ]
        },
        valores: {
          valorFactura: 0,
          gastosTransporte: 0,
          seguro: 0,
          otrosGastos: 0,
          valorAduanaTotal: 0,
          moneda: 'USD'
        },
        resultadoSelectivo: {
          codigo: 'R',
          descripcion: 'Revisión documental'
        },
        estadoDocumento: 'CONFIRMADO',
        firmaElectronica: 'AB12CD34EF56GH78'
      }
    });
    setShowForm(false);
  };

  const addItemMercancia = () => {
    const newItems = [...form.duca.mercancias.items];
    const newLinea = newItems.length + 1;
    newItems.push({
      linea: newLinea,
      descripcion: '',
      cantidad: 0,
      unidadMedida: 'CAJA',
      valorUnitario: 0,
      paisOrigen: 'GT'
    });
    
    setForm({
      duca: {
        ...form.duca,
        mercancias: {
          ...form.duca.mercancias,
          numeroItems: newLinea,
          items: newItems
        }
      }
    });
  };

  const removeItemMercancia = (index) => {
    if (form.duca.mercancias.items.length <= 1) return;
    
    const newItems = form.duca.mercancias.items.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, linea: i + 1 }));
    
    setForm({
      duca: {
        ...form.duca,
        mercancias: {
          ...form.duca.mercancias,
          numeroItems: newItems.length,
          items: newItems
        }
      }
    });
  };

  const updateItemMercancia = (index, field, value) => {
    const newItems = [...form.duca.mercancias.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    setForm({
      duca: {
        ...form.duca,
        mercancias: {
          ...form.duca.mercancias,
          items: newItems
        }
      }
    });
  };

  // 🔥 NUEVO COMPONENTE: Vista de detalles
  const DetallesDeclaracion = ({ declaracion, onClose }) => {
    if (!declaracion) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content large-modal">
          <div className="modal-header">
            <h3>📋 Detalles de Declaración - {declaracion.numero_documento}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="detalles-content">
            {/* Información General */}
            <div className="detalles-section">
              <h4>📄 Información General</h4>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>Número DUCA:</label>
                  <span>{declaracion.numero_documento}</span>
                </div>
                <div className="detalle-item">
                  <label>Fecha Emisión:</label>
                  <span>{new Date(declaracion.fecha_emision).toLocaleDateString('es-MX')}</span>
                </div>
                <div className="detalle-item">
                  <label>País Emisor:</label>
                  <span>{declaracion.pais_emisor}</span>
                </div>
                <div className="detalle-item">
                  <label>Tipo Operación:</label>
                  <span className={`tipo-operacion ${declaracion.tipo_operacion.toLowerCase()}`}>
                    {declaracion.tipo_operacion}
                  </span>
                </div>
                <div className="detalle-item">
                  <label>Estado:</label>
                  <span className={`status ${declaracion.estado.toLowerCase()}`}>
                    {declaracion.estado}
                  </span>
                </div>
                <div className="detalle-item">
                  <label>Fecha Registro:</label>
                  <span>{new Date(declaracion.created_at).toLocaleDateString('es-MX')}</span>
                </div>
              </div>
            </div>

            {/* Exportador */}
            <div className="detalles-section">
              <h4>🏢 Exportador</h4>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>ID:</label>
                  <span>{declaracion.exportador.idExportador}</span>
                </div>
                <div className="detalle-item">
                  <label>Nombre:</label>
                  <span>{declaracion.exportador.nombreExportador}</span>
                </div>
                <div className="detalle-item full-width">
                  <label>Dirección:</label>
                  <span>{declaracion.exportador.direccionExportador || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Importador */}
            <div className="detalles-section">
              <h4>🏢 Importador</h4>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>ID:</label>
                  <span>{declaracion.importador.idImportador}</span>
                </div>
                <div className="detalle-item">
                  <label>Nombre:</label>
                  <span>{declaracion.importador.nombreImportador}</span>
                </div>
                <div className="detalle-item full-width">
                  <label>Dirección:</label>
                  <span>{declaracion.importador.direccionImportador || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Transporte */}
            <div className="detalles-section">
              <h4>🚛 Transporte</h4>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>Medio:</label>
                  <span>{declaracion.transporte.medioTransporte}</span>
                </div>
                <div className="detalle-item">
                  <label>Placa:</label>
                  <span>{declaracion.transporte.placaVehiculo}</span>
                </div>
                <div className="detalle-item">
                  <label>Conductor:</label>
                  <span>{declaracion.transporte.conductor?.nombreConductor || 'N/A'}</span>
                </div>
                <div className="detalle-item full-width">
                  <label>Ruta:</label>
                  <span>{declaracion.transporte.ruta.aduanaSalida} → {declaracion.transporte.ruta.aduanaEntrada}</span>
                </div>
                <div className="detalle-item">
                  <label>País Destino:</label>
                  <span>{declaracion.transporte.ruta.paisDestino}</span>
                </div>
                <div className="detalle-item">
                  <label>Kilómetros:</label>
                  <span>{declaracion.transporte.ruta.kilometrosAproximados || 0} km</span>
                </div>
              </div>
            </div>

            {/* Mercancías */}
            <div className="detalles-section">
              <h4>📦 Mercancías ({declaracion.mercancias.numeroItems} items)</h4>
              <div className="mercancias-table">
                <table>
                  <thead>
                    <tr>
                      <th>Línea</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Unidad</th>
                      <th>Valor Unit.</th>
                      <th>Valor Total</th>
                      <th>País Origen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declaracion.mercancias.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.linea}</td>
                        <td>{item.descripcion}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.unidadMedida}</td>
                        <td>${item.valorUnitario?.toFixed(2)}</td>
                        <td>${((item.cantidad || 0) * (item.valorUnitario || 0))?.toFixed(2)}</td>
                        <td>{item.paisOrigen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Valores */}
            <div className="detalles-section">
              <h4>💰 Valores</h4>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>Valor Factura:</label>
                  <span>${declaracion.valores.valorFactura?.toFixed(2)}</span>
                </div>
                <div className="detalle-item">
                  <label>Gastos Transporte:</label>
                  <span>${declaracion.valores.gastosTransporte?.toFixed(2)}</span>
                </div>
                <div className="detalle-item">
                  <label>Seguro:</label>
                  <span>${declaracion.valores.seguro?.toFixed(2)}</span>
                </div>
                <div className="detalle-item">
                  <label>Otros Gastos:</label>
                  <span>${declaracion.valores.otrosGastos?.toFixed(2)}</span>
                </div>
                <div className="detalle-item full-width">
                  <label>Valor Aduana Total:</label>
                  <span className="valor-total">${declaracion.valores.valorAduanaTotal?.toFixed(2)}</span>
                </div>
                <div className="detalle-item">
                  <label>Moneda:</label>
                  <span>{declaracion.valores.moneda}</span>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="detalles-section">
              <h4>📋 Información Adicional</h4>
              <div className="detalles-grid">
                <div className="detalle-item">
                  <label>Estado Documento:</label>
                  <span>{declaracion.estado_documento}</span>
                </div>
                <div className="detalle-item">
                  <label>Resultado Selectivo:</label>
                  <span>{declaracion.resultadoSelectivo?.descripcion || 'N/A'}</span>
                </div>
                <div className="detalle-item full-width">
                  <label>Firma Electrónica:</label>
                  <span className="firma-electronica">{declaracion.firma_electronica}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detalles-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="declaracion-management">
      <div className="declaracion-header">
        <h2>📋 Gestión de Declaraciones Aduaneras</h2>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            + Nueva Declaración
          </button>
          <button 
            className="btn btn-secondary"
            onClick={loadDeclaraciones}
            disabled={loading}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>📝 Nueva Declaración Aduanera (DUCA)</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="declaracion-form">
              {/* Sección: Información General */}
              <div className="form-section">
                <h4>📄 Información General del DUCA</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Número de Documento *</label>
                    <input
                      type="text"
                      value={form.duca.numeroDocumento}
                      onChange={(e) => setForm({
                        duca: { ...form.duca, numeroDocumento: e.target.value }
                      })}
                      required
                      placeholder="GT2025DUCA001234"
                      maxLength="20"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha Emisión *</label>
                    <input
                      type="date"
                      value={form.duca.fechaEmision}
                      onChange={(e) => setForm({
                        duca: { ...form.duca, fechaEmision: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>País Emisor *</label>
                    <select
                      value={form.duca.paisEmisor}
                      onChange={(e) => setForm({
                        duca: { ...form.duca, paisEmisor: e.target.value }
                      })}
                      required
                    >
                      <option value="GT">Guatemala</option>
                      <option value="SV">El Salvador</option>
                      <option value="HN">Honduras</option>
                      <option value="NI">Nicaragua</option>
                      <option value="CR">Costa Rica</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tipo Operación *</label>
                    <select
                      value={form.duca.tipoOperacion}
                      onChange={(e) => setForm({
                        duca: { ...form.duca, tipoOperacion: e.target.value }
                      })}
                      required
                    >
                      <option value="IMPORTACION">Importación</option>
                      <option value="EXPORTACION">Exportación</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección: Exportador */}
              <div className="form-section">
                <h4>🏢 Información del Exportador</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>ID Exportador *</label>
                    <input
                      type="text"
                      value={form.duca.exportador.idExportador}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          exportador: { 
                            ...form.duca.exportador, 
                            idExportador: e.target.value 
                          } 
                        }
                      })}
                      required
                      maxLength="15"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre Exportador *</label>
                    <input
                      type="text"
                      value={form.duca.exportador.nombreExportador}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          exportador: { 
                            ...form.duca.exportador, 
                            nombreExportador: e.target.value 
                          } 
                        }
                      })}
                      required
                      maxLength="100"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Dirección Exportador</label>
                  <input
                    type="text"
                    value={form.duca.exportador.direccionExportador}
                    onChange={(e) => setForm({
                      duca: { 
                        ...form.duca, 
                        exportador: { 
                          ...form.duca.exportador, 
                          direccionExportador: e.target.value 
                        } 
                      }
                    })}
                    maxLength="120"
                  />
                </div>
              </div>

              {/* Sección: Importador */}
              <div className="form-section">
                <h4>🏢 Información del Importador</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>ID Importador *</label>
                    <input
                      type="text"
                      value={form.duca.importador.idImportador}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          importador: { 
                            ...form.duca.importador, 
                            idImportador: e.target.value 
                          } 
                        }
                      })}
                      required
                      maxLength="15"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre Importador *</label>
                    <input
                      type="text"
                      value={form.duca.importador.nombreImportador}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          importador: { 
                            ...form.duca.importador, 
                            nombreImportador: e.target.value 
                          } 
                        }
                      })}
                      required
                      maxLength="100"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Transporte */}
              <div className="form-section">
                <h4>🚛 Información del Transporte</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Medio Transporte *</label>
                    <select
                      value={form.duca.transporte.medioTransporte}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          transporte: { 
                            ...form.duca.transporte, 
                            medioTransporte: e.target.value 
                          } 
                        }
                      })}
                      required
                    >
                      <option value="TERRESTRE">Terrestre</option>
                      <option value="MARITIMO">Marítimo</option>
                      <option value="AEREO">Aéreo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Placa Vehículo *</label>
                    <input
                      type="text"
                      value={form.duca.transporte.placaVehiculo}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          transporte: { 
                            ...form.duca.transporte, 
                            placaVehiculo: e.target.value 
                          } 
                        }
                      })}
                      required
                      maxLength="10"
                    />
                  </div>
                </div>
                
                <h5>📋 Ruta del Transporte</h5>
                <div className="form-row">
                  <div className="form-group">
                    <label>Aduana Salida *</label>
                    <input
                      type="text"
                      value={form.duca.transporte.ruta.aduanaSalida}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          transporte: { 
                            ...form.duca.transporte, 
                            ruta: { 
                              ...form.duca.transporte.ruta, 
                              aduanaSalida: e.target.value 
                            } 
                          } 
                        }
                      })}
                      required
                      maxLength="50"
                    />
                  </div>
                  <div className="form-group">
                    <label>Aduana Entrada *</label>
                    <input
                      type="text"
                      value={form.duca.transporte.ruta.aduanaEntrada}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          transporte: { 
                            ...form.duca.transporte, 
                            ruta: { 
                              ...form.duca.transporte.ruta, 
                              aduanaEntrada: e.target.value 
                            } 
                          } 
                        }
                      })}
                      required
                      maxLength="50"
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Mercancías */}
              <div className="form-section">
                <h4>📦 Mercancías ({form.duca.mercancias.numeroItems} items)</h4>
                {form.duca.mercancias.items.map((item, index) => (
                  <div key={index} className="item-mercancia">
                    <div className="item-header">
                      <h5>Item #{item.linea}</h5>
                      {form.duca.mercancias.items.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-remove-item"
                          onClick={() => removeItemMercancia(index)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Descripción *</label>
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => updateItemMercancia(index, 'descripcion', e.target.value)}
                          required
                          maxLength="120"
                        />
                      </div>
                      <div className="form-group">
                        <label>Cantidad *</label>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => updateItemMercancia(index, 'cantidad', parseInt(e.target.value) || 0)}
                          required
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Unidad Medida *</label>
                        <select
                          value={item.unidadMedida}
                          onChange={(e) => updateItemMercancia(index, 'unidadMedida', e.target.value)}
                          required
                        >
                          <option value="CAJA">Caja</option>
                          <option value="ROLLO">Rollo</option>
                          <option value="KILO">Kilo</option>
                          <option value="LITRO">Litro</option>
                          <option value="UNIDAD">Unidad</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Valor Unitario (USD) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => updateItemMercancia(index, 'valorUnitario', parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={addItemMercancia}
                >
                  + Agregar Item
                </button>
              </div>

              {/* Sección: Valores */}
              <div className="form-section">
                <h4>💰 Valores de la Declaración</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Valor Factura (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.duca.valores.valorFactura}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          valores: { 
                            ...form.duca.valores, 
                            valorFactura: parseFloat(e.target.value) || 0 
                          } 
                        }
                      })}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gastos Transporte (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.duca.valores.gastosTransporte}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          valores: { 
                            ...form.duca.valores, 
                            gastosTransporte: parseFloat(e.target.value) || 0 
                          } 
                        }
                      })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Seguro (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.duca.valores.seguro}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          valores: { 
                            ...form.duca.valores, 
                            seguro: parseFloat(e.target.value) || 0 
                          } 
                        }
                      })}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Otros Gastos (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.duca.valores.otrosGastos}
                      onChange={(e) => setForm({
                        duca: { 
                          ...form.duca, 
                          valores: { 
                            ...form.duca.valores, 
                            otrosGastos: parseFloat(e.target.value) || 0 
                          } 
                        }
                      })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Valor Aduana Total (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={calculateValorAduanaTotal()}
                    disabled
                    className="disabled-input"
                  />
                  <small>Calculado automáticamente</small>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? '⏳ Registrando...' : '✅ Registrar Declaración'}
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

      {/* 🔥 NUEVO: Modal de detalles */}
      {showDetalles && (
        <DetallesDeclaracion 
          declaracion={selectedDeclaracion}
          onClose={() => {
            setShowDetalles(false);
            setSelectedDeclaracion(null);
          }}
        />
      )}

      {/* Tabla de declaraciones */}
      <div className="declaraciones-table-container">
        {loading ? (
          <div className="loading">⏳ Cargando declaraciones...</div>
        ) : declaraciones.length === 0 ? (
          <div className="no-declaraciones">
            <p>No hay declaraciones registradas</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Crear Primera Declaración
            </button>
          </div>
        ) : (
          <table className="declaraciones-table">
            <thead>
              <tr>
                <th>N° DUCA</th>
                <th>Fecha Emisión</th>
                <th>Tipo Operación</th>
                <th>Estado Documento</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {declaraciones.map(declaracion => (
                <tr key={declaracion.id}>
                  <td>
                    <strong>{declaracion.numero_documento}</strong>
                  </td>
                  <td>{new Date(declaracion.fecha_emision).toLocaleDateString('es-MX')}</td>
                  <td>
                    <span className={`tipo-operacion ${declaracion.tipo_operacion.toLowerCase()}`}>
                      {declaracion.tipo_operacion}
                    </span>
                  </td>
                  <td>
                    <span className="estado-documento">
                      {declaracion.estado_documento}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${declaracion.estado.toLowerCase()}`}>
                      {declaracion.estado}
                    </span>
                  </td>
                  <td>
                    {new Date(declaracion.created_at).toLocaleDateString('es-MX')}
                  </td>
                  <td className="actions">
                    <button 
                      className="btn-action btn-view"
                      title="Ver detalles"
                      onClick={() => verDetalles(declaracion.id)}
                    >
                      👁️
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