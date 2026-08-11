# Yanapiri Wawa (Ayudante del Bebé)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Yanapiri Wawa es una plataforma web progresiva (PWA) de alto rendimiento y API REST en NestJS diseñada para la asistencia en el monitoreo nutricional y de crecimiento infantil en entornos comunitarios urbanos y rurales. Conecta el registro asistido en el hogar realizado por los cuidadores con la triaje y priorización del personal de salud (CRED) y las visitas de campo de los actores sociales comunitarios.

---

## Propuesta de Valor y Principio Clínico

El proyecto resuelve la brecha entre los controles presenciales asistenciales (CRED) y el día a día del menor en el hogar mediante el registro guiado de **Peso, Talla y Perímetro Braquial (MUAC)**. Las mediciones son evaluadas en tiempo real por un motor de reglas basado en los estándares de la OMS (Z-Scores) para generar alertas de prioridad clínica (Rojo, Amarillo, Verde).

> ⚠️ **Guardarraíl Clínico:** Yanapiri Wawa **no realiza diagnósticos médicos** de anemia ni desnutrición. El sistema actúa como una herramienta de triaje y alerta temprana que sugiere derivaciones oportunas a profesionales de la salud capacitados.

### 🌟 Características Principales
- **Asistente NLU Multilingüe (Yanapiri Mikhuy):** Chatbot inteligente con reconocimiento de intenciones (NLU) y Text-to-Speech (TTS). Entiende Español, Quechua y Aymara.
- **Simulador de Costo-Efectividad Nutricional:** Herramienta interactiva que diseña canastas básicas ricas en hierro según el presupuesto y la región (Costa, Sierra, Selva).
- **Triaje Automático (OMS/MINSA):** Clasificación automática de mediciones antropométricas mediante Z-Score y MUAC, emitiendo alertas tipo Semáforo.
- **Aislamiento de Datos por Roles (RBAC):** Privacidad absoluta. Los cuidadores solo ven a sus hijos, y los agentes solo a su zona jurisdiccional.

---

## 📚 Documentación Avanzada (Deep Dive)
Si deseas entender a profundidad la lógica científica y arquitectónica de Yanapiri Wawa, consulta nuestra documentación especializada:
- [🧠 Arquitectura NLU y Chatbot](docs/AI_NLU_ARCHITECTURE.md): Diagramas de secuencia de la inteligencia artificial.
- [🏥 Reglas Clínicas OMS/MINSA](docs/CLINICAL_RULES.md): Fórmulas matemáticas (LMS), umbrales MUAC y fuentes oficiales.
- [⚙️ Arquitectura Edge Server](docs/ARCHITECTURE.md): Sincronización offline, IndexedDB y bases de datos locales.

---




## Análisis Multi-Beneficio por Perfil de Usuario

Yanapiri Wawa ha sido diseñado analizando de manera exhaustiva las necesidades operativas de cada uno de los 4 actores del ecosistema de salud infantil:

### 1. Cuidador / Familia (Madre / Padre)
- **Prevención Temprana de Anemia y Desnutrición:** Permite detectar caídas o desviaciones en la curva de peso, talla y perímetro braquial (MUAC) en el propio hogar antes de que se conviertan en cuadros clínicos severos.
- **Educación Nutricional Accesible por Voz (*Yanapiri Mikhuy Voice*):** Permite a madres o cuidadores con dificultades de lectura consultar recetas y reemplazos del ticket de mercado mediante un Chatbot flotante interactivo nativo a **costo $0**.
- **Personalización Económica:** El Simulador de Costo-Efectividad arma estrategias de alimentación basadas en el presupuesto real de la familia para curar la anemia sin golpear el bolsillo.
- **Cero Gasto de Datos y Almacenamiento:** PWA ultra ligera (< 500 KB) que funciona 100% offline sin consumir datos móviles ni espacio en teléfonos Android antiguos de gama baja.
- **Recordatorios Asistenciales Oportunos:** Notificaciones Push nativas y contador Badge en el icono de la pantalla de inicio sobre fechas de vacunas y controles CRED pendientes.

### 2. Actor Social / Agente Comunitario (Visitas en Campo)
- **Priorización Eficiente de Visitas en Campo:** Mapa y lista inteligente de visitas domiciliarias ordenadas automáticamente por semáforo de riesgo (Rojo, Amarillo, Verde), optimizando tiempos de caminata en comunidades rurales dispersas.
- **Operatividad 100% Offline en Selva y Sierra:** Permite registrar la bitácora de visita y observaciones cualitativas sin señal de internet; los datos se sincronizan solos (Background Sync) al regresar a la posta médica o zona con Wi-Fi.
- **Sustitución del Cuaderno Físico por Registro Digital:** Reemplaza fichas de papel manuscritas por registros digitales estructurados con fecha, hora y coordenadas generales.
- **Escaneo Rápido de Carnet CRED por QR:** Identificación instantánea del carnet físico del niño mediante la cámara del teléfono sin necesidad de tipear códigos largos.

### 3. Profesional de Salud / Personal CRED (Médico / Enfermero)
- **Triaje Clínico Automatizado (Z-Score OMS):** Clasificación automática del nivel de riesgo nutricional reduciendo el tiempo de cálculo manual en consulta presencial.
- **Continuidad de Cuidado Casa - Centro de Salud:** Vincula directamente las mediciones tomadas en casa por los padres con la historia clínica del establecimiento de salud.
- **Visualización Gráfica Interactiva de Percentiles:** Curvas dinámicas de crecimiento (Peso/Edad, Talla/Edad, Peso/Talla) con gráficos interactivos Recharts para evaluación de tendencias.
- **Soberanía y Protección de Datos Médicos (Edge Computing):** Los datos pueden almacenarse en el servidor local de la posta médica (SQLite / NestJS Edge) garantizando privacidad médica al 100% sin dependencia de suscripciones en la nube.

### 4. Administrador / Coordinador Regional
- **Toma de Decisiones basada en Datos Reales:** Reportes consolidados y gráficos de tendencias regionales (Costa, Sierra, Selva) y efectividad de derivaciones en tiempo real.
- **Transparencia e Integridad de Datos:** Portal Público de Impacto con analítica de primera parte y recálculo automático cada 15 minutos sin cookies de terceros ni rastreadores comerciales.
- **Trazabilidad y Auditoría Completa (Audit Logs):** Registro detallado de quién ingresó, modificó o atendió cada alerta clínica para cumplimiento normativo.
- **Sostenibilidad Económica ($0 Costo de Infraestructura):** Ejecución en hardware reciclado (PCs/laptops usadas en postas) con costo de licencias de $0.

---

## Arquitectura de Servidor de Borde (Edge Server) a Costo $0

Para garantizar que Yanapiri Wawa funcione en las postas médicas más aisladas del Perú, diseñamos una arquitectura resiliente y asíncrona (Offline-First) que sincroniza datos cuando vuelve la conexión.

[Ver diagrama detallado de la arquitectura de Edge Server ⚙️](docs/ARCHITECTURE.md)

---

## Stack Tecnológico

### Frontend
- **Framework & Lenguaje:** React 19, TypeScript, Vite 6.
- **Estilos & UI:** Tailwind CSS v4, Lucide Icons, componentes accesibles.
- **Visualización de Datos:** Recharts para curvas de percentiles OMS.
- **PWA & Offline:** Service Worker con caché dinámico, IndexedDB, Workbox Background Sync y App Badging API.

### Backend (NestJS + Prisma)
- **Framework:** NestJS 11 (Node.js).
- **ORM & Persistencia:** Prisma ORM 7 con conector SQLite (`@prisma/adapter-better-sqlite3`) y soporte listo para PostgreSQL.
- **Autenticación & Seguridad:** JSON Web Tokens (`@nestjs/jwt`), Hashing de contraseñas con `bcryptjs`, CORS habilitado.
- **Testing:** Jest para pruebas unitarias de controladores y servicios.

---

## Estructura del Proyecto

```text
Yanapiriwawa-Crecer-Mejor/
├── backend/                  # Servidor Principal NestJS & API REST
│   ├── prisma/
│   │   ├── schema.prisma     # Esquema relacional de base de datos
│   │   └── seed.ts           # Script de datos semilla (Usuarios, Niños, Mediciones)
│   ├── src/
│   │   ├── auth/             # Autenticación JWT y Login/Registro
│   │   ├── patients/         # Gestión de Niños/Pacientes
│   │   ├── measurements/     # Registro antropométrico y motor de alertas OMS
│   │   ├── public-impact/    # Portal Público de Transparencia de Impacto
│   │   ├── prisma/           # Servicio e inyección global de Prisma Client
│   │   ├── app.module.ts     # Módulo principal NestJS
│   │   └── main.ts           # Punto de entrada y configuración de CORS
│   └── package.json          # Dependencias y scripts de backend NestJS
├── docs/                     # Documentación técnica de arquitectura
│   └── ARCHITECTURE.md       # Diagramas y flujos de arquitectura Edge Server
├── public/
│   ├── foods/                # Catálogo de imágenes de superalimentos (Macro Close-up)
│   └── pwa-sw.js             # Service Worker con Background Sync & Push
├── src/
│   ├── app/
│   │   ├── components/       # Componentes UI (Diccionario, Curvas OMS, Paneles, Modales QR/Voz)
│   │   ├── contexts/         # Contextos React (Auth, Data, State)
│   │   ├── lib/              # Cliente API, pwa-capabilities y utilidades
│   │   └── pages/            # Páginas por rol (Familia, Agente, Profesional, Admin, Transparencia)
│   ├── main.tsx              # Punto de entrada React
│   └── index.css             # Estilos globales y Tailwind CSS
├── package.json              # Dependencias de Frontend
└── vite.config.ts            # Configuración de empaquetado Vite
```

---

## Instalación y Ejecución

### Requisitos Previos
- **Node.js:** v18.0.0 o superior.
- **npm:** v9.0.0 o superior.

---

### Paso 1: Configurar y Ejecutar el Backend NestJS

1. Dirígete a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```
3. Genera el cliente de Prisma e inicializa la base de datos SQLite con datos semilla:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. Inicia el servidor de desarrollo NestJS:
   ```bash
   npm run start:dev
   ```
   El backend estará ejecutándose en `http://localhost:3000`.

---

### Paso 2: Configurar y Ejecutar el Frontend React

1. Desde la raíz del proyecto, instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
   La interfaz gráfica estará disponible en `http://localhost:5173`. Puedes acceder al portal de transparencia en `http://localhost:5173/transparencia`.

---

## Pruebas Automatizadas

### Pruebas del Backend NestJS
Para ejecutar la suite de pruebas unitarias con Jest:
```bash
npm test --prefix backend
```

### Pruebas de Compilación del Frontend
Para validar la compilación y tipado estático del frontend:
```bash
npm run build
```

---

## Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulte el archivo [LICENSE](LICENSE) para más detalles.