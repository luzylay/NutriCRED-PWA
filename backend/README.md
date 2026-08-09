# Yanapiriwawa - Backend (API)

Este es el servidor backend de la plataforma Yanapiriwawa, desarrollado con **NestJS** y **Prisma**.

## 🚀 Estado Actual (Mocks Funcionales)

Para facilitar el desarrollo del Frontend y la integración temprana, la base de datos **no está requerida** en este momento. Los endpoints de Autenticación (`/auth`) y recursos están **mockeados** en memoria. Esto significa que la aplicación responde de manera funcional a las peticiones, devolviendo tokens y datos de prueba.

Cualquier desarrollador puede levantar este backend y usarlo inmediatamente sin sentir la falta de la base de datos real.

## 📦 Cómo Levantar el Backend (Local)

1. Instalar dependencias:
```bash
npm install
```
2. Iniciar el servidor en modo desarrollo:
```bash
npm run start:dev
```
El servidor se ejecutará en `http://localhost:3000`.

---

## 🗄️ Guía: Cómo Conectar la Base de Datos Real en el Futuro

Cuando la organización esté lista para conectarse a una base de datos real (PostgreSQL), sigue estrictamente estos pasos:

### 1. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz de esta carpeta `backend/` con tu cadena de conexión a PostgreSQL:
```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/yanapiriwawa_db?schema=public"
```

### 2. Aplicar las Migraciones (Crear Tablas)
El esquema ya está definido en `prisma/schema.prisma`. Para reflejar estos modelos en la base de datos real, ejecuta:
```bash
npx prisma migrate dev --name init
```
Esto creará las tablas de `Organization` y `User`.

### 3. Eliminar los Mocks y Usar PrismaClient
Ve a los archivos de servicio (ej. `src/auth/auth.service.ts`) y reemplaza las validaciones mockeadas de memoria para usar el cliente de Prisma:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Ejemplo de llamada real a la DB:
const user = await prisma.user.findUnique({ where: { email: dto.email } });
```

---

*Desarrollado para resolver problemas de interoperabilidad en el sector salud.*
