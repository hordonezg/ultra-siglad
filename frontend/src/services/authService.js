const API_URL = 'http://localhost:3000/api';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error de autenticación');
    }

    return data;
  },

  async verifyToken(token) {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error verificando token');
    }

    return data;
  },

  saveToken(token) {
    localStorage.setItem('siglad_token', token);
  },

  getToken() {
    return localStorage.getItem('siglad_token');
  },

  // ✅ MÉTODO LOGOUT COMPLETO Y MEJORADO
  logout() {
    console.log('🔐 Cerrando sesión...');
    
    // Eliminar token y datos de usuario
    localStorage.removeItem('siglad_token');
    localStorage.removeItem('siglad_user');
    
    // Limpiar sessionStorage por si acaso
    sessionStorage.clear();
    
    // Registrar en consola
    console.log('✅ Sesión cerrada - Datos eliminados');
    console.log('🔄 Redirigiendo al login...');
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  // ✅ MÉTODO ADICIONAL: Guardar datos del usuario
  saveUserData(userData) {
    localStorage.setItem('siglad_user', JSON.stringify(userData));
  },

  // ✅ MÉTODO ADICIONAL: Obtener datos del usuario
  getUserData() {
    const userData = localStorage.getItem('siglad_user');
    return userData ? JSON.parse(userData) : null;
  },

  // ✅ MÉTODO ADICIONAL: Verificar rol del usuario
  getUserRole() {
    const userData = this.getUserData();
    return userData ? userData.rol : null;
  }
};