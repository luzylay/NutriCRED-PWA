# Yanapiri Wawa (Ayudante del Bebé)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Yanapiri Wawa es una plataforma web progresiva (PWA) y API REST diseñada para la asistencia en el monitoreo nutricional y de crecimiento infantil en comunidades urbanas y rurales. El sistema conecta el registro antropométrico realizado en el hogar por los cuidadores con la triaje y priorización del personal de salud (CRED) y las visitas de campo de los agentes comunitarios de salud.

---

## Propuesta de Valor y Principio Clínico


El proyecto busca acortar la brecha entre los controles asistenciales presenciales (CRED) y el seguimiento del menor en el hogar mediante el registro guiado de **Peso, Talla y Perímetro Braquial (MUAC)**. Las mediciones registradas son procesadas por un motor de reglas (OMS / Z-Score) que clasifica el nivel de riesgo en tiempo real y genera alertas estructuradas.

> ⚠️ **Guardarraíl Clínico:** Yanapiri Wawa **no emite diagnósticos médicos** de anemia ni desnutrición. El sistema detecta desviaciones en las curvas de crecimiento infantil y sugiere derivaciones oportunas a profesionales de la salud capacitados.

---

## Roles del Sistema

1. **Cuidador (Familia):** Interfaz PWA con diseño accesible para móviles. Permite registrar mediciones paso a paso, consultar gráficas de crecimiento infantil y acceder al diccionario nutricional de superalimentos regionales (*Yanapiri Mikhuy*).
2. **Actor Social (Agente Comunitario):** Panel móvil para gestión de visitas domiciliarias priorizadas por nivel de riesgo, registro de observaciones en campo y seguimiento cualitativo.
3. **Profesional de Salud (Personal CRED):** Dashboard clínico web para profesionales de la salud. Permite ordenar menores asignados según prioridad de riesgo (Rojo / Amarillo / Verde), revisar curvas de percentiles OMS y auditar registros.

---

## Stack Tecnológico

### Frontend
- **Framework & Lenguaje:** React 19, TypeScript, Vite 6.
- **Estilos & UI:** Tailwind CSS v4, Lucide Icons, componentes accesibles.
- **Visualización de Datos:** Recharts para curvas de percentiles OMS.
- **Soporte Offline & PWA:** Service Worker para caché de activos y almacenamiento local.

### Backend (NestJS + Prisma)
- **Framework:** NestJS 11 (Node.js).
- **ORM & Persistencia:** Prisma ORM 7 con soporte para SQLite (`dev.db`) y PostgreSQL.
- **Autenticación & Seguridad:** JSON Web Tokens (`@nestjs/jwt`), Hashing de contraseñas con `bcryptjs`, habilitación de CORS.
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
│   │   ├── prisma/           # Servicio e inyección global de Prisma Client
│   │   ├── app.module.ts     # Módulo principal NestJS
│   │   └── main.ts           # Punto de entrada y configuración de CORS
│   ├── app/                  # Implementación complementaria FastAPI (Python)
│   └── package.json          # Dependencias y scripts de backend NestJS
├── public/
│   ├── foods/                # Catálogo de imágenes de superalimentos (Macro Close-up)
│   └── pwa-sw.js             # Service Worker para funcionamiento offline
├── src/
│   ├── app/
│   │   ├── components/       # Componentes de UI (Diccionario, Curvas OMS, Paneles)
│   │   ├── contexts/         # Contextos de React (Auth, Data, State)
│   │   ├── lib/              # Cliente API y utilidades
│   │   └── pages/            # Páginas por rol (Familia, Agente, Profesional, Admin)
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
   La interfaz gráfica estará disponible en `http://localhost:5173`.

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