# Manual de Seguridad Clínica (CLINICAL_SAFETY.md) - NutriCRED - Crecer mejor

Este documento detalla las directrices clínicas, los límites funcionales, el resguardo legal y el origen normativo de las reglas aplicadas en **NutriCRED - Crecer mejor** para garantizar la seguridad clínica del paciente menor de 5 años y evitar el intrusismo o la automatización de diagnósticos médicos.

---

## 1. El Principio Fundamental: NO Diagnosticar sin Aprobación Médica

Es un requisito mandatorio e inalterable en todo el diseño de software de la plataforma:
**NutriCRED es un Sistema de Soporte a la Decisión Clínica (CDS) y seguimiento nutricional, NO de diagnóstico autónomo.**

| Funcionalidad | SÍ Puede Hacer | NO Puede Hacer |
| :--- | :--- | :--- |
| **Monitorear Peso / Talla** | Registrar medidas antropométricas y contrastarlas con las tablas estándar de la OMS (Puntaje Z). | Emitir diagnósticos médicos definitivos de forma autónoma sin evaluación presencial del profesional. |
| **Monitorear MUAC** | Indicar si el perímetro braquial está en zona de alerta de desnutrición aguda (< 11.5 cm). | Reemplazar el examen físico realizado por el médico o enfermera CRED. |
| **Recomendador Nutricional** | Sugerir recetas con hierro hemínico (sangrecita, bazo, hígado) del INS/CENAN con precios MIDAGRI. | Prescribir fármacos, dosis de suplementos de hierro o indicar tratamientos médicos invasivos. |
| **Seguimiento CRED** | Calcular la fecha esperada del próximo control según la NTS N° 137-MINSA e informar por WhatsApp. | Sustituir la cita presencial médica en el centro de salud o en el INSN San Borja. |

---

## 2. Textos y Banners de Advertencia Médica (Disclaimer MINSA / INSN-SB)

Cada vez que el sistema presenta un resultado o ticket nutricional:
1. **En la Interfaz del Apoderado (Familia):** Se renderiza un banner prominente de advertencia médica:
   > ⚠️ **ADVERTENCIA MÉDICA LEGAL OBLIGATORIA (MINSA / INSN-SB):**  
   > *No tome decisiones nutricionales, cambios de dieta o suplementación de hierro sin antes contar con la evaluación presencial y aprobación explícita de su Médico Especialista o Profesional CRED. Todas las recomendaciones están dictaminadas bajo las Guías del Ministerio de Salud (MINSA), el Instituto Nacional de Salud (INS) y los protocolos del Instituto Nacional de Salud del Niño San Borja (INSN-SB).*

2. **En las Exportaciones a WhatsApp:** Se adjunta el texto de reserva médica al pie del ticket de compra semanal.

3. **En la Interfaz del Profesional de Salud:** Se muestran los datos crudos, cálculos Z-Score OMS y el botón de rectificación con firma cryptográfica **SHA-256** bajo la **Ley N° 29733**, requiriendo justificación obligatoria (> 5 caracteres).

---

## 3. Gobernanza del Motor de Reglas (`credRules.ts`)

- **Cálculos Determínicos:** Toda la lógica de riesgo se basa en reglas y umbrales codificados de forma explícita en `src/app/lib/credRules.ts` utilizando percentiles fijos de la OMS y calendarios del MINSA. No se utilizan algoritmos estocásticos (IA libre) para definir niveles de urgencia clínica.
- **Trazabilidad Inmutable:** Cada corrección o cambio en un dato de salud registra una firma cryptográfica de 64 caracteres en `auditLogs`.
- **Fuentes Oficiales Validadas:**
  - **MINSA Perú:** Norma Técnica de Salud NTS N.° 137-MINSA/2017/DGIESP (Control CRED).
  - **OMS:** Patrones de crecimiento infantil de la OMS (2006) para Peso/Edad, Talla/Edad y Peso/Talla.
  - **INSN San Borja:** Criterios de evaluación pediátrica del Instituto Nacional de Salud del Niño San Borja.
  - **INS/CENAN + MIDAGRI:** Tabla Peruana de Composición de Alimentos y precios referenciales de mercados mayoristas.

---

## 4. Orientación Nutricional Controlada (Prompt Sandboxing)

El módulo de consejería alimentaria complementaria aplica guardrails estrictos:
- **Respuesta Estructurada con Contexto Cerrado:** El asistente no genera respuestas clínicas arbitrarias. Solo ofrece opciones pre-aprobadas basadas en la edad del menor (0 a 5 años) y las guías oficiales.
- **Filtro de Emergencias:** Si en el triaje se registra un signo de alarma grave (ej. Edema bilateral presente, Z-Weight < -3 SD o Hemoglobina < 7.0 g/dL), el sistema desvía inmediatamente a una pantalla de **ALERTA MÉDICA URGENTE** con botón de llamada rápida al 106 (SAMU) o al establecimiento de salud más cercano.
