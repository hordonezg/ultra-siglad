import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';

// Configurar variables de entorno
dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar PostgreSQL para Render con SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ==================== CORS CONFIGURATION ====================

// Middleware CORS MANUAL - 100% FUNCIONAL
app.use((req, res, next) => {
  console.log('🔧 CORS Middleware ejecutándose para:', req.method, req.url, 'Origin:', req.headers.origin);
  
  const allowedOrigins = [
    'https://proyecto-desarrollo-web-frontend.onrender.com',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];
  
  const requestOrigin = req.headers.origin;
  
  // Permitir el origin si está en la lista, sino permitir el que viene
  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  } else if (allowedOrigins.length > 0) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request permitida para:', requestOrigin);
    return res.status(200).end();
  }
  
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// ==================== MIDDLEWARES DE AUTENTICACIÓN ====================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  console.log('🔐 === VERIFYTOKEN MIDDLEWARE ===');
  console.log('🔐 URL:', req.url);
  console.log('🔐 Authorization:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ SIN TOKEN O FORMATO INCORRECTO');
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ TOKEN VÁLIDO - Usuario:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ TOKEN INVÁLIDO:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    console.log('🔐 === REQUIREROLE MIDDLEWARE ===');
    console.log('🔐 Roles requeridos:', roles);
    console.log('🔐 Usuario actual:', req.user);
    
    if (!req.user) {
      console.log('❌ USUARIO NO AUTENTICADO');
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.rol)) {
      console.log('❌ ROL INSUFICIENTE');
      console.log('❌ Rol usuario:', req.user.rol);
      console.log('❌ Roles permitidos:', roles);
      return res.status(403).json({ 
        error: 'Permisos insuficientes',
        detalles: {
          rol_usuario: req.user.rol,
          roles_permitidos: roles
        }
      });
    }

    console.log('✅ ACCESO PERMITIDO');
    next();
  };
};

// ==================== RUTAS PÚBLICAS ====================

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'SIGLAD Backend funcionando con PostgreSQL en Render',
      database: 'Conectado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error de conexión a la base de datos',
      error: error.message 
    });
  }
});

// Ruta de login - VERSIÓN CORREGIDA
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    console.log(`🔐 Intento de login: ${email}`);

    const userResult = await pool.query(
      'SELECT id, nombre, correo, contrasena, rol, activo FROM usuarios WHERE correo = $1',
      [email]
    );

    const user = userResult.rows[0];
    
    if (!user) {
      await pool.query(
        `INSERT INTO bitacora (usuario, ip_origen, operacion, resultado) VALUES ($1, $2, $3, $4)`,
        [email, ip, 'login_fallido', 'usuario_no_existe']
      );
      return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
    }

    if (!user.activo) {
      await pool.query(
        `INSERT INTO bitacora (usuario, ip_origen, operacion, resultado) VALUES ($1, $2, $3, $4)`,
        [user.correo, ip, 'login_fallido', 'usuario_inactivo']
      );
      return res.status(403).json({ error: 'Usuario deshabilitado' });
    }

    // ✅ CORRECCIÓN: Verificar si es un hash bcrypt (2a o 2b) o texto plano
    let validPassword = false;
    
    if (user.contrasena.startsWith('$2a$') || user.contrasena.startsWith('$2b$')) {
      // Es un hash bcrypt
      validPassword = await bcrypt.compare(password, user.contrasena);
      console.log(`🔐 Comparando hash bcrypt para: ${email}`);
    } else {
      // Es texto plano (solo para usuarios antiguos)
      validPassword = (password === user.contrasena);
      console.log(`🔐 Comparando texto plano para: ${email}`);
    }

    if (!validPassword) {
      await pool.query(
        `INSERT INTO bitacora (usuario, ip_origen, operacion, resultado) VALUES ($1, $2, $3, $4)`,
        [user.correo, ip, 'login_fallido', 'contrasena_incorrecta']
      );
      return res.status(401).json({ error: 'Usuario o contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        rol: user.rol,
        email: user.correo,
        nombre: user.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    await pool.query(
      `INSERT INTO bitacora (usuario, ip_origen, operacion, resultado) VALUES ($1, $2, $3, $4)`,
      [user.correo, ip, 'login_exitoso', 'exito']
    );

    console.log(`✅ Login exitoso: ${user.correo} (${user.rol})`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.correo,
        rol: user.rol
      },
      message: 'Autenticación exitosa'
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
});

// Ruta para verificar token
app.get('/api/auth/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// ==================== RUTAS DE GESTIÓN DE USUARIOS (CU-02) ====================

// Obtener todos los usuarios (solo admin)
app.get('/api/users', verifyToken, requireRole(['Administrador']), async (req, res) => {
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
});

// Crear usuario (solo admin)
app.post('/api/users', verifyToken, requireRole(['Administrador']), async (req, res) => {
  const { nombre, correo, password, rol, activo } = req.body;
  const ip = req.ip || '127.0.0.1';
  const adminEmail = req.user.email;

  try {
    // [FA01] Validar campos obligatorios
    if (!nombre || !correo || !password || !rol) {
      await pool.query(
        `INSERT INTO bitacora 
         (usuario, ip_origen, operacion, resultado)
         VALUES ($1, $2, $3, $4)`,
        [adminEmail, ip, 'crear_usuario_fallido', 'fallo - campos incompletos']
      );
      return res.status(400).json({ error: 'Complete todos los campos obligatorios' });
    }

    // [FA02] Verificar si el correo ya existe
    const existingUser = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (existingUser.rows.length > 0) {
      await pool.query(
        `INSERT INTO bitacora 
         (usuario, ip_origen, operacion, resultado)
         VALUES ($1, $2, $3, $4)`,
        [adminEmail, ip, 'crear_usuario_fallido', 'fallo - correo duplicado']
      );
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    // Validar rol
    const rolesPermitidos = ['Administrador', 'Transportista', 'Agente Aduanero'];
    if (!rolesPermitidos.includes(rol)) {
      return res.status(400).json({ error: 'Rol no válido' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol, activo) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nombre, correo, rol, activo, fecha_creacion`,
      [nombre, correo, hashedPassword, rol, activo !== false]
    );

    const newUser = result.rows[0];

    // Registrar en bitácora
    await pool.query(
      `INSERT INTO bitacora 
       (usuario, ip_origen, operacion, resultado)
       VALUES ($1, $2, $3, $4)`,
      [adminEmail, ip, 'usuario_creado', `éxito - usuario: ${correo}`]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: newUser
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    
    await pool.query(
      `INSERT INTO bitacora 
       (usuario, ip_origen, operacion, resultado)
       VALUES ($1, $2, $3, $4)`,
      [req.user.email, ip, 'crear_usuario_fallido', 'fallo - error interno']
    );
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar usuario (solo admin)
app.put('/api/users/:id', verifyToken, requireRole(['Administrador']), async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, rol, activo } = req.body;
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
        await pool.query(
          `INSERT INTO bitacora 
           (usuario, ip_origen, operacion, resultado)
           VALUES ($1, $2, $3, $4)`,
          [req.user.email, ip, 'editar_usuario_fallido', 'fallo - correo duplicado']
        );
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

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    query += updates.join(', ') + ` WHERE id = $${paramCount} RETURNING id, nombre, correo, rol, activo`;
    values.push(id);

    const result = await pool.query(query, values);
    const updatedUser = result.rows[0];

    // Registrar en bitácora
    await pool.query(
      `INSERT INTO bitacora 
       (usuario, ip_origen, operacion, resultado)
       VALUES ($1, $2, $3, $4)`,
      [req.user.email, ip, 'usuario_editado', `éxito - usuario: ${updatedUser.correo}`]
    );

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar usuario (solo admin)
app.delete('/api/users/:id', verifyToken, requireRole(['Administrador']), async (req, res) => {
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

    // No permitir eliminar el usuario admin principal
    if (userEmail === 'admin@siglad.com') {
      return res.status(400).json({ error: 'No se puede eliminar el usuario administrador principal' });
    }

    // Eliminar usuario
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    // Registrar en bitácora
    await pool.query(
      `INSERT INTO bitacora 
       (usuario, ip_origen, operacion, resultado)
       VALUES ($1, $2, $3, $4)`,
      [req.user.email, ip, 'usuario_eliminado', `éxito - usuario: ${userEmail}`]
    );

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    
    await pool.query(
      `INSERT INTO bitacora 
       (usuario, ip_origen, operacion, resultado)
       VALUES ($1, $2, $3, $4)`,
      [req.user.email, ip, 'eliminar_usuario_fallido', 'fallo - error interno']
    );
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== RUTAS DE DECLARACIONES ADUANERAS (CU-03) ====================

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
    errors.push('ID importador inválido o excedes 15 caracteres');
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

// Crear declaración aduanera (solo transportista)
app.post('/api/declaraciones', verifyToken, requireRole(['Transportista']), async (req, res) => {
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

    // Verificar si el DUCA ya existe (RN01)
    const ducaExists = await pool.query(
      'SELECT id FROM declaraciones WHERE numero_documento = $1',
      [ducaData.numeroDocumento]
    );

    if (ducaExists.rows.length > 0) {
      await registrarBitacora(usuarioId, ip, 'crear_declaracion', 'fallo_duca_duplicado', ducaData.numeroDocumento);
      return res.status(400).json({ error: 'DUCA ya registrado' });
    }

    // Crear declaración
    const result = await pool.query(
      `INSERT INTO declaraciones (
        numero_documento, fecha_emision, pais_emisor, tipo_operacion,
        exportador, importador, transporte, mercancias, valores,
        resultado_selectivo, estado_documento, firma_electronica, usuario_id, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Pendiente')
      RETURNING id, numero_documento, fecha_emision, estado_documento, estado`,
      [
        ducaData.numeroDocumento, ducaData.fechaEmision, ducaData.paisEmisor, ducaData.tipoOperacion,
        JSON.stringify(ducaData.exportador), JSON.stringify(ducaData.importador),
        JSON.stringify(ducaData.transporte), JSON.stringify(ducaData.mercancias),
        JSON.stringify(ducaData.valores), JSON.stringify(ducaData.resultadoSelectivo || {}),
        ducaData.estadoDocumento, ducaData.firmaElectronica, usuarioId
      ]
    );

    const declaracion = result.rows[0];

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

    await registrarBitacora(req.user.userId, ip, 'crear_declaracion', 'fallo_error_interno', ducaData.numeroDocumento);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
});

// Listar declaraciones del transportista
app.get('/api/declaraciones', verifyToken, requireRole(['Transportista']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, numero_documento, fecha_emision, tipo_operacion, 
              estado_documento, estado, created_at
       FROM declaraciones 
       WHERE usuario_id = $1 
       ORDER BY created_at DESC`,
      [req.user.userId]
    );
    
    res.json({
      success: true,
      declaraciones: result.rows
    });
  } catch (error) {
    console.error('Error listando declaraciones:', error);
    res.status(500).json({ error: 'Error obteniendo declaraciones' });
  }
});

// Obtener declaración específica
app.get('/api/declaraciones/:id', verifyToken, requireRole(['Transportista']), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM declaraciones 
       WHERE id = $1 AND usuario_id = $2`,
      [id, req.user.userId]
    );

    const declaracion = result.rows[0];
    
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
});

// ==================== RUTAS DE DECLARACIONES PARA AGENTE (CU-04) ====================

// Obtener declaraciones pendientes para agente
app.get('/api/declaraciones/agente/pendientes', verifyToken, requireRole(['Agente Aduanero']), async (req, res) => {
  const ip = req.ip || '127.0.0.1';
  
  try {
    console.log('📋 Agente solicitando declaraciones pendientes');

    const result = await pool.query(
      `SELECT 
        d.id,
        d.numero_documento,
        d.fecha_emision,
        d.pais_emisor,
        d.tipo_operacion,
        d.exportador->>'nombreExportador' as nombre_exportador,
        d.importador->>'nombreImportador' as nombre_importador,
        d.transporte->>'medioTransporte' as medio_transporte,
        d.valores->>'valorAduanaTotal' as valor_aduana_total,
        d.valores->>'moneda' as moneda,
        d.estado_documento,
        d.estado,
        d.created_at,
        u.nombre as transportista_nombre,
        u.correo as transportista_correo
       FROM declaraciones d
       JOIN usuarios u ON d.usuario_id = u.id
       WHERE d.estado = 'Pendiente'
       ORDER BY d.created_at DESC`
    );

    await registrarBitacora(req.user.userId, ip, 'consultar_pendientes', 'exito', null);

    res.json({
      success: true,
      declaraciones: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo declaraciones pendientes:', error);
    await registrarBitacora(req.user.userId, ip, 'consultar_pendientes', 'fallo', null);
    res.status(500).json({ error: 'Error obteniendo declaraciones pendientes' });
  }
});

// Obtener estadísticas para agente
app.get('/api/declaraciones/agente/estadisticas', verifyToken, requireRole(['Agente Aduanero']), async (req, res) => {
  const ip = req.ip || '127.0.0.1';

  try {
    console.log('📈 Solicitando estadísticas para agente');

    const result = await pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN estado = 'Pendiente' THEN 1 END) as pendientes,
        COUNT(CASE WHEN estado = 'Validada' THEN 1 END) as validadas,
        COUNT(CASE WHEN estado = 'Rechazada' THEN 1 END) as rechazadas
       FROM declaraciones`
    );

    const estadisticas = result.rows[0];

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
});

// Obtener detalle de declaración para agente
app.get('/api/declaraciones/agente/detalle/:id', verifyToken, requireRole(['Agente Aduanero']), async (req, res) => {
  const { id } = req.params;
  const ip = req.ip || '127.0.0.1';

  try {
    const result = await pool.query(
      `SELECT 
        d.*,
        u.nombre as transportista_nombre,
        u.correo as transportista_correo
       FROM declaraciones d
       JOIN usuarios u ON d.usuario_id = u.id
       WHERE d.id = $1`,
      [id]
    );

    const declaracion = result.rows[0];
    
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
});

// Validar o rechazar declaración
app.post('/api/declaraciones/agente/validar/:id', verifyToken, requireRole(['Agente Aduanero']), async (req, res) => {
  const { id } = req.params;
  const { accion, motivoRechazo } = req.body; // 'aprobar' o 'rechazar'
  const ip = req.ip || '127.0.0.1';
  const agenteId = req.user.userId;

  try {
    console.log(`🔍 Agente ${agenteId} validando declaración ${id}, acción: ${accion}`);

    // Verificar que la declaración existe y está pendiente
    const declaracionResult = await pool.query(
      `SELECT d.*, u.nombre as transportista_nombre
       FROM declaraciones d
       JOIN usuarios u ON d.usuario_id = u.id
       WHERE d.id = $1`,
      [id]
    );

    const declaracion = declaracionResult.rows[0];
    
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

    // Validar motivo si es rechazo
    if (accion === 'rechazar' && (!motivoRechazo || motivoRechazo.trim() === '')) {
      await registrarBitacora(agenteId, ip, 'validar_declaracion', 'fallo_motivo_vacio', declaracion.numero_documento);
      return res.status(400).json({ error: 'Debe proporcionar un motivo para el rechazo' });
    }

    // Actualizar declaración
    const updateResult = await pool.query(
      `UPDATE declaraciones 
       SET estado = $1, 
           agente_validador_id = $2,
           motivo_rechazo = $3,
           fecha_validacion = NOW(),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, numero_documento, estado, fecha_validacion`,
      [nuevoEstado, agenteId, motivoRechazo, id]
    );

    const declaracionActualizada = updateResult.rows[0];

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
});

// Funciones auxiliares para CU-03 y CU-04
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

// ==================== RUTAS ADICIONALES ====================

// Ruta para crear usuarios de prueba - CORREGIDA
app.get('/api/create-test-users', async (req, res) => {
  try {
    const adminHash = await bcrypt.hash('admin123', 12);
    const transportistaHash = await bcrypt.hash('trans123', 12);
    const agenteHash = await bcrypt.hash('agente123', 12);

    await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol, activo) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (correo) DO UPDATE SET 
       contrasena = EXCLUDED.contrasena, 
       rol = EXCLUDED.rol`,
      ['Administrador SIGLAD', 'admin@siglad.com', adminHash, 'Administrador', true]
    );

    await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol, activo) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (correo) DO UPDATE SET 
       contrasena = EXCLUDED.contrasena, 
       rol = EXCLUDED.rol`,
      ['Transportista Demo', 'transportista@siglad.com', transportistaHash, 'Transportista', true]
    );

    await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol, activo) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (correo) DO UPDATE SET 
       contrasena = EXCLUDED.contrasena, 
       rol = EXCLUDED.rol`,
      ['Agente Aduanero Demo', 'agente@siglad.com', agenteHash, 'Agente Aduanero', true] // ✅ CORREGIDO: "Agente Aduanero"
    );

    console.log('✅ Usuarios de prueba creados/actualizados');

    res.json({ 
      success: true, 
      message: 'Usuarios de prueba creados con contraseñas hasheadas',
      usuarios: [
        { nombre: 'Administrador SIGLAD', correo: 'admin@siglad.com', password: 'admin123', rol: 'Administrador' },
        { nombre: 'Transportista Demo', correo: 'transportista@siglad.com', password: 'trans123', rol: 'Transportista' },
        { nombre: 'Agente Aduanero Demo', correo: 'agente@siglad.com', password: 'agente123', rol: 'Agente Aduanero' } // ✅ CORREGIDO
      ]
    });

  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    res.status(500).json({ error: 'Error creando usuarios: ' + error.message });
  }
});

// Ruta para ver usuarios actuales (pública para testing)
app.get('/api/users-list', async (req, res) => {
  try {
    const users = await pool.query('SELECT id, nombre, correo, rol, activo FROM usuarios');
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

// ==================== INICIALIZACIÓN MEJORADA ====================

async function initializeDatabase() {
  try {
    console.log('🔄 Conectando a PostgreSQL en Render...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado a PostgreSQL en Render');

    // Verificar tablas existentes
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('usuarios', 'bitacora', 'declaraciones')
    `);

    const tablasExistentes = tablesCheck.rows.map(row => row.table_name);
    console.log('📊 Tablas existentes:', tablasExistentes);

    // Crear tabla declaraciones si no existe
    if (!tablasExistentes.includes('declaraciones')) {
      console.log('🔄 Creando tabla declaraciones...');
      await pool.query(`
        CREATE TABLE declaraciones (
          id SERIAL PRIMARY KEY,
          numero_documento VARCHAR(20) UNIQUE NOT NULL,
          fecha_emision DATE NOT NULL,
          pais_emisor VARCHAR(2) NOT NULL,
          tipo_operacion VARCHAR(20) NOT NULL,
          exportador JSONB NOT NULL,
          importador JSONB NOT NULL,
          transporte JSONB NOT NULL,
          mercancias JSONB NOT NULL,
          valores JSONB NOT NULL,
          resultado_selectivo JSONB,
          estado_documento VARCHAR(20) NOT NULL,
          firma_electronica VARCHAR(64) NOT NULL,
          usuario_id INTEGER REFERENCES usuarios(id) NOT NULL,
          estado VARCHAR(20) DEFAULT 'Pendiente',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Tabla declaraciones creada');
    }

    // Agregar campos para CU-04 si no existen
    const columnsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'declaraciones' 
      AND column_name IN ('agente_validador_id', 'motivo_rechazo', 'fecha_validacion')
    `);

    const columnasExistentes = columnsCheck.rows.map(row => row.column_name);
    
    if (!columnasExistentes.includes('agente_validador_id')) {
      await pool.query('ALTER TABLE declaraciones ADD COLUMN agente_validador_id INTEGER REFERENCES usuarios(id)');
      console.log('✅ Columna agente_validador_id agregada');
    }
    
    if (!columnasExistentes.includes('motivo_rechazo')) {
      await pool.query('ALTER TABLE declaraciones ADD COLUMN motivo_rechazo TEXT');
      console.log('✅ Columna motivo_rechazo agregada');
    }
    
    if (!columnasExistentes.includes('fecha_validacion')) {
      await pool.query('ALTER TABLE declaraciones ADD COLUMN fecha_validacion TIMESTAMP');
      console.log('✅ Columna fecha_validacion agregada');
    }

    const userCount = await pool.query('SELECT COUNT(*) as count FROM usuarios');
    console.log(`👥 Usuarios en base de datos: ${userCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
  }
}

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor SIGLAD corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Gestión usuarios: GET/POST/PUT/DELETE http://localhost:${PORT}/api/users`);
  console.log(`📝 Declaraciones: POST/GET http://localhost:${PORT}/api/declaraciones`);
  console.log(`👮‍♂️ Agente - Pendientes: GET http://localhost:${PORT}/api/declaraciones/agente/pendientes`);
  console.log(`📈 Agente - Estadísticas: GET http://localhost:${PORT}/api/declaraciones/agente/estadisticas`);
  console.log(`🧪 Crear usuarios prueba: http://localhost:${PORT}/api/create-test-users`);
  console.log(`🗄️  Base de datos: PostgreSQL en Render`);
  
  await initializeDatabase();
});