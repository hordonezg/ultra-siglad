<!-- Encabezado centrado con logos -->
<div align="center">

  <!-- Logos SVG con rotación al pasar el mouse -->
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" width="80" height="80" style="margin: 0 15px; transition: transform 0.4s;" onmouseover="this.style.transform='rotate(360deg)'" onmouseout="this.style.transform='rotate(0deg)'"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="80" height="80" style="margin: 0 15px; transition: transform 0.4s;" onmouseover="this.style.transform='rotate(360deg)'" onmouseout="this.style.transform='rotate(0deg)'"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="80" height="80" style="margin: 0 15px; transition: transform 0.4s;" onmouseover="this.style.transform='rotate(360deg)'" onmouseout="this.style.transform='rotate(0deg)'"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="80" height="80" style="margin: 0 15px; transition: transform 0.4s;" onmouseover="this.style.transform='rotate(360deg)'" onmouseout="this.style.transform='rotate(0deg)'"/>

  <h1>🚛 SIGLAD - Sistema de Gestión Logística Aduanera</h1>
  <h3>Sistema integral para la gestión de declaraciones aduaneras</h3>

  <p><b>Versión 1.0</b> — Implementación Completa de 5 Casos de Uso</p>
  <p>Desarrollado con ❤️ por el equipo <b>SIGLAD</b></p>

  <hr style="width:80%;border:1px solid #ccc;">
</div>

---

## 🏢 Acerca del Proyecto

**SIGLAD (Sistema de Gestión Logística Aduanera)** es una solución integral diseñada para optimizar y automatizar los procesos de gestión aduanera.  
Permite registrar, administrar y supervisar las **declaraciones aduaneras**, asegurando el cumplimiento normativo y la trazabilidad total de cada operación.

Este sistema fue desarrollado con un enfoque **modular**, **escalable** y **seguro**, aplicando las mejores prácticas de arquitectura de software empresarial.

---

## ⚙️ Tecnologías Utilizadas

<div align="center">

| Frontend | Backend | Base de Datos | UI Framework | Herramientas |
|-----------|----------|----------------|----------------|---------------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" width="50" height="50"/> Angular 19 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" width="50" height="50"/> Spring Boot 3.4 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="50" height="50"/> PostgreSQL 15 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="50" height="50"/> Bootstrap 5 | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" width="50" height="50"/> VS Code |
  
</div>

---

## 🚀 Funcionalidades Principales

- 📦 **Gestión de Declaraciones Aduaneras**: Registro, validación y seguimiento en tiempo real.  
- 👥 **Control de Usuarios y Roles**: Accesos seguros por perfil (Administrador, Transportista, Revisor).  
- 📑 **Emisión de Reportes y Auditorías** en PDF y Excel.  
- 🔍 **Consulta Inteligente** por filtros dinámicos.  
- 🌐 **Interfaz moderna y adaptable (responsive)** para escritorio y móvil.

---

## 🧩 Arquitectura General

Estructura basada en **microservicios**, siguiendo principios **RESTful**, conectados a través de un **API Gateway (Zuul)** y registrados en **Eureka**.

[ Angular (Frontend) ]
|
[ Gateway (Zuul) ]
|
[ Servicios: Usuario | Declaraciones | Transportista ]
|
[ PostgreSQL Database ]

yaml
Copiar código

---

## 🧰 Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/siglad.git

# Ingresar al directorio principal
cd siglad

# Ejecutar backend (Spring Boot)
./mvnw spring-boot:run

# Ejecutar frontend (Angular)
ng serve -o
📸 Vista Previa
<div align="center"> <img src="https://github.com/yourusername/siglad-demo/blob/main/preview.gif?raw=true" width="80%" alt="Vista previa del sistema SIGLAD"> </div>
👥 Equipo de Desarrollo
Integrante	Rol
Bryan Méndez	Líder Técnico / Arquitectura
Ana López	Frontend Developer
Carlos Gómez	Backend Developer
Laura Ramírez	QA & Documentación

🏁 Estado del Proyecto
✅ Implementación completa de los 5 casos de uso principales.
🚧 Próximamente: Integración con servicios externos y módulo de trazabilidad avanzada.

<div align="center">
✨ Desarrollado con pasión por el equipo SIGLAD 🚛
© 2025 - Todos los derechos reservados.

</div>