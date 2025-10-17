<!-- Encabezado con logos animados -->
<div align="center">

<style>
/* Animación suave compatible con VSCode/GitHub */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.logo:hover {
  animation: rotate 1.5s linear infinite;
}
</style>

<img class="logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="70" style="margin:0 15px;">
<img class="logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="70" style="margin:0 15px;">
<img class="logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="70" style="margin:0 15px;">
<img class="logo" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg" width="70" style="margin:0 15px;">

<h1>🚛 SIGLAD - Sistema de Gestión Logística Aduanera</h1>
<h3>Sistema integral para la gestión de declaraciones aduaneras con roles múltiples</h3>

<p>
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white" alt="React Badge"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql&logoColor=white" alt="PostgreSQL Badge"/>
  <img src="https://img.shields.io/badge/JWT-Security-orange?logo=jsonwebtokens&logoColor=white" alt="JWT Badge"/>
</p>

**Versión 1.0 — Implementación Completa de 5 Casos de Uso**  
_Desarrollado con ❤️ por el equipo SIGLAD_

---

</div>

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

**SIGLAD** es un sistema web diseñado para optimizar los procesos de gestión aduanera, permitiendo administrar declaraciones **DUCA**, validar documentos y realizar seguimiento de operaciones con control de acceso por roles.

**Objetivos clave:**
- Digitalización de procesos de importación/exportación  
- Validación conforme al **Anexo II de la DUCA**  
- Auditoría completa y trazabilidad  

---

## 🏗️ Arquitectura del Sistema

**Componentes principales:**
- **Frontend:** React 18 (interfaz moderna y responsive)  
- **Backend:** Node.js + Express (API RESTful)  
- **Base de Datos:** PostgreSQL (estructura relacional optimizada)  
- **Autenticación:** JWT Tokens  
- **Infraestructura:** Despliegue escalable en Render / AWS / GCP  

```mermaid
graph TD
  F[Frontend - React] --> API[API REST - Node.js / Express]
  API --> DB[(PostgreSQL)]
  API --> AUTH[JWT Auth Service]
  API --> LOG[Bitácora / Auditoría]
🛠️ Stack Tecnológico
Categoría	Tecnologías
Frontend	React 18, SweetAlert2, CSS3, Axios
Backend	Node.js, Express, JWT, bcryptjs, CORS
Base de Datos	PostgreSQL, pg Driver
Seguridad	JWT Tokens, Bcrypt, Validación multi-nivel, Bitácora de auditoría

👥 Casos de Uso Implementados
🔐 CU-001: Autenticación de Usuarios con Roles
Validación JWT con expiración de 2 horas

Encriptación segura (bcrypt)

Redirección por rol: Admin / Transportista / Agente

👨‍💼 CU-002: Gestión de Usuarios (Administrador)
CRUD de usuarios con validación de correos únicos

Registro en bitácora

Reglas de negocio: solo administradores gestionan usuarios

🚛 CU-003: Registro de Declaración Aduanera
Carga de DUCA en formato JSON

Validaciones automáticas según Anexo II

Control de estado: Pendiente / Validada / Rechazada

🔍 CU-004: Validación de Declaración (Agente Aduanero)
Revisión completa de DUCA

Aprobación o rechazo con motivo

Registro automático en bitácora

📊 CU-005: Consulta de Estado de Declaración
Filtros por estado

Vista detallada con seguimiento

Reporte histórico por usuario

🚀 Características Principales
💎 Interfaz premium con modo oscuro y diseño corporativo

🧩 Arquitectura modular por microservicios

🧠 Validación inteligente en frontend y backend

📈 Reportes dinámicos en PDF/Excel

🔒 Seguridad avanzada basada en roles y JWT

🌐 Compatibilidad multiplataforma

📁 Estructura del Proyecto
bash
Copiar código
siglad/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── LogoutButton.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── pages/
│   │   │   ├── UserManagement.jsx
│   │   │   ├── TransportistaPanel.jsx
│   │   │   └── ValidacionDeclaraciones.jsx
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js
└── database/
    └── schema.sql
⚙️ Instalación y Configuración
🔧 Prerrequisitos
Node.js 18+

PostgreSQL 15+

npm o yarn

⚙️ Instalación
bash
Copiar código
# Clonar repositorio
git clone https://github.com/tu-usuario/siglad.git
cd siglad

# Instalar backend
cd backend
npm install

# Instalar frontend
cd ../frontend
npm install
🌐 Configuración (.env)
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
👨‍💼 Administrador	Gestión completa, estadísticas, bitácora
🚛 Transportista	Registro y consulta de declaraciones
👮‍♂️ Agente Aduanero	Validación y aprobación/rechazo

📊 Módulos del Sistema
🏠 Panel de Administrador — Control total del sistema

📝 Gestión de Declaraciones — DUCA digital

🔍 Validación Aduanera — Verificación avanzada

📈 Consultas y Reportes — Seguimiento completo

🗃️ Base de Datos (Esquema Simplificado)
sql
Copiar código
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  contrasena VARCHAR(255),
  rol VARCHAR(20),
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🤝 Contribución
¡Las contribuciones son bienvenidas!

Forkea el proyecto

Crea una rama (feature/AmazingFeature)

Realiza commits (git commit -m "Add feature")

Sube tus cambios (git push origin feature/AmazingFeature)

Abre un Pull Request

<div align="center">
✨ SIGLAD - Sistema de Gestión Logística Aduanera
Versión 1.0 — Implementación Completa de 5 Casos de Uso
Desarrollado con ❤️ por el equipo SIGLAD

📄 Reportar Bug • 🚀 Solicitar Feature • 📘 Documentación

© 2025 SIGLAD — Todos los derechos reservados 🚛

</div> ```