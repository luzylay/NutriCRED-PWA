# Políticas de Seguridad (SECURITY.md) - Yanapiri Wawa

Este documento detalla las medidas de seguridad informática, protección de datos y mitigaciones implementadas en el MVP de **Yanapiri Wawa**.

---

## 1. Autenticación y Autorización (RBAC)

El sistema implementa un control de acceso basado en roles (**Role-Based Access Control - RBAC**) estricto que restringe qué usuarios pueden leer o escribir sobre la ficha médica de cada menor.

### Matriz de Permisos por Endpoint:

| Ruta de API | Método | Roles Permitidos | Restricción Adicional |
| :--- | :---: | :--- | :--- |
| `/auth/register` | `POST` | Todos (Público para Demo) | El registro crea perfiles diferenciados según el rol solicitado. |
| `/auth/login` | `POST` | Todos (Público) | Genera un token JWT firmado con algoritmo HS256 y expiración de 2 horas. |
| `/children` | `POST` | `ADMIN`, `PROFESSIONAL`, `CAREGIVER` | Los cuidadores solo pueden asociar niños bajo su propia tutela. |
| `/children` | `GET` | Todos | **Caregiver:** Ve solo sus hijos.<br>**Agent:** Ve solo niños asignados.<br>**Professional:** Acceso global a pacientes. |
| `/children/{id}/measurements` | `POST` | `ADMIN`, `PROFESSIONAL`, `CAREGIVER`, `COMMUNITY_AGENT` | Validado mediante la relación en las tablas puente. |
| `/audit` | `GET` | `ADMIN`, `PROFESSIONAL` | Solo personal autorizado de nivel clínico puede revisar bitácoras de auditoría. |

---

## 2. Hardening y Cifrado de Datos

- **Cifrado de Contraseñas:** Las contraseñas se almacenan cifradas utilizando el algoritmo **bcrypt** con generación de salt dinámica, evitando ataques de diccionario y rainbow tables. No se utiliza el obsoleto módulo de hashing MD5 o SHA1.
- **Tokens de Sesión (JWT):** Los tokens se firman en el servidor con una llave secreta de alta entropía. La carga útil del token solo incluye información no identificativa como el `username` y `role` para evitar fugas de datos en tránsito.
- **Protección contra Inyección SQL:** Todas las interacciones con la base de datos se realizan a través del ORM de SQLAlchemy utilizando consultas parametrizadas automáticas.
- **Protección contra XSS:** El frontend en React realiza el escape automático de caracteres en todos los campos ingresados por teclado antes de renderizarlos en el DOM.

---

## 3. Privacidad en Canales de Comunicación (WhatsApp Mock)

Para evitar fugas de información médica confidencial por canales de mensajería externos no encriptados:
- **No se envía información clínica en mensajes:** El adaptador de WhatsApp jamás transmitirá textos como *"Su hijo tiene sospecha de desnutrición"* o el valor de peso Z-score.
- **Mensaje genérico:** La alerta se limita a notificar que existe una actualización disponible en la plataforma segura: *"Yanapiri Wawa: Hay una actualización importante sobre el seguimiento de Juan. Ingrese a la plataforma para revisarla."*
- **Adapter Modular:** El código para la integración real con WhatsApp Business API está desacoplado para ser reemplazado de manera rápida y segura por un webhook certificado en el entorno productivo.
