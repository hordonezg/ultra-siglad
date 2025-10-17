<div align="center">

<!-- ===========================
  Encabezado principal - LOGOS SVG animados (rotación)
  Nota: las animaciones usan <animateTransform> (SMIL).
  Algunas plataformas/visores usan sanitización; si no giran en GitHub,
  se visualizan como SVG estáticos pero siguen siendo corporativos.
=========================== -->

<!-- Contenedor de logos -->
<p>
  <!-- Node.js SVG (rotación continua) -->
  <svg width="90" height="90" viewBox="0 0 256 256" aria-hidden="true" role="img" style="margin:0 14px">
    <title>Node.js</title>
    <g transform="translate(128 128)">
      <g transform="translate(-128 -128)">
        <path d="M128 0L250 64v128L128 256 6 192V64z" fill="#3C873A"/>
        <path d="M128 36l96 48v88l-96 48-96-48V84z" fill="#8CC84B" opacity="0.08"/>
        <!-- Node hex + "node" text simplified for README -->
      </g>
    </g>
    <g transform="translate(128 140)">
      <g>
        <text x="-40" y="12" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#ffffff">Node</text>
      </g>
    </g>
    <animateTransform attributeName="transform" attributeType="XML"
      type="rotate" from="0 45 45" to="360 45 45" dur="6s" repeatCount="indefinite"/>
  </svg>

  <!-- React SVG -->
  <svg width="110" height="90" viewBox="0 0 841.9 595.3" aria-hidden="true" role="img" style="margin:0 14px">
    <title>React</title>
    <!-- simplified React atom -->
    <g transform="translate(420,300)" fill="none" stroke="#61DAFB" stroke-width="18">
      <ellipse rx="260" ry="100" />
      <ellipse rx="260" ry="100" transform="rotate(60)"/>
      <ellipse rx="260" ry="100" transform="rotate(120)"/>
      <circle r="32" fill="#61DAFB" stroke="none"/>
    </g>
    <animateTransform attributeName="transform" attributeType="XML"
      type="rotate" from="0 55 45" to="-360 55 45" dur="8s" repeatCount="indefinite"/>
  </svg>

  <!-- PostgreSQL SVG -->
  <svg width="90" height="90" viewBox="0 0 512 512" aria-hidden="true" role="img" style="margin:0 14px">
    <title>PostgreSQL</title>
    <!-- Elephant head simplified -->
    <g transform="translate(0,40)">
      <ellipse cx="256" cy="220" rx="180" ry="120" fill="#336791"/>
      <path d="M150 230 q60 -80 212 -60 q-40 40 -10 108 q-150 -20 -202 -48z" fill="#fff" opacity="0.12"/>
      <circle cx="210" cy="190" r="12" fill="#fff"/>
    </g>
    <animateTransform attributeName="transform" attributeType="XML"
      type="rotate" from="0 45 45" to="360 45 45" dur="10s" repeatCount="indefinite"/>
  </svg>

  <!-- JWT SVG (simple) -->
  <svg width="80" height="80" viewBox="0 0 100 100" aria-hidden="true" role="img" style="margin:0 14px">
    <title>JWT</title>
    <g>
      <rect x="6" y="14" width="88" height="72" rx="8" fill="#f6c94b"/>
      <text x="50" y="55" font-family="Arial, Helvetica, sans-serif" font-size="14" text-anchor="middle" fill="#222">JWT</text>
    </g>
    <animateTransform attributeName="transform" attributeType="XML"
      type="rotate" from="0 40 40" to="360 40 40" dur="7s" repeatCount="indefinite"/>
  </svg>
</p>

<h1 style="margin-bottom:6px">🚛 SIGLAD - Sistema de Gestión Logística Aduanera</h1>

<p style="margin-top:0.2rem;"><strong>Sistema integral para la gestión de declaraciones aduaneras con roles múltiples</strong></p>

<p>
  <img src="https://img.shields.io/badge/SIGLAD-Sistema%20Aduanero-blue?style=for-the-badge" alt="SIGLAD Badge" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js" alt="Node.js Badge" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React Badge" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-orange?style=for-the-badge&logo=postgresql" alt="PostgreSQL Badge" />
  <img src="https://img.shields.io/badge/Autenticaci%C3%B3n-JWT-yellow?style=for-the-badge&logo=jsonwebtokens" alt="JWT Badge" />
</p>

<p><em>Versión 1.0 — Implementación Completa de 5 Casos de Uso</em></p>
<p>Desarrollado con ❤️ por el equipo <strong>SIGLAD</strong></p>

<hr style="width:80%;border:1px solid #e6e6e6;">
</div>

---

## 📋 Tabla de Contenidos
- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [👥 Casos de Uso Implementados](#-casos-de-uso-implementados)
- [🚀 Características Principales](#-características-principales)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Instalación y Configuración](#️-instalación-y-configuración)
- [🔐 Roles de Usuario](#-roles-de-usuario)
- [📊 Módulos del Sistema](#-módulos-del-sistema)
- [🔍 API Documentation](#-api-documentation)
- [🗃️ Base de Datos](#️-base-de-datos)
- [🤝 Contribución](#-contribución)

---

## 🎯 Descripción del Proyecto
**SIGLAD** es un sistema web desarrollado para optimizar y digitalizar los procesos de gestión aduanera.  
Permite la administración de **declaraciones DUCA**, validación de documentos y seguimiento de operaciones de importación/exportación con control de acceso basado en roles.

---

## 🏗️ Arquitectura del Sistema

**Componentes Principales:**

- **Frontend:** Aplicación **React** con diseño responsive.  
- **Backend:** **API RESTful** con **Node.js** y **Express**.  
- **Base de Datos:** **PostgreSQL** con estructura relacional.  
- **Balanceador:** Distribución de carga para alta disponibilidad.  
- **Infraestructura:** Despliegue en nube (AWS / Google Cloud / Render).

```mermaid
graph TD
  F[Frontend - React] --> API[API REST - Node.js/Express]
  API --> DB[(PostgreSQL)]
  API --> Auth[JWT Auth Service]
  API --> Logger[Bitácora / Auditoría]
🛠️ Stack Tecnológico
Frontend
React 18 – Framework principal

SweetAlert2 – Alertas y notificaciones

CSS3 – Estilos y animaciones

Axios – Cliente HTTP

Backend
Node.js – Runtime JavaScript

Express.js – Framework web

JWT – Autenticación por tokens

bcryptjs – Encriptación de contraseñas

CORS – Control de acceso entre dominios

Base de Datos
PostgreSQL – Base de datos relacional

pg – Cliente PostgreSQL para Node.js

Seguridad
JWT Tokens – Autenticación stateless

Bcrypt – Hash de contraseñas

Validación multi-nivel – Frontend y backend

Bitácora de auditoría – Registro de todas las operaciones

👥 Casos de Uso Implementados
🔐 CU-001: Autenticación de Usuarios con Roles
Objetivo: Garantizar acceso seguro al sistema mediante autenticación con credenciales válidas y control de permisos por roles.

Flujo principal:

Usuario ingresa credenciales

Sistema valida y genera token JWT

Redirección según rol del usuario

Características:

Tokens JWT con expiración de 2 horas

Encriptación con bcrypt

Bitácora de intentos de acceso

Roles: Administrador, Transportista, Agente Aduanero

👥 CU-002: Gestión de Usuarios (Administrador)
Objetivo: Permitir al Administrador mantener actualizado el registro de usuarios del sistema.

Funcionalidades:

Crear, editar y eliminar usuarios

Asignación de roles y estados

Validación de correos únicos

Registro en bitácora de operaciones

Reglas de negocio:

Solo administradores pueden gestionar usuarios

Validación de campos obligatorios

Prevención de duplicados de correo

📝 CU-003: Registro de Declaración Aduanera (Transportista)
Objetivo: Digitalizar el registro de declaraciones aduaneras para mejorar la trazabilidad.

Flujo principal:

Transportista ingresa datos DUCA mediante JSON

Sistema valida formato según Anexo II

Validación de importador activo

Almacenamiento con estado "Pendiente"

Ejemplo (estructura DUCA):

json
Copiar código
{
  "duca": {
    "numeroDocumento": "GT2025DUCA001234",
    "fechaEmision": "2025-10-04",
    "paisEmisor": "GT",
    "tipoOperacion": "IMPORTACION",
    "exportador": { /* ... */ },
    "importador": { /* ... */ },
    "transporte": { /* ... */ },
    "mercancias": {
      "numeroItems": 2,
      "items": [ /* ... */ ]
    },
    "valores": { /* ... */ },
    "estadoDocumento": "CONFIRMADO",
    "firmaElectronica": "AB12CD34EF56GH78"
  }
}
Validaciones principales:

Formato JSON según Anexo II

Campos obligatorios completos

Unicidad del número DUCA

Estructura de mercancías válida

🔍 CU-004: Validación de Declaración (Agente Aduanero)
Objetivo: Garantizar el control y revisión de las declaraciones.

Flujo principal:

Agente consulta declaraciones pendientes

Selecciona declaración para validación

Verifica información completa

Aprueba o rechaza con motivo

Revisiones:

Datos DUCA (número, fecha, país)

Exportador / importador

Transporte y ruta

Valores y mercancías

Firma electrónica

Estados post-validación:

✅ Validada

❌ Rechazada (con motivo)

📊 CU-005: Consulta de Estado de Declaración
Objetivo: Permitir a transportistas consultar el estado de sus declaraciones.

Funcionalidades:

Lista de declaraciones propias

Filtros por estado (Pendiente, Validada, Rechazada)

Vista detallada y seguimiento

Estados disponibles:

⏳ Pendiente

✅ Validada

❌ Rechazada

🚀 Características Principales
✨ Interfaz de Usuario
Design System coherente y profesional

Modo oscuro premium en todas las vistas

Responsive design para móviles y escritorio

Alertas con SweetAlert2

Scroll y UX pulido

🔒 Seguridad y Auditoría
Autenticación JWT con expiración configurable

Control de acceso por roles

Bitácora completa de operaciones

Validación multi-capas (frontend & backend)

Manejo seguro de errores y excepciones

📊 Gestión de Declaraciones
Formularios DUCA completos según normativa

Validación en tiempo real

Estados declarativos y seguimiento

Múltiples ítems por declaración

📁 Estructura del Proyecto (Resumen)
pgsql
Copiar código
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
Copiar código
# Clonar repositorio
git clone https://github.com/tu-usuario/siglad.git
cd siglad

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
Configuración (backend/.env)
bash
Copiar código
DATABASE_URL=postgresql://usuario:password@localhost:5432/siglad
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
Ejecución
bash
Copiar código
# Iniciar backend
cd backend
npm run dev

# Iniciar frontend (en otra terminal)
cd ../frontend
npm run dev
🔐 Roles de Usuario
👨‍💼 Administrador

Gestión completa de usuarios

Visualización de estadísticas

Acceso a bitácoras

🚛 Transportista

Registro de declaraciones DUCA

Consulta de estado y historial

👮‍♂️ Agente Aduanero

Validación de declaraciones

Aprobación o rechazo con motivo

Registro de estadísticas y motivos

📊 Módulos del Sistema
🏠 Panel de Administrador — Gestión de usuarios, estadísticas, bitácora

📝 Gestión de Declaraciones — Formulario DUCA, validación, cálculo de valores

🔍 Validación — Revisión detallada de DUCA por agentes

📈 Consulta de Estados — Filtros, vistas y seguimiento en tiempo real

🔍 API Documentation (Ejemplos)
Autenticación

http
Copiar código
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
Gestión de Declaraciones

http
Copiar código
POST /api/declaraciones
Authorization: Bearer {token}
Content-Type: application/json

{
  "duca": { /* estructura DUCA según Anexo II */ }
}
Validación por Agente

http
Copiar código
POST /api/declaraciones/agente/validar/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "accion": "aprobar|rechazar",
  "motivoRechazo": "Motivo opcional"
}
Consulta de Declaraciones

http
Copiar código
GET /api/declaraciones
Authorization: Bearer {token}
🗃️ Base de Datos (Esquema Principal)
sql
Copiar código
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
¡Las contribuciones son bienvenidas!

Fork el proyecto

Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m "Add some AmazingFeature")

Push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

Guía de estilo: seguir convenciones del proyecto, documentar nuevas funcionalidades y probar cambios exhaustivamente.

<div align="center" markdown="1"> 🚀 **SIGLAD - Sistema de Gestión Logística Aduanera** *Versión 1.0 — Implementación Completa de 5 Casos de Uso*
Desarrollado con ❤️ por el equipo SIGLAD

Reportar Bug · Solicitar Feature · Documentación

© 2025 SIGLAD - Todos los derechos reservados

</div>