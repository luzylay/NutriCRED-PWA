# NutriCRED 🇵🇪 — Monitoreo Nutricional Infantil & Lucha contra la Anemia

![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Dexie.js](https://img.shields.io/badge/IndexedDB-Dexie.js%20v2-blue?style=for-the-badge)
![Crypto](https://img.shields.io/badge/SHA--256-Ley%20N%C2%B0%2029733-green?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline--First-purple?style=for-the-badge)
![MINSA CRED](https://img.shields.io/badge/MINSA-NTS%20137--CRED-red?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Production-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> **NutriCRED (antes Yanapiri Wawa)** es una plataforma web PWA e inteligencia epidemiológica de monitoreo nutricional infantil, triaje preventivo y priorización clínica en el Perú (0 a 5 años). Funciona con arquitectura **100% Offline-First (IndexedDB via Dexie.js)**, motor de reglas clínicas **CRED MINSA + OMS (`credRules.ts`)**, integración con **Programas Sociales MIDIS (JUNTOS, Cuna Más, Qali Warma, PAIS)**, trazabilidad cryptográfica **SHA-256 (Ley N° 29733)** y **Power BI DirectQuery**.

---

## 🌐 Enlaces de Despliegue en Vivo

- 🚀 **Despliegue Oficial en Vercel:** [https://nutricred-crecer-mejor-nutrivision.vercel.app/](https://nutricred-crecer-mejor-nutrivision.vercel.app/)
- 🔗 **Deployment Preview Directo:** [https://nutricred-crecer-mejor-nutrivision-4b0ht47xd-luzylays-projects.vercel.app/](https://nutricred-crecer-mejor-nutrivision-4b0ht47xd-luzylays-projects.vercel.app/)
- 📦 **Vercel Project Name:** `nutricred-crecer-mejor-nutrivision`
- 🐙 **Repositorio GitHub:** [https://github.com/luzylay/Yanapiri-Wawa](https://github.com/luzylay/Yanapiri-Wawa)

---

## 🔑 Credenciales de Acceso Demo

| Perfil | Usuario | Contraseña | Ruta |
| :--- | :--- | :--- | :--- |
| **Apoderada / Familia** | `maria` | `maria123` | `/familia` |
| **Personal de Salud / Médico** | `carlos` | `carlos123` | `/dashboard` |
| **Agente Comunitario de Salud** | `luisa` | `luisa123` | `/dashboard` |
| **Administrador de TI** | `admin` | `admin123` | `/admin` |

---

## 🛠️ Stack Tecnológico Detallado

### 1. Frontend Core & Compilación
- **React 18.3:** Biblioteca de interfaz de usuario desacoplada por componentes reutilizables con Hooks (`useMemo`, `useCallback`, `useContext`, `useRef`).
- **TypeScript 5.5:** Tipado estricto en tiempo de compilación (`Child`, `Measurement`, `LocalAuditLog`, `UserRole`, `GrowthPoint`) previendo errores en ejecución.
- **Vite 6.4.3:** Entorno de desarrollo ultra-rápido impulsado por ESBuild con reemplazo de módulos en caliente (HMR) y empaquetado optimizado en chunks de producción.

### 2. Estilos, Diseño & Ergonomía Táctil (Mobile-First)
- **TailwindCSS v4 + CSS Variables:** Sistema de diseño responsivo basado en tokens CSS reutilizables (`--primary`, `--accent`, `--card`, `--background`).
- **Ergonomía Táctil (WCAG / Apple HIG):** Todos los botones y campos poseen una altura táctil mínima de **44px** (`min-height: 44px; touch-action: manipulation;`) e inputs de **16px** (elimina auto-zoom en iOS Safari / Android Chrome).

### 3. Motor de Reglas Frecuencia CRED MINSA & OMS (`credRules.ts`)
- **NTS N° 137-MINSA/DGIESP:** Codificación oficial de frecuencias mínimas por edad:
  - *Neonato (0-29 días):* Frecuencia 7 días (Máx. 10 días).
  - *Lactante (1-11 meses):* Frecuencia 30 días (Máx. 45 días).
  - *1 a 2 años (12-23 meses):* Frecuencia 60 días (Máx. 75 días).
  - *Preescolar (2-4 años):* Frecuencia 90 días (Máx. 120 días).
  - *Escolar (5-11 años):* Frecuencia 180 días (Máx. 210 días).
- **Multiplicadores de Riesgo Nutricional OMS:**
  - 🟢 **Adecuado:** Frecuencia estándar CRED MINSA.
  - 🟡 **Riesgo Nutricional:** Frecuencia acortada a 15-30 días (Alerta preventiva 7 días previos).
  - 🔴 **Alerta Médica:** Frecuencia urgente 24h a 7 días.

### 4. Simulador de Costo-Efectividad & Conectividad Médica
- **Prescripción Médica Directa:** Sello de aprobación del médico (*Dr. Carlos Mendoza · CMP 58492*) cargando la Estrategia B Mixta en 1 clic.
- **Tabla de Composición INS/CENAN + Precios MIDAGRI:** Alimentos hemínicos por región (*Sierra, Costa, Selva*).
- **Claridad Familiar:** Diferenciación explícita entre *Ticket de Compra Semanal en el Mercado* y *Ración Diaria en la Comida del Hogar*.
- **Advertencia Médica Obligatoria (MINSA / INS / INSN-SB):** Cláusula legal de no autoprescripción en pantalla y en exportación WhatsApp.

### 5. Módulo de Programas Sociales MIDIS Integrado
- **Vinculación Clínico-Social:** Integrado en el Panel del Médico para derivación de niños en riesgo/alerta a:
  - **JUNTOS:** Transferencia monetaria condicionada a controles CRED.
  - **Cuna Más:** Visitas domiciliarias y cuidado diurno para <3 años.
  - **Qali Warma:** Alimentación escolar.
  - **Tambos PAIS:** Salud itinerante en zonas rurales.

### 6. Base de Datos Local & Resiliencia Offline-First
- **Dexie.js (IndexedDB Schema v2):** Almacenamiento persistente en el dispositivo con 5 tablas relacionales (`children`, `measurements`, `visits`, `syncQueue`, `auditLogs`).
- **Service Worker PWA:** Funcionamiento garantizado sin internet en zonas altoandinas y comunidades nativas.

### 7. Cryptografía & Ley N° 29733 (Protección de Datos)
- **Web Crypto API (`crypto.subtle.digest`):** Firma inmutable **SHA-256 de 64 caracteres** por cada corrección clínica o auditoría.
- **Trazabilidad Ley N° 29733:** No eliminación de historias clínicas; auditoría de rectificaciones con motivo obligatorio (>5 caracteres).

---

## 👥 Matriz de Roles y Permisos de Acceso (RBAC)

| Perfil | Rol en Código | Ruta | Capacidades Permitiendo | Restricciones de Seguridad |
| :--- | :--- | :--- | :--- | :--- |
| **Apoderada (`maria`)** | `CAREGIVER` | `/familia` | **Lectura de su hijo:** Credencial virtual, DNI parcial, evolución de peso y curva OMS, alerta semáforo (🟢/🟡/🔴), simulador costo-efectividad con plan prescrito del médico, ticket de compra semanal por WhatsApp. | **Cero edición.** No puede cargar datos ni consultar datos de otros menores. |
| **Personal de Salud (`carlos`)** | `PROFESSIONAL` | `/dashboard` | **Escritura Clínica Total sobre sus pacientes:** Registro de niños, ingreso de peso/talla/MUAC/Hb/Edema, asignación de campañas, próximo control CRED, derivación a **Programas Sociales MIDIS (JUNTOS, Cuna Más, Qali Warma, PAIS)**, rectificación Ley N° 29733, **Dashboard Power BI Regional**. | No puede modificar pacientes de otras regiones ni administrar usuarios de TI. |
| **Admin IT (`admin`)** | `ADMIN` | `/admin` | **Gestión Global de Infraestructura:** Administración de usuarios y credenciales, configuración de matriz `check_frequencies`, vigencia de campañas, auditoría SHA-256, backups, **Dashboard Power BI Nacional**. | **Cero edición de datos clínicos** directos en historias de pacientes. |

---

## 💻 Instalación y Despliegue

```bash
# 1. Clonar el repositorio
git clone https://github.com/luzylay/Yanapiri-Wawa.git
cd Yanapiri-Wawa

# 2. Instalar dependencias
npm install

# 3. Iniciar entorno de desarrollo
npm run dev

# 4. Compilar bundle de producción
npm run build
```

---

## 📄 Licencia
Distribuido bajo la Licencia **MIT**. Consulta `LICENSE` para más detalles.