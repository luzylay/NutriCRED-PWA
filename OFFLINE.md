# Funcionamiento Sin Conexión (OFFLINE.md) - Yanapiri Wawa

Este documento detalla el diseño técnico para garantizar que la plataforma **Yanapiri Wawa** funcione correctamente en zonas rurales sin conexión a internet y sincronice sus registros de forma transparente al recuperar la red.

---

## 1. Caché Estático: Service Worker

El archivo `public/pwa-sw.js` actúa como proxy de red local en el smartphone del cuidador.

- **Fase de Instalación (`install`):** Descarga y almacena en la caché estática local de la PWA todos los archivos indispensables del core frontend (`index.html`, JavaScript compilado, hojas de estilo CSS y tipografías).
- **Fase de Captura (`fetch`):** Aplica la estrategia **Cache-First con fallback de Red**. Al solicitar recursos estáticos, los recupera instantáneamente desde la caché local sin consumir megabytes. Solo si el archivo no está en caché, recurre a internet.
- **Exclusión de la API:** El Service Worker ignora deliberadamente las peticiones dirigidas a la API `/children`, `/auth` o `/visits` para garantizar que no se sirvan datos de salud obsoletos por accidente.

---

## 2. Cola de Sincronización (Offline Sync Queue)

Cuando el cuidador o el actor social intentan guardar una medición o visita:

1. **Detección de Red:** El frontend evalúa el estado del navegador mediante `navigator.onLine` e intercepta excepciones de conexión caída al ejecutar `fetch()`.
2. **Almacenamiento Local (Opt-In):** Si no hay conexión, los datos de la medición se guardan en el LocalStorage bajo la clave `yanapiri_offline_queue` con el estado `sync_status: "pending"`.
3. **Optimización en Caliente:** Para mantener la usabilidad sin red, el frontend introduce temporalmente el nuevo registro offline en el listado local de mediciones, permitiendo que la curva de peso del niño se actualice en la pantalla del celular al instante, marcándolo con una etiqueta visual de "Offline / Pendiente".

---

## 3. Resolución de Conflictos y Sincronización

### 3.1 Disparadores Automáticos
La PWA escucha activamente el evento `online` del navegador:
```javascript
window.addEventListener("online", () => {
  // Sincroniza automáticamente la cola local en segundo plano
  triggerSyncQueue();
});
```
Adicionalmente, se incluye un botón manual con icono de recarga en el encabezado de la PWA móvil que permite forzar la sincronización si la señal es inestable.

### 3.2 Política de No-Duplicación y Conflictos
- **Identificación Temporal:** Cada registro offline posee una marca de tiempo UTC inalterable en su creación (`measurement_date`).
- **Idempotencia en el Servidor:** Si una petición de la cola es enviada por duplicado por reintentos de red, el backend utiliza la combinación de `child_id`, `type`, `value` y `measurement_date` para descartar duplicados y evitar ensuciar el historial.
- **Orden de Procesamiento:** Los registros se procesan estrictamente en orden **FIFO (First-In, First-Out)**, garantizando que si se tomaron múltiples pesos en días diferentes sin red, la base de datos almacene la curva en la secuencia cronológica real correspondiente.
- **Tratamiento de Errores de Cola:** Si una petición de la cola falla por validación lógica (ej. rango erróneo en el servidor), esta se remueve de la cola y se alerta al usuario para evitar bloqueos del flujo de sincronización general.
