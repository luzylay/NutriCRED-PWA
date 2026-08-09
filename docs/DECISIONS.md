# Registro de Decisiones de Arquitectura (DECISIONS.md) - Yanapiri Wawa

Este documento registra las decisiones técnicas clave tomadas durante el diseño del MVP de **Yanapiri Wawa**, justificando los motivos de elección técnica.

---

## 🏛️ ADR-001: Elección de PWA (Progressive Web App) en lugar de App Nativa

- **Contexto:** Los cuidadores principales (madres/padres en zonas rurales) usan smartphones de gama baja/media con espacio de almacenamiento limitado y conectividad inestable.
- **Decisión:** Desarrollar el cliente móvil inicialmente como una PWA basada en React/Vite.
- **Justificación:**
  1. **Instalación sin fricción:** La PWA se agrega a la pantalla de inicio desde el navegador sin requerir descargas pesadas desde Google Play Store.
  2. **Multiplataforma con base de código única:** Un único desarrollo web responde a iOS y Android.
  3. **Peso mínimo:** Ocupa menos de 2 MB de almacenamiento local.
  4. **Portabilidad TWA:** Puede empaquetarse fácilmente como una Trusted Web Activity (TWA) para subirla a Play Store en el futuro sin reescribir código.

---

## 🏛️ ADR-002: Elección de FastAPI (Python) para el Backend

- **Contexto:** Se requiere una API REST con validación ágil, soporte rápido para cálculos matemáticos (Rules Engine) e integraciones futuras.
- **Decisión:** Implementar el backend utilizando FastAPI en Python.
- **Justificación:**
  1. **Velocidad de ejecución:** Basado en Starlette y Pydantic, ofrece un rendimiento comparable a Go y Node.js.
  2. **Autodocumentación:** Genera automáticamente el esquema OpenAPI interactivo (Swagger) en `/docs`.
  3. **Ecosistema de Ciencia de Datos:** Python facilita enormemente la integración futura de modelos predictivos y procesamiento de curvas de crecimiento.

---

## 🏛️ ADR-003: Motor de Base de Datos Dual (SQLite / PostgreSQL)

- **Contexto:** El MVP se despliega localmente para hackathons/demos, pero debe estar listo para escalabilidad corporativa.
- **Decisión:** Configurar SQLAlchemy con soporte dual, usando SQLite local por defecto y PostgreSQL en producción a través de la variable de entorno `DATABASE_URL`.
- **Justificación:**
  1. **Portabilidad:** SQLite permite ejecutar la demo completa de forma local sin requerir instalación de servidores de base de datos complejos.
  2. **Flexibilidad:** Cambiar a una base de datos distribuida en la nube (PostgreSQL en AWS/RDS) solo requiere cambiar la variable de entorno, sin tocar una sola línea de código SQL del backend.

---

## 🏛️ ADR-004: Reglas Clínicas basadas en Estándares vs. IA Generativa

- **Contexto:** Se requiere interpretar las mediciones para evaluar el riesgo nutricional del menor.
- **Decisión:** Utilizar un motor de reglas inmutable basado en estándares (OMS/UNICEF) codificado directamente en Python, en lugar de modelos de lenguaje (LLMs) o IA generativa.
- **Justificación:**
  1. **Seguridad Clínica (Cero Alucinaciones):** Un menor no puede estar expuesto a falsos positivos/negativos producto de alucinaciones de modelos probabilísticos.
  2. **Trazabilidad y Defendibilidad:** Cada alerta generada se asocia de forma determinista y auditable a una directiva oficial de salud (OMS/MINSA).

---

## 🏛️ ADR-005: Arquitectura Monolítica Modular

- **Contexto:** Estructuración y organización del código para el crecimiento del MVP.
- **Decisión:** Construir el software como un monolito modular bien estructurado, manteniendo carpetas independientes para Auth, DB, Rules Engine y Seed.
- **Justificación:**
  - Evita la complejidad prematura y costes de latencia/orquestación de microservicios (Kubernetes, colas de mensajes distribuidas) durante la etapa de hackathon/MVP.
  - Al estar fuertemente modularizado, cada paquete puede ser extraído a un servicio independiente en el futuro.

---

## 🏛️ ADR-006: Estrategia de Almacenamiento Offline-First

- **Contexto:** La conectividad a internet en comunidades rurales y centros CRED es intermitente o inexistente.
- **Decisión:** Diseñar la PWA para interceptar las desconexiones, guardar los datos en una cola en LocalStorage / IndexedDB y sincronizarlos secuencialmente mediante peticiones idempotentes cuando retorne la red.
- **Justificación:**
  - Evita la pérdida accidental de mediciones tomadas en el hogar.
  - Mejora el "Time-to-Value" del producto al permitir que el cuidador use la app sin preocuparse por la señal telefónica.
