# Política de Protección de Datos Personales (PRIVACY.md) - Yanapiri Wawa

Este documento detalla el marco normativo de privacidad y protección de la información médica de los menores de edad y sus familias dentro de la plataforma **Yanapiri Wawa**, tomando como referencia la **Ley N.º 29733 — Ley de Protección de Datos Personales del Perú**.

---

## 1. Principios de Protección de Datos Implementados

### 1.1 Consentimiento Informado (Opt-In Obligatorio)
De acuerdo con la legislación peruana, el tratamiento de datos sensibles (datos de salud) requiere el consentimiento previo, expreso e informado del titular. En Yanapiri Wawa:
- Durante el registro de un niño, el cuidador debe marcar explícitamente la aceptación de la política de datos personales.
- Este consentimiento se almacena de forma inmutable en la tabla `consents` con fecha y hora.
- Se prevé un mecanismo para revocar el consentimiento, inhabilitando la visibilidad del expediente para actores sociales de forma inmediata.

### 1.2 Minimización y Finalidad Proporcional
- El sistema solo solicita y procesa datos estrictamente necesarios para evaluar el crecimiento nutricional (Peso, Talla, Sexo, Edad y Perímetro Braquial).
- **Prohibición de fotografías:** Por seguridad de los menores de edad, el MVP de Yanapiri Wawa **no almacena ni permite adjuntar fotografías** de los rostros de los niños. Esto mitiga riesgos de exposición accidental de menores y reduce la huella de almacenamiento de datos sensibles.

### 1.3 Confidencialidad y Seguridad por Defecto (Privacy by Design)
- La base de datos asocia los registros médicos del menor solo con su cuidador principal, su actor social asignado y su pediatra/enfermero en CRED. No existen consultas cruzadas ni visibilidad compartida entre familias.
- En los listados de atenciones prioritarias del profesional, los nombres completos se truncan a iniciales en las vistas generales (`shortName`) para resguardar la identidad del menor en pantallas expuestas en salas de espera de los establecimientos de salud.

---

## 2. Bitácora de Auditoría (Trazabilidad Absoluta)

Para cumplir con el deber de confidencialidad y control exigido por la Autoridad Nacional de Protección de Datos Personales (ANPD):
- Toda acción sobre el expediente clínico (crear niño, modificar peso, generar alerta, acceso a curvas) es guardada en la tabla `audit_logs`.
- Cada registro almacena:
  - **Quién:** ID del usuario autenticado por JWT.
  - **Qué:** Acción realizada (ej. `register_measurement_weight`).
  - **Sobre qué:** ID de la medición o ficha de niño afectada.
  - **Cuándo:** Marca de tiempo UTC inalterable.
  - **IP y Metadatos:** Origen de la petición.
- Estos registros son de solo lectura y no pueden ser modificados ni eliminados por ningún operador del sistema (inmutabilidad de logs).
