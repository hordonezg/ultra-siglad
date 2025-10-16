import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = authService.getToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authService.verifyToken(token);
      setUser(data.user);
      
      // ✅ GUARDAR USER EN LOCALSTORAGE PARA PERSISTENCIA
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setError(null);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      authService.logout();
      localStorage.removeItem('user'); // ✅ LIMPIAR USER TAMBIÉN
      setError('Sesión expirada. Por favor, ingresa nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      
      // ✅ GUARDAR TOKEN Y USER EN LOCALSTORAGE
      authService.saveToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      
      // ✅ SOLUCIÓN ÓPTIMA: Retornamos los datos para que el Login.jsx haga la redirección
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    authService.logout();
    localStorage.removeItem('user'); // ✅ LIMPIAR USER AL HACER LOGOUT
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    setError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};