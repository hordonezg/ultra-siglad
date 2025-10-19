import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(form.email, form.password);
      
      // Redirigir según rol
      switch(result.user.rol) {
        case 'Administrador':
          window.location.href = '/admin';
          break;
        case 'Transportista':
          window.location.href = '/transportista';
          break;
        case 'Agente Aduanero':
          window.location.href = '/agente';
          break;
        default:
          window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>🚛 SIGLAD</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
          Sistema de Gestión Logística Aduanal
        </p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            placeholder="usuario@siglad.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Ingresar al sistema'}
        </button>

        {/* <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          <strong>Usuarios de prueba:</strong><br/>
          admin@siglad.com / admin123<br/>
          transportista@siglad.com / trans123<br/>
          agente@siglad.com / agente123
        </div> */}
      </form>
    </div>
  );
}