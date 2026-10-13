# 🔄 MANUAL DE ITERACIONES Y DIRECTRICES DE PROCESO
> **Proyecto:** Calculat-Boss-Clan (SPA)  
> **Propósito:** Definición del ciclo de vida de desarrollo, gobernanza por sprints, directrices de calidad y desglose operativo de las fases de construcción.  
> **Supervisor:** Jorge  
> **Líder Técnico:** Senior Full Stack React Developer  

---

## 1. Filosofía de Trabajo por Iteraciones

El desarrollo de la SPA no se realiza de forma monolítica ni improvisada. Cada incremento de valor se rige bajo el principio de **Iteraciones Cortas y Deterministas**:
1. **Predecibilidad:** Cada iteración tiene un alcance cerrado y validado previamente con el supervisor.
2. **Entregables Funcionales:** Al término de cada iteración, el software debe compilar, pasar todos los linters y pruebas, y ser 100% interactuable en el navegador.
3. **Calidad no Negociable:** No se avanza a la siguiente iteración sin el cumplimiento estricto del *Definition of Done (DoD)*.

---

## 2. Flujo Canónico de una Iteración

Cada ciclo de iteración sigue obligatoriamente las siguientes 6 etapas:

```
┌────────────────────────┐
│  1. REFINAMIENTO       │ ➔ Clarificación de requisitos con el Supervisor
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│  2. CONTRATOS & DISEÑO │ ➔ Modelado TypeScript, firmas de funciones y layout UI
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│  3. CONSTRUCCIÓN       │ ➔ Código limpio, modular, desacoplado y estilizado
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│  4. VERIFICACIÓN & QA  │ ➔ Type-check, ESLint, pruebas en navegador y Edge Cases
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│  5. APROBACIÓN SUPERV. │ ➔ Demo funcional y visto bueno de Jorge
└──────────┬─────────────┘
           ▼
┌────────────────────────┐
│  6. CIERRE & BITÁCORA  │ ➔ Registro en bitacora.md y actualización de planner.md
└────────────────────────┘
```

---

## 3. Directrices Obligatorias de Proceso

### Directriz 1: Gestión de Alcance (Scope Discipline)
* Queda prohibido añadir funcionalidades espontáneas fuera de la iteración en curso (*scope creep*). Cualquier nueva idea debe registrarse en el backlog del `planner.md` para ser priorizada con el supervisor.

### Directriz 2: Integridad del Entorno (Zero-Broken-Window Rule)
* El repositorio nunca puede quedar en un estado donde `npm run build` o `npm run lint` fallen. Todo commit debe ser un punto de restauración funcional.

### Directriz 3: Directriz de UI/UX y Estética Premium
* Todo componente visual debe adherirse a la identidad de diseño establecida: tema oscuro elegante, variables CSS consistentes, tipografía cuidada (Inter/Outfit), micro-animaciones en estados de foco/hover y ausencia total de layouts rotos en resoluciones estándar (1920x1080, 1366x768, y móviles 390px).

### Directriz 4: Directriz de Tipado y Pureza de Funciones
* Todo cálculo de negocio (Clan Boss) debe escribirse como una función pura: a mismos datos de entrada, idéntico resultado, sin mutar objetos recibidos y sin efectos colaterales.

### Directriz 5: Trazabilidad en Bitácora
* Ninguna tarea se considera formalmente terminada hasta que su correspondiente entrada con fecha, archivos y justificación esté consignada en `recursos/bitacora.md`.

---

## 4. Definition of Ready (DoR) y Definition of Done (DoD)

### Definition of Ready (DoR) — ¿Cuándo se inicia una tarea/iteración?
- [x] El objetivo de la iteración está redactado claramente.
- [x] Las fórmulas matemáticas o requerimientos visuales están comprendidos.
- [x] No existen bloqueos técnicos o dependencias sin resolver de iteraciones previas.
- [x] El supervisor ha dado luz verde para comenzar.

### Definition of Done (DoD) — ¿Cuándo se finaliza una iteración?
- [x] **Compilación Limpia:** `npm run build` genera el bundle sin advertencias críticas.
- [x] **Linting Estricto:** `npm run lint` pasa con 0 errores y 0 warnings.
- [x] **Tipado TypeScript:** Cero errores de diagnóstico en `tsc -b`.
- [x] **Validación en Navegador:** Probado en navegador real con interacción manual exitosa.
- [x] **Responsive:** Validado en desktop y viewport móvil.
- [x] **Bitácora Actualizada:** Entrada correspondiente registrada en `recursos/bitacora.md`.
- [x] **Feedback del Supervisor:** Presentado y validado con Jorge.

---

## 5. Plan Detallado de Iteraciones de la SPA

### 📍 Iteración 0: Documentación, Diagnóstico y Cimientos (ESTADO: EN CURSO)
* **Objetivo:** Definir las directrices de ingeniería, crear los manuales en `/recursos/` y preparar la estructura para el arranque.
* **Entregables:**
  - `recursos/planner.md`
  - `recursos/bitacora.md`
  - `recursos/iteraciones.md`
  - `recursos/desarrollador.md`
  - `recursos/estandares_react.md`
* **Criterio de Éxito:** Supervisor aprueba la documentación de gobernanza.

---

### 📍 Iteración 1: Limpieza, Arquitectura de Carpetas y Design System Base
* **Objetivo:** Eliminar el código demo de Vite y establecer la arquitectura limpia de carpetas en `src/` junto con el sistema de tokens CSS (colores HSL, tipografía, variables de elevación, resets).
* **Entregables:**
  - Estructura modular: `core/`, `components/`, `hooks/`, `styles/`, `types/`, `utils/`.
  - Archivo `src/styles/tokens.css` y `src/styles/global.css`.
  - Componente Layout base de la SPA (Navbar táctico, contenedor principal, footer de estado).
* **Criterio de Éxito:** App corriendo con un lienzo limpio, visualmente sofisticado y con estructura escalable.

---

### 📍 Iteración 2: Dominio y Motor Matemático de Clan Boss
* **Objetivo:** Implementar los modelos de datos y las fórmulas algorítmicas de combate (True Speed, Turn Meter, Buffs de Velocidad, Debuffs de Reducción).
* **Entregables:**
  - Tipos e interfaces completas en `src/types/clanBoss.ts`.
  - Motor de cálculo en `src/core/calculator/speedTuneEngine.ts`.
  - Pruebas de validación de casos conocidos de sincronización de Clan Boss (ej: Ultra Nightmare 190-240 speed ranges).
* **Criterio de Éxito:** Funciones matemáticas que resuelven con exactitud el orden de turno a 50 rondas.

---

### 📍 Iteración 3: Formulación Dinámica y Configuración de Campeones
* **Objetivo:** Crear los componentes interactivos para configurar el equipo de 5 campeones (Velocidad base, sets de artefactos, glifos, maestrías de TM como Maestro de la Guerra / Sabiduría del Mal).
* **Entregables:**
  - `ChampionCard`: Tarjeta configurable por campeón con validaciones numéricas.
  - `StatInput`: Control numérico con botones de incremento fino y prevención de valores inválidos.
  - `BossSelector`: Selector de dificultad del Clan Boss (Pesadilla, Ultra Pesadilla, Afinidad: Vacío, Magia, Fuerza, Espíritu).
* **Criterio de Éxito:** Los cambios en los inputs recalculan inmediatamente el estado global del equipo sin lag.

---

### 📍 Iteración 4: Visualizador de Timeline de Batalla y Detección de Desincronizaciones
* **Objetivo:** Representar visualmente la secuencia de turnos entre los 5 campeones y el Clan Boss a lo largo de las rondas de combate.
* **Entregables:**
  - Componente `TurnTimelineTable`: Matriz de turnos con indicadores visuales por cada acción del Boss (Golpe 1, Golpe 2, Aturdimiento).
  - Alertas automáticas de desincronización (*"¡El campeón pierde la sincronización en el turno 14!"*).
  - Resumen de estadísticas efectivas (*True Speed*) de todo el escuadrón.
* **Criterio de Éxito:** Visualización clara que permita a cualquier usuario identificar en qué turno falla su estrategia.

---

### 📍 Iteración 5: Persistencia, Presets y Pulido Final (Entrega v1.0.0)
* **Objetivo:** Permitir guardar equipos localmente, exportar configuraciones en formato JSON descargable y optimizar la experiencia de usuario general.
* **Entregables:**
  - Hook de persistencia `useLocalStorageState`.
  - Módulo de exportación/importación JSON con validación de esquema.
  - Auditoría de accesibilidad, contrastes y rendimiento Lighthouse > 95.
* **Criterio de Éxito:** SPA terminada, robusta, visualmente impecable y lista para producción.
