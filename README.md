# Yanapiri Wawa (Ayudante del Bebé) 👶🏽🍼

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Producci%C3%B3n-success?style=for-the-badge)

Yanapiri Wawa es una plataforma web y PWA diseñada para el seguimiento nutricional y de crecimiento infantil en entornos comunitarios. Este software conecta el monitoreo realizado por los cuidadores (padres/madres) en sus hogares con las acciones de priorización del personal de salud (médicos/enfermeros) y las visitas de campo de los actores sociales comunitarios.

---

## 🚀 Problema y Propuesta de Valor

Existe una gran brecha entre los controles CRED (Crecimiento y Desarrollo) presenciales y el día a día de un menor en su domicilio. Yanapiri Wawa resuelve esto facilitando el registro asistido de mediciones de **Peso, Talla y Perímetro Braquial (MUAC)** en casa, y convirtiendo esta información en alertas estructuradas basadas en reglas oficiales para que el personal clínico pueda priorizar su atención.

> ⚠️ **Principio Clínico Fundamental:** Yanapiri Wawa **NO realiza diagnósticos médicos** de anemia o desnutrición. El sistema identifica señales de desviación en las curvas de crecimiento y sugiere derivaciones a profesionales de salud para su respectivo diagnóstico y tratamiento.

---

## 👥 Usuarios del Sistema

1. **Cuidador (Familia):** PWA móvil con botones grandes y lenguaje accesible. Registra el crecimiento del niño mediante un asistente visual paso a paso, consulta el historial gráfico y recibe recomendaciones nutricionales mediante un chatbot interactivo (*Yanapiri Mikhuy*).
2. **Actor Social (Agente Comunitario):** Panel móvil con visitas priorizadas de menores en riesgo, permitiéndole registrar visitas presenciales e ingresar observaciones cualitativas.
3. **Profesional de Salud (Personal CRED):** Dashboard web clínico para el médico o enfermero. Permite visualizar pacientes asignados, ordenarlos según nivel de riesgo (Rojo/Amarillo/Verde), revisar gráficas de percentiles de la OMS y consultar la auditoría.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts para curvas OMS, IndexedDB/LocalStorage para funcionamiento offline.
- **Backend:** Python, FastAPI, SQLAlchemy ORM, SQLite (para demostración local) y soporte PostgreSQL, PyJWT para autenticación de seguridad.
- **Testing:** Pytest para backend y Vitest para frontend.

---

## 📁 Estructura del Proyecto

```text
Yanapiriwawa-Crecer-Mejor/
├── backend/                  # Código del Servidor FastAPI
│   ├── app/
│   │   ├── auth.py           # Seguridad JWT y permisos RBAC
│   │   ├── database.py       # Configuración de base de datos
│   │   ├── main.py           # Enrutadores y Endpoints REST API
│   │   ├── models.py         # 22 Modelos relacionales SQLAlchemy
│   │   ├── rules.py          # Motor de Reglas (Z-Score y MUAC)
│   │   ├── schemas.py        # Esquemas de validación Pydantic
│   │   ├── seed.py           # Generador de datos semilla para la demo
│   │   └── tests/            # Pruebas unitarias de API y reglas
│   ├── run.py                # Script de arranque del backend
│   └── requirements.txt      # Dependencias Python
├── public/
│   └── pwa-sw.js             # Service Worker para caché offline
├── src/
│   ├── app/
│   │   ├── App.tsx           # Componente React principal (Vistas integradas)
│   │   └── components/       # Componentes visuales Shadcn y UI
│   ├── styles/               # Estilos globales y paletas accesibles
│   └── main.tsx              # Punto de entrada React y registro PWA
├── package.json              # Dependencias del Frontend
└── vite.config.ts            # Configuración de empaquetado Vite
```

---

## 💻 Instalación y Ejecución

### Requisitos Previos

- Python 3.12 o superior instalado.
- Node.js v18 o superior instalado.
- npm (o pnpm).

---

### Paso 1: Configurar y Ejecutar el Backend

1. Dirígete a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea el entorno virtual de Python:
   ```bash
   python -m venv .venv
   ```
3. Activa el entorno virtual:
   - **En Windows (PowerShell):**
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
   - **En Linux/macOS:**
     ```bash
     source .venv/bin/activate
     ```
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
5. Carga los datos semilla (Demo Hackathon):
   ```bash
   python -m app.seed
   ```
6. Inicia el servidor FastAPI:
   ```bash
   python run.py
   ```
   El backend estará disponible en `http://127.0.0.1:8000` con documentación interactiva en `http://127.0.0.1:8000/docs`.

---

### Paso 2: Configurar y Ejecutar el Frontend

1. Vuelve a la raíz del proyecto e instala las dependencias npm:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173`. Puedes abrir el modo móvil en el navegador para simular el comportamiento de PWA.

---

## 🧪 Pruebas Unitarias (Testing)

Ejecuta las pruebas automatizadas del backend para verificar el cálculo de Z-score y las validaciones de acceso (RBAC):
```bash
cd backend
.venv\Scripts\python -m pytest app/tests/
```

---

## 🛡️ Demo Walkthrough (Hackathon)

Para comprobar el flujo completo del sistema integrado:
1. Abre la PWA móvil en el rol **Familia** (se autenticará automáticamente como María).
2. Agrega una medición de peso para el niño Juan utilizando el asistente paso a paso.
3. El sistema evaluará el peso ingresado contra las tablas de la OMS. Si el peso indica una caída moderada/crítica, se generará una alerta `follow-up` o `urgent` que se enviará al servidor.
4. Desconecta tu internet (activa modo offline en tu navegador), registra otra medición y verifica cómo se guarda en la cola IndexedDB. Conéctalo de nuevo y dale clic al botón **Sincronizar** para subir la cola.
5. Cambia al rol de **Profesional** en la barra superior. Verás que Juan Quispe aparece al inicio de la lista de prioridad clínica junto a sus curvas dinámicas de percentiles OMS.
6. Cambia al rol de **Actor Social**. Verás la visita prioritaria asignada a Juan y podrás registrar su bitácora de visita cualitativa en el campo.