import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthLog } from '../models/AuthLog.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Obtener IP del cliente
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress ||
             (req.connection.socket ? req.connection.socket.remoteAddress : null);

  try {
    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    
    // [FA01] Credenciales inválidas
    if (!user) {
      await AuthLog.create({
        usuario_id: null,
        ip_origen: ip,
        operacion: 'login_fallido',
        resultado: 'fallo - usuario no existe'
      });
      return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
    }

    // [FA02] Usuario inactivo
    if (!user.activo) {
      await AuthLog.create({
        usuario_id: user.id,
        ip_origen: ip,
        operacion: 'login_fallido',
        resultado: 'fallo - usuario inactivo'
      });
      return res.status(403).json({ error: 'Usuario deshabilitado' });
    }

    // Validar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await AuthLog.create({
        usuario_id: user.id,
        ip_origen: ip,
        operacion: 'login_fallido',
        resultado: 'fallo - contraseña incorrecta'
      });
      return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
    }

    // Generar JWT (2 horas de expiración)
    const token = jwt.sign(
      { 
        userId: user.id, 
        rol: user.rol,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Registrar éxito en bitácora
    await AuthLog.create({
      usuario_id: user.id,
      ip_origen: ip,
      operacion: 'login_exitoso',
      resultado: 'éxito'
    });

    // Actualizar último login
    await User.updateLastLogin(user.id);

    // Respuesta exitosa
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        rol: user.rol
      },
      message: 'Autenticación exitosa'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verify = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error verificando token' });
  }
};