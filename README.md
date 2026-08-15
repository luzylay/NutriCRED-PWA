# NutriCRED 🇵🇪 — Monitoreo Nutricional Infantil & Lucha contra la Anemia

![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Dexie.js](https://img.shields.io/badge/IndexedDB-Dexie.js%20v2-blue?style=for-the-badge)
![Crypto](https://img.shields.io/badge/SHA--256-Ley%20N%C2%B0%2029733-green?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline--First-purple?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Production-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> **NutriCRED (antes Yanapiri Wawa)** es una plataforma web PWA inteligente de monitoreo nutricional infantil, triaje preventivo y priorización clínica en el Perú, diseñada específicamente para el primer nivel de atención (rango de 0 a 5 años). Funciona con arquitectura **100% Offline-First (IndexedDB via Dexie.js)**, trazabilidad cryptográfica **SHA-256 (Ley N° 29733)** e integración en tiempo real con **Power BI DirectQuery**.

---

## 🌐 Enlaces de Despliegue en Vivo

- 🚀 **Despliegue Oficial en Vercel:** [https://nutricred-crecer-mejor-nutrivision.vercel.app/](https://nutricred-crecer-mejor-nutrivision.vercel.app/)
- 🔗 **Deployment Preview Directo:** [https://nutricred-crecer-mejor-nutrivision-4b0ht47xd-luzylays-projects.vercel.app/](https://nutricred-crecer-mejor-nutrivision-4b0ht47xd-luzylays-projects.vercel.app/)
- 📦 **Vercel Project Name:** `nutricred-crecer-mejor-nutrivision`
- 🐙 **Repositorio GitHub:** [https://github.com/luzylay/Yanapiri-Wawa](https://github.com/luzylay/Yanapiri-Wawa)

---

## 🛠️ Stack Tecnológico Detallado

### 1. Frontend Core & Compilación
- **React 18.3:** Biblioteca de interfaz de usuario desacoplada por componentes reutilizables con Hooks (`useMemo`, `useCallback`, `useContext`, `useRef`).
- **TypeScript 5.5:** Tipado estricto en tiempo de compilación (`Child`, `Measurement`, `LocalAuditLog`, `UserRole`, `GrowthPoint`) previendo errores en ejecución.
- **Vite 6.4.3:** Entorno de desarrollo ultra-rápido impulsado por ESBuild con reemplazo de módulos en caliente (HMR) y empaquetado optimizado en chunks de producción.

### 2. Estilos, Diseño & Accesibilidad (Mobile-First)
- **TailwindCSS v4 + CSS Variables:** Sistema de diseño responsivo basado en tokens CSS reutilizables (`--primary`, `--accent`, `--card`, `--background`).
- **Estructura Mobile-First:** Diseñado primeramente para smartphones (320px) hasta pantallas médicas ultra-anchas (1280px+).
- **Ergonomía Táctil (WCAG / Apple HIG):** Todos los botones y campos poseen una altura táctil mínima de **44px** (`min-height: 44px; touch-action: manipulation;`) y texto base de **16px** (evita auto-zoom en navegadores móviles).
- **Temas Visuales Adaptativos:** 
  - **Modo Marca (Rojo & Dorado)**: Identidad visual médica oficial.
  - **Modo Noche (Descanso Visual)**: Reduce fatiga visual en guardias nocturnas.
  - **Alto Contraste (Baja Visión)**: Cumplimiento WCAG AAA.
  - **Daltonismo (Azul y Naranja)**: Paleta distinguible para deficiencias cromáticas.

### 3. Base de Datos Local & Resiliencia Offline-First
- **Dexie.js (IndexedDB Schema v2):** Almacenamiento persistente en el dispositivo del usuario con 5 tablas relacionales:
  - `children`: Perfil del menor, DNI, campaña activa, tendencia de peso (`up`/`stable`/`down`), diagnóstico del médico.
  - `measurements`: Peso, Talla, MUAC (perímetro braquial), Hemoglobina y Edema bilateral.
  - `visits`: Controles CRED y visitas domiciliarias.
  - `syncQueue`: Cola de sincronización offline con servidor central.
  - `auditLogs`: Tabla inmutable de trazabilidad cryptográfica **SHA-256**.
- **Service Worker & Manifest PWA:** Instalable como aplicación nativa en Android/iOS con funcionamiento sin señal de internet en zonas rurales andinas.

### 4. Cryptografía & Ley N° 29733 (Protección de Datos)
- **Web Crypto API (`crypto.subtle.digest`):** Generación de firmas **SHA-256 de 64 caracteres** por cada corrección clínica o evento de auditoría.
- **Ley N° 29733 (No Eliminación):** Ninguna historia clínica u original es destruida. Las correcciones generan un registro inmutable en `historial_correcciones` con valores anteriores y nuevos en JSON + motivo obligatorio (>5 caracteres).
- **Enmascaramiento de DNI:** Protección de la identidad de los menores mediante vistas parciales (`7458****`).

### 5. Inteligencia de Datos & Integración Power BI DirectQuery
- **Power BI Embedded / DirectQuery SQL:** Dashboard analítico de 2 páginas embebido en tiempo real:
  - **Página 1 (1500x1280px):** 7 Filtros interactivos (`Período`, `Departamento`, `Provincia`, `Distrito`, `Centro Poblado`, `DIRESA`, `Dx_anemia`) y 4 visuales (Cantidad Evaluados, Anemia por Severidad, Tabla Niños con Anemia, Top por DIRESA).
  - **Página 2 (720x1280px):** Visual de Frecuencia de Visita por Ámbito (Consulta Externa, Visita Domiciliaria, Emergencia, Hospitalario).
- **Mapeo Relacional SQL:**
  ```sql
  SELECT n.id_niño, n.dni, n.nombre, n.ubigeo_departamento AS DepartamentoPN,
         n.ubigeo_provincia AS ProvinciaPN, n.ubigeo_distrito AS DistritoPN,
         n.ubigeo_centro_poblado AS CentroPobladoPN, n.diresa AS Diresa,
         e.fecha_evaluacion, e.peso, e.talla, e.diagnostico_anemia AS Dx_anemia,
         e.tipo_atencion AS ambito, c.periodo2 AS Periodo2, c.mes AS Mes
  FROM niños n JOIN evaluaciones e ON n.id_niño = e.id_niño
  JOIN calendario c ON DATE_TRUNC('month', e.fecha_evaluacion) = c.fecha_mes
  WHERE e.activo = TRUE;
  ```

### 6. Lenguas Originarias & Asistente NLU
- **Soporte Multilingüe Integrado:** Español, Runasimi (Quechua), Aymara e Inglés (`translations.ts`).
- **Motor NLU (Natural Language Understanding):** Triaje automatizado en lenguas nativas para la detección temprana de signos de alarma.
- **Botón Flotante Draggable (`GlobalChatbotButton.tsx`):** Asistente arrastrable interactivo con soporte de eventos táctiles (`Pointer Events`) en smartphones.

---

## 👥 Matriz de Roles y Permisos de Acceso (RBAC)

| Perfil | Rol en Código | Ruta | Capacidades Permitiendo | Restricciones de Seguridad |
| :--- | :--- | :--- | :--- | :--- |
| **Apoderado (`maria`)** | `CAREGIVER` | `/familia` | **Solo Lectura de su hijo:** Credencial virtual, DNI parcial, evolución de peso y curva OMS, alerta semáforo (🟢/🟡/🔴), campaña activa, plan de alimentación y recetas andinas. | **Cero edición.** No puede cargar datos ni consultar datos de otros menores. |
| **Personal de Salud (`carlos`)** | `PROFESSIONAL` | `/dashboard` | **Escritura Clínica Total sobre sus pacientes:** Registro de niños (validado RENIEC), ingreso de peso/talla/MUAC/Hb/Edema, asignación de campañas, tendencia manual (**↑/→/↓**), alertas semáforo, diagnóstico libre, corrección Ley N° 29733, **Dashboard Power BI Regional**. | No puede modificar pacientes de otras regiones ni administrar usuarios de TI. |
| **Admin IT (`admin`)** | `ADMIN` | `/admin` | **Gestión Global del Sistema:** Administración de usuarios y roles, configuración de campañas y vigencias, gestión de DIRESAs/Ubigeos, auditoría SHA-256, backups, **Dashboard Power BI Nacional**. | **Cero edición de datos clínicos** directos en historias de pacientes. |

---

## 📝 Módulo 1: Flujo de Corrección Clínico (Ley N° 29733)

1. **Detección:** El médico selecciona **`[Corregir]`** en la ficha clínica de la evaluación.
2. **Ingreso de Valores:** Carga los datos corregidos (Peso, Talla, Diagnóstico, Campaña).
3. **Motivo Obligatorio:** Justificación requerida de mínimo **5 caracteres** (reduce malas prácticas >80%).
4. **Validación de Rangos Fisiológicos:**
   - **Peso:** `2.0 kg` a `25.0 kg`.
   - **Talla:** `45.0 cm` a `120.0 cm`.
   - **Hemoglobina:** `4.0 g/dL` a `18.0 g/dL`.
5. **Firma SHA-256 Inmutable:** El registro original **nunca se borra**. Se almacena la firma cryptográfica de 64 caracteres en `auditLogs`.
6. **Notificación:** Notifica al médico original y actualiza la credencial del apoderado con fecha de revisión.
7. **Límite de 30 Días:** Bloqueo de corrección para registros antiguos a 30 días salvo autorización del jefe de servicio.

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