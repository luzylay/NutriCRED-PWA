# Arquitectura del Sistema - Yanapiri Wawa

Este documento especifica la arquitectura técnica, los patrones de diseño y los flujos de datos del sistema **Yanapiri Wawa**, diseñado para operar con máxima resiliencia en entornos de baja conectividad a costo $0 de infraestructura.

---

## 1. Visión General de la Arquitectura

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          CAPA DE CLIENTE (PWA)                          │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ Rol Cuidador     │  │ Rol Actor Social │  │ Rol Profesional CRED  │  │
│  │ (Familia PWA)    │  │ (Agente Campo)   │  │ (Dashboard Clínico)   │  │
│  └────────┬─────────┘  └────────┬─────────┘  └───────────┬───────────┘  │
│           │                     │                        │              │
│           └─────────────────────┼────────────────────────┘              │
│                                 ▼                                       │
│                [ Service Worker + Workbox Sync ]                        │
│                [ App Badging API & Web Speech  ]                        │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ (HTTP / JSON / Wi-Fi Local)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVIDOR (NESTJS EDGE)                       │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ AuthModule       │  │ PatientsModule   │  │ MeasurementsModule    │  │
│  │ (JWT / Bcrypt)   │  │ (/children)      │  │ (OMS Z-Score Engine)  │  │
│  └──────────────────┘  └──────────────────┘  └───────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ PublicImpactModule (/public/stats - Cache 15 min)                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                 │                                       │
│                                 ▼                                       │
│                    [ Prisma ORM Client v7 ]                             │
│                    [ SQLite / @prisma/adapter-better-sqlite3 ]          │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS LOCAL Y SOBERANÍA                       │
│                   (dev.db - 100% Soberanía en Posta)                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes Principales

### A. Capa de Cliente (PWA)
- **Tecnología:** React 19 + TypeScript + Vite 6 + Tailwind CSS v4.
- **Sintetizador & Reconocimiento de Voz (*Yanapiri Mikhuy Voice*):** Integración nativa de `SpeechRecognition` y `SpeechSynthesis` que operan de manera local en el procesador del dispositivo a costo $0.
- **Escáner QR Nativo:** Captura directa por cámara usando HTML5 Canvas para lectura instantánea de carnets CRED.
- **Sincronización Offline:** Service Worker con Workbox para encolamiento de mediciones en `IndexedDB` y `LocalStorage` cuando el dispositivo se encuentra sin señal.

### B. Capa de Servidor (NestJS Edge Server)
- **Tecnología:** NestJS 11 (Node.js) + TypeScript.
- **Motor de Reglas OMS (Z-Score & MUAC):**
  - **MUAC < 11.5 cm:** Alerta Crítica (Rojo - Desnutrición Aguda Severa).
  - **11.5 cm <= MUAC < 12.5 cm:** Alerta Preventiva (Amarillo - Riesgo de Desnutrición).
  - **Z-Score < -2.0:** Alerta Crítica (Rojo).
- **Módulo de Transparencia de Impacto Público:** Generación de métricas agregadas anonimizadas con almacenamiento en caché en memoria (TTL de 15 minutos) para consumo rápido (< 5ms).

### C. Capa de Datos & Persistencia
- **Tecnología:** Prisma ORM 7 + SQLite.
- **Modelo Relacional:** `User`, `Caregiver`, `HealthProfessional`, `CommunityAgent`, `Child`, `Measurement`, `Alert`, `Visit`, `AuditLog`.

---

## 3. Principios de Seguridad y Privacidad (Ley N° 29733)

1. **Anonimización Estricta:** Las estadísticas públicas expuestas por `GET /public/stats` omiten cualquier identificador personal (Cero nombres, DNIs o coordenadas privadas).
2. **Soberanía Local (Edge Server):** Los datos almacenados en el servidor local de la posta médica no se comparten con terceros ni requieren servidores comerciales en la nube.
3. **Auditoría de Operaciones:** Cada cambio o estado de alerta genera un registro en la tabla `AuditLog` detallando el usuario y timestamp de la acción.

---

## 4. Reglas de Alerta Clínica y Fundamentación Normativa

### A. Algoritmo de Evaluación Antropométrica
El backend ([measurements.service.ts](file:///c:/Users/Loayza/Downloads/Yanapiriwawa/Yanapiriwawa-Crecer-Mejor/backend/src/measurements/measurements.service.ts)) procesa cada medición ingresada bajo la siguiente lógica de triaje priorizado:

```text
[ Entrada: Peso, Talla, MUAC ]
             │
             ▼
   ¿MUAC < 11.5 cm? ─── SI ───> Alerta ROJA (Desnutrición Aguda Severa - DAS)
             │
             NO
             │
   ¿MUAC < 12.5 cm? ─── SI ───> Alerta AMARILLA (Riesgo / Desnutrición Moderada)
             │
             NO
             │
  ¿Z-Score < -2.0 DE? ── SI ───> Alerta ROJA (Desnutrición Severa)
             │
             NO
             │
  ¿Z-Score < -1.0 DE? ── SI ───> Alerta AMARILLA (Riesgo de Bajo Peso)
             │
             NO
             │
             └─────────────────> Estado VERDE (Seguimiento Normal)
```

### B. Referencias Normativas Oficiales
1. **NTS N° 137-MINSA/2017/DGIESP:** Norma Técnica de Salud para el Control del Crecimiento y Desarrollo de la Niña y el Niño Menor de Cinco Años (MINSA Perú).
2. **WHO Child Growth Standards (2006):** Patrones de Crecimiento Infantil de la Organización Mundial de la Salud.
3. **WHO/UNICEF Joint Statement (2009):** Detección de Desnutrición Aguda Severa mediante Perímetro Braquial (MUAC).
4. **NTS N° 134-MINSA/2017/DGIESP:** Manejo Terapéutico y Preventivo de la Anemia en Niños (MINSA Perú).

