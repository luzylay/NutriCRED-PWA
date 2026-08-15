# NutriCRED 🇵🇪

![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Dexie.js](https://img.shields.io/badge/IndexedDB-Dexie.js-blue?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline--First-purple?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Production-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> **Plataforma Web PWA de Monitoreo Nutricional Infantil y Triaje Preventivo en el Perú**  
> *Diseñada para el primer nivel de atención en Perú (rango 0 a 5 años) con arquitectura offline-first (IndexedDB Dexie.js), triaje semafórico OMS y seguimiento de campañas de alimentación.*

🌐 **Despliegue Oficial en vivo en Vercel**: [https://yanapiriwawa.vercel.app/](https://yanapiriwawa.vercel.app/)  
🌐 **Enlace Alternativo**: [https://yanapiriwawa-crecer-mejor.vercel.app/](https://yanapiriwawa-crecer-mejor.vercel.app/)

---

## 🏛️ Arquitectura de los 3 Pilares y Matriz de Roles

### 1. Evaluación Médica (Escritura Exclusiva)
- **Registrador:** El médico realiza el registro en la primera atención presencial.
- **Validación RENIEC:** Requiere DNI del apoderado validado contra RENIEC + DNI del niño (o Historia Clínica temporal).
- **Control Antropométrico:** Carga exclusiva de Peso, Talla, Perímetro Braquial (MUAC), Hemoglobina y Edema Bilateral (Kwashiorkor).
- **Asignación de Campañas:** Asignación de programas de suplementación (`Campaña Hierro`, `Campaña Multinutriente`, `Campaña Leche Fortificada`, `Campaña Complementaria`, `Sin campaña`).
- **Evaluación de Tendencia & Alertas:** Registro de tendencia manual (**↑ Subiendo / → Estable / ↓ Bajando**), diagnóstico libre en historia clínica y activación manual de alerta semáforo.

### 2. Credencial Virtual del Apoderado (Solo Lectura)
- **Consulta Exclusiva:** El apoderado visualiza su credencial virtual con DNI protegido (parcial), campaña activa con fecha de vigencia, tendencia de peso, diagnóstico del médico y alerta activa.
- **Matriz de Alerta Semáforo:**
  - 🟢 **NORMAL (Verde):** Evolución favorable. Continuar plan y cita programada.
  - 🟡 **VIGILANCIA (Amarillo):** Acudir a control en los próximos 7 días.
  - 🔴 **URGENTE (Rojo):** **Acudir a emergencia o centro de salud en las próximas 24 horas.** No esperar cita.
- **Seguridad:** El apoderado no edita ni altera registros en el sistema.

### 3. Resiliencia Offline-First
- **IndexedDB Persistente (Dexie.js):** 4 tablas locales (`children`, `measurements`, `visits`, `syncQueue`) para operabilidad 100% sin internet en zonas rurales.

---

## 🚀 Instalación y Despliegue

### 1. Desarrollo Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor local Vite
npm run dev

# Probar compilación de producción
npm run build
```

### 2. Despliegue en GitHub
```bash
# Agregar cambios y confirmar
git add .
git commit -m "feat: NutriCRED release with 3-pillar architecture, Dexie IndexedDB and virtual credential"
git push origin main
```

### 3. Despliegue en Vercel
1. Conectar el repositorio de GitHub en [Vercel Dashboard](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.

---

## 📄 Licencia
Este proyecto está distribuido bajo la licencia **MIT**.