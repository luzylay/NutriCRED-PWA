# Yanapiri Wawa (Ayudante del Bebé) 🇵🇪

![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Local--First-purple?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Production-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> **Plataforma Web PWA de Monitoreo Nutricional Infantil y Triaje Preventivo en el Perú**  
> *Diseñada para funcionar 100% Offline en zonas rurales con IA de Visión por Computadora en CPU (WebAssembly).*

🌐 **Despliegue Oficial en vivo**: [https://yanapiriwawa.vercel.app/](https://yanapiriwawa.vercel.app/)  
🌐 **Enlace Alternativo**: [https://yanapiriwawa-crecer-mejor.vercel.app/](https://yanapiriwawa-crecer-mejor.vercel.app/)

---

## 🌟 Propuesta de Valor y Principio Clínico

Yanapiri Wawa conecta el registro antropométrico realizado por las familias en el hogar con el trabajo presencial de los profesionales de salud (CRED) y las visitas domiciliarias de las promotoras (ACS).

- **Triaje OMS / MINSA**: Evaluación en tiempo real de Peso, Talla y Perímetro Braquial (MUAC) mediante curvas Z-Score oficial de la OMS.
- **Triaje S.O.S de Emergencia**: Detección y canalización prioritaria de niños con signos de alarma clínica (fiebre, vómitos, decaimiento).
- **Guardarraíl Clínico**: El sistema actúa como herramienta asistida de triaje preventivo y no reemplaza el diagnóstico presencial del médico o nutricionista.

---

## 🛠️ Herramientas de IA y Visión Local (100% CPU WASM)

El proyecto ejecuta todas sus capacidades de visión por computadora e inteligencia artificial **directamente en el procesador (CPU) del dispositivo del usuario**, sin costo de servidor backend ni consumo de datos móviles:

1. **🥗 Semáforo del Plato AR 2D (`PlateScannerModal`)**:
   - Analiza la comida servida mediante la cámara en tiempo real para detectar sangrecita, hígado, cítricos (vitamina C) e inhibidores de hierro (té/café/lácteos).
2. **🤟 Intérprete LSP — Lengua de Señas Peruana (`CameraPanel`)**:
   - Sistema de accesibilidad inclusiva impulsado por MediaPipe Hands (21 puntos clave) que clasifica formas y movimientos de señas en tiempo real.
3. **💊 Evidencia Fotográfica de Suplementos (`SupplementPhotoCapture`)**:
   - Registro de adherencia al hierro con captura de frasco/gotero en vivo y fallback a cámara nativa ante bloqueos de permisos.
4. **📇 Escáner de Carnet CRED por QR (`QRScannerModal`)**:
   - Lectura rápida de carnets de salud para identificación inmediata del menor.

---

## 🎨 Sistema de Temas Accesibles (4 Modos de Contraste)

La interfaz se adapta visualmente a cualquier usuario y entorno de iluminación:
- **Rojo y Dorado (`.theme-red-gold`)**: Modo Marca institucional con tipografía e insignias de alto contraste.
- **Modo Noche / Descanso Visual (`.theme-night-gold`)**: Paleta oscura enmarcada en acentos dorados para evitar fatiga ocular.
- **Baja Visión (`.theme-low-vision`)**: Contraste maximizado para usuarios con limitaciones visuales.
- **Daltonismo (`.theme-colorblind`)**: Colores calibrados para deuteranopía, protanopía y acromatopsia.

---

## 👥 Matriz de Funcionalidades por Rol de Usuario

| Rol de Usuario | Funcionalidades | Enfoque Operativo |
| :--- | :---: | :--- |
| **🏡 Apoderado / Familia** | **18** | Curvas Z-Score, seguimiento diario de hierro con foto, semáforo del plato AR, reporte S.O.S y Puntos Yanapiri. |
| **👩‍⚕️ Promotora (ACS)** | **14** | Censo comunitario 100% offline, escáner CRED QR, hemoglobina corregida por altitud, alertas de migración. |
| **🩺 Médico / Nutricionista** | **15** | Sala de situación regional, consola de auditoría fotográfica, percentiles OMS, inventario de suplementos. |
| **🌐 Público / Ciudadano** | **7** | Transparencia de impacto en vivo, mapas de calor de anemia, simulador de WhatsApp, olla común. |

---

## 🔒 Protocolo de Seguridad en GitHub

El repositorio está configurado bajo estrictas reglas de seguridad en [`.gitignore`](.gitignore):
- Exclusión total de secretos, tokens y archivos de entorno (`.env`, `.env.*`).
- Exclusión de certificados, llaves privadas (`*.pem`, `*.key`) y bases de datos locales (`*.db`).
- Exclusión de logs y archivos temporales de agentes (`.system_generated/`, `.brain/`, `scratch/`).

---

## 🚀 Instalación y Desarrollo Local

### Requisitos Previos
- **Node.js**: v18.0.0 o superior.
- **npm**: v9.0.0 o superior.

### Pasos de Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/Yanapiriwawa-Crecer-Mejor.git
cd Yanapiriwawa-Crecer-Mejor

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo Vite
npm run dev

# 4. Validar compilación de producción
npm run build
```

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulte el archivo [LICENSE](LICENSE) para más detalles.