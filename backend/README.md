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

## 🛡️ Protocolos de Ciberseguridad (Pendientes para Producción)

Debido a la naturaleza sensible de los datos (Sector Salud), cuando se conecte la base de datos real, es **estrictamente obligatorio** implementar las siguientes capas de seguridad antes de salir a producción, asegurando que no existan puertas traseras:

1. **Prevención de Inyección SQL (Nativo)**: Al utilizar Prisma como ORM, todas las consultas están parametrizadas por defecto. Nunca se debe concatenar *strings* directos en consultas crudas (`$queryRaw`).
2. **Encriptación de Contraseñas (Hashing)**:
   - Instalar `bcrypt` y asegurar que toda contraseña pase por una función de *hash* (con *salt*) antes de guardarse.
   - Ningún token ni contraseña cruda debe exponerse en logs.
3. **Validación Criptográfica y Guards (NestJS)**:
   - Implementar `@nestjs/jwt` con firmas reales.
   - Proteger cada endpoint sensible utilizando `AuthGuard`. Esto rechazará cualquier petición que carezca de un token válido o que pertenezca a un usuario sin los permisos (roles) adecuados.
4. **CORS, Rate Limiting y SSL**:
   - **CORS**: Limitar drásticamente qué dominios (orígenes) pueden comunicarse con esta API.
   - **Rate Limiter**: Instalar `@nestjs/throttler` para prevenir ataques de fuerza bruta en `/auth/login`.
   - **Certificados SSL**: El servidor debe configurarse siempre bajo protocolo `HTTPS` para encriptar la data en tránsito.

---

*Desarrollado para resolver problemas de interoperabilidad en el sector salud.*
