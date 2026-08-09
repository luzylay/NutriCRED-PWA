# Modelo de Base de Datos (DATABASE.md) - Yanapiri Wawa

Este documento detalla el esquema relacional físico de la base de datos de **Yanapiri Wawa**, el cual está implementado y autogenerado mediante el ORM de SQLAlchemy.

---

## 1. Diagrama de Relaciones Físicas

La base de datos sigue una estructura normalizada en tercera forma normal (3NF) para asegurar la consistencia clínica de los datos y evitar redundancias.

```text
  ┌──────────┐          ┌──────────────┐          ┌──────────────────────┐
  │  USERS   │ ◄─────── │  CAREGIVERS  │ ◄─────── │   CAREGIVER_CHILD    │
  └────┬─────┘          └──────────────┘          └──────────┬───────────┘
       │                                                     │
       │                ┌──────────────┐                     │ (child_id)
       ├──────────────► │  COMM_AGENTS │                     ▼
       │                └──────┬───────┘              ┌──────────────┐
       │                       │                      │   CHILDREN   │
       │                       ▼                      └──────┬───────┘
       │                ┌──────────────┐                     │
       │                │    VISITS    │ ◄───────────────────┤
       │                └──────┬───────┘                     │
       │                       ▼                             ▼
       │                ┌──────────────┐              ┌──────────────┐
       │                │ OBSERVATIONS │              │ MEASUREMENTS │
       │                └──────────────┘              └──────┬───────┘
       ▼                                                     ▼
  ┌──────────┐                                        ┌──────────────┐
  │  AUDITS  │                                        │    ALERTS    │
  └──────────┘                                        └──────────────┘
```

---

## 2. Diccionario de Tablas Principales

### 2.1 Tabla `users`
Almacena las credenciales de ingreso e identifica el rol del usuario en la plataforma.
- `id` (INTEGER, PK): Identificador único correlativo.
- `username` (VARCHAR, Unique, Indexed): Nombre de usuario único de acceso.
- `email_or_phone` (VARCHAR, Indexed): Canal primario de comunicación.
- `password_hash` (VARCHAR): Hash Bcrypt de la contraseña.
- `role` (VARCHAR): Rol del usuario (`ADMIN`, `PROFESSIONAL`, `COMMUNITY_AGENT`, `CAREGIVER`).
- `created_at` (DATETIME): Fecha de creación de la cuenta.

### 2.2 Tabla `children`
Ficha de identificación del menor monitoreado.
- `id` (INTEGER, PK): Código del niño.
- `name` (VARCHAR): Nombre completo.
- `sex` (VARCHAR): Sexo biológico (`M` o `F`).
- `date_of_birth` (DATETIME): Fecha de nacimiento (indispensable para cálculo Z-score).
- `district` (VARCHAR): Distrito de residencia.
- `community` (VARCHAR): Comunidad rural o sector urbano.
- `zscore_actual` (FLOAT): Último Z-score de peso calculado.
- `status_alerta` (VARCHAR): Semáforo de riesgo actual (`normal`, `follow-up`, `urgent`).

### 2.3 Tabla `measurements`
Historial de mediciones de crecimiento tomadas en hogar u establecimiento.
- `id` (INTEGER, PK).
- `child_id` (INTEGER, FK children.id): Niño medido.
- `registered_by` (INTEGER, FK users.id): Usuario que ingresó el dato.
- `type` (VARCHAR): Tipo de medición (`weight`, `height`, `muac`).
- `value` (FLOAT): Valor numérico registrado.
- `unit` (VARCHAR): Unidad (`kg` o `cm`).
- `measurement_date` (DATETIME): Fecha de la toma.
- `method` (VARCHAR): Origen del dato (`self` (padre), `agent` (visita), `professional` (establecimiento)).

### 2.4 Tabla `alerts`
Registro histórico de alarmas de crecimiento disparadas por el motor de reglas.
- `id` (INTEGER, PK).
- `child_id` (INTEGER, FK children.id).
- `measurement_id` (INTEGER, FK measurements.id).
- `rule_version_id` (INTEGER, FK rule_versions.id).
- `level` (VARCHAR): Semáforo (`normal`, `follow-up`, `urgent`).
- `created_at` (DATETIME): Fecha del disparo de la alerta.
- `status_revision` (VARCHAR): Estado de atención clínica (`pending`, `reviewed`).
- `comments` (TEXT): Descripción/Explicación clínica de la desviación.

---

## 3. Integridad y Trazabilidad (Auditoría)

La tabla `audit_logs` almacena un registro inmutable de todos los eventos del sistema:
- `id` (INTEGER, PK).
- `user_id` (INTEGER, FK): Operador de la acción.
- `action` (VARCHAR): Tipo de evento (ej. `register_measurement_weight`).
- `table_affected` (VARCHAR): Tabla SQL modificada.
- `record_id` (INTEGER): ID del registro afectado.
- `timestamp` (DATETIME): Fecha y hora UTC.
- `ip_address` (VARCHAR): Origen de red del dispositivo.
- `old_value` / `new_value` (TEXT): Almacenan diferencias en formato plano para facilitar auditorías cruzadas.
