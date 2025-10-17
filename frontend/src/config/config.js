// Configuración para diferentes entornos
const config = {
  development: {
    API_URL: 'http://localhost:3000/api'
  },
  production: {
    API_URL: 'https://proyecto-desarrollo-web-wts1.onrender.com' // ← CAMBIA POR TU URL REAL
  }
};

// Selecciona automáticamente según el entorno
const environment = import.meta.env.PROD ? 'production' : 'development';
export const API_URL = config[environment].API_URL;

console.log('🚀 Environment:', environment);
console.log('🔗 API URL:', API_URL);