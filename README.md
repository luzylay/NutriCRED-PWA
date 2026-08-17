# NutriCRED - Crecer mejor 🇵🇪
### Ecosistema Digital de Monitoreo Nutricional Infantil, Triaje Preventivo y Priorización Clínica

![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Dexie.js](https://img.shields.io/badge/IndexedDB-Dexie.js%20v2-blue?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Offline--First-purple?style=for-the-badge)
![MINSA CRED](https://img.shields.io/badge/MINSA-NTS%20137--CRED-red?style=for-the-badge)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

---

## 👥 Equipo Multidisciplinario

1. **Andrea Valencia** — Medicina Humana (Universidad Científica del Sur - UCSUR) · [andreavalenciac05@gmail.com](mailto:andreavalenciac05@gmail.com)
2. **Lady Loayza** — Ingeniería de Software (Universidad Tecnológica del Perú - UTP) · [loayzax5x6x7@gmail.com](mailto:loayzax5x6x7@gmail.com)
3. **Renzo Huayta** — Economía (Universidad Nacional Mayor de San Marcos - UNMSM) · [renzohuay93@gmail.com](mailto:renzohuay93@gmail.com)
4. **Jhon Rincon** — Data Engineering (Universidad Nacional de Ingeniería - UNI) · [jhonrinconroman@gmail.com](mailto:jhonrinconroman@gmail.com)

---

## 🌐 Enlaces de Despliegue en Vivo

- 🚀 **Despliegue Oficial en Vercel:** [https://nutricred-crecer-mejor-nutrivision.vercel.app/](https://nutricred-crecer-mejor-nutrivision.vercel.app/)
- 🐙 **Repositorio GitHub:** [https://github.com/luzylay/Yanapiri-Wawa](https://github.com/luzylay/Yanapiri-Wawa)

---

## 1. Descripción del Desafío y Contexto

### 1.1 El Problema de Salud Pública (Datos Oficiales Verificables)
Según la Encuesta Demográfica y de Salud Familiar (**ENDES 2025, INEI**), la prevalencia de anemia infantil en niñas y niños de 6 a 35 meses de edad en el Perú alcanza el **34.9%**. Esta afección compromete de manera irreversible el desarrollo cognitivo, motor e inmunológico en los primeros años de vida.

En el primer nivel de atención (puestos y centros de salud I-1 a I-4), la problemática no radica únicamente en el diagnóstico inicial, sino en la **alta tasa de deserción del tratamiento suplementario y del control de Crecimiento y Desarrollo (CRED)**. El seguimiento tradicional en planillas físicas de papel y carnets de control manuscritos dificulta la identificación oportuna de niños que abandonan la suplementación o que no acuden a sus controles programados.

### 1.2 Población Objetivo del MVP
El MVP de **NutriCRED - Crecer mejor** está enfocado en la población infantil de **0 a 5 años** (0 a 59 meses), conforme a las especificaciones operativas del Control CRED establecidas por el Ministerio de Salud (**MINSA**) y los estándares de atención pediátrica del Instituto Nacional de Salud del Niño San Borja (**INSN-SB**).

### 1.3 Marco Normativo e Institucional
El diseño funcional y los algoritmos del sistema se construyen rigurosamente sobre la base de la normativa sanitaria peruana e internacional:
- **NTS N° 137-MINSA/DGIESP-2017:** Norma Técnica de Salud para el Control del Crecimiento y Desarrollo de la Niña y el Niño Menor de Cinco Años.
- **Estándares Internacionales OMS:** Patrones de crecimiento infantil de la Organización Mundial de la Salud (Puntaje Z para Peso/Edad, Talla/Edad y Peso/Talla).
- **Guías Clínicas INSN-SB:** Criterios de evaluación y derivación en anemia severa y desnutrición aguda.

---

## 2. Solución Propuesta y Diferenciador

### 2.1 Enfoque de la Solución
**NutriCRED** es un ecosistema digital integral que conecta al personal de salud con las familias vulnerables a través de una arquitectura articulada en tres componentes clave:

```
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│   WHATSAPP FAMILIAR       │      │   PWA PROFESIONAL SALUD   │      │   ANALÍTICA POWER BI      │
│ (Baja fricción / Emojis)  │ ◄──► │ (Offline-First / CRED)    │ ◄──► │ (DirectQuery / DIRESA)    │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

1. **Canal Informativo para la Familia (vía WhatsApp):** Entrega de credenciales virtuales de salud, semáforo nutricional comprensible (🟢 Adecuado, 🟡 Riesgo, 🔴 Alerta) y listas de compra semanales adaptadas al presupuesto del hogar.
2. **Aplicación Web PWA para el Personal de Salud:** Herramienta para la admisión, registro antropométrico (*Peso, Talla, MUAC, Hemoglobina, Edema*), cálculo autoadaptativo del próximo control CRED e historial clínico.
3. **Recomendador Nutricional Regionalizado:** Motor de recomendaciones alimentarias que integra la Tabla Peruana de Composición de Alimentos (**INS/CENAN**) con el Sistema de Precios Mayoristas del Ministerio de Desarrollo Agrario y Riego (**MIDAGRI**).

### 2.2 Diferenciadores Clave
- **Sin barrera de instalación:** Las familias no requieren descargar aplicaciones adicionales ni consumir paquetes de datos complejos; la interacción se realiza por WhatsApp.
- **Resiliencia Operativa (Offline-First):** La PWA profesional utiliza **IndexedDB (via Dexie.js)** para permitir al médico o enfermera registrar atenciones en zonas rurales o comunidades sin cobertura de internet, sincronizando automáticamente al recuperar la señal.
- **Seguridad y Trazabilidad:** Cumplimiento de la **Ley N° 29733 (Ley de Protección de Datos Personales)** mediante registros de auditoría inmutables con firmas cryptográficas **SHA-256** para cualquier rectificación de datos clínicos.

---

## 3. Impacto en Salud y Valor Público

### 3.1 Cifras de Referencia
- **Indicador Base:** 34.9% de prevalencia de anemia en niños de 6 a 35 meses (**ENDES 2025, INEI**).
- **Frecuencia CRED Normada:** Calendario estandarizado por grupo etario según la NTS N° 137-MINSA (Neonato: 7d; Lactante: 30d; 1-2 años: 60d; Preescolar: 90d; Escolar: 180d).

### 3.2 Beneficios Esperados (Proyecciones basadas en estándares de salud pública)
*(Nota: Las siguientes cifras constituyen metas de impacto proyectadas a ser validadas en fase de implementación piloto).*

- **Detección Oportuna:** Proyección de reducción de hasta un **50% en la detección tardía** de anemia y riesgo nutricional mediante la categorización semafórica en cada control.
- **Continuidad del Tratamiento:** Meta de incrementar el cumplimiento del esquema de suplementación de hierro (SRSI 0 a 6 meses) del promedio estimado del 35% actual a un **70% de adherencia**.
- **Empoderamiento Familiar:** Facilitación de pautas nutricionales claras con alimentos ricos en hierro hemínico (*sangrecita, bazo, hígado*) adaptadas al presupuesto semanal de la familia.

### 3.3 Alineación con Políticas Públicas
El sistema se encuentra alineado con el **Plan Nacional para la Reducción y Control de la Anemia Materno Infantil** y los lineamientos del **Ministerio de Salud (MINSA)**, el **Instituto Nacional de Salud (INS/CENAN)** y el **Instituto Nacional de Salud del Niño San Borja (INSN-SB)**.

---

## 4. Enfoque en el Usuario y Accesibilidad

### 4.1 Perfiles de Usuario y Diseño Adaptado

#### A. Apoderado / Familia (Caregiver)
- **Canal de Interacción:** WhatsApp y credencial digital en navegador móvil.
- **Experiencia de Usuario:** Lenguaje claro en español y lenguas originarias (*Quechua/Aymara*), comunicación semafórica por colores y emojis universales, ticket de compra para el mercado local.

#### B. Personal de Salud / Médico / Enfermera CRED (Professional)
- **Canal de Interacción:** Aplicación PWA responsiva con diseño *Mobile-First*.
- **Experiencia de Usuario:** Ergonomía táctil con botones de **44px** (estándar WCAG / Apple HIG) e inputs de **16px** (evita auto-zoom en dispositivos móviles), filtro de priorización de casos críticos, cálculo automático del Puntaje Z OMS y derivación a Programas Sociales MIDIS (*JUNTOS, Cuna Más, Qali Warma, PAIS*).

#### C. Administrador de TI / Gestión Regional (Admin)
- **Canal de Interacción:** Consola centralizada de gestión.
- **Experiencia de Usuario:** Administración de usuarios y roles (RBAC), parametrización de tablas CRED, auditoría SHA-256 y visualización de analítica en **Power BI DirectQuery**.

### 4.2 Barreras Identificadas y Soluciones Diseñadas

| Barrera Identificada | Evidencia del Entorno | Solución Diseñada en NutriCRED |
| :--- | :--- | :--- |
| **Bajo alfabetismo digital** | Dificultad para descargar y configurar aplicaciones móviles desde tiendas App Store / Play Store. | Uso de **WhatsApp** como interfaz principal para la familia, aprovechando una herramienta ya adoptada. |
| **Falta de conectividad a Internet** | Puestos de salud en zonas rurales altoandinas o de selva sin cobertura 3G/4G estable. | Arquitectura **Offline-First (IndexedDB)** que almacena atenciones localmente y las sincroniza cuando hay red. |
| **Limitación económica familiar** | Familias con presupuestos semanales reducidos para la compra de alimentos. | **Simulador de Costo-Efectividad** que calcula la canasta nutricional óptima con insumos locales de bajo costo (**MIDAGRI**). |
| **Desconfianza en recomendaciones** | Incertidumbre sobre el origen del consejo nutricional. | Inclusión de la firma de prescripción del médico tratante y advertencia médica explícita (**MINSA / INSN-SB**). |

---

## 5. Viabilidad Técnica y Económica

### 5.1 Arquitectura Tecnológica
La solución utiliza una arquitectura híbrida desacoplada y escalable:

- **Frontend:** React 18.3, TypeScript 5.5, Vite 6.4, TailwindCSS v4.
- **Persistencia Local:** Dexie.js (IndexedDB Schema v2) con 5 tablas relacionales (`children`, `measurements`, `visits`, `syncQueue`, `auditLogs`).
- **Capa de Seguridad:** Web Crypto API con hashing **SHA-256** para auditoría inmutable.
- **Mensajería:** Integración vía API REST / Webhook con la plataforma de WhatsApp.
- **Analítica de Datos:** Power BI Embedded mediante consultas SQL en tiempo real (*DirectQuery*).

### 5.2 Modelo de Financiamiento Propuesto
*(Estimaciones de viabilidad sujetas a validación institucional)*:
- **Modelo Principal:** Esquema de licenciamiento institucional B2G (Business-to-Government) para DIRESAs, GERESAs y Gobiernos Locales a través del Programa Presupuestal Articulado Nutricional (**PAN - PP 001**).
- **Fuentes Complementarias:** Fondos de cooperación internacional en salud pública y programas de Inversión Social Corporativa (RSC / Obras por Impuestos) en zonas de influencia.

### 5.3 Roadmap de Implementación Proyectado (12 Meses)

```
[M1 - M2] ──► [M3 - M4] ──► [M5 - M6] ──► [M7 - M9] ──► [M10 - M12]
  Fase 1        Fase 2        Fase 3        Fase 4        Fase 5
 (Piloto)     (WhatsApp)    (Power BI)    (Recomend.)   (Escalam.)
```

- **Fase 1 (Meses 1-2):** Registro e implementación piloto inicial en establecimientos de salud seleccionados de DIRESA Lima.
- **Fase 2 (Meses 3-4):** Despliegue del canal de interacción por WhatsApp y entrega de credencial virtual a apoderados.
- **Fase 3 (Meses 5-6):** Sincronización del Dashboard Power BI DirectQuery con el motor de cálculo Z-Score OMS.
- **Fase 4 (Meses 7-9):** Integración completa del recomendador regional de alimentos (INS/CENAN + MIDAGRI).
- **Fase 5 (Meses 10-12):** Evaluación de resultados del piloto y propuesta de escalamiento a 3 DIRESAs adicionales.

---

## 6. Componentes Abiertos y Reutilizables

El repositorio contiene módulos independientes diseñados de forma modular para facilitar su reutilización en iniciativas de salud pública:

1. **Motor de Reglas y Cálculo Z-Score OMS (`src/app/lib/credRules.ts`):** Lógica en TypeScript para determinar intervalos de control CRED según la NTS N° 137-MINSA y clasificar niveles de riesgo.
2. **Modulo de Conectividad de Programas Sociales (`src/app/components/admin/SocialProgramsPanel.tsx`):** Componente para la gestión de derivación a programas sociales MIDIS (*JUNTOS, Cuna Más, Qali Warma, PAIS*).
3. **Simulador de Costo-Efectividad Nutricional (`src/app/components/family/CostEffectivenessSimulator.tsx`):** Algoritmo que cruza valores biométricos con tablas de precios regionales.
4. **Plantilla de Conexión Power BI DirectQuery (`src/app/components/professional/PowerBIDashboard.tsx`):** Estructura de integración para tableros de analítica en tiempo real.

---

## 7. Próximos Pasos y Escalabilidad

1. **Validación de Campo:** Ejecutar las pruebas operativas del piloto en coordinación con el personal de salud del primer nivel de atención.
2. **Integración con Sistemas Legados:** Evaluar mecanismos de interoperabilidad bajo estándares **HL7 FHIR R4** para el intercambio de datos con los sistemas de información del MINSA (*HIS MINSA*).
3. **Ampliación de Cobertura:** Adaptar las tablas de composición de alimentos para incorporar ingredientes autóctonos de diversas micro-regiones del país.

---

## 8. Declaración de Uso de IA Generativa

- **Herramientas Utilizadas:** ChatGPT (OpenAI) - Modelo GPT-4, versión 2025.
- **Uso Realizado:** Apoyo en la conceptualización, estructuración del pitch de presentación, elaboración de documentación técnica, optimización de prompts y revisión de redacción.
- **Resultado Incorporado y Revisión Humana:** Todo el contenido generado mediante herramientas de IA fue revisado, adaptado y validado técnicamente por el equipo multidisciplinario. Las referencias clínicas y operativas fueron contrastadas con la documentación oficial del **MINSA**, **OMS**, **INS/CENAN** e **INSN-SB**.
- **Privacidad y Seguridad de Datos:** Se declara expresamente que **no se ingresaron datos personales, sensibles o confidenciales** de pacientes ni de menores de edad en los modelos de IA.
- **Declaración Responsable:** El equipo declara que el uso de IA generativa sirvió exclusivamente como herramienta de apoyo operativo y no sustituyó el análisis técnico, el criterio médico ni la responsabilidad de los autores.

---

## 9. Seguridad y Credenciales

- **Protección de Datos Sensibles:** Este repositorio **NO contiene credenciales reales, claves privadas ni tokens de acceso a entornos de producción**.
- **Gestión de Entorno:** Toda la configuración sensible se gestiona a través de variables de entorno mediante el archivo `.env`.
- **Plantilla de Configuración:** Se proporciona el archivo [`.env.example`](file:///.env.example) con la estructura requerida sin valores reales para facilitar el despliegue seguro en entornos locales o de prueba.

---

## 10. Instalación y Configuración

### 10.1 Requisitos Previos
- **Node.js:** Versión 18.0 o superior.
- **Gestor de Paquetes:** `npm` (v9+) o `yarn`.

### 10.2 Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/luzylay/Yanapiri-Wawa.git
cd Yanapiri-Wawa

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo local
npm run dev

# 5. Compilar bundle de producción
npm run build
```

---

## 📄 Licencia
Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para obtener más detalles.
