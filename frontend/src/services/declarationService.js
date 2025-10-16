import api from './api';

// Función para verificar y obtener el token
const getToken = () => {
  const token = localStorage.getItem('siglad_token');
  console.log('🔐 Service - Token disponible:', !!token);
  
  if (!token) {
    console.error('❌ Service - NO HAY TOKEN DISPONIBLE');
    throw new Error('No hay token de autenticación');
  }
  
  return token;
};

export const declarationService = {
  // ✅ MÉTODOS EXISTENTES CU-04 (AGENTE)
  getDeclaracionesPendientes: () => {
    const token = getToken();
    console.log('🔐 Service - Obteniendo declaraciones pendientes');
    
    return api.get('/declaraciones/agente/pendientes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  getEstadisticasAgente: () => {
    const token = getToken();
    console.log('🔐 Service - Obteniendo estadísticas');
    
    return api.get('/declaraciones/agente/estadisticas', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  getDeclaracionForAgente: (id) => {
    const token = getToken();
    console.log('🔐 Service - Obteniendo detalle declaración:', id);
    
    return api.get(`/declaraciones/agente/detalle/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  validarDeclaracion: (id, datos) => {
    const token = getToken();
    console.log('🔐 Service - Validando declaración:', id, datos);
    
    return api.post(`/declaraciones/agente/validar/${id}`, datos, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },

  // ✅ CORREGIDOS MÉTODOS CU-05 (TRANSPORTISTA)
  getDeclaracionesTransportista: () => {
    const token = getToken();
    console.log('🔐 Service - Obteniendo declaraciones del transportista');
    
    return api.get('/declaraciones', {  // ✅ RUTA CORREGIDA
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  
  // ⚠️ ESTA RUTA TAMPOCO EXISTE - ¿LA NECESITAS?
  consultarEstadoDeclaracion: (id) => {
    const token = getToken();
    console.log('🔐 Service - Consultando estado específico:', id);
    
    // Si necesitas esta función, usa la ruta que SÍ existe:
    return api.get(`/declaraciones/${id}`, {  // ✅ RUTA QUE SÍ EXISTE
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
};

export default declarationService;