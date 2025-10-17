<!-- ===================== BADGES CON MOVIMIENTO ===================== -->
<div align="center">
  <a href="#"><img src="https://img.shields.io/badge/SIGLAD-Sistema%20Aduanero-blue" alt="SIGLAD" style="margin:5px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)';" onmouseout="this.style.transform='scale(1)';"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-18%2B-green" alt="Node.js" style="margin:5px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)';" onmouseout="this.style.transform='scale(1)';"></a>
  <a href="#"><img src="https://img.shields.io/badge/React-18-blue" alt="React" style="margin:5px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)';" onmouseout="this.style.transform='scale(1)';"></a>
  <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-15-orange" alt="PostgreSQL" style="margin:5px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)';" onmouseout="this.style.transform='scale(1)';"></a>
  <a href="#"><img src="https://img.shields.io/badge/Autenticación-JWT-yellow" alt="JWT" style="margin:5px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)';" onmouseout="this.style.transform='scale(1)';"></a>
</div>

<style>
body { background-color:#121212; color:#f0f0f0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
pre { background-color:#1e1e1e; color:#c5c5c5; padding:15px; border-radius:5px; overflow-x:auto; }
.card { background-color:#2e2e2e; color:#f0f0f0; padding:20px; border-radius:10px; margin-bottom:20px; }
.json { background-color:#1e1e1e; color:#9cdcfe; padding:15px; border-radius:5px; overflow-x:auto; }
.sql { background-color:#1e1e1e; color:#b5cea8; padding:15px; border-radius:5px; overflow-x:auto; }
.folder { color:#c586c0; }
.file { color:#9cdcfe; }
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
- **Frontend:** React 18 con diseño responsive  
- **Backend:** API RESTful con Node.js y Express  
- **Base de Datos:** PostgreSQL con estructura relacional  
- **Balanceador:** Distribución de carga para alta disponibilidad  
- **Infraestructura:** Despliegue en nube (AWS / Google Cloud / Render)
</div>

---

## 🛠️ Stack Tecnológico
<div class="card">
**Frontend:**  
- React 18  
- SweetAlert2  
- CSS3  
- Axios  

**Backend:**  
- Node.js  
- Express.js  
- JWT  
- bcryptjs  
- CORS  

**Base de Datos:**  
- PostgreSQL  
- pg  

**Seguridad:**  
- JWT Tokens  
- Bcrypt  
- Validación multi-nivel  
- Bitácora de auditoría
</div>

---

## 👥 Casos de Uso Implementados

### 🔐 CU-001: Autenticación de Usuarios con Roles
<div class="card">
**Objetivo:** Acceso seguro al sistema y control por roles.  

**Flujo:**  
1. Usuario ingresa credenciales  
2. Sistema valida y genera JWT  
3. Redirección según rol  

**Roles:** Administrador, Transportista, Agente Aduanero
</div>

### 👥 CU-002: Gestión de Usuarios (Administrador)
<div class="card">
**Objetivo:** Administrar usuarios del sistema.  

**Funcionalidades:** Crear, editar, eliminar usuarios; asignar roles; validación de correos únicos.  
**Reglas:** Solo administradores pueden gestionar usuarios.
</div>

### 📝 CU-003: Registro de Declaración Aduanera (Transportista)
<div class="card">
**Objetivo:** Registro digital de DUCA para trazabilidad y validación.  

**Flujo:**  
1. Transportista ingresa datos DUCA (JSON)  
2. Validación de formato y datos  
3. Almacenamiento con estado "Pendiente"  

**Estructura DUCA:**
<div class="json">
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
      "items": [ ]
    },
    "valores": { },
    "estadoDocumento": "CONFIRMADO",
    "firmaElectronica": "AB12CD34EF56GH78"
  }
}
</div> **Validaciones:** Formato JSON correcto, campos obligatorios completos, DUCA único. </div>
🔍 CU-004: Validación de Declaración (Agente Aduanero)
<div class="card"> **Objetivo:** Control y revisión de declaraciones.
Flujo:

Consultar declaraciones pendientes

Validar o rechazar con motivo

Registrar acciones en bitácora

</div>
📊 CU-005: Consulta de Estado de Declaración
<div class="card"> **Objetivo:** Transparencia y seguimiento de declaraciones.
Funcionalidades:

Filtrado por estado

Vista detallada

Seguimiento completo
Estados: ⏳ Pendiente, ✅ Validada, ❌ Rechazada

</div>
🚀 Características Principales
<div class="card"> - Modo oscuro en toda la interfaz - Alertas elegantes con SweetAlert2 - Validación de datos en tiempo real - Bitácora y auditoría completa - Responsive design </div>
📁 Estructura del Proyecto
<div class="card"> <pre> <span class="folder">siglad/</span> ├── <span class="folder">frontend/</span> │ ├── <span class="folder">src/</span> │ │ ├── <span class="folder">components/</span> │ │ │ ├── <span class="file">LogoutButton.jsx</span> │ │ │ └── <span class="file">LogoutButton.css</span> │ │ ├── <span class="folder">services/</span> │ │ │ ├── <span class="file">authService.js</span> │ │ │ └── <span class="file">declarationService.js</span> │ │ ├── <span class="folder">pages/</span> │ │ │ ├── <span class="file">UserManagement.jsx</span> │ │ │ ├── <span class="file">TransportistaPanel.jsx</span> │ │ │ ├── <span class="file">DeclaracionManagement.jsx</span> │ │ │ ├── <span class="file">ConsultaEstado.jsx</span> │ │ │ ├── <span class="file">ValidacionDeclaraciones.jsx</span> │ │ │ └── <span class="file">AgentePanel.jsx</span> │ │ └── <span class="folder">styles/</span> ├── <span class="folder">backend/</span> │ ├── <span class="file">server.js</span> │ ├── <span class="folder">routes/</span> │ │ ├── <span class="file">auth.js</span> │ │ ├── <span class="file">users.js</span> │ │ └── <span class="file">declarations.js</span> │ └── <span class="folder">middleware/</span> │ └── <span class="file">auth.js</span> └── <span class="folder">database/</span> └── <span class="file">schema.sql</span> </pre> </div>
⚙️ Instalación y Configuración
<div class="card"> **Prerrequisitos:** Node.js 18+, PostgreSQL 15+
Instalación:

bash
Copiar código
git clone https://github.com/tu-usuario/siglad.git
cd siglad
cd backend && npm install
cd ../frontend && npm install
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
<div class="card"> **Administrador:** Gestión de usuarios, estadísticas, bitácora. **Transportista:** Registro y seguimiento de DUCA. **Agente Aduanero:** Validación de declaraciones. </div>
📊 Módulos del Sistema
<div class="card"> - Panel de Administrador - Gestión de Declaraciones (Transportista) - Validación (Agente Aduanero) - Consulta de Estados </div>
🔍 API Documentation
<div class="card"> - POST /api/auth/login - POST /api/declaraciones - POST /api/declaraciones/agente/validar/{id} - GET /api/declaraciones </div>
🗃️ Base de Datos
<div class="card"> <div class="sql"> ```sql CREATE TABLE usuarios ( id SERIAL PRIMARY KEY, nombre VARCHAR(100) NOT NULL, correo VARCHAR(100) UNIQUE NOT NULL, contrasena VARCHAR(255) NOT NULL, rol VARCHAR(20) NOT NULL, activo BOOLEAN DEFAULT true, fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP );
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
</div>

---

## 🤝 Contribución
<div class="card">
- Fork → Crear rama → Commit → Push → Pull Request  
- Seguir convenciones de código  
- Documentar nuevas funcionalidades  
- Probar cambios exhaustivamente
</div>

---

<div align="center">
🚀 SIGLAD - Sistema de Gestión Logística Aduanera  
*Versión 1.0 - Implementación Completa de 5 Casos de Uso*  

Desarrollado con ❤️ por el equipo SIGLAD  

Reportar Bug · Solicitar Feature · Documentación  

*© 2025 SIGLAD - Todos los derechos reservados*
</div>