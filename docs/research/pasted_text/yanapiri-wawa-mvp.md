📋 INSTRUCCIÓN PRINCIPAL
Desarrolla el MVP funcional de Yanapiri Wawa (aimara: "Ayudante del Bebé"), una plataforma digital de vigilancia nutricional infantil que conecta a familias con centros de salud mediante:

PWA (Progressive Web App) para familias (React + Vite + Tailwind + Chart.js)

Dashboard web para personal de salud (React + Tailwind + Recharts)

API Backend para procesamiento (FastAPI/Node.js)

Motor Yanapiri para cálculo de Z-scores (Python)

Base de datos PostgreSQL para almacenamiento

Integración con WhatsApp Business API para registro rápido

El proyecto debe estar listo para ser empaquetado como TWA (Trusted Web Activity) usando Bubblewrap, demostrando que la solución puede publicarse en Google Play.

🎯 OBJETIVOS DEL MVP
Para la Hackathon (Instituto Nacional de Salud del Niño - San Borja)
Objetivo	Descripción	Criterio de Éxito
Prototipo funcional	PWA que permite registrar niños y mediciones	Registro de al menos 1 niño y 3 mediciones en demo
Motor Yanapiri	Cálculo de Z-scores según estándares OMS	Mostrar percentiles y alertas codificadas por colores
Dashboard básico	Visualización de niños y alertas	Lista priorizada con filtros de riesgo
WhatsApp integrado	Registro rápido de mediciones por chat	Enviar "Peso: 12.5 kg" y recibir confirmación
Arquitectura escalable	Preparada para TWA/Google Play	Demostrar que el APK se genera con Bubblewrap
Enfoque NO diagnóstico	Sistema de alertas, no diagnóstico	Todas las recomendaciones incluyen advertencia
🏗️ ARQUITECTURA DEL SISTEMA
text
                    YANAPIRI WAWA
                         │
         ┌───────────────┼────────────────┐
         │               │                │
         ▼               ▼                ▼
    APP FAMILIA       WHATSAPP          PANEL SALUD
    (PWA - React)    (Business API)   (React Dashboard)
         │               │                │
         └───────────────┼────────────────┘
                         ▼
               BACKEND (Node.js / Python)
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         PostgreSQL    Motor      Recomendaciones
                    Yanapiri    (Yanapiri Mikhuy)
                         │
                         ▼
              Cálculo de Z-scores
           (Pandas, NumPy, SciPy)
📁 ESTRUCTURA DE CARPETAS DEL PROYECTO
text
yanapiri-wawa/
├── frontend/
│   ├── pwa/                    # PWA para familias
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/
│   │   │   │   ├── child/
│   │   │   │   ├── measurements/
│   │   │   │   ├── growth-chart/
│   │   │   │   └── alerts/
│   │   │   ├── pages/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── RegisterChild.jsx
│   │   │   │   ├── MeasurementHistory.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   ├── services/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── public/
│   │   │   ├── manifest.json
│   │   │   ├── service-worker.js
│   │   │   └── icons/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── tailwind.config.js
│   │
│   └── dashboard/              # Dashboard para personal de salud
│       ├── src/
│       │   ├── components/
│       │   │   ├── dashboard/
│       │   │   ├── child-list/
│       │   │   ├── filters/
│       │   │   └── charts/
│       │   ├── pages/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── ChildDetail.jsx
│       │   │   ├── Alerts.jsx
│       │   │   └── Reports.jsx
│       │   ├── services/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── children.py
│   │   │   ├── measurements.py
│   │   │   ├── alerts.py
│   │   │   ├── whatsapp.py
│   │   │   └── users.py
│   │   ├── models/
│   │   │   ├── child.py
│   │   │   ├── measurement.py
│   │   │   ├── alert.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   ├── services/
│   │   │   └── motor_yanapiri.py
│   │   ├── main.py
│   │   └── requirements.txt
│   │
│   └── motor_yanapiri/
│       ├── zscore_calculator.py
│       ├── growth_analyzer.py
│       ├── alert_generator.py
│       ├── data/
│       │   └── who_growth_tables.json
│       └── tests/
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_children_table.sql
│   │   ├── 002_create_measurements_table.sql
│   │   ├── 003_create_alerts_table.sql
│   │   └── 004_create_users_table.sql
│   └── seed.sql
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.pwa
│   │   ├── Dockerfile.dashboard
│   │   └── docker-compose.yml
│   └── deployment/
│       ├── nginx.conf
│       └── .env.example
│
├── twa/                       # Trusted Web Activity (Bubblewrap)
│   ├── app/
│   ├── build.gradle
│   └── bubblewrap.config.json
│
├── docs/
│   ├── pitch.md
│   ├── problem-statement.md
│   ├── user-personas.md
│   └── technical-architecture.md
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── README.md
├── LICENSE
└── .gitignore
🗄️ ESTRUCTURA DE BASE DE DATOS (PostgreSQL)
Tabla: children
Campo	Tipo	Descripción
id	UUID	PK
name	VARCHAR(100)	Nombre del niño
birth_date	DATE	Fecha de nacimiento
sex	ENUM('M','F')	Sexo
caregiver_id	UUID	FK a users
health_center_id	UUID	FK a health_centers
address	VARCHAR(200)	Dirección/distrito
created_at	TIMESTAMP	
updated_at	TIMESTAMP	
Tabla: measurements
Campo	Tipo	Descripción
id	UUID	PK
child_id	UUID	FK a children
date	DATE	Fecha de medición
weight	DECIMAL(5,2)	Peso en kg
height	DECIMAL(5,2)	Talla en cm
muac	DECIMAL(4,1)	Perímetro braquial en cm (opcional)
head_circumference	DECIMAL(4,1)	Perímetro cefálico en cm (opcional)
source	ENUM('home','health_center')	Fuente de medición
registered_by	ENUM('caregiver','health_worker')	Quién registra
created_at	TIMESTAMP	
Tabla: alerts
Campo	Tipo	Descripción
id	UUID	PK
child_id	UUID	FK a children
type	ENUM('growth_descent','muac_critical','weight_loss','missed_control')	Tipo de alerta
severity	ENUM('low','medium','high')	Severidad: 🟢🟡🔴
message	TEXT	Mensaje descriptivo
status	ENUM('active','reviewed','resolved')	Estado
health_worker_id	UUID	FK a users
created_at	TIMESTAMP	
resolved_at	TIMESTAMP	
Tabla: users
Campo	Tipo	Descripción
id	UUID	PK
phone_number	VARCHAR(20)	Número de teléfono (identificador)
name	VARCHAR(100)	Nombre
role	ENUM('caregiver','health_worker','admin')	Rol
health_center_id	UUID	FK a health_centers (si aplica)
created_at	TIMESTAMP	
Tabla: health_centers
Campo	Tipo	Descripción
id	UUID	PK
name	VARCHAR(200)	Nombre del centro
region	VARCHAR(100)	Región
district	VARCHAR(100)	Distrito
created_at	TIMESTAMP	
⚙️ CONFIGURACIÓN DEL ENTORNO DE DESARROLLO
Backend (FastAPI / Python)
python
# requirements.txt
fastapi==0.110.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
pandas==2.1.0
numpy==1.24.0
scipy==1.11.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
twilio==8.8.0
python
# backend/api/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from .routes import children, measurements, alerts, whatsapp, users
from .database import engine, get_db
from .models import Base

app = FastAPI(
    title="Yanapiri Wawa API",
    description="API para vigilancia nutricional infantil",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://tu-dominio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(children.router, prefix="/api/children", tags=["children"])
app.include_router(measurements.router, prefix="/api/measurements", tags=["measurements"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["whatsapp"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Yanapiri Wawa"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
Motor Yanapiri (Cálculo de Z-scores)
python
# backend/motor_yanapiri/zscore_calculator.py
import pandas as pd
import numpy as np
from scipy.interpolate import interp1d
from .data import who_growth_tables

class MotorYanapiri:
    """Motor de cálculo de puntajes Z según estándares OMS"""
    
    def __init__(self):
        self.who_tables = who_growth_tables.load()
    
    def calculate_zscore(self, sex, age_months, measurement_type, value):
        """Calcula puntaje Z para un indicador dado"""
        table = self.who_tables[measurement_type][sex]
        age = age_months
        
        # Interpolación lineal según OMS
        z_scores = []
        for z in [-3, -2, -1, 0, 1, 2, 3]:
            interpolated = interp1d(table['age'], table[f'z_{z}'], 
                                    kind='linear', fill_value='extrapolate')
            z_scores.append(interpolated(age))
        
        # Encontrar Z-score exacto
        if value < z_scores[0]:
            return -3.0
        elif value > z_scores[-1]:
            return 3.0
        
        for i in range(6):
            if z_scores[i] <= value <= z_scores[i+1]:
                ratio = (value - z_scores[i]) / (z_scores[i+1] - z_scores[i])
                return (i - 3) + ratio
        
        return 0.0
    
    def classify_nutrition(self, zscore):
        """Clasifica el estado nutricional según Z-score"""
        if zscore < -3.0:
            return {"category": "Desnutrición aguda grave", "severity": "🔴", "alert": "urgente"}
        elif zscore < -2.0:
            return {"category": "Desnutrición aguda moderada", "severity": "🟡", "alert": "seguimiento"}
        elif zscore < -1.0:
            return {"category": "Riesgo de desnutrición", "severity": "🟡", "alert": "observación"}
        elif zscore <= 1.0:
            return {"category": "Normal", "severity": "🟢", "alert": "ninguna"}
        elif zscore <= 2.0:
            return {"category": "Riesgo de sobrepeso", "severity": "🟡", "alert": "observación"}
        else:
            return {"category": "Sobrepeso", "severity": "🔴", "alert": "seguimiento"}
Frontend (PWA - React + Vite + Tailwind)
javascript
// frontend/pwa/package.json
{
  "name": "yanapiri-wawa-pwa",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "react-hook-form": "^7.48.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0"
  }
}
Configuración de PWA (manifest.json)
json
// frontend/pwa/public/manifest.json
{
  "name": "Yanapiri Wawa - Ayudante del Bebé",
  "short_name": "Yanapiri Wawa",
  "description": "Plataforma de vigilancia nutricional infantil",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10B981",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
Service Worker (para offline)
javascript
// frontend/pwa/public/service-worker.js
const CACHE_NAME = 'yanapiri-wawa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
Componente Principal de la PWA
jsx
// frontend/pwa/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterChild from './pages/RegisterChild';
import MeasurementHistory from './pages/MeasurementHistory';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-child" element={<RegisterChild />} />
          <Route path="/measurements" element={<MeasurementHistory />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
jsx
// frontend/pwa/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildren } from '../hooks/useChildren';
import ChildCard from '../components/ChildCard';
import GrowthChart from '../components/GrowthChart';
import AlertsList from '../components/AlertsList';

function Home() {
  const navigate = useNavigate();
  const { children, loading, fetchChildren } = useChildren();
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Yanapiri Wawa</h1>
          <p className="text-sm text-gray-600">Ayudante del Bebé</p>
        </div>
        <button 
          onClick={() => navigate('/register-child')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Agregar niño
        </button>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Aún no has registrado a tu hijo</p>
          <p className="text-sm text-gray-400 mt-2">Mide y monitorea su crecimiento</p>
        </div>
      ) : (
        <>
          {/* Lista de niños */}
          {children.map(child => (
            <ChildCard 
              key={child.id} 
              child={child} 
              onSelect={() => setSelectedChild(child)}
            />
          ))}

          {/* Curva de crecimiento del niño seleccionado */}
          {selectedChild && (
            <GrowthChart child={selectedChild} />
          )}

          {/* Alertas */}
          <AlertsList children={children} />
        </>
      )}
    </div>
  );
}

export default Home;
Componente de Gráfico de Crecimiento
jsx
// frontend/pwa/src/components/GrowthChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GrowthChart({ child }) {
  const measurements = child.measurements || [];
  
  const data = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Peso (kg)',
        data: measurements.map(m => m.weight),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3
      },
      {
        label: 'Peso esperado (P50)',
        data: measurements.map(m => child.expected_weight_p50 || 0),
        borderColor: '#93C5FD',
        borderDash: [5, 5],
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Curva de Crecimiento' },
      legend: { position: 'bottom' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="font-medium text-gray-800 mb-3">Curva de Crecimiento</h3>
      <div style={{ height: '250px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default GrowthChart;
Integración con WhatsApp (Webhook)
python
# backend/api/routes/whatsapp.py
from fastapi import APIRouter, HTTPException, Request
from twilio.twiml.messaging_response import MessagingResponse
from ..services.motor_yanapiri import MotorYanapiri
from ..services.child_service import ChildService
from ..services.measurement_service import MeasurementService

router = APIRouter()
motor = MotorYanapiri()

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """Maneja mensajes entrantes de WhatsApp"""
    form_data = await request.form()
    message_body = form_data.get('Body', '').strip()
    from_number = form_data.get('From', '')

    resp = MessagingResponse()
    msg = resp.message()

    try:
        # Procesar mensaje
        if message_body.startswith("Peso:"):
            # Extraer peso del mensaje
            weight_str = message_body.replace("Peso:", "").replace("kg", "").strip()
            weight = float(weight_str)
            
            # Buscar al niño activo
            child = ChildService.get_active_child(from_number)
            if not child:
                msg.body("Primero registra a tu hijo en la app de Yanapiri Wawa. 📱")
                return str(resp)
            
            # Guardar medición
            MeasurementService.save_measurement(
                child_id=child.id,
                weight=weight,
                source="home"
            )
            
            # Calcular Z-score
            zscore = motor.calculate_zscore(
                sex=child.sex,
                age_months=child.age_months,
                measurement_type="weight",
                value=weight
            )
            classification = motor.classify_nutrition(zscore)
            
            # Respuesta con estado
            response_text = f"""
✅ Registro completado, {child.name}!

📊 Estado nutricional: {classification['category']}
⚡ Severidad: {classification['severity']} {classification['alert']}

📝 Recomendación: 
"""
            if classification['severity'] == '🔴':
                response_text += "Por favor acude al centro de salud para evaluación inmediata. 🏥"
            elif classification['severity'] == '🟡':
                response_text += "Agenda una visita con tu actor social. 👩‍⚕️"
            else:
                response_text += "¡Sigue así! Mantén el seguimiento mensual. 💪"
            
            msg.body(response_text)
            
        elif message_body.startswith("Talla:"):
            talla_str = message_body.replace("Talla:", "").replace("cm", "").strip()
            talla = float(talla_str)
            
            # Similar al procesamiento de peso...
            msg.body("✅ Talla registrada correctamente.")
            
        else:
            msg.body("""
Hola, soy Yanapiri Wawa 🌱

Puedes registrarme con:
- Peso: 12.5 kg
- Talla: 85 cm

O visita la app para más opciones. 📱
""")
            
    except Exception as e:
        msg.body("Hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo. 🙏")
        
    return str(resp)
📦 DESPLIEGUE CON DOCKER
yaml
# infrastructure/docker/docker-compose.yml
version: '3.8'

services:
  database:
    image: postgres:15
    container_name: yanapiri-db
    environment:
      POSTGRES_USER: yanapiri
      POSTGRES_PASSWORD: yanapiri2026
      POSTGRES_DB: yanapiri
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../database/migrations:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - yanapiri-net

  backend:
    build:
      context: ../backend
      dockerfile: ../infrastructure/docker/Dockerfile.api
    container_name: yanapiri-api
    environment:
      DATABASE_URL: postgresql://yanapiri:yanapiri2026@database:5432/yanapiri
      SECRET_KEY: ${SECRET_KEY}
      TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
      TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
    ports:
      - "8000:8000"
    depends_on:
      - database
    networks:
      - yanapiri-net

  pwa:
    build:
      context: ../frontend/pwa
      dockerfile: ../../infrastructure/docker/Dockerfile.pwa
    container_name: yanapiri-pwa
    ports:
      - "80:80"
    networks:
      - yanapiri-net

  dashboard:
    build:
      context: ../frontend/dashboard
      dockerfile: ../../infrastructure/docker/Dockerfile.dashboard
    container_name: yanapiri-dashboard
    ports:
      - "8080:80"
    networks:
      - yanapiri-net

networks:
  yanapiri-net:
    driver: bridge

volumes:
  postgres_data:
Dockerfile del Backend
dockerfile
# infrastructure/docker/Dockerfile.api
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
🔧 CONFIGURACIÓN DE TWA (BUBBLEWRAP)
bash
# 1. Instalar Bubblewrap
npm install -g @bubblewrap/cli

# 2. Inicializar el proyecto TWA
cd twa
bubblewrap init --manifest=https://tu-dominio.com/manifest.json

# 3. Configurar el assetlinks.json (en tu servidor)
# Crear archivo en: /.well-known/assetlinks.json
json
// /.well-known/assetlinks.json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.yanapiriwawa.app",
      "sha256_cert_fingerprints": [
        "TU_HUELLA_SHA256_DE_GOOGLE_PLAY"
      ]
    }
  }
]
bash
# 4. Generar el APK
bubblewrap build

# El APK se generará en: twa/app/build/outputs/apk/release/app-release.apk
🧪 CRITERIOS DE ACEPTACIÓN (MVP)
Para la Hackathon
#	Requisito	Estado
1	PWA instalable (manifest.json + Service Worker)	Pendiente
2	Registro de niño (nombre, fecha nacimiento, sexo)	Pendiente
3	Registro de mediciones (peso, talla, MUAC)	Pendiente
4	Visualización de curva de crecimiento	Pendiente
5	Cálculo de Z-scores (OMS)	Pendiente
6	Sistema de alertas codificadas (🟢🟡🔴)	Pendiente
7	Dashboard con lista priorizada	Pendiente
8	Integración con WhatsApp (webhook)	Pendiente
9	Demo offline con Service Worker	Pendiente
10	APK generado con Bubblewrap	Pendiente
Métricas de Éxito
Métrica	Objetivo
Tiempo de registro de medición	< 60 segundos
Precisión de Z-scores	± 0.1 puntos
Alertas generadas correctamente	100%
Tamaño del APK	< 5 MB
Rendimiento en dispositivos básicos	< 3 segundos de carga
📋 CHECKLIST DE DESARROLLO (HACKATHON)
Día 1: Configuración y Estructura
□ Configurar repositorio en GitHub
□ Estructurar proyecto según el esquema definido
□ Configurar entorno de desarrollo (Node.js, Python, PostgreSQL)
□ Configurar Docker local para desarrollo
□ Crear base de datos y migraciones iniciales
Día 2: Backend y Motor Yanapiri
□ Implementar API con FastAPI (CRUD: niños, mediciones)
□ Implementar Motor Yanapiri (cálculo de Z-scores)
□ Cargar tablas OMS en la base de datos
□ Probar clasificación nutricional con datos de ejemplo
□ Implementar generación de alertas por reglas
Día 3: Frontend (PWA y Dashboard)
□ Configurar PWA con React + Vite + Tailwind
□ Implementar registro de niños y mediciones
□ Implementar visualización de curvas de crecimiento (Chart.js)
□ Configurar Service Worker para offline
□ Implementar dashboard con lista priorizada
Día 4: Integraciones y Demo
□ Configurar webhook de WhatsApp
□ Probar registro por mensaje de texto
□ Generar APK con Bubblewrap
□ Preparar demo en vivo (teléfono + dashboard)
□ Ensayar pitch de 2 minutos
🗣️ PITCH DE 2 MINUTOS (Para la Hackathon)
Apertura (20 segundos)
"En Huancavelica, 1 de cada 5 niños menores de 3 años queda sin seguimiento por más de 45 días entre visitas domiciliarias, perpetuando el 22.7% de desnutrición crónica."

Problema (20 segundos)
"Hoy, una madre en Huancavelica tiene que caminar 2 horas hasta el centro de salud. El profesional mide a su niño, anota en papel, y recién en la siguiente visita sabe si está creciendo bien. Para entonces, el daño ya está hecho."

Solución (30 segundos)
"Presentamos Yanapiri Wawa —Ayudante del Bebé en aimara— una plataforma que integra un algoritmo predictivo basado en estándares OMS al sistema de visitas del MINSA. La familia mide peso, talla y MUAC desde casa y registra por WhatsApp. El sistema analiza la tendencia de crecimiento y alerta al centro de salud con 2 meses de anticipación."

Los 3 Diferenciadores (30 segundos)
"Primero: Motor Yanapiri. No solo clasifica, predice tendencias. Segundo: Recomendaciones contextualizadas. Sugerimos comidas que la familia puede pagar y encontrar en su mercado local. Tercero: Accesibilidad multicanal. App, WhatsApp y SMS para llegar a donde las apps no llegan."

Demo (15 segundos)
(Mostrar teléfono) "Aquí enviamos 'Peso: 12.4 kg, Talla: 85 cm'. El sistema calcula el Z-score y genera una alerta. En el dashboard, el profesional ve a los niños priorizados por riesgo."

Modelo de Negocio (15 segundos)
"El MINSA ya invirtió S/76 millones en telemedicina. Con USD 3 por niño al año, el Estado ahorra USD 197 en tratamiento por cada niño detectado a tiempo."

Cierre (10 segundos)
"Yanapiri Wawa: el ayudante del bebé que el sistema de salud peruano necesita. Porque un niño bien alimentado es un niño que aprende, que sueña y que transforma su comunidad."

💎 CONCLUSIÓN
Este prompt contiene todo lo necesario para que un agente o equipo de desarrollo construya el MVP completo de Yanapiri Wawa para la hackathon. El proyecto está diseñado para ser:

Característica	Estado
Funcional	✅ Flujo completo: registro → medición → alerta → dashboard
Escalable	✅ Arquitectura preparada para TWA y Google Play
Ético	✅ Enfoque NO diagnóstico, bases científicas claras
Contextualizado	✅ Datos de Huancavelica, estándares OMS/UNICEF/MINSA
Ganable	✅ Diferenciadores claros, modelo de negocio viable
Yanapiri Wawa: Medir. Detectar. Conectar. Actuar.