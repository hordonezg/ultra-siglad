🚛 SIGLAD - Sistema de Gestión Logística Aduanera
<div align="center">
https://img.shields.io/badge/SIGLAD-Sistema%2520Aduanero-blue
https://img.shields.io/badge/Node.js-18%252B-green
https://img.shields.io/badge/React-18-blue
https://img.shields.io/badge/PostgreSQL-15-orange
https://img.shields.io/badge/Autenticaci%C3%B3n-JWT-yellow

Sistema integral para la gestión de declaraciones aduaneras con roles múltiples

</div>
📋 Tabla de Contenidos
🎯 Descripción del Proyecto

🏗️ Arquitectura del Sistema

🛠️ Stack Tecnológico

👥 Casos de Uso Implementados

🚀 Características Principales

📁 Estructura del Proyecto

⚙️ Instalación y Configuración

🔐 Roles de Usuario

📊 Módulos del Sistema

🔍 API Documentation

🤝 Contribución

🎯 Descripción del Proyecto
SIGLAD es un sistema web desarrollado para optimizar y digitalizar los procesos de gestión aduanera. Permite la administración de declaraciones DUCA, validación de documentos y seguimiento de operaciones de importación/exportación con control de acceso basado en roles.

🏗️ Arquitectura del Sistema






Componentes Principales:
Frontend: Aplicación React con diseño responsive

Backend: API RESTful con Node.js y Express

Base de Datos: PostgreSQL con estructura relacional

Balanceador: Distribución de carga para alta disponibilidad

Infraestructura: Despliegue en nube (AWS/Google Cloud/Render)

🛠️ Stack Tecnológico
Frontend
React 18 - Framework principal

SweetAlert2 - Alertas y notificaciones premium

CSS3 - Estilos y animaciones

Axios - Cliente HTTP para APIs

Backend
Node.js - Runtime de JavaScript

Express.js - Framework web

JWT - Autenticación por tokens

bcryptjs - Encriptación de contraseñas

CORS - Control de acceso entre dominios

Base de Datos
PostgreSQL - Base de datos relacional

PG - Cliente PostgreSQL para Node.js

Seguridad
JWT Tokens - Autenticación stateless

Bcrypt - Hash de contraseñas

Validación multi-nivel - Frontend y backend

Bitácora de auditoría - Registro de todas las operaciones

👥 Casos de Uso Implementados
🔐 CU-001: Autenticación de Usuarios con Roles
Objetivo: Garantizar acceso seguro al sistema mediante autenticación con credenciales válidas y control de permisos por roles.

Flujo Principal:

Usuario ingresa credenciales

Sistema valida y genera token JWT

Redirección según rol del usuario

Características:

Tokens JWT con expiración de 2 horas

Encriptación bcrypt para contraseñas

Bitácora de intentos de acceso

Roles: Administrador, Transportista, Agente Aduanero

👥 CU-002: Gestión de Usuarios (Administrador)
Objetivo: Permitir al Administrador mantener actualizado el registro de usuarios del sistema.

Funcionalidades:

Crear, editar y eliminar usuarios

Asignación de roles y estados

Validación de correos únicos

Registro en bitácora de operaciones

Reglas de Negocio:

Solo administradores pueden gestionar usuarios

Validación de campos obligatorios

Prevención de duplicados de correo

📝 CU-003: Registro de Declaración Aduanera (Transportista)
Objetivo: Digitalizar el registro de declaraciones aduaneras para mejorar la trazabilidad de mercancías y facilitar la validación aduanera.

Flujo Principal:

Transportista ingresa datos DUCA mediante JSON

Sistema valida formato según Anexo II

Validación de importador activo

Almacenamiento con estado "Pendiente"

Estructura DUCA:

json
{
  "duca": {
    "numeroDocumento": "GT2025DUCA001234",
    "fechaEmision": "2025-10-04",
    "paisEmisor": "GT",
    "tipoOperacion": "IMPORTACION",
    "exportador": { ... },
    "importador": { ... },
    "transporte": { ... },
    "mercancias": {
      "numeroItems": 2,
      "items": [ ... ]
    },
    "valores": { ... },
    "estadoDocumento": "CONFIRMADO",
    "firmaElectronica": "AB12CD34EF56GH78"
  }
}
Validaciones:

Formato JSON según Anexo II

Campos obligatorios completos

Unicidad del número DUCA

Estructura de mercancías válida

🔍 CU-004: Validación de Declaración (Agente Aduanero)
Objetivo: Garantizar el control y revisión de las declaraciones para evitar inconsistencias y fraudes en el proceso aduanero.

Flujo Principal:

Agente consulta declaraciones pendientes

Selecciona declaración para validación

Verifica información completa

Aprueba o rechaza con motivo

Información Revisada:

Datos básicos DUCA (número, fecha, país)

Información de exportador/importador

Detalles de transporte y ruta

Valores y mercancías declaradas

Estado documental y firma electrónica

Estados Post-Validación:

✅ Validada - Cumple con todos los requisitos

❌ Rechazada - Requiere correcciones (con motivo)

📊 CU-005: Consulta de Estado de Declaración
Objetivo: Permitir a los transportistas consultar el estado de sus declaraciones de manera transparente y en tiempo real.

Funcionalidades:

Lista completa de declaraciones propias

Filtros por estado (Pendiente, Validada, Rechazada)

Vista detallada de cada declaración

Seguimiento del proceso de validación

Estados Disponibles:

⏳ Pendiente - En espera de validación

✅ Validada - Aprobada por agente aduanero

❌ Rechazada - Requiere correcciones

🚀 Características Principales
✨ Interfaz de Usuario
Design System coherente y profesional

Modo oscuro premium en todas las vistas

Responsive design para dispositivos móviles

Alertas elegantes con SweetAlert2

Scroll personalizado transparente y discreto

🔒 Seguridad y Auditoría
Autenticación JWT con expiración configurable

Control de acceso basado en roles

Bitácora completa de todas las operaciones

Validación multi-capas (frontend y backend)

Manejo seguro de errores y excepciones

📊 Gestión de Declaraciones
Formularios DUCA completos según normativa

Validación en tiempo real de datos

Estados de declaración (Pendiente, Validada, Rechazada)

Seguimiento completo del proceso

Múltiples items de mercancía por declaración

📁 Estructura del Proyecto
text
siglad/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LogoutButton.jsx
│   │   │   └── LogoutButton.css
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── declarationService.js
│   │   ├── pages/
│   │   │   ├── UserManagement.jsx
│   │   │   ├── TransportistaPanel.jsx
│   │   │   ├── DeclaracionManagement.jsx
│   │   │   ├── ConsultaEstado.jsx
│   │   │   ├── ValidacionDeclaraciones.jsx
│   │   │   └── AgentePanel.jsx
│   │   └── styles/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── declarations.js
│   └── middleware/
│       └── auth.js
└── database/
    └── schema.sql
⚙️ Instalación y Configuración
Prerrequisitos
Node.js 18+

PostgreSQL 15+

npm o yarn

Instalación
bash
# Clonar repositorio
git clone https://github.com/tu-usuario/siglad.git
cd siglad

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
Configuración
bash
# Variables de entorno (backend/.env)
DATABASE_URL=postgresql://usuario:password@localhost:5432/siglad
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
Ejecución
bash
# Iniciar backend
cd backend
npm run dev

# Iniciar frontend (terminal nueva)
cd frontend
npm run dev
🔐 Roles de Usuario
👨‍💼 Administrador
Gestión completa de usuarios

Visualización de estadísticas globales

Administración del sistema

Acceso a bitácoras de auditoría

🚛 Transportista
Registro de declaraciones DUCA

Consulta de estado de declaraciones

Gestión de sus propias declaraciones

Visualización de historial personal

👮‍♂️ Agente Aduanero
Validación de declaraciones pendientes

Aprobación o rechazo de DUCA

Consulta de historial y estadísticas

Registro de motivos de rechazo

📊 Módulos del Sistema
🏠 Panel de Administrador
Gestión de usuarios (CRUD completo)

Estadísticas del sistema

Bitácora de operaciones

Monitorización del sistema

📝 Gestión de Declaraciones (Transportista)
Formulario DUCA completo según Anexo II

Múltiples items de mercancía

Cálculo automático de valores

Validación en tiempo real

Consulta de estados

🔍 Validación (Agente Aduanero)
Lista de declaraciones pendientes

Validación detallada de documentos

Aprobación/rechazo con motivos

Estadísticas de validación

Historial de decisiones

📊 Consulta de Estados
Filtros por estado (Pendiente, Validada, Rechazada)

Vista detallada de declaraciones

Estadísticas personalizadas

Seguimiento del proceso completo

🔍 API Documentation
Autenticación
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
Gestión de Declaraciones
http
POST /api/declaraciones
Authorization: Bearer {token}
Content-Type: application/json

{
  "duca": {
    "numeroDocumento": "GT2025DUCA001234",
    "fechaEmision": "2025-10-04",
    // ... estructura completa según Anexo II
  }
}
Validación de Declaraciones
http
POST /api/declaraciones/agente/validar/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "accion": "aprobar|rechazar",
  "motivoRechazo": "Motivo opcional para rechazo"
}
Consulta de Estados
http
GET /api/declaraciones
Authorization: Bearer {token}
🗃️ Base de Datos
Esquema Principal
sql
-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de declaraciones
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
    estado_documento VARCHAR(20) NOT NULL,
    firma_electronica VARCHAR(64) NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    agente_validador_id INTEGER REFERENCES usuarios(id),
    motivo_rechazo TEXT,
    fecha_validacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de bitácora
CREATE TABLE bitacora (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    ip_origen VARCHAR(45) NOT NULL,
    operacion VARCHAR(50) NOT NULL,
    resultado VARCHAR(50) NOT NULL,
    numero_declaracion VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🤝 Contribución
¡Las contribuciones son bienvenidas! Por favor:

Fork el proyecto

Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

Guía de Estilo
Seguir las convenciones de código existentes

Incluir documentación para nuevas funcionalidades

Probar cambios exhaustivamente

Mantener compatibilidad con versiones anteriores

<div align="center">
🚀 SIGLAD - Sistema de Gestión Logística Aduanera
*Versión 1.0 - Implementación Completa de 5 Casos de Uso*

Desarrollado con ❤️ por el equipo SIGLAD

Reportar Bug ·
Solicitar Feature ·
Documentación

*© 2025 SIGLAD - Todos los derechos reservados*

</div>