# Plan de Recuperación ante Desastres (DRP) - Yanapiri Wawa

Este documento establece los procedimientos de respaldo (backup) y recuperación ante fallos catastróficos del servidor edge (posta médica local).

## 1. Política de Copias de Seguridad

- **Frecuencia:** Las copias de seguridad de la base de datos `dev.db` (SQLite) deben ejecutarse diariamente a las 23:00 hrs.
- **Herramienta:** El script de backup automatizado se encuentra en `backend/scripts/backup.js`.
- **Cifrado:** Todos los backups generados son encriptados en reposo usando el algoritmo **AES-256-CBC**. La contraseña para el cifrado se debe configurar en la variable de entorno `BACKUP_PASSWORD`.
- **Almacenamiento:** Los archivos generados tienen el formato `backup-YYYY-MM-DDTHH-mm-ss.db.enc` y se almacenan en la carpeta `backend/backups/`. Se recomienda que esta carpeta esté sincronizada o sea copiada a una unidad extraíble (USB) semanalmente por el personal.

## 2. Ejecución Manual de Backup

Para forzar la creación de un backup manual antes de un mantenimiento, ejecute:

```bash
cd backend
node scripts/backup.js
```

## 3. Procedimiento de Restauración (Recovery)

En caso de que el archivo principal `dev.db` se corrompa o se pierda:

1. **Detener el servicio:**
   Asegúrese de que el servidor NestJS esté detenido.
2. **Descifrar el último backup:**
   Dado que los backups están cifrados, necesitará crear un script inverso (`restore.js`) o usar herramientas compatibles con `openssl` (que utilicen el mismo vector de inicialización almacenado en los primeros 16 bytes del archivo).
3. **Reemplazar la base de datos:**
   Reemplace el archivo `dev.db` corrupto con la versión descifrada del backup.
4. **Reiniciar el servidor:**
   Inicie el servidor nuevamente y ejecute `npx prisma db push` o `prisma migrate deploy` por si hubiesen migraciones pendientes.

## 4. Pruebas del DRP

Se debe simular un proceso de restauración completo al menos una vez cada 6 meses en un entorno aislado, para garantizar que la contraseña de cifrado siga siendo conocida por los administradores y que la integridad del archivo descifrado permita iniciar el backend sin errores.
