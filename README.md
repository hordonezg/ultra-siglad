<div align="center">

# 🚛 **SIGLAD - Sistema de Gestión Logística Aduanera**

[![SIGLAD](https://img.shields.io/badge/SIGLAD-Sistema%20Aduanero-blue)](#)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-orange?logo=postgresql&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/Autenticación-JWT-yellow?logo=jsonwebtokens&logoColor=black)](#)

**Sistema integral para la gestión de declaraciones aduaneras con roles múltiples**

---

<!-- Animación suave (rotación hover) -->
<style>
@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
.tech-icon {
  transition: transform 0.3s ease-in-out;
}
.tech-icon:hover {
  animation: rotate 1.5s linear infinite;
}
</style>

<p align="center">
  <img class="tech-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="60" />
  <img class="tech-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="60" />
  <img class="tech-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="60" />
  <img class="tech-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="60" />
  <img class="tech-icon" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="60" />
</p>

</div>

---

## 📋 Tabla de Contenidos
- 🎯 Descripción del Proyecto
- 🏗️ Arquitectura del Sistema
- 🛠️ Stack Tecnológico
- 👥 Casos de Uso Implementados
- 🚀 Características Principales
- 📁 Estructura del Proyecto
- ⚙️ Instalación y Configuración
- 🔐 Roles de Usuario
- 📊 Módulos del Sistema
- 🔍 API Documentation
- 🤝 Contribución

---

## 🎯 Descripción del Proyecto
**SIGLAD** es un sistema web desarrollado para optimizar y digitalizar los procesos de gestión aduanera.  
Permite la administración de declaraciones **DUCA**, validación de documentos y seguimiento de operaciones con control de acceso basado en roles.

---

## 🏗️ Arquitectura del Sistema

**Componentes Principales:**
- **Frontend:** Aplicación React con diseño responsive  
- **Backend:** API RESTful con Node.js y Express  
- **Base de Datos:** PostgreSQL con estructura relacional  
- **Balanceador:** Distribución de carga para alta disponibilidad  
- **Infraestructura:** Despliegue en nube (AWS/Google Cloud/Render)

---

## 🛠️ Stack Tecnológico

### 🔹 **Frontend**
- React 18  
- SweetAlert2  
- CSS3  
- Axios  

### 🔹 **Backend**
- Node.js  
- Express.js  
- JWT  
- bcryptjs  
- CORS  

### 🔹 **Base de Datos**
- PostgreSQL  
- PG Driver  

### 🔹 **Seguridad**
- JWT Tokens  
- Bcrypt  
- Validación multi-nivel  
- Bitácora de auditoría  

---

## 👥 Casos de Uso Implementados

### 🔐 CU-001: Autenticación de Usuarios con Roles
**Objetivo:** Garantizar acceso seguro al sistema mediante autenticación con credenciales válidas y control de permisos por roles.

**Flujo Principal:**
1. Usuario ingresa credenciales  
2. Sistema valida y genera token JWT  
3. Redirección según rol del usuario  

**Características:**
- Tokens JWT con expiración de 2 horas  
- Encriptación bcrypt  
- Bitácora de intentos de acceso  

**Roles:** Administrador, Transportista, Agente Aduanero

---

### 👥 CU-002: Gestión de Usuarios (Administrador)
**Objetivo:** Permitir al Administrador mantener actualizado el registro de usuarios del sistema.

**Funcionalidades:**
- Crear, editar y eliminar usuarios  
- Asignación de roles y estados  
- Validación de correos únicos  
- Registro en bitácora  

---

### 📝 CU-003: Registro de Declaración Aduanera (Transportista)
**Objetivo:** Digitalizar el registro de declaraciones aduaneras.

```json
{
  "duca": {
    "numeroDocumento": "GT2025DUCA001234",
    "fechaEmision": "2025-10-04",
    "paisEmisor": "GT",
    "tipoOperacion": "IMPORTACION",
    "exportador": { },
    "importador": { },
    "transporte": { },
    "mercancias": {
      "numeroItems": 2,
      "items": []
    },
    "valores": { },
    "estadoDocumento": "CONFIRMADO",
    "firmaElectronica": "AB12CD34EF56GH78"
  }
}
Validaciones:

Formato JSON según Anexo II

Campos obligatorios completos

Unicidad del número DUCA

🔍 CU-004: Validación de Declaración (Agente Aduanero)
Flujo Principal:

Agente consulta declaraciones pendientes

Selecciona declaración

Verifica información

Aprueba o rechaza con motivo

Estados Post-Validación:

✅ Validada

❌ Rechazada

📊 CU-005: Consulta de Estado de Declaración
Funcionalidades:

Lista completa de declaraciones

Filtros por estado

Vista detallada

Estados Disponibles:

⏳ Pendiente

✅ Validada

❌ Rechazada

🚀 Características Principales
✨ Interfaz de Usuario moderna y responsive

🔒 Autenticación JWT

📈 Validación multi-capas

🧾 Bitácora completa

💼 Seguimiento de DUCA en tiempo real

📁 Estructura del Proyecto
text
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
🔧 Prerrequisitos
Node.js 18+

PostgreSQL 15+

npm o yarn

🧩 Instalación
bash
Copiar código
git clone https://github.com/tu-usuario/siglad.git
cd siglad

cd backend
npm install

cd ../frontend
npm install
⚙️ Configuración
bash
Copiar código
DATABASE_URL=postgresql://usuario:password@localhost:5432/siglad
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
▶️ Ejecución
bash
Copiar código
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
🔐 Roles de Usuario
Rol	Permisos
👨‍💼 Administrador	CRUD de usuarios, estadísticas, bitácora
🚛 Transportista	Registro y consulta de declaraciones
👮‍♂️ Agente Aduanero	Validación y aprobación/rechazo

🗃️ Base de Datos
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
🤝 Contribución
Fork el proyecto

Crea una rama (feature/AmazingFeature)

Commit (git commit -m 'Add feature')

Push (git push origin feature/AmazingFeature)

Abre un Pull Request

<div align="center">
🚀 SIGLAD - Sistema de Gestión Logística Aduanera
Versión 1.0 - Implementación Completa de 5 Casos de Uso
Desarrollado con ❤️ por el equipo SIGLAD

📄 Reportar Bug · 🚀 Solicitar Feature · 📘 Documentación

© 2025 SIGLAD — Todos los derechos reservados

</div> ```