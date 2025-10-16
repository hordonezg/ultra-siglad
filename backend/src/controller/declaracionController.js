import { Declaracion } from '../models/Declaracion.js';
import { pool } from '../config/database.js';

// Validar formato DUCA según Anexo II
const validarFormatoDUCA = (ducaData) => {
  const errors = [];

  // Validaciones básicas según Anexo III
  if (!ducaData.numeroDocumento || ducaData.numeroDocumento.length > 20) {
    errors.push('Número de documento inválido o excede 20 caracteres');
  }

  if (!ducaData.fechaEmision || !/^\d{4}-\d{2}-\d{2}$/.test(ducaData.fechaEmision)) {
    errors.push('Fecha de emisión inválida (formato YYYY-MM-DD)');
  }

  if (!ducaData.paisEmisor || ducaData.paisEmisor.length !== 2) {
    errors.push('País emisor inválido (debe ser código de 2 caracteres)');
  }

  if (!['IMPORTACION', 'EXPORTACION'].includes(ducaData.tipoOperacion)) {
    errors.push('Tipo de operación inválido (solo IMPORTACION/EXPORTACION)');
  }

  // Validar exportador
  if (!ducaData.exportador?.idExportador || ducaData.exportador.idExportador.length > 15) {
    errors.push('ID exportador inválido o excede 15 caracteres');
  }

  // Validar importador
  if (!ducaData.importador?.idImportador || ducaData.importador.idImportador.length > 15) {
    errors.push('ID importador inválido o excede 15 caracteres');
  }

  // Validar transporte
  if (!['TERRESTRE', 'MARITIMO', 'AEREO'].includes(ducaData.transporte?.medioTransporte)) {
    errors.push('Medio de transporte inválido');
  }

  // Validar mercancías
  if (!ducaData.mercancias?.items || !Array.isArray(ducaData.mercancias.items)) {
    errors.push('Items de mercancías inválidos');
  }

  // Validar valores
  if (!ducaData.valores?.valorAduanaTotal || !ducaData.valores?.moneda) {
    errors.push('Valores aduaneros incompletos');
  }

  return errors;
};

// ==============================================
// ✅ MÉTODOS EXISTENTES DEL CU-03 (TRANSPORTISTA)
// ==============================================

export const crearDeclaracion = async (req, res) => {
  const ducaData = req.body;
  const ip = req.ip || '127.0.0.1';
  const usuarioId = req.user.userId;

  try {
    console.log(`📝 Intentando crear declaración DUCA: ${ducaData.numeroDocumento}`);

    // [FA01] Validar datos completos
    if (!ducaData || Object.keys(ducaData).length === 0) {
      await registrarBitacora(usuarioId, ip, 'crear_declaracion', 'fallo_datos_incompletos', ducaData.numeroDocumento);
      return res.status(400).json({ error: 'Verifique los campos obligatorios' });
    }

    // Validar formato DUCA según Anexo II
    const erroresValidacion = validarFormatoDUCA(ducaData);
    if (erroresValidacion.length > 0) {
      await registrarBitacora(usuarioId, ip, 'crear_declaracion', 'fallo_validacion', ducaData.numeroDocumento);
      return res.status(400).json({ 
        error: 'Errores de validación', 
        detalles: erroresValidacion 
      });
    }

    // [FA02] Validar que el importador esté activo (simulado)
    const importadorActivo = await validarImportadorActivo(ducaData.importador.idImportador);
    if (!importadorActivo) {
      await registrarBitacora(usuarioId, ip, 'crear_declaracion', 'fallo_importador_inactivo', ducaData.numeroDocumento);
      return res.status(400).json({ error: 'Importador no activo' });
    }

    // Crear declaración
    const declaracion = await Declaracion.create({
      ...ducaData,
      usuarioId: usuarioId
    });

    // Registrar éxito en bitácora
    await registrarBitacora(usuarioId, ip, 'crear_declaracion', 'exito', ducaData.numeroDocumento);

    console.log(`✅ Declaración creada: ${declaracion.numero_documento}`);

    res.status(201).json({
      success: true,
      message: 'Declaración registrada correctamente',
      declaracion: {
        id: declaracion.id,
        numeroDocumento: declaracion.numero_documento,
        estado: declaracion.estado,
        fechaEmision: declaracion.fecha_emision
      }
    });

  } catch (error) {
    console.error('❌ Error creando declaración:', error);

    if (error.message === 'DUCA ya registrado') {
      await registrarBitacora(req.user.userId, ip, 'crear_declaracion', 'fallo_duca_duplicado', ducaData.numeroDocumento);
      return res.status(400).json({ error: 'DUCA ya registrado' });
    }

    await registrarBitacora(req.user.userId, ip, 'crear_declaracion', 'fallo_error_interno', ducaData.numeroDocumento);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listarDeclaraciones = async (req, res) => {
  try {
    const declaraciones = await Declaracion.findByUser(req.user.userId);
    
    res.json({
      success: true,
      declaraciones: declaraciones
    });
  } catch (error) {
    console.error('Error listando declaraciones:', error);
    res.status(500).json({ error: 'Error obteniendo declaraciones' });
  }
};

export const obtenerDeclaracion = async (req, res) => {
  const { id } = req.params;

  try {
    const declaracion = await Declaracion.findById(id, req.user.userId);
    
    if (!declaracion) {
      return res.status(404).json({ error: 'Declaración no encontrada' });
    }

    res.json({
      success: true,
      declaracion: declaracion
    });
  } catch (error) {
    console.error('Error obteniendo declaración:', error);
    res.status(500).json({ error: 'Error obteniendo declaración' });
  }
};

// ==============================================
// ✅ NUEVOS MÉTODOS PARA CU-05 (TRANSPORTISTA - CONSULTA ESTADO)
// ==============================================

export const getDeclaracionesTransportista = async (req, res) => {
  const ip = req.ip || '127.0.0.1';
  const transportistaId = req.user.userId;
  
  try {
    console.log(`📋 Transportista ${transportistaId} consultando estado de declaraciones`);

    const declaraciones = await Declaracion.findByUser(transportistaId);

    // ✅ REGISTRAR EN BITÁCORA - CONSULTA GENERAL
    await registrarBitacora(
      transportistaId, 
      ip, 
      'consulta_estado_general', 
      'exito', 
      null
    );

    console.log(`✅ ${declaraciones.length} declaraciones encontradas para transportista`);

    res.json({
      success: true,
      declaraciones: declaraciones,
      total: declaraciones.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo declaraciones del transportista:', error);
    
    // ✅ REGISTRAR ERROR EN BITÁCORA
    await registrarBitacora(
      transportistaId, 
      ip, 
      'consulta_estado_general', 
      'fallo', 
      null
    );
    
    res.status(500).json({ error: 'Error obteniendo declaraciones' });
  }
};

export const consultarEstadoDeclaracion = async (req, res) => {
  const { id } = req.params;
  const ip = req.ip || '127.0.0.1';
  const transportistaId = req.user.userId;

  try {
    console.log(`🔍 Transportista ${transportistaId} consultando estado declaración: ${id}`);

    const declaracion = await Declaracion.findById(id, transportistaId);
    
    if (!declaracion) {
      // ✅ REGISTRAR EN BITÁCORA - NO ENCONTRADA
      await registrarBitacora(
        transportistaId, 
        ip, 
        'consulta_estado_especifico', 
        'fallo_no_encontrada', 
        id
      );
      
      return res.status(404).json({ error: 'Declaración no encontrada' });
    }

    // ✅ REGISTRAR EN BITÁCORA - CONSULTA EXITOSA
    await registrarBitacora(
      transportistaId, 
      ip, 
      'consulta_estado_especifico', 
      'exito', 
      declaracion.numero_documento
    );

    console.log(`✅ Estado consultado: ${declaracion.numero_documento} - ${declaracion.estado}`);

    res.json({
      success: true,
      declaracion: {
        id: declaracion.id,
        numeroDocumento: declaracion.numero_documento,
        fechaEmision: declaracion.fecha_emision,
        tipoOperacion: declaracion.tipo_operacion,
        estadoDocumento: declaracion.estado_documento,
        estado: declaracion.estado,
        fechaValidacion: declaracion.fecha_validacion,
        motivoRechazo: declaracion.motivo_rechazo,
        agenteValidador: declaracion.agente_validador_nombre,
        created_at: declaracion.created_at
      }
    });

  } catch (error) {
    console.error('❌ Error consultando estado de declaración:', error);
    
    // ✅ REGISTRAR ERROR EN BITÁCORA
    await registrarBitacora(
      transportistaId, 
      ip, 
      'consulta_estado_especifico', 
      'fallo_error_interno', 
      id
    );
    
    res.status(500).json({ error: 'Error consultando estado de declaración' });
  }
};

// ==============================================
// ✅ NUEVOS MÉTODOS PARA CU-04 (AGENTE ADUANERO)
// ==============================================

export const getDeclaracionesPendientes = async (req, res) => {
  const ip = req.ip || '127.0.0.1';
  
  try {
    console.log('📋 Agente solicitando declaraciones pendientes');

    const declaraciones = await Declaracion.findPendientes();

    await registrarBitacora(req.user.userId, ip, 'consultar_pendientes', 'exito', null);

    res.json({
      success: true,
      declaraciones: declaraciones,
      total: declaraciones.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo declaraciones pendientes:', error);
    await registrarBitacora(req.user.userId, ip, 'consultar_pendientes', 'fallo', null);
    res.status(500).json({ error: 'Error obteniendo declaraciones pendientes' });
  }
};

export const getDeclaracionForAgente = async (req, res) => {
  const { id } = req.params;
  const ip = req.ip || '127.0.0.1';

  try {
    const declaracion = await Declaracion.findByIdForAgente(id);
    
    if (!declaracion) {
      await registrarBitacora(req.user.userId, ip, 'consultar_declaracion', 'fallo_no_encontrada', id);
      return res.status(404).json({ error: 'Declaración no encontrada' });
    }

    await registrarBitacora(req.user.userId, ip, 'consultar_declaracion', 'exito', declaracion.numero_documento);

    res.json({
      success: true,
      declaracion: declaracion
    });

  } catch (error) {
    console.error('Error obteniendo declaración:', error);
    await registrarBitacora(req.user.userId, ip, 'consultar_declaracion', 'fallo', id);
    res.status(500).json({ error: 'Error obteniendo declaración' });
  }
};

export const validarDeclaracion = async (req, res) => {
  const { id } = req.params;
  const { accion, motivoRechazo } = req.body; // 'aprobar' o 'rechazar'
  const ip = req.ip || '127.0.0.1';
  const agenteId = req.user.userId;

  try {
    console.log(`🔍 Agente ${agenteId} validando declaración ${id}, acción: ${accion}`);

    // Verificar que la declaración existe y está pendiente
    const declaracion = await Declaracion.findByIdForAgente(id);
    
    if (!declaracion) {
      await registrarBitacora(agenteId, ip, 'validar_declaracion', 'fallo_no_encontrada', id);
      return res.status(404).json({ error: 'Declaración no encontrada' });
    }

    if (declaracion.estado !== 'Pendiente') {
      await registrarBitacora(agenteId, ip, 'validar_declaracion', 'fallo_ya_procesada', declaracion.numero_documento);
      return res.status(400).json({ error: 'La declaración ya fue procesada' });
    }

    // Determinar nuevo estado según la acción
    let nuevoEstado;
    if (accion === 'aprobar') {
      nuevoEstado = 'Validada';
    } else if (accion === 'rechazar') {
      nuevoEstado = 'Rechazada';
    } else {
      return res.status(400).json({ error: 'Acción inválida' });
    }

    // [FA02] Validar motivo si es rechazo
    if (accion === 'rechazar' && (!motivoRechazo || motivoRechazo.trim() === '')) {
      await registrarBitacora(agenteId, ip, 'validar_declaracion', 'fallo_motivo_vacio', declaracion.numero_documento);
      return res.status(400).json({ error: 'Debe proporcionar un motivo para el rechazo' });
    }

    // Actualizar declaración
    const declaracionActualizada = await Declaracion.updateValidacion(id, {
      estado: nuevoEstado,
      agenteValidadorId: agenteId,
      motivoRechazo: motivoRechazo
    });

    // Registrar en bitácora
    await registrarBitacora(agenteId, ip, 'validar_declaracion', 'exito', declaracion.numero_documento);

    console.log(`✅ Declaración ${declaracion.numero_documento} ${nuevoEstado}`);

    res.json({
      success: true,
      message: `Declaración ${accion === 'aprobar' ? 'validada' : 'rechazada'} correctamente`,
      declaracion: declaracionActualizada
    });

  } catch (error) {
    console.error('❌ Error validando declaración:', error);
    await registrarBitacora(req.user.userId, ip, 'validar_declaracion', 'fallo_error_interno', id);
    res.status(500).json({ error: 'Error procesando la validación' });
  }
};

export const getHistorialValidaciones = async (req, res) => {
  const ip = req.ip || '127.0.0.1';
  const agenteId = req.user.userId;

  try {
    console.log(`📊 Agente ${agenteId} solicitando historial de validaciones`);

    const declaraciones = await Declaracion.findByAgenteValidador(agenteId);

    await registrarBitacora(agenteId, ip, 'consultar_historial', 'exito', null);

    res.json({
      success: true,
      declaraciones: declaraciones,
      total: declaraciones.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo historial:', error);
    await registrarBitacora(agenteId, ip, 'consultar_historial', 'fallo', null);
    res.status(500).json({ error: 'Error obteniendo historial de validaciones' });
  }
};

export const getEstadisticasAgente = async (req, res) => {
  const ip = req.ip || '127.0.0.1';

  try {
    console.log('📈 Solicitando estadísticas para agente');

    const estadisticas = await Declaracion.getEstadisticasAgente();

    await registrarBitacora(req.user.userId, ip, 'consultar_estadisticas', 'exito', null);

    res.json({
      success: true,
      estadisticas: estadisticas
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    await registrarBitacora(req.user.userId, ip, 'consultar_estadisticas', 'fallo', null);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
};

// ==============================================
// 🔧 FUNCIONES AUXILIARES
// ==============================================

const registrarBitacora = async (usuarioId, ip, operacion, resultado, numeroDeclaracion) => {
  try {
    const usuario = await pool.query(
      'SELECT correo FROM usuarios WHERE id = $1',
      [usuarioId]
    );

    const email = usuario.rows[0]?.correo || 'desconocido';

    await pool.query(
      `INSERT INTO bitacora (usuario, ip_origen, operacion, resultado, numero_declaracion)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, ip, operacion, resultado, numeroDeclaracion]
    );
  } catch (error) {
    console.error('Error registrando en bitácora:', error);
  }
};

const validarImportadorActivo = async (idImportador) => {
  // Simulación - en producción consultaría servicio externo
  return new Promise(resolve => {
    setTimeout(() => resolve(true), 100);
  });
};