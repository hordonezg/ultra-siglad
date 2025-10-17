<!-- ===================== BADGES ANIMADOS ===================== -->
<div align="center">
  <img src="https://img.shields.io/badge/SIGLAD-Sistema%20Aduanero-blue" style="margin:5px; animation: bounce 2s infinite;">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js&logoColor=white" style="margin:5px; animation: bounce 2s infinite;">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white" style="margin:5px; animation: bounce 2s infinite;">
  <img src="https://img.shields.io/badge/PostgreSQL-15-orange?logo=postgresql&logoColor=white" style="margin:5px; animation: bounce 2s infinite;">
  <img src="https://img.shields.io/badge/JWT-yellow?logo=jsonwebtokens&logoColor=black" style="margin:5px; animation: bounce 2s infinite;">
</div>

<style>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
body { background-color:#121212; color:#f0f0f0; }
pre { background-color:#1e1e1e; color:#c5c5c5; padding:15px; border-radius:5px; overflow-x:auto; }
.card { background-color:#2e2e2e; color:#f0f0f0; padding:20px; border-radius:10px; margin-bottom:20px; }
</style>

---

# 🚛 SIGLAD - Sistema de Gestión Logística Aduanera

Sistema integral para la gestión de declaraciones aduaneras con roles múltiples

---

## 📋 Tabla de Contenidos

- 🎯 [Descripción del Proyecto](#descripción-del-proyecto)  
- 🏗️ [Arquitectura del Sistema](#arquitectura-del-sistema)  
- 🛠️ [Stack Tecnológico](#stack-tecnológico)  
- 👥 [Casos de Uso Implementados](#casos-de-uso-implementados)  
- 🚀 [Características Principales](#características-principales)  
- 📁 [Estructura del Proyecto](#estructura-del-proyecto)  
- ⚙️ [Instalación y Configuración](#instalación-y-configuración)  
- 🔐 [Roles de Usuario](#roles-de-usuario)  
- 📊 [Módulos del Sistema](#módulos-del-sistema)  
- 🔍 [API Documentation](#api-documentation)  
- 🗃️ [Base de Datos](#base-de-datos)  
- 🤝 [Contribución](#contribución)  

---

## 🎯 Descripción del Proyecto

<div class="card">
SIGLAD es un sistema web desarrollado para optimizar y digitalizar los procesos de gestión aduanera. Permite la administración de declaraciones DUCA, validación de documentos y seguimiento de operaciones de importación/exportación con control de acceso basado en roles.
</div>

---

## 🏗️ Arquitectura del Sistema

<div class="card">
**Componentes Principales:**  
- **Frontend:** Aplicación React con diseño responsive  
- **Backend:** API RESTful con Node.js y Express  
- **Base de Datos:** PostgreSQL con estructura relacional  
- **Balanceador:** Distribución de carga para alta disponibilidad  
- **Infraestructura:** Despliegue en nube (AWS / Google Cloud / Render)
</div>

---

## 🛠️ Stack Tecnológico

<div class="card">
**Frontend:**  
- React 18 – Framework principal  
- SweetAlert2 – Alertas y notificaciones premium  
- CSS3 – Estilos y animaciones  
- Axios – Cliente HTTP para APIs  

**Backend:**  
- Node.js – Runtime de JavaScript  
- Express.js – Framework web  
- JWT – Autenticación por tokens  
- bcryptjs – Encriptación de contraseñas  
- CORS – Control de acceso entre dominios  

**Base de Datos:**  
- PostgreSQL – Base de datos relacional  
- pg – Cliente PostgreSQL para Node.js  

**Seguridad:**  
- JWT Tokens – Autenticación stateless  
- Bcrypt – Hash de contraseñas  
- Validación multi-nivel – Frontend y backend  
- Bitácora de auditoría – Registro de todas las operaciones
</div>

---

## 👥 Casos de Uso Implementados

### 🔐 CU-001: Autenticación de Usuarios con Roles
<div class="card">
**Objetivo:** Garantizar acceso seguro mediante credenciales válidas y control de permisos.  

**Flujo Principal:**  
1. Usuario ingresa credenciales  
2. Sistema valida y genera token JWT  
3. Redirección según rol del usuario  

**Características:**  
- Tokens JWT con expiración de 2 horas  
- Encriptación bcrypt para contraseñas  
- Bitácora de intentos de acceso  
- Roles: Administrador, Transportista, Agente Aduanero
</div>

### 👥 CU-002: Gestión de Usuarios (Administrador)
<div class="card">
**Objetivo:** Permitir al Administrador mantener actualizado el registro de usuarios.  

**Funcionalidades:**  
- Crear, editar y eliminar usuarios  
- Asignación de roles y estados  
- Validación de correos únicos  
- Registro en bitácora de operaciones  

**Reglas de Negocio:**  
- Solo administradores pueden gestionar usuarios  
- Validación de campos obligatorios  
- Prevención de duplicados de correo
</div>

### 📝 CU-003: Registro de Declaración Aduanera (Transportista)
<div class="card">
**Objetivo:** Digitalizar el registro de declaraciones aduaneras para mejorar la trazabilidad de mercancías y facilitar la validación aduanera.  

**Flujo Principal:**  
1. Transportista ingresa datos DUCA mediante JSON  
2. Sistema valida formato según Anexo II  
3. Validación de importador activo  
4. Almacenamiento con estado "Pendiente"  

**Estructura DUCA:**
<pre>
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
</pre>

**Validaciones:**  
- Formato JSON según Anexo II  
- Campos obligatorios completos  
- Unicidad del número DUCA  
- Estructura de mercancías válida
</div>

### 🔍 CU-004: Validación de Declaración (Agente Aduanero)
<div class="card">
**Objetivo:** Garantizar control y revisión de las declaraciones para evitar inconsistencias y fraudes.  

**Flujo Principal:**  
1. Agente consulta declaraciones pendientes  
2. Selecciona declaración para validación  
3. Verifica información completa  
4. Aprueba o rechaza con motivo  

**Información Revisada:**  
- Datos básicos DUCA (número, fecha, país)  
- Información de exportador/importador  
- Detalles de transporte y ruta  
- Valores y mercancías declaradas  
- Estado documental y firma electrónica  

**Estados Post-Validación:**  
- ✅ Validada - Cumple todos los requisitos  
- ❌ Rechazada - Requiere correcciones (con motivo)
</div>

### 📊 CU-005: Consulta de Estado de Declaración
<div class="card">
**Objetivo:** Permitir a transportistas consultar el estado de sus declaraciones de manera transparente y en tiempo real.  

**Funcionalidades:**  
- Lista completa de declaraciones propias  
- Filtros por estado (Pendiente, Validada, Rechazada)  
- Vista detallada de cada declaración  
- Seguimiento del proceso de validación  

**Estados Disponibles:**  
- ⏳ Pendiente  
- ✅ Validada  
- ❌ Rechazada
</div>

---

## 🚀 Características Principales

<div class="card">
**Interfaz de Usuario:**  
- Design System coherente y profesional  
- Modo oscuro premium en todas las vistas  
- Responsive design para móviles y escritorio  
- Alertas elegantes con SweetAlert2  
- Scroll transparente y discreto  

**Seguridad y Auditoría:**  
- Autenticación JWT con expiración configurable  
- Control de acceso por roles  
- Bitácora completa de operaciones  
- Validación multi-capas  
- Manejo seguro de errores y excepciones  

**Gestión de Declaraciones:**  
- Formularios DUCA completos según normativa  
- Validación en tiempo real  
- Estados de declaración (Pendiente, Validada, Rechazada)  
- Seguimiento completo del proceso  
- Múltiples items por declaración
</div>

---

## 📁 Estructura del Proyecto
<div class="card">
<pre>
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
</pre>
</div>

---

## ⚙️ Instalación y Configuración
<div class="card">
**Prerrequisitos:** Node.js 18+, PostgreSQL 15+, npm o yarn  

**Instalación:**
```bash
git clone https://github.com/tu-usuario/siglad.git
cd siglad

cd backend
npm install

cd ../frontend
npm install
Configuración (.env backend):

bash
Copiar código
DATABASE_URL=postgresql://usuario:password@localhost:5432/siglad
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
Ejecución:

bash
Copiar código
cd backend
npm run dev

cd frontend
npm run dev
</div>
🔐 Roles de Usuario
<div class="card"> **Administrador** - Gestión completa de usuarios - Visualización de estadísticas globales - Administración del sistema - Acceso a bitácoras de auditoría
Transportista

Registro de declaraciones DUCA

Consulta de estado de declaraciones

Gestión de sus propias declaraciones

Visualización de historial personal

Agente Aduanero

Validación de declaraciones pendientes

Aprobación o rechazo de DUCA

Consulta de historial y estadísticas

Registro de motivos de rechazo

</div>
📊 Módulos del Sistema
<div class="card"> **Panel de Administrador:** Gestión de usuarios, estadísticas, bitácora, monitorización **Gestión de Declaraciones (Transportista):** Formulario DUCA completo, múltiples items, cálculo automático de valores, validación en tiempo real, consulta de estados **Validación (Agente Aduanero):** Lista de declaraciones pendientes, validación detallada, aprobación/rechazo con motivos, estadísticas y historial **Consulta de Estados:** Filtros por estado, vista detallada de declaraciones, estadísticas personalizadas, seguimiento completo </div>
🔍 API Documentation
<div class="card"> **Autenticación:** `POST /api/auth/login` ```json { "email": "usuario@ejemplo.com", "password": "contraseña" } ```
Gestión de Declaraciones:
POST /api/declaraciones

json
Copiar código
{
  "duca": {
    "numeroDocumento": "GT2025DUCA001234",
    "fechaEmision": "2025-10-04"
    // ... estructura completa según Anexo II
  }
}
Validación por Agente:
POST /api/declaraciones/agente/validar/{id}

json
Copiar código
{
  "accion": "aprobar|rechazar",
  "motivoRechazo": "Motivo opcional para rechazo"
}
Consulta de Estados:
GET /api/declaraciones

</div>
🗃️ Base de Datos
<div class="card"> **Esquema Principal (SQL):** ```sql -- Tabla de usuarios CREATE TABLE usuarios ( id SERIAL PRIMARY KEY, nombre VARCHAR(100) NOT NULL, correo VARCHAR(100) UNIQUE NOT NULL, contrasena VARCHAR(255) NOT NULL, rol VARCHAR(20) NOT NULL, activo BOOLEAN DEFAULT true, fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
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

yaml
Copiar código
</div>

---

## 🤝 Contribución
<div class="card">
¡Las contribuciones son bienvenidas!  

- Fork el proyecto  
- Crear rama para feature (`git checkout -b feature/AmazingFeature`)  
- Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)  
- Push a la rama (`git push origin feature/AmazingFeature`)  
- Abrir Pull Request  

**Guía de Estilo:**  
- Seguir convenciones de código existentes  
- Incluir documentación para nuevas funcionalidades  
- Probar cambios exhaustivamente  
- Mantener compatibilidad con versiones anteriores
</div>

---

<div align="center">
🚀 **SIGLAD - Sistema de Gestión Logística Aduanera**  
*Versión 1.0 - Implementación Completa de 5 Casos de Uso*  

Desarrollado con ❤️ por el equipo SIGLAD  

Reportar Bug · Solicitar Feature · Documentación  

© 2025 SIGLAD - Todos los derechos reservados
</div>