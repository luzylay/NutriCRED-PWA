# Guía de Despliegue (DEPLOYMENT.md) - Yanapiri Wawa

Este documento detalla el procedimiento para desplegar la plataforma **Yanapiri Wawa** en un entorno de producción o staging.

---

## 1. Variables de Entorno

Tanto el backend como el frontend leen configuraciones a través de variables de entorno para facilitar su despliegue en contenedores o servicios en la nube.

### Backend (FastAPI)
Crea un archivo `.env` en la carpeta `backend/` con los siguientes parámetros:

- `DATABASE_URL`: URI de conexión a la base de datos.
  - *SQLite (Local/Demo):* `sqlite:///./yanapiriwawa.db`
  - *PostgreSQL (Producción):* `postgresql://user:password@host:port/dbname`
- `SECRET_KEY`: Llave secreta criptográfica de alta entropía para firmar tokens JWT.
- `ALGORITHM`: Algoritmo de firma (por defecto `HS256`).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Expiración de sesión (por defecto `120`).

---

## 2. Despliegue del Backend

### Opción A: Despliegue con Docker (Recomendado para Producción)

1. Crea un `Dockerfile` en el directorio `backend/`:
   ```dockerfile
   FROM python:3.12-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```
2. Construye y ejecuta el contenedor:
   ```bash
   docker build -t yanapiri-backend .
   docker run -d -p 8000:8000 --env-file .env --name yanapiri-api yanapiri-backend
   ```

### Opción B: Despliegue Manual con Uvicorn y Gunicorn
En un servidor Linux VPS (Ubuntu/Debian):
1. Configura un archivo de servicio systemd en `/etc/systemd/system/yanapiri.service`:
   ```ini
   [Unit]
   Description=Yanapiri Wawa FastAPI Service
   After=network.target

   [Service]
   User=www-data
   WorkingDirectory=/var/www/yanapiri/backend
   ExecStart=/var/www/yanapiri/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
   Restart=always
   EnvironmentFile=/var/www/yanapiri/backend/.env

   [Install]
   WantedBy=multi-user.target
   ```
2. Recarga y activa el servicio:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start yanapiri.service
   sudo systemctl enable yanapiri.service
   ```
3. Configura **Nginx** como Proxy Inverso para redirigir el tráfico HTTPS hacia el puerto `8000` local.

---

## 3. Despliegue del Frontend (PWA)

El frontend compilado por Vite consiste en archivos estáticos puros (HTML, JS, CSS) que pueden alojarse en cualquier servidor web estático.

1. Genera los archivos estáticos en la carpeta raíz del frontend:
   ```bash
   npm run build
   ```
   Esto creará la carpeta `dist/` conteniendo todos los recursos optimizados.
2. Sube la carpeta `dist/` a servicios de hosting estático como:
   - **Vercel / Netlify / Cloudflare Pages:** Vinculando directamente el repositorio de Git.
   - **AWS S3 / Google Cloud Storage:** Configurando el bucket como static website hosting.
   - **Nginx local:** Apuntando la directiva `root` de tu servidor virtual a la ruta del directorio `dist/`.
