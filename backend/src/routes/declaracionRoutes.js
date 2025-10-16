import express from 'express';
import { 
  // ✅ MÉTODOS EXISTENTES CU-03 (Transportista)
  crearDeclaracion, 
  listarDeclaraciones, 
  obtenerDeclaracion,
  
  // ✅ NUEVOS MÉTODOS CU-04 (Agente Aduanero)
  getDeclaracionesPendientes,
  getDeclaracionForAgente,
  validarDeclaracion,
  getHistorialValidaciones,
  getEstadisticasAgente,

  // ✅ NUEVOS MÉTODOS CU-05 (Transportista - Consulta Estado)
  getDeclaracionesTransportista,
  consultarEstadoDeclaracion
} from '../controllers/declaracionController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// ==============================================
// ✅ RUTAS EXISTENTES CU-03 (TRANSPORTISTA)
// ==============================================
router.post('/', requireRole(['Transportista']), crearDeclaracion);
router.get('/', requireRole(['Transportista']), listarDeclaraciones);
router.get('/:id', requireRole(['Transportista']), obtenerDeclaracion);

// ==============================================
// ✅ NUEVAS RUTAS CU-05 (CONSULTA ESTADO - TRANSPORTISTA)
// ==============================================

// Obtener todas las declaraciones del transportista para consulta de estado
router.get('/transportista/consulta-estado', 
  requireRole(['Transportista']), 
  getDeclaracionesTransportista
);

// Consultar estado específico de una declaración (con bitácora)
router.get('/transportista/consulta/:id', 
  requireRole(['Transportista']), 
  consultarEstadoDeclaracion
);

// ==============================================
// ✅ RUTAS CU-04 (AGENTE ADUANERO) - CORREGIDAS
// ==============================================

// Obtener declaraciones pendientes de validación
router.get('/agente/pendientes', 
  requireRole(['Agente Aduanero']),  // ✅ CORREGIDO
  getDeclaracionesPendientes
);

// Obtener detalles específicos de declaración para agente
router.get('/agente/detalle/:id', 
  requireRole(['Agente Aduanero']),  // ✅ CORREGIDO
  getDeclaracionForAgente
);

// Validar o rechazar declaración
router.post('/agente/validar/:id', 
  requireRole(['Agente Aduanero']),  // ✅ CORREGIDO
  validarDeclaracion
);

// Obtener historial de validaciones del agente
router.get('/agente/historial', 
  requireRole(['Agente Aduanero']),  // ✅ CORREGIDO
  getHistorialValidaciones
);

// Obtener estadísticas para dashboard del agente
router.get('/agente/estadisticas', 
  requireRole(['Agente Aduanero']),  // ✅ CORREGIDO
  getEstadisticasAgente
);

export default router;