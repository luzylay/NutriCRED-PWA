# Documentación de API (API.md) - Yanapiri Wawa

Esta es la especificación técnica de los endpoints de la API REST de **Yanapiri Wawa**, disponible por defecto en `http://127.0.0.1:8000`.

---

## 1. Autenticación y Registro

### 1.1 Registro de Usuario
Crea una cuenta de cuidador, agente comunitario o profesional de salud en el sistema.
- **Ruta:** `/auth/register`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "username": "maria",
    "email_or_phone": "987654321",
    "password": "maria123",
    "role": "CAREGIVER",
    "name": "María",
    "lastname": "Quispe",
    "district": "Huancavelica",
    "community": "Anchonga"
  }
  ```
- **Respuesta (201 Created):**
  ```json
  {
    "id": 4,
    "username": "maria",
    "email_or_phone": "987654321",
    "role": "CAREGIVER",
    "status": "active",
    "created_at": "2026-08-09T03:00:00"
  }
  ```

### 1.2 Inicio de Sesión
Autentica credenciales y retorna un JWT Bearer token.
- **Ruta:** `/auth/login`
- **Método:** `POST`
- **Cuerpo (Form-Data):**
  - `username`: "maria"
  - `password`: "maria123"
- **Respuesta (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer",
    "role": "CAREGIVER",
    "username": "maria"
  }
  ```

---

## 2. Gestión de Niños

### 2.1 Listar Niños
Retorna la lista de menores autorizados según el rol del JWT.
- **Ruta:** `/children`
- **Método:** `GET`
- **Cabecera:** `Authorization: Bearer <token>`
- **Respuesta (200 OK):**
  ```json
  [
    {
      "id": 3,
      "name": "Juan Quispe Mamani",
      "sex": "M",
      "date_of_birth": "2024-05-15T00:00:00",
      "district": "Huancavelica",
      "community": "Anchonga",
      "zscore_actual": -1.8,
      "status_alerta": "follow-up"
    }
  ]
  ```

### 2.2 Registrar Niño
Registra un nuevo menor asociado al cuidador que invoca.
- **Ruta:** `/children`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "name": "Luis Quispe Mamani",
    "sex": "M",
    "date_of_birth": "2025-01-10T00:00:00",
    "district": "Huancavelica",
    "community": "Anchonga",
    "relationship": "Hijo"
  }
  ```

---

## 3. Mediciones Domiciliarias e Historial

### 3.1 Registrar Medición
Registra una medición de Peso, Talla o MUAC. Ejecuta automáticamente la validación de rango y el motor de percentiles OMS.
- **Ruta:** `/children/{child_id}/measurements`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "type": "weight",
    "value": 11.2,
    "unit": "kg",
    "method": "self"
  }
  ```
- **Respuesta (200 OK):**
  ```json
  {
    "id": 14,
    "child_id": 3,
    "registered_by": 4,
    "type": "weight",
    "value": 11.2,
    "unit": "kg",
    "measurement_date": "2026-08-09T03:30:00",
    "method": "self",
    "sync_status": "synced"
  }
  ```

---

## 4. Dashboard Clínico y Auditoría

### 4.1 Resumen Estadístico (Semáforo)
- **Ruta:** `/dashboard/summary`
- **Método:** `GET`
- **Respuesta (200 OK):**
  ```json
  {
    "total_children": 6,
    "normal_count": 2,
    "follow_up_count": 2,
    "urgent_count": 2
  }
  ```

### 4.2 Cola de Pacientes Priorizada
Retorna la lista de niños ordenada jerárquicamente por nivel de urgencia clínica (`urgent` -> `follow-up` -> `normal`).
- **Ruta:** `/dashboard/prioritized`
- **Método:** `GET`
- **Respuesta (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Pedro Inca Tuesta",
      "age": "3a 1m",
      "last_measured": "28/07/2026",
      "weight": 11.8,
      "height": 88.1,
      "muac": 11.5,
      "z_score": -2.8,
      "status": "urgent",
      "next_action": "Evaluación médica prioritaria",
      "district": "Huancavelica",
      "community": "Ccasapata",
      "caregiver": "Rosa Tuesta"
    }
  ]
  ```

### 4.3 Consultar Auditoría (Solo Lectura)
- **Ruta:** `/audit`
- **Método:** `GET`
- **Respuesta (200 OK):**
  ```json
  [
    {
      "id": 45,
      "user_id": 2,
      "action": "register_measurement_weight",
      "table_affected": "measurements",
      "record_id": 14,
      "timestamp": "2026-08-09T03:30:15"
    }
  ]
  ```
