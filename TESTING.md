# Guía de Pruebas (TESTING.md) - Yanapiri Wawa

Este documento detalla la estrategia de aseguramiento de calidad (QA) y cómo ejecutar las pruebas unitarias y de integración de la plataforma **Yanapiri Wawa**.

---

## 1. Pruebas Unitarias del Backend (Python + Pytest)

El backend de Yanapiri Wawa cuenta con un conjunto de pruebas automatizadas que validan de manera aislada la lógica matemática del cálculo de percentiles y la seguridad de las rutas.

### 1.1 Herramientas Utilizadas
- **Pytest:** Ejecutor principal de pruebas.
- **FastAPI TestClient:** Cliente HTTP mock para invocar los endpoints de la API sin levantar el servidor de red.
- **SQLAlchemy In-Memory / Test Database:** Base de datos SQLite temporal (`test_yanapiri.db`) que se crea y destruye automáticamente antes y después de cada corrida para evitar polución de la base de datos real.

### 1.2 Ejecutar las Pruebas
1. Activa tu entorno virtual de Python en la carpeta `backend/`.
2. Ejecuta la suite de pruebas mediante el intérprete:
   ```bash
   python -m pytest app/tests/
   ```

---

## 2. Cobertura de Pruebas (Test Cases)

Las pruebas creadas en `backend/app/tests/test_backend.py` cubren los siguientes aspectos críticos:

1. **Cálculo de Percentiles Z-score (`test_z_score_calculation`):**
   - Valida que un varón de 18 meses con el peso promedio de la OMS (10.9 kg) obtenga un Z-score exacto de `0.0`.
   - Valida que un varón de 24 meses con bajo peso (9.0 kg) obtenga una desviación crítica de `Z < -2.0`.
2. **Evaluación de Cinta MUAC (`test_muac_rules`):**
   - Comprueba que un perímetro braquial menor a 11.5 cm dispare correctamente el nivel de alerta `urgent` (rojo).
   - Comprueba que un valor de 12.0 cm dispare el nivel `follow-up` (amarillo).
3. **Flujo Completo de Autenticación (`test_auth_flow`):**
   - Registro de un usuario cuidador.
   - Login del cuidador y decodificación correcta del JWT retornado.
   - Verificación de que no se dupliquen usuarios con el mismo nombre.
4. **Registro de Niños y Mediciones Clínicas (`test_child_and_measurement`):**
   - Creación de un menor en la base de datos por parte de un profesional.
   - Ingreso de una medición de peso anómala.
   - Verificación en la base de datos de que se registre automáticamente la Alerta en estado `pending` asociada a la regla OMS y su respectiva explicación clínica.
