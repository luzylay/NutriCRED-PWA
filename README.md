# Yanapiri Wawa (Ayudante del Bebé)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Yanapiri Wawa es una plataforma web progresiva (PWA) de alto rendimiento y API REST en NestJS para la asistencia en el monitoreo nutricional y crecimiento infantil en entornos comunitarios urbanos y rurales. Conecta el registro asistido en el hogar por los cuidadores con la triaje y priorización del personal de salud (CRED) y las visitas de campo de los actores sociales comunitarios.

---

## Propuesta de Valor y Principio Clínico

El proyecto resuelve la brecha entre los controles presenciales asistenciales (CRED) y el día a día del menor en el hogar mediante el registro guiado de **Peso, Talla y Perímetro Braquial (MUAC)**. Las mediciones son evaluadas en tiempo real por un motor de reglas basado en los estándares de la OMS (Z-Scores) para generar alertas de prioridad clínica (Rojo, Amarillo, Verde).

> ⚠️ **Guardarraíl Clínico:** Yanapiri Wawa **no realiza diagnósticos médicos** de anemia ni desnutrición. El sistema actúa como una herramienta de triaje y alerta temprana que sugiere derivaciones oportunas a profesionales de la salud capacitados.

---

## Pilares Tecnológicos e Innovaciones ($0 Costo de Infraestructura)

1. **PWA de Ultra Baja Latencia (< 500 KB):**
   - Diseñada para maximizar la retención en mercados emergentes y zonas rurales de Perú con baja conectividad.
   - Posesión de capacidades nativas completas sin requerir descargas pesadas de tiendas de aplicaciones.

2. **Capacidades Nativas Web (Proyecto Fugu W3C):**
   - **App Badging API (`navigator.setAppBadge`):** Muestra un contador de notificaciones de alertas prioritarias directamente sobre el icono de la PWA instalada en el dispositivo (Android y iOS 16.4+).
   - **Workbox Background Sync:** Sincronización automática de datos en segundo plano al recuperar cobertura de red sin intervención manual.
   - **Escáner QR Nativo de Carnet CRED:** Lectura acelerada mediante cámara nativa sin librerías ni servicios de pago de terceros.
   - **Web Push Notifications:** Notificaciones y recordatorios nativos de controles asistenciales.

3. **Asistente Conversacional por Voz (*Yanapiri Mikhuy Voice*):**
   - Integración nativa de `SpeechRecognition` y `SpeechSynthesis` del navegador/SO. Permite a las madres y cuidadores interactuar por voz de manera bidireccional y sin costo de procesamiento en la nube.

4. **Portal Público de Transparencia e Impacto Social (First-Party Analytics & Privacy by Design):**
   - Dashboard de impacto en tiempo real sin cookies de terceros ni rastreadores comerciales.
   - Recálculo en caché de 15 minutos (< 5ms de respuesta) con feed de actividad comunitaria anonimizada y distribución territorial por regiones de Perú.
   - Cumplimiento estricto con la Ley N° 29733 de Protección de Datos Personales.

---

## Roles del Sistema

1. **Cuidador (Familia):** PWA móvil con diseño accesible. Permite registrar mediciones paso a paso, consultar gráficas de crecimiento infantil (Recharts) y acceder al diccionario nutricional de superalimentos regionales con fotografía macro culinaria.
2. **Actor Social (Agente Comunitario):** Panel móvil para gestión de visitas domiciliarias priorizadas por nivel de riesgo, registro de observaciones en campo y seguimiento cualitativo.
3. **Profesional de Salud (Personal CRED):** Dashboard clínico web para profesionales de la salud. Permite ordenar menores asignados según prioridad de riesgo (Rojo / Amarillo / Verde), revisar curvas de percentiles OMS y auditar registros.

---

## Stack Tecnológico

### Frontend
- **Framework & Lenguaje:** React 19, TypeScript, Vite 6.
- **Estilos & UI:** Tailwind CSS v4, Lucide Icons, componentes accesibles.
- **Visualización de Datos:** Recharts para curvas de percentiles OMS.
- **PWA & Offline:** Service Worker con caché dinámico, IndexedDB y Workbox.

### Backend (NestJS + Prisma)
- **Framework:** NestJS 11 (Node.js).
- **ORM & Persistencia:** Prisma ORM 7 con conector de alto rendimiento SQLite (`@prisma/adapter-better-sqlite3`) y soporte para PostgreSQL.
- **Autenticación & Seguridad:** JSON Web Tokens (`@nestjs/jwt`), Hashing de contraseñas con `bcryptjs`, CORS habilitado.
- **Testing:** Jest para pruebas unitarias de controladores y servicios.

### Backend (Python FastAPI - Arquitectura Complementaria)
- **Framework:** FastAPI (Python 3.12).
- **ORM & Validación:** SQLAlchemy, esquemas Pydantic.
- **Testing:** Pytest.

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
│   ├── app/                  # Implementación complementaria FastAPI (Python)
│   └── package.json          # Dependencias y scripts de backend NestJS
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
- *(Opcional)* **Python:** 3.12+ para el backend FastAPI complementario.

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