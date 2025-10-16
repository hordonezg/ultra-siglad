import { pool } from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';
import { AuthLog } from '../models/AuthLog.js';

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, correo, rol, activo, fecha_creacion 
      FROM usuarios 
      ORDER BY fecha_creacion DESC
    `);
    
    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
};

export const createUser = async (req, res) => {
  const { nombre, correo, password, rol, activo } = req.body;
  const ip = req.ip || '127.0.0.1';
  const adminEmail = req.user.email;

  try {
    // [FA01] Validar campos obligatorios
    if (!nombre || !correo || !password || !rol) {
      await AuthLog.create({
        usuario_id: req.user.userId,
        ip_origen: ip,
        operacion: 'crear_usuario_fallido',
        resultado: 'fallo - campos incompletos'
      });
      return res.status(400).json({ error: 'Complete todos los campos obligatorios' });
    }

    // [FA02] Verificar si el correo ya existe
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (existingUser.rows.length > 0) {
      await AuthLog.create({
        usuario_id: req.user.userId,
        ip_origen: ip,
        operacion: 'crear_usuario_fallido',
        resultado: 'fallo - correo duplicado'
      });
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    // Validar rol
    const rolesPermitidos = ['Administrador', 'Transportista', 'Agente Aduanal'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol, activo) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, correo, rol, activo, fecha_creacion`,
      [nombre, correo, hashedPassword, rol, activo !== false]
    );

    const newUser = result.rows[0];

    // Registrar en bitácora
    await AuthLog.create({
      usuario_id: req.user.userId,
      ip_origen: ip,
      operacion: 'usuario_creado',
      resultado: `éxito - usuario: ${correo}`
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: newUser
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    
    await AuthLog.create({
      usuario_id: req.user.userId,
      ip_origen: ip,
      operacion: 'crear_usuario_fallido',
      resultado: 'fallo - error interno'
    });
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol, activo, resetPassword } = req.body;
  const ip = req.ip || '127.0.0.1';

  try {
    // Verificar si el usuario existe
    const userExists = await pool.query(
      'SELECT id, correo FROM usuarios WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo correo ya existe (excluyendo el usuario actual)
    if (correo && correo !== userExists.rows[0].correo) {
      const emailExists = await pool.query(
        'SELECT id FROM usuarios WHERE correo = $1 AND id != $2',
        [correo, id]
      );

      if (emailExists.rows.length > 0) {
        await AuthLog.create({
          usuario_id: req.user.userId,
          ip_origen: ip,
          operacion: 'editar_usuario_fallido',
          resultado: 'fallo - correo duplicado'
        });
        return res.status(400).json({ error: 'Correo ya registrado' });
      }
    }

    // Construir query dinámica
    let query = 'UPDATE usuarios SET ';
    const values = [];
    let paramCount = 1;
    const updates = [];

    if (nombre) {
      updates.push(`nombre = $${paramCount}`);
      values.push(nombre);
      paramCount++;
    }

    if (correo) {
      updates.push(`correo = $${paramCount}`);
      values.push(correo);
      paramCount++;
    }

    if (rol) {
      updates.push(`rol = $${paramCount}`);
      values.push(rol);
      paramCount++;
    }

    if (activo !== undefined) {
      updates.push(`activo = $${paramCount}`);
      values.push(activo);
      paramCount++;
    }

    if (resetPassword) {
      const hashedPassword = await hashPassword('Temp123!');
      updates.push(`contrasena = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    query += updates.join(', ') + ` WHERE id = $${paramCount} RETURNING id, nombre, correo, rol, activo`;
    values.push(id);

    const result = await pool.query(query, values);
    const updatedUser = result.rows[0];

    // Registrar en bitácora
    await AuthLog.create({
      usuario_id: req.user.userId,
      ip_origen: ip,
      operacion: 'usuario_editado',
      resultado: `éxito - usuario: ${updatedUser.correo}`
    });

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const ip = req.ip || '127.0.0.1';

  try {
    // Verificar si el usuario existe
    const userExists = await pool.query(
      'SELECT id, correo FROM usuarios WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const userEmail = userExists.rows[0].correo;

    // No permitir eliminar el propio usuario
    if (parseInt(id) === parseInt(req.user.userId)) {
      return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
    }

    // Eliminar usuario
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    // Registrar en bitácora
    await AuthLog.create({
      usuario_id: req.user.userId,
      ip_origen: ip,
      operacion: 'usuario_eliminado',
      resultado: `éxito - usuario: ${userEmail}`
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    
    await AuthLog.create({
      usuario_id: req.user.userId,
      ip_origen: ip,
      operacion: 'eliminar_usuario_fallido',
      resultado: 'fallo - error interno'
    });
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getUserLogs = async (req, res) => {
  try {
    const logs = await AuthLog.getLogs();
    
    res.json({
      success: true,
      logs: logs.filter(log => 
        log.operacion.includes('usuario_') || 
        log.operacion.includes('crear_usuario') ||
        log.operacion.includes('editar_usuario') ||
        log.operacion.includes('eliminar_usuario')
      )
    });
  } catch (error) {
    console.error('Error obteniendo logs:', error);
    res.status(500).json({ error: 'Error obteniendo logs' });
  }
};