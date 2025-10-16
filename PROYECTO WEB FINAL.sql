CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(50) CHECK (rol IN ('Administrador', 'Transportista', 'Agente Aduanero')),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bitacora (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(100),
  ip_origen VARCHAR(50),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  operacion VARCHAR(50),
  resultado VARCHAR(20)
);


--SELECCION DE USUARIOS O TABLAS
SELECT * FROM usuarios;

SELECT * FROM declaraciones;

SELECT * FROM bitacora ORDER BY id DESC;

ALTER TABLE bitacora ALTER COLUMN resultado TYPE VARCHAR(100);


--CREACION DE USUARIOS PREDETERMINADOS
INSERT INTO usuarios (nombre, correo, contrasena, rol, activo)
VALUES ('Administrador SIGLAD', 'admin@siglad.com', '$2b$10$eImiTXuWVxfM37uY4JANjQ==', 'Administrador', TRUE);

INSERT INTO usuarios (nombre, correo, contrasena, rol, activo)
VALUES ('Administrador SIGLAD', 'admin1@siglad.com', '123456789', 'Administrador', TRUE);

INSERT INTO usuarios (nombre, correo, contrasena, rol, activo)
VALUES ('Tranportista SIGLAD', 'transportista@siglad.com', '123456789', 'Transportista', TRUE);

INSERT INTO usuarios (nombre, correo, contrasena, rol, activo)
VALUES ('Agente SIGLAD', 'agente@siglad.com', '123456789', 'Agente Aduanero', TRUE);


-- Tabla de declaraciones aduaneras
CREATE TABLE IF NOT EXISTS declaraciones (
    id SERIAL PRIMARY KEY,
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    fecha_emision DATE NOT NULL,
    pais_emisor VARCHAR(2) NOT NULL,
    tipo_operacion VARCHAR(20) NOT NULL,
    
    -- Datos JSON según estructura Anexo II
    exportador JSONB NOT NULL,
    importador JSONB NOT NULL,
    transporte JSONB NOT NULL,
    mercancias JSONB NOT NULL,
    valores JSONB NOT NULL,
    resultado_selectivo JSONB,
    estado_documento VARCHAR(20) NOT NULL,
    firma_electronica VARCHAR(64) NOT NULL,
    
    -- Control interno
    usuario_id INTEGER REFERENCES usuarios(id) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_declaraciones_usuario ON declaraciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_declaraciones_estado ON declaraciones(estado);
CREATE INDEX IF NOT EXISTS idx_declaraciones_numero ON declaraciones(numero_documento);

-- Agregar solo los campos faltantes si la tabla ya existe
ALTER TABLE declaraciones 
ADD COLUMN IF NOT EXISTS agente_validador_id INTEGER REFERENCES usuarios(id),
ADD COLUMN IF NOT EXISTS motivo_rechazo TEXT,
ADD COLUMN IF NOT EXISTS fecha_validacion TIMESTAMP;

-- Crear los índices nuevos si no existen
CREATE INDEX IF NOT EXISTS idx_declaraciones_agente_validador ON declaraciones(agente_validador_id);
CREATE INDEX IF NOT EXISTS idx_declaraciones_fecha_validacion ON declaraciones(fecha_validacion);