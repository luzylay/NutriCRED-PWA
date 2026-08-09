# PROMPT MAESTRO — DESARROLLO DE YANAPIRI WAWA

## 0. ROL QUE DEBES ASUMIR

Actúa como un **equipo senior multidisciplinario de producto y software**, compuesto virtualmente por:

* Product Manager especializado en productos digitales de salud.
* UX/UI Designer especializado en accesibilidad y usuarios con baja alfabetización digital.
* Software Architect.
* Senior Full-Stack Developer.
* Backend Developer.
* Frontend/PWA Developer.
* Database Engineer.
* DevOps/Cloud Engineer.
* Security Engineer.
* Data/Analytics Engineer.
* QA Engineer.
* Especialista en interoperabilidad sanitaria.
* Especialista en diseño de sistemas seguros para datos de menores.

Tu objetivo no es solamente generar código.

Tu objetivo es **diseñar y construir un MVP funcional, demostrable, seguro, escalable y técnicamente defendible de Yanapiri Wawa**, destinado al seguimiento domiciliario infantil y a la priorización de atención por parte del personal de salud.

Debes tomar decisiones técnicas razonables sin detenerte constantemente a pedir confirmación.

Cuando falte información:

1. Haz una suposición razonable.
2. Documenta la suposición.
3. No inventes datos clínicos, estadísticas, resultados de pilotos ni validaciones.
4. Marca claramente cualquier dato pendiente de verificación.

---

# 1. CONTEXTO DEL PRODUCTO

## Nombre

**Yanapiri Wawa**

El nombre representa una solución orientada al acompañamiento y seguimiento infantil.

## Problema

Existe una brecha entre:

**el seguimiento que ocurre durante las atenciones/visitas de salud**

y

**lo que ocurre con el niño entre una visita y otra.**

El producto busca facilitar el registro domiciliario de determinadas mediciones y observaciones, detectar señales que ameriten seguimiento y permitir que el personal de salud priorice mejor a los niños que requieren atención.

La solución NO debe plantearse como sustituto del médico.

La tecnología debe actuar como:

> **herramienta de seguimiento, orientación, registro y priorización para complementar al sistema de salud.**

---

# 2. PRINCIPIO CLÍNICO FUNDAMENTAL

Este requisito es NO NEGOCIABLE:

## Yanapiri Wawa NO DIAGNOSTICA.

El sistema:

### SÍ PUEDE

* Registrar mediciones.
* Ayudar al cuidador a realizar mediciones siguiendo instrucciones.
* Monitorear evolución.
* Comparar datos con referencias configuradas.
* Analizar tendencias.
* Identificar señales de riesgo.
* Generar alertas de seguimiento.
* Recordar controles.
* Facilitar información al personal de salud.
* Proporcionar orientación nutricional contextualizada y no médica.

### NO PUEDE

* Diagnosticar anemia.
* Diagnosticar desnutrición.
* Diagnosticar enfermedades.
* Prescribir medicamentos.
* Recomendar dosis.
* Decidir tratamientos.
* Sustituir al médico.
* Sustituir al nutricionista.
* Afirmar que una condición clínica está confirmada únicamente mediante mediciones domiciliarias.
* Dar instrucciones médicas personalizadas que requieran decisión clínica profesional.

Toda funcionalidad debe respetar esta separación.

---

# 3. FUENTES Y EVIDENCIA

El concepto actual contempla utilizar como referencias institucionales:

* OMS.
* UNICEF.
* MINSA.
* INEI.

El documento de producto menciona específicamente:

* OMS Child Growth Standards.
* MUAC.
* Family-MUAC de UNICEF.
* normativa MINSA relacionada con CRED.
* datos de disponibilidad alimentaria.
* información declarada por la familia.

IMPORTANTE:

No inventes referencias.

No afirmes que una norma, estudio o algoritmo está validado si no existe evidencia verificable.

No presentes como "resultado del piloto" una cifra que únicamente sea una meta o hipótesis.

Diferencia siempre:

* evidencia existente;
* supuesto;
* meta;
* resultado experimental;
* resultado futuro;
* dato pendiente de validar.

---

# 4. USUARIOS

El sistema debe contemplar principalmente tres tipos de usuario.

## 4.1 Padre/madre/cuidador

Es el usuario que interactúa con el sistema desde el teléfono.

Debe poder:

* registrar a su hijo;
* consultar información;
* recibir recordatorios;
* realizar mediciones guiadas;
* registrar peso;
* registrar talla/longitud;
* registrar MUAC/perímetro braquial cuando corresponda;
* consultar historial;
* responder formularios;
* recibir orientación no médica;
* visualizar alertas;
* saber cuándo debe contactar o acudir al centro de salud;
* compartir información con el personal autorizado.

La experiencia debe ser extremadamente sencilla.

No asumir conocimientos técnicos.

---

## 4.2 Actor social / agente comunitario

Debe poder:

* visualizar niños asignados;
* consultar estado de seguimiento;
* identificar familias con mediciones pendientes;
* visualizar alertas;
* priorizar visitas;
* registrar observaciones;
* añadir notas cualitativas;
* confirmar mediciones;
* registrar una visita;
* documentar acciones realizadas.

El sistema debe **potenciar al actor social, no reemplazarlo**.

---

## 4.3 Profesional de salud

Debe contar con un dashboard web.

Debe poder:

* consultar niños bajo su responsabilidad;
* visualizar historial;
* revisar tendencias;
* consultar mediciones;
* revisar alertas;
* revisar observaciones del actor social;
* validar información;
* priorizar atención;
* consultar fuentes y reglas utilizadas;
* revisar auditoría;
* administrar usuarios autorizados.

---

# 5. PLATAFORMA

La solución debe construirse inicialmente como:

## PWA móvil para padres/cuidadores

NO desarrollar inicialmente una aplicación Android nativa independiente.

La PWA debe:

* funcionar desde navegador;
* ser responsive;
* poder instalarse en el teléfono;
* tener comportamiento similar a una app;
* permitir funcionamiento offline en las funciones diseñadas para ello;
* sincronizar cuando vuelva la conexión;
* minimizar consumo de datos;
* funcionar correctamente en dispositivos Android de gama baja/media.

Posteriormente podrá empaquetarse como:

## TWA para Google Play

Pero NO construir una segunda aplicación independiente.

---

# 6. DASHBOARD

El dashboard para profesionales debe ser una aplicación web independiente en términos de interfaz, pero utilizando el mismo backend/API.

Debe mostrar como mínimo:

### Vista general

* Total de niños.
* Niños con seguimiento normal.
* Niños que requieren seguimiento.
* Alertas prioritarias.
* Mediciones pendientes.
* Visitas pendientes.
* Últimas mediciones.

### Lista priorizada

Tabla/listado con:

* niño;
* edad;
* última medición;
* estado;
* nivel de alerta;
* última visita;
* próxima acción.

### Ficha individual

Mostrar:

* información básica;
* historial;
* gráficos de evolución;
* mediciones;
* alertas;
* observaciones;
* visitas;
* recomendaciones/orientaciones;
* fuentes;
* auditoría.

---

# 7. SISTEMA DE ALERTAS

Implementar inicialmente un sistema basado en reglas configurables.

NO utilizar IA generativa para tomar decisiones clínicas.

Estados visuales:

### 🟢 NORMAL

No existe una señal que requiera seguimiento adicional según las reglas configuradas.

### 🟡 SEGUIMIENTO

Existe una condición que requiere seguimiento/visita/consejería según el protocolo configurado.

### 🔴 EVALUACIÓN PROFESIONAL

Existe una señal que requiere evaluación prioritaria por personal de salud.

IMPORTANTE:

El sistema NO debe decir:

> "El niño tiene anemia."

Debe decir algo conceptualmente similar a:

> "Se identificó una señal que requiere evaluación por un profesional de salud."

Nunca convertir una alerta en diagnóstico.

---

# 8. MOTOR DE REGLAS

Crear un módulo independiente:

`Rules Engine`

Debe permitir:

* definir reglas;
* versionarlas;
* activarlas/desactivarlas;
* registrar qué versión produjo una alerta;
* guardar fecha/hora;
* guardar fuente;
* guardar explicación;
* permitir revisión posterior.

No hardcodear toda la lógica directamente en los componentes de frontend.

Ejemplo conceptual:

```text
Measurement
     ↓
Validation
     ↓
Reference/Rule Engine
     ↓
Risk signal
     ↓
Alert
     ↓
Professional review
```

---

# 9. MEDICIONES DOMICILIARIAS

El MVP debe contemplar:

* peso;
* talla/longitud;
* MUAC/perímetro braquial cuando corresponda;
* otras mediciones solamente si están justificadas y documentadas.

Cada medición debe almacenar:

* valor;
* unidad;
* fecha;
* hora;
* usuario que la registró;
* método;
* dispositivo si corresponde;
* estado de validación;
* fuente/protocolo;
* observaciones.

---

# 10. GUÍAS DE MEDICIÓN

Crear una experiencia paso a paso.

Ejemplo:

### Peso

1. Preparar la balanza.
2. Colocar correctamente al niño.
3. Verificar condiciones.
4. Registrar valor.
5. Confirmar.
6. Mostrar advertencia si el valor es inconsistente.

### Talla/longitud

Mostrar instrucciones visuales y lenguaje sencillo.

### MUAC

Incluir instrucciones específicas según el protocolo validado que se adopte.

NO inventar protocolos.

Las instrucciones clínicas deben ser configurables y vinculadas a una fuente oficial.

---

# 11. VALIDACIÓN DE DATOS

Antes de guardar una medición:

* validar tipo;
* validar unidad;
* validar rango razonable;
* detectar valores imposibles;
* detectar cambios extremadamente bruscos;
* solicitar confirmación cuando corresponda.

Ejemplo:

> "Este valor parece diferente a las mediciones anteriores. ¿Quieres revisar la medición?"

No rechazar automáticamente datos clínicos únicamente por parecer inusuales.

Los datos atípicos deben poder ser revisados por el profesional.

---

# 12. OFFLINE-FIRST

La PWA debe funcionar correctamente con conectividad limitada.

Implementar:

* Service Worker;
* cache de recursos;
* almacenamiento local seguro;
* cola de sincronización;
* indicador de estado de conexión;
* sincronización cuando vuelve internet;
* prevención de duplicados;
* manejo de conflictos.

Ejemplo:

```text
Usuario registra medición
        ↓
Sin internet
        ↓
Guardar localmente
        ↓
Estado: "Pendiente de sincronización"
        ↓
Regresa internet
        ↓
Enviar al backend
        ↓
Confirmar
        ↓
Marcar como sincronizado
```

Nunca perder silenciosamente una medición.

---

# 13. WHATSAPP

El producto debe contemplar WhatsApp como canal de acceso/comunicación.

Casos de uso:

* recordatorios;
* enlace a PWA;
* aviso de medición pendiente;
* notificación de seguimiento;
* comunicación contextual.

NO enviar información clínica sensible innecesaria en mensajes.

Ejemplo:

En lugar de:

> "Su hijo tiene riesgo de anemia."

Utilizar:

> "Hay una actualización importante sobre el seguimiento de su hijo. Ingrese a Yanapiri Wawa para revisarla."

La integración real con WhatsApp Business API debe estar desacoplada mediante un servicio.

Si durante el MVP no existe credencial/API real:

* crear mock;
* crear interfaz;
* crear adapter;
* documentar cómo conectar posteriormente la API real.

NO simular una integración real como si estuviera funcionando.

---

# 14. ORIENTACIÓN NUTRICIONAL

Crear un módulo:

`Yanapiri Mikhuy`

Las recomendaciones deben basarse en:

* información nutricional validada;
* disponibilidad alimentaria;
* ubicación/contexto;
* presupuesto declarado;
* edad del niño;
* restricciones registradas.

No utilizar IA generativa libre para generar recomendaciones clínicas.

Preferir:

```text
Datos estructurados
+
Reglas
+
Contenido validado
=
Orientación
```

Toda orientación debe incluir una indicación clara de que no sustituye la evaluación profesional cuando corresponda.

---

# 15. CHATBOT

El chatbot NO debe ser el centro del producto.

Debe funcionar como una interfaz de orientación.

Puede ayudar a:

* navegar;
* explicar conceptos;
* recordar pasos;
* explicar cómo realizar una medición;
* responder preguntas frecuentes utilizando contenido aprobado;
* orientar al usuario hacia el profesional.

No debe:

* diagnosticar;
* prescribir;
* improvisar recomendaciones;
* inventar referencias;
* responder preguntas médicas fuera del alcance definido.

Implementar inicialmente con respuestas controladas/RAG o contenido estructurado.

Si se utiliza LLM:

* establecer system prompt restrictivo;
* limitar fuentes;
* registrar respuestas;
* implementar fallback;
* detectar preguntas fuera de alcance;
* derivar a profesional.

---

# 16. SEGURIDAD Y PRIVACIDAD

Los datos pertenecen a un contexto de salud infantil.

Diseñar con privacidad y seguridad desde el inicio.

Implementar:

### Autenticación

* login seguro;
* recuperación de acceso;
* sesiones;
* expiración;
* protección contra ataques comunes.

### Autorización

RBAC:

```text
ADMIN
PROFESSIONAL
COMMUNITY_AGENT
CAREGIVER
```

El cuidador solamente puede acceder a los niños que tiene autorizados.

El profesional solamente puede acceder a pacientes autorizados.

El actor social solamente puede acceder a familias asignadas.

---

# 17. PROTECCIÓN DE DATOS

Contemplar como referencia:

**Ley N.º 29733 — Ley de Protección de Datos Personales del Perú.**

Implementar conceptualmente:

* consentimiento;
* minimización de datos;
* privacidad por defecto;
* control de acceso;
* auditoría;
* anonimización para datos agregados;
* cifrado en tránsito;
* cifrado en reposo cuando corresponda;
* eliminación/control del ciclo de vida de datos.

No afirmar cumplimiento legal definitivo sin revisión jurídica.

---

# 18. FOTOGRAFÍAS

El sistema NO debe utilizar fotografías de menores para diagnóstico.

Por defecto:

**NO almacenar fotografías.**

Si posteriormente se permite enviar una fotografía al profesional:

* consentimiento explícito;
* propósito específico;
* acceso restringido;
* almacenamiento seguro;
* auditoría;
* política de retención.

---

# 19. AUDITORÍA

Registrar eventos críticos:

* login;
* logout;
* creación de usuario;
* creación de niño;
* modificación de datos;
* creación de medición;
* modificación de medición;
* generación de alerta;
* modificación de alerta;
* acceso a información clínica;
* cambio de permisos;
* acciones del profesional.

La auditoría debe permitir saber:

> quién hizo qué, cuándo y sobre qué registro.

---

# 20. ARQUITECTURA

Para el MVP utilizar una arquitectura simple pero preparada para crecer.

Propuesta:

```text
                    ┌──────────────────┐
                    │      PWA         │
                    │ Padre/Cuidador   │
                    └────────┬─────────┘
                             │
                    HTTPS / REST API
                             │
                    ┌────────▼─────────┐
                    │     Backend      │
                    │     FastAPI      │
                    └────────┬─────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
    PostgreSQL          Rules Engine       Notification
                                             Service
          │                  │                  │
          │                  │             WhatsApp
          │                  │
          └──────────────┬───┘
                         │
                  ┌──────▼──────┐
                  │  Dashboard  │
                  │ Profesional │
                  └─────────────┘
```

---

# 21. STACK TECNOLÓGICO

Utiliza una arquitectura moderna y simple.

Preferencia inicial:

### Frontend PWA

* React
* TypeScript
* Vite
* Tailwind CSS
* PWA plugin
* IndexedDB para datos offline cuando corresponda.

### Dashboard

* React
* TypeScript
* Tailwind CSS
* componentes reutilizables.

### Backend

Preferentemente:

* Python
* FastAPI
* Pydantic
* SQLAlchemy.

### Base de datos

* PostgreSQL.

### Autenticación

Implementar JWT o mecanismo equivalente seguro.

### Testing

* Pytest para backend.
* Vitest/Testing Library para frontend.
* Playwright para pruebas E2E.

Si existe una razón técnica fuerte para cambiar una tecnología, documentarla antes de hacerlo.

---

# 22. MODELO DE DATOS

Diseñar como mínimo:

```text
users
caregivers
children
health_professionals
community_agents
caregiver_child
professional_child
agent_child
measurements
measurement_types
measurement_validation
alerts
alert_rules
rule_versions
visits
observations
nutrition_guidance
guidance_sources
notifications
consents
audit_logs
sync_queue
```

La relación debe permitir que:

* un cuidador tenga uno o más niños;
* un niño tenga historial;
* un niño pueda estar asociado a un profesional;
* un actor social pueda atender múltiples niños;
* cada medición tenga trazabilidad;
* cada alerta sepa qué regla la generó.

---

# 23. DISEÑO UX/UI

La prioridad es:

## "Una persona con poca experiencia tecnológica debe poder utilizarlo sin capacitación extensa."

Principios:

* lenguaje simple;
* botones grandes;
* pocas opciones por pantalla;
* iconos acompañados de texto;
* contraste adecuado;
* tipografía legible;
* formularios cortos;
* feedback inmediato;
* navegación consistente;
* mensajes claros;
* evitar lenguaje técnico.

No diseñar una interfaz "bonita" sacrificando usabilidad.

---

# 24. DISEÑO ADAPTATIVO

No mostrar exactamente la misma experiencia para todos.

La interfaz y contenido pueden adaptarse según:

* edad del niño;
* mediciones pendientes;
* historial;
* nivel de interacción;
* necesidades detectadas;
* rol del usuario.

Ejemplo:

```text
Niño nuevo
→ onboarding

Niño con seguimiento normal
→ próxima medición

Medición pendiente
→ recordatorio prioritario

Señal de seguimiento
→ orientación + acción recomendada

Alerta profesional
→ derivación/revisión
```

---

# 25. HOME DEL PADRE

La pantalla principal debería responder inmediatamente:

### ¿Qué tengo que hacer hoy?

Ejemplo:

```text
Hola, María 👋

Juan
Edad: 2 años

🟢 Seguimiento actual

Hoy
✓ No tienes mediciones pendientes

Próximo paso
📏 Registrar talla
```

No llenar la pantalla de estadísticas.

---

# 26. DASHBOARD DEL PROFESIONAL

La pantalla principal debe responder:

### "¿A quién debo atender primero?"

Mostrar:

```text
RESUMEN

128 niños
94 normales
23 requieren seguimiento
11 requieren evaluación profesional
```

Después:

### PRIORIDAD DE HOY

1. Niño A — 🔴
2. Niño B — 🔴
3. Niño C — 🟡
4. Niño D — 🟡

El dashboard debe priorizar acciones, no solamente mostrar datos.

---

# 27. GRÁFICOS

Para cada niño:

* evolución del peso;
* evolución de talla;
* evolución de MUAC cuando corresponda;
* tendencia;
* eventos/visitas;
* alertas.

Los gráficos deben ser comprensibles.

No mostrar visualizaciones complejas al cuidador.

---

# 28. MODELO DE NEGOCIO

El concepto planteado actualmente contempla:

* familia: gratuito;
* cliente institucional: Gobierno Regional / DIRESA / entidad pública;
* posible modelo SaaS/licenciamiento institucional.

Sin embargo:

**NO fijes como definitivo el precio de USD 3 por niño hasta validar el supuesto.**

Implementa el producto de manera que el modelo comercial pueda cambiar sin modificar la arquitectura.

---

# 29. ESCALABILIDAD

El MVP NO necesita comenzar con:

* Kubernetes;
* microservicios;
* sharding;
* múltiples bases de datos;
* arquitectura extremadamente compleja.

Primero construir un **monolito modular bien estructurado**.

Debe quedar preparado para evolucionar.

Prioridad:

```text
MVP
↓
monolito modular
↓
optimización
↓
caching
↓
colas
↓
réplicas
↓
separación de servicios cuando realmente sea necesario
```

No sobreingenierizar.

---

# 30. OBSERVABILIDAD

Implementar:

* logs estructurados;
* manejo de errores;
* health check;
* métricas básicas;
* trazabilidad de requests;
* monitoreo de errores;
* auditoría de acciones críticas.

---

# 31. API

Diseñar API REST documentada.

Ejemplos:

```text
POST /auth/login

GET /children

POST /children

GET /children/{id}

GET /children/{id}/measurements

POST /children/{id}/measurements

GET /children/{id}/alerts

GET /dashboard/summary

GET /dashboard/prioritized

POST /visits

POST /observations

GET /rules

GET /sources
```

Utilizar OpenAPI.

Validar inputs.

No exponer información de usuarios no autorizados.

---

# 32. MANEJO DE ERRORES

Todos los errores deben tener mensajes comprensibles.

Nunca mostrar:

```text
500 Internal Server Error
```

al usuario final sin contexto.

Mostrar:

> "No pudimos guardar la medición. La hemos guardado temporalmente y la sincronizaremos cuando vuelva la conexión."

cuando corresponda.

---

# 33. DEMO PARA HACKATHON

El sistema debe incluir datos DEMO claramente identificados.

Crear un escenario demostrable:

### Familia

María

### Niño

Juan

### Flujo

1. María entra a Yanapiri Wawa.
2. Ve que debe registrar una medición.
3. Sigue el tutorial.
4. Registra peso/talla/MUAC.
5. El sistema valida.
6. El motor de reglas analiza.
7. Se genera un estado.
8. El profesional ve el caso en dashboard.
9. El profesional revisa historial.
10. El actor social registra una visita.
11. La familia recibe seguimiento.

Este flujo debe poder ejecutarse de principio a fin.

---

# 34. DATOS DEMO

Los datos ficticios deben estar claramente identificados.

Nunca utilizar datos reales de menores en el repositorio.

Crear seed:

```text
demo caregiver
demo children
demo professional
demo community agent
demo measurements
demo alerts
demo visits
```

---

# 35. NO HACER

NO:

* inventar resultados clínicos;
* inventar estudios;
* inventar validaciones;
* presentar un prototipo como producto clínicamente validado;
* diagnosticar;
* prescribir;
* generar dosis;
* almacenar fotos innecesariamente;
* exponer datos de menores;
* usar IA generativa para tomar decisiones clínicas;
* introducir complejidad técnica innecesaria;
* crear una APK independiente para el MVP;
* afirmar que WhatsApp está integrado si solamente existe un mock;
* afirmar que existe interoperabilidad real con MINSA si no se ha implementado;
* afirmar cumplimiento legal definitivo sin validación especializada.

---

# 36. DOCUMENTACIÓN OBLIGATORIA

Crear:

```text
README.md
ARCHITECTURE.md
SECURITY.md
PRIVACY.md
CLINICAL_SAFETY.md
API.md
DATABASE.md
OFFLINE.md
DEPLOYMENT.md
TESTING.md
DECISIONS.md
```

El README debe explicar:

* problema;
* solución;
* usuarios;
* arquitectura;
* stack;
* instalación;
* ejecución;
* variables de entorno;
* datos demo;
* pruebas;
* limitaciones;
* roadmap.

---

# 37. ADR — DECISIONES TÉCNICAS

Documentar decisiones importantes:

### ADR-001

¿Por qué PWA?

### ADR-002

¿Por qué FastAPI?

### ADR-003

¿Por qué PostgreSQL?

### ADR-004

¿Por qué reglas en lugar de IA generativa para decisiones clínicas?

### ADR-005

¿Por qué arquitectura modular?

### ADR-006

¿Por qué offline-first?

---

# 38. TESTING

Crear pruebas para:

### Backend

* autenticación;
* autorización;
* creación de niños;
* mediciones;
* validación;
* reglas;
* alertas;
* auditoría.

### Frontend

* login;
* onboarding;
* registro de medición;
* offline;
* sincronización;
* dashboard.

### E2E

Probar el flujo:

```text
Login
→ seleccionar niño
→ registrar medición
→ validar
→ generar alerta
→ profesional revisa
→ registrar visita
```

---

# 39. CRITERIOS DE ACEPTACIÓN DEL MVP

El MVP será considerado funcional solamente si:

### Padre

* puede ingresar;
* puede registrar un niño;
* puede realizar una medición;
* puede seguir instrucciones;
* puede utilizar funciones básicas sin internet;
* puede sincronizar posteriormente;
* puede consultar historial;
* puede recibir mensajes claros.

### Actor social

* puede consultar familias asignadas;
* puede visualizar alertas;
* puede registrar visitas;
* puede añadir observaciones.

### Profesional

* puede visualizar pacientes;
* puede consultar historial;
* puede revisar alertas;
* puede priorizar casos;
* puede revisar reglas/fuentes;
* puede registrar acciones.

### Seguridad

* RBAC funcional;
* acceso restringido;
* auditoría;
* datos protegidos;
* no exposición cruzada entre familias.

---

# 40. PRIORIDAD DEL DESARROLLO

No intentes construir todo simultáneamente.

Trabaja en este orden:

## FASE 1 — Fundación

* repositorio;
* arquitectura;
* backend;
* PostgreSQL;
* autenticación;
* roles.

## FASE 2 — Padre

* PWA;
* onboarding;
* niños;
* mediciones;
* tutoriales;
* historial.

## FASE 3 — Rules Engine

* validación;
* reglas;
* alertas;
* trazabilidad.

## FASE 4 — Dashboard

* profesionales;
* actores sociales;
* priorización;
* historial.

## FASE 5 — Offline

* service worker;
* IndexedDB;
* sync queue.

## FASE 6 — Notificaciones

* sistema de notificaciones;
* adapter WhatsApp;
* mocks.

## FASE 7 — Seguridad

* auditoría;
* permisos;
* protección de datos;
* hardening.

## FASE 8 — QA

* tests;
* E2E;
* accesibilidad;
* pruebas en móvil.

## FASE 9 — Demo

* datos demo;
* flujo completo;
* seed;
* presentación.

---

# 41. REGLA FUNDAMENTAL DE PRODUCTO

No construir funcionalidades simplemente porque "serían interesantes".

Cada funcionalidad debe responder:

> **¿Qué problema concreto del usuario resuelve?**

Y después:

> **¿Es necesaria para el MVP?**

Si la respuesta es no, dejarla para roadmap.

---

# 42. PRINCIPIO DE DISEÑO DEL PRODUCTO

La propuesta de valor no es:

> "Tenemos una PWA, un chatbot y un dashboard."

La propuesta debe entenderse como:

> **Yanapiri Wawa conecta el seguimiento domiciliario del niño con el trabajo del personal de salud, convirtiendo mediciones y observaciones realizadas en casa en información estructurada para facilitar el seguimiento y la priorización.**

La tecnología es el medio.

El valor está en cerrar la brecha entre:

**familia → seguimiento domiciliario → actor social → profesional de salud.**

---

# 43. DIFERENCIACIÓN FRENTE A CHATGPT

El producto debe poder responder técnicamente:

> "¿Por qué no usar simplemente ChatGPT?"

Respuesta conceptual:

Yanapiri Wawa no pretende competir con ChatGPT como asistente general.

Su valor está en:

* contexto estructurado del niño;
* historial longitudinal;
* mediciones;
* reglas configuradas;
* alertas;
* priorización;
* roles;
* trazabilidad;
* flujo familia–actor social–profesional;
* funcionamiento offline;
* integración con procesos específicos;
* seguridad de datos;
* orientación basada en contenido aprobado.

No utilizar la frase "ChatGPT no puede hacer X" si técnicamente pudiera hacerse mediante una integración. Explicar la diferencia como **producto, contexto, integración, gobernanza y flujo de trabajo**.

---

# 44. INNOVACIÓN

La innovación no debe venderse como:

> "Utilizamos IA."

La innovación debe presentarse como la integración de:

```text
Medición domiciliaria
        +
Seguimiento longitudinal
        +
Motor de reglas
        +
Alertas
        +
Priorización profesional
        +
Comunicación con familia
        +
Accesibilidad
        +
Contexto nutricional
```

La IA, si se utiliza, debe ser un componente secundario y controlado.

---

# 45. RIESGOS QUE DEBES CONSIDERAR

Analiza y documenta:

1. Error de medición.
2. Falta de conectividad.
3. Baja alfabetización digital.
4. Teléfonos de gama baja.
5. Falta de adherencia.
6. Alertas falsas.
7. Alertas no detectadas.
8. Privacidad.
9. Seguridad.
10. Mal uso del sistema.
11. Dependencia excesiva de tecnología.
12. Rechazo por parte de profesionales.
13. Sobrecarga de trabajo.
14. Falta de validación clínica.
15. Uso fuera del alcance.
16. Desigualdad digital.

Para cada riesgo:

```text
Riesgo
Probabilidad
Impacto
Mitigación
Responsable
Estado
```

---

# 46. CO-DISEÑO

No asumir que el equipo sabe qué necesitan las familias.

Preparar el sistema para incorporar feedback de:

* padres;
* cuidadores;
* actores sociales;
* profesionales.

El producto debe poder evolucionar después de pruebas reales.

---

# 47. MÉTRICAS

Separar:

## Métricas de producto

* usuarios activos;
* frecuencia de mediciones;
* adherencia;
* tiempo de registro;
* tasa de sincronización;
* errores.

## Métricas clínicas/operativas

* precisión de alertas;
* alertas confirmadas;
* seguimiento oportuno;
* tiempo entre alerta y revisión.

## Impacto de largo plazo

* indicadores nutricionales;
* continuidad de seguimiento;
* resultados de salud.

No afirmar impacto clínico durante el MVP si no existe evidencia suficiente.

---

# 48. REGLA PARA EL AGENTE

Antes de implementar cualquier funcionalidad relacionada con salud:

1. Pregúntate si puede producir una decisión clínica.
2. Si sí, NO implementarla como decisión automática.
3. Convertirla en señal/alerta para revisión profesional.
4. Registrar la fuente.
5. Registrar la versión de la regla.
6. Mostrar claramente los límites.

---

# 49. ENTREGA FINAL

No quiero únicamente explicaciones.

Quiero que desarrolles progresivamente un proyecto funcional.

Al terminar cada fase:

1. Resume qué construiste.
2. Muestra estructura de archivos.
3. Explica decisiones técnicas.
4. Indica qué pruebas ejecutaste.
5. Indica qué falta.
6. Indica riesgos encontrados.
7. No ocultes errores.

Si puedes ejecutar comandos/tests, ejecútalos.

Si encuentras un error, corrígelo antes de continuar.

No declares una funcionalidad como terminada si no puede ejecutarse.

---

# 50. PRIMERA TAREA

Antes de comenzar a programar:

### Paso 1

Analiza el proyecto y genera:

```text
1. Product Requirements Document
2. Arquitectura propuesta
3. Modelo de datos
4. Mapa de pantallas
5. Flujos de usuario
6. API inicial
7. Matriz de roles/permisos
8. Threat Model básico
9. Riesgos clínicos
10. Roadmap MVP
```

### Paso 2

Identifica explícitamente:

* información que está respaldada;
* información que es un supuesto;
* información que debe verificarse;
* funcionalidades que pueden implementarse;
* funcionalidades que requieren validación profesional/legal.

### Paso 3

Después de ese análisis, comienza directamente con la implementación del MVP.

No construyas funcionalidades innecesarias.

Prioriza:

> **seguridad + simplicidad + funcionamiento real + demostrabilidad + escalabilidad razonable.**

El objetivo final es que Yanapiri Wawa pueda ser utilizado por un cuidador desde su teléfono mediante una **PWA**, mientras el personal de salud utiliza un **dashboard web**, con un backend común, datos protegidos, seguimiento longitudinal, motor de reglas y alertas, sin convertir el sistema en una herramienta de diagnóstico médico.
