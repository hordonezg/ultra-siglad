<!-- ==========================
🚛 SIGLAD - Sistema de Gestión Logística Aduanera
Diseño profesional con logos, badges, e íconos SVG
=========================== -->

<div align="center">

# 🚛 **SIGLAD - Sistema de Gestión Logística Aduanera**

### _Sistema integral para la gestión de declaraciones aduaneras_

---

<!-- 🔹 Logos SVG interactivos -->
<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" height="80" alt="Node.js Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" height="80" alt="React Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" height="80" alt="PostgreSQL Logo" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://jwt.io/img/pic_logo.svg" height="80" alt="JWT Logo" />
</p>

<!-- 🔹 Badges -->
<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/SIGLAD-Sistema%20Aduanero-blue?style=for-the-badge" alt="SIGLAD Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js" alt="Node.js Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/PostgreSQL-15-orange?style=for-the-badge&logo=postgresql" alt="PostgreSQL Badge"/>
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Autenticación-JWT-yellow?style=for-the-badge&logo=jsonwebtokens" alt="JWT Badge"/>
  </a>
</p>

<p align="center">
  <em>Versión 1.0 — Implementación Completa de 5 Casos de Uso</em><br>
  Desarrollado con ❤️ por el equipo <strong>SIGLAD</strong>
</p>

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
**SIGLAD** es un sistema web integral diseñado para **digitalizar y optimizar procesos aduaneros**.  
Permite la administración de **declaraciones DUCA**, validación de documentos y seguimiento de operaciones de importación/exportación con acceso basado en roles.

---

## 🏗️ Arquitectura del Sistema

```mermaid
graph TD
  A[Frontend - React] -->|Axios| B[API REST - Node.js/Express]
  B --> C[(PostgreSQL Database)]
  B --> D[JWT Authentication Service]
  C --> E[Bitácora de Auditoría]
Componentes Clave:

🖥️ Frontend: React 18 con diseño responsive

⚙️ Backend: Node.js + Express

🗄️ Base de Datos: PostgreSQL 15

🔐 Autenticación: JWT + bcrypt

☁️ Infraestructura: Render / AWS / Google Cloud

🛠️ Stack Tecnológico
💻 Frontend
⚛️ React 18

💅 SweetAlert2

🎨 CSS3 y animaciones

🔗 Axios

🧠 Backend
🟩 Node.js / Express.js

🔐 JWT + bcryptjs

🌐 CORS

🗃️ Base de Datos
🐘 PostgreSQL

🧩 pg

🛡️ Seguridad
Validación multi-nivel (frontend/backend)

Bitácora completa de operaciones

Hash seguro de contraseñas

👥 Casos de Uso Implementados
🔐 CU-001: Autenticación de Usuarios con Roles
Validación con JWT

Encriptación bcrypt

Redirección automática según rol

👨‍💼 CU-002: Gestión de Usuarios (Administrador)
CRUD completo de usuarios

Validación de correos únicos

Registro automático en bitácora

🚛 CU-003: Registro de Declaración Aduanera
Ingreso de DUCA en formato JSON

Validación de estructura y campos

Estados: Pendiente / Validada / Rechazada

👮‍♂️ CU-004: Validación de Declaraciones
Revisión de exportador/importador

Validación documental y firma electrónica

Control de estado de cada DUCA

📊 CU-005: Consulta de Estado
Filtros por estado

Detalle y trazabilidad completa

🚀 Características Principales
✨ Interfaz de Usuario

Modo oscuro 🌙

Diseño profesional y responsive

Alertas personalizadas (SweetAlert2)

🔒 Seguridad

JWT con expiración configurable

Control por roles

Bitácora detallada

📦 Gestión de Declaraciones

Validación en tiempo real

Seguimiento completo

Múltiples ítems por DUCA

📁 Estructura del Proyecto
bash
Copiar código
siglad/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── pages/
│   │   └── styles/
├── backend/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── database/
    └── schema.sql
⚙️ Instalación y Configuración
🔧 Prerrequisitos
Node.js ≥ 18

PostgreSQL ≥ 15

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
⚙️ Variables de Entorno
bash
Copiar código
# backend/.env
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
Rol	Descripción
👨‍💼 Administrador	Gestión de usuarios, bitácora, estadísticas
🚛 Transportista	Registro y consulta de declaraciones
👮‍♂️ Agente Aduanero	Validación y control documental

📊 Módulos del Sistema
🏠 Panel Administrador: CRUD usuarios, estadísticas, bitácora

📝 Gestión DUCA: Registro, validación y seguimiento

🔍 Validación Aduanera: Control de DUCA y firmas

📈 Consulta de Estados: Visualización y filtros

🔍 API Documentation (Ejemplo)
http
Copiar código
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
http
Copiar código
POST /api/declaraciones
Authorization: Bearer {token}
Content-Type: application/json
{
  "duca": {
    "numeroDocumento": "GT2025DUCA001234",
    "fechaEmision": "2025-10-04"
  }
}
🗃️ Base de Datos (Resumen)
sql
Copiar código
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  contrasena VARCHAR(255),
  rol VARCHAR(20),
  activo BOOLEAN DEFAULT true
);
🤝 Contribución
Fork al proyecto

Crear rama feature/AmazingFeature

Commit: git commit -m "Add AmazingFeature"

Push: git push origin feature/AmazingFeature

Pull Request 🚀

<div align="center">
🚀 SIGLAD v1.0 — Implementación Completa de 5 Casos de Uso
Desarrollado con ❤️ por el equipo SIGLAD
© 2025 SIGLAD — Todos los derechos reservados

<a href="#">📘 Documentación</a> •
<a href="#">🐞 Reportar Bug</a> •
<a href="#">✨ Solicitar Feature</a>

</div> ```