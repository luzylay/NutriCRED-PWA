# Yanapiri Wawa — Android TWA (Trusted Web Activity)

Este directorio contiene el proyecto Android mínimo para publicar la PWA de
Yanapiri Wawa (`/familia`) en la Google Play Store como una **Trusted Web Activity**.

## ¿Qué es un TWA?

Un TWA convierte tu PWA en un APK instalable desde Play Store **sin reescribir código**.
El usuario lo descarga como cualquier app nativa, pero en realidad muestra la URL
`https://tu-dominio.com/familia` en Chrome, con la barra de navegación oculta.

## Requisitos

- Android Studio (Hedgehog o superior)
- JDK 17+
- Cuenta de Google Play Console
- Dominio HTTPS con el archivo `/.well-known/assetlinks.json` publicado
- Un keystore de firma Android

---

## Pasos para compilar

### 1. Publicar la PWA con HTTPS

Asegúrate de que tu app Vite esté desplegada con HTTPS y que el archivo
`public/.well-known/assetlinks.json` sea accesible en:

```
https://tu-dominio.com/.well-known/assetlinks.json
```

### 2. Obtener el SHA-256 del keystore

```bash
# Generar un nuevo keystore (si no tienes uno)
keytool -genkey -v -keystore yanapiri.jks -alias yanapiri \
  -keyalg RSA -keysize 2048 -validity 10000

# Obtener el SHA-256
keytool -list -v -keystore yanapiri.jks | grep SHA256
```

Copia el fingerprint y pégalo en `public/.well-known/assetlinks.json`:
```json
"sha256_cert_fingerprints": ["AA:BB:CC:..."]
```

### 3. Abrir en Android Studio

1. Abre este directorio `android-twa/` en Android Studio.
2. Edita `app/src/main/res/values/strings.xml` con tu dominio real.
3. En `app/build.gradle`, actualiza `applicationId`.

### 4. Compilar el APK

```bash
./gradlew assembleRelease
```

### 5. Firmar el APK

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore yanapiri.jks app-release-unsigned.apk yanapiri
```

---

## Estructura del proyecto

```
android-twa/
  app/
    src/main/
      AndroidManifest.xml     ← Permisos y configuración TWA
      kotlin/pe/yanapiriwawa/
        MainActivity.kt       ← Entry point (usa LauncherActivity de Browser)
      res/
        values/
          strings.xml         ← URL y nombre de la app
        mipmap-*/
          ic_launcher.png     ← Íconos de la app
  build.gradle
  settings.gradle
```

---

## Ventajas del TWA sobre un APK nativo

| Aspecto | TWA | React Native / Flutter |
|---------|-----|------------------------|
| Código nuevo | ❌ No necesario | ✅ Reescribir todo |
| Offline support | ✅ Service Worker | ✅ Nativo |
| Updates instantáneas | ✅ Deploy web | ❌ Requiere nueva versión |
| Acceso a hardware | ⚠️ Limitado | ✅ Completo |
| Costo | 🟢 Mínimo | 🔴 Alto |

Para el caso de Yanapiri Wawa, el TWA es la opción **ideal** dado que:
- La PWA ya tiene soporte offline con Service Worker
- Las funciones necesarias (cámara básica, formularios) son accesibles desde web
- Los usuarios de zonas rurales prefieren apps de Play Store a abrir un browser
