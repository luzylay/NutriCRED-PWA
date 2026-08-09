# Manual de Seguridad Clínica (CLINICAL_SAFETY.md) - Yanapiri Wawa

Este documento detalla las directrices clínicas, los límites funcionales y el origen de las reglas aplicadas en **Yanapiri Wawa** para garantizar la seguridad clínica del paciente y evitar el intrusismo o la automatización de diagnósticos médicos.

---

## 1. El Principio Fundamental: NO Diagnosticar

Es un requisito mandatorio e inalterable en todo el diseño de software de la plataforma:
**Yanapiri Wawa es una herramienta de seguimiento y priorización, no de diagnóstico.**

| Funcionalidad | SÍ Puede Hacer | NO Puede Hacer |
| :--- | :--- | :--- |
| **Monitorear Peso** | Registrar el peso domiciliario del menor y contrastarlo con tablas OMS. | Decir si el niño tiene desnutrición crónica o aguda. |
| **Monitorear MUAC** | Indicar si el perímetro braquial está en la zona roja (<11.5 cm) de desnutrición aguda severa. | Confirmar de forma autónoma una desnutrición clínica sin evaluación presencial. |
| **Prevención Anemia** | Recomendar el consumo diario de vísceras ricas en hierro según el MINSA. | Diagnosticar anemia por software o predecir hemoglobina por fotos. |
| **Medicamentos** | Recordar la fecha de la próxima cita de control CRED. | Prescribir suplemento de hierro, jarabes, vacunas o indicar dosis. |

---

## 2. Textos y Banners de Advertencia (Disclaimer)

Cada vez que el motor de reglas detecta una medición fuera de rango (urgente o seguimiento):
1. **En el panel de Familia:** Se renderiza de manera prominente una nota aclaratoria:
   > 🔴 *Se identificó una señal que requiere evaluación clínica presencial para analizar su peso. Esta alerta es una señal de seguimiento y no constituye un diagnóstico médico. Acuda al establecimiento de salud de su comunidad.*
2. **En el panel Profesional:** Se muestran los datos crudos y calculados (Z-score) junto con su respectiva fuente oficial, permitiendo al profesional contrastar la medición antes de emitir un juicio clínico.

---

## 3. Gobernanza del Motor de Reglas (Rules Engine)

- **Cálculos Matemáticos:** Toda la lógica de riesgo se basa en reglas y umbrales codificados de forma explícita en `backend/app/rules.py` utilizando percentiles fijos de la OMS. No se utilizan algoritmos estocásticos (IA, Machine Learning o LLMs) para definir niveles de urgencia clínica.
- **Trazabilidad:** Cada alerta de riesgo almacena la versión exacta de la regla que la gatilló (`rule_version_id`) y su fuente documental.
- **Fuentes Oficiales Seledadas:**
  - **OMS:** *WHO Child Growth Standards (Weight-for-Age / Height-for-Age).*
  - **UNICEF:** *Family-MUAC protocol for screening acute malnutrition.*
  - **MINSA Perú:** *Norma Técnica de Salud para el Control del Crecimiento y Desarrollo del Niño y la Niña Menor de Cinco Años (NTS N.º 137-MINSA/2017/DGIESP).*

---

## 4. Orientación Nutricional Controlada (Yanapiri Mikhuy)

El módulo de consejería alimentaria complementaria se implementa mediante respuestas estructuradas en base a la edad del menor.
- **No se utiliza IA libre:** El chatbot de orientación nutricional responde exclusivamente utilizando un conjunto de respuestas pre-aprobadas y curadas basadas en las directrices del Ministerio de Salud del Perú.
- **Filtro de seguridad:** Si el cuidador ingresa consultas fuera del alcance (ej. *"¿Qué dosis de antibiótico le doy por fiebre?"*), el chatbot aplica un fallback de seguridad: *"Recuerda que no brindo diagnósticos ni tratamientos médicos. Para orientaciones específicas, acude al Centro de Salud de tu comunidad."*
