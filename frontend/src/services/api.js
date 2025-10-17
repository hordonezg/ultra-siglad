import axios from 'axios';
import { API_URL } from '../config/config.js'; // ← IMPORTA LA CONFIG

// Configuración base de axios
const api = axios.create({
  baseURL: API_URL, // ← USA LA VARIABLE DE CONFIG
  timeout: 10000,
});

// Interceptor para agregar el token a todas las requests - CON MÁS DEBUG
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('🔐 === REQUEST INTERCEPTOR DEBUG ===');
    console.log('🔐 Request URL:', config.url);
    console.log('🔐 Token disponible:', !!token);
    console.log('🔐 Token completo:', token);
    console.log('🔐 Token length:', token?.length);
    console.log('🔐 Token empieza con eyJ?:', token?.startsWith('eyJ'));
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Headers después de agregar token:', config.headers);
    } else {
      console.error('❌ NO HAY TOKEN DISPONIBLE - Request sin autenticación');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response exitosa:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      console.log('🔐 Error 401 - Token inválido o expirado');
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

export default api;