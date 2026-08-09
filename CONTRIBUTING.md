# Guía de Contribución (Contributing Guidelines)

¡Gracias por tu interés en contribuir a **Yanapiri Wawa**! Como proyecto enfocado en la salud pública y tecnología cívica, damos la bienvenida a desarrolladores, diseñadores, médicos y especialistas en nutrición que deseen sumar esfuerzos para combatir la desnutrición infantil.

## 🚀 ¿Cómo empezar?

1. **Haz un Fork** del repositorio a tu cuenta personal.
2. **Clona** el proyecto en tu máquina local.
3. Crea una **nueva rama (branch)** para tu funcionalidad o corrección de error:
   `git checkout -b feature/nombre-de-tu-mejora` o `git checkout -b fix/nombre-del-error`

## 💻 Convenciones de Código (Clean Code)
Para mantener un estándar de clase mundial, exigimos las siguientes prácticas:

- **Frontend (React/Vite):** 
  - Usa TypeScript estricto. No uses `any`.
  - Componentes funcionales y Hooks. Nada de clases.
  - Asegúrate de que tu UI sea responsiva usando Tailwind CSS.
  - Si añades una nueva página, por favor documenta cómo interactúa con el `Offline-First` Cache (`api.ts`).

- **Backend (FastAPI):**
  - Mantén el estándar `PEP 8`.
  - Documenta todas tus rutas REST en los decoradores de FastAPI para el autogenerado de Swagger.
  - Añade Pruebas Unitarias (`pytest`) para cualquier regla clínica nueva (ej. nuevas tablas OMS).

## 💬 Convención de Commits (Conventional Commits)
Sigue el estándar [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(modulo): añade nueva funcionalidad`
- `fix(modulo): corrige un error`
- `docs(readme): actualiza documentación`
- `refactor(ui): mejora estructura del código sin añadir funcionalidades`

## 📦 Pull Requests (PRs)
1. Antes de enviar un PR, asegúrate de correr el linter y compilador: `npm run build`.
2. Ejecuta las pruebas del backend: `pytest`.
3. Explica claramente en el PR **qué** cambiaste y **por qué** (si es un cambio clínico, cita la fuente oficial, ej. MINSA/OMS).

¡Tu código puede salvar vidas! Gracias por ayudar.
