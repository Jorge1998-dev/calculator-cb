# 👨‍💻 GUÍA Y REGLAS DEL DESARROLLADOR SENIOR
> **Proyecto:** Calculat-Boss-Clan (SPA)  
> **Perfil:** Senior Full Stack React Developer  
> **Supervisor:** Jorge  
> **Propósito:** Código de conducta técnica, procesos operativos, principios de diseño de software y estándares de ingeniería obligatorios para este repositorio.  

---

## 1. Declaración de Principios de Ingeniería

Como desarrollador Senior, cada línea de código escrita en este proyecto debe cumplir con tres axiomas fundamentales:
1. **Mantenibilidad sobre Aceleración Descuidada:** Código escrito para ser leído, mantenido y extendido sin fricción por cualquier ingeniero.
2. **Determinismo y Pureza:** La lógica de negocio y cálculo matemático no debe tener efectos secundarios ni depender de ciclos de vida visuales.
3. **Cero Tolerancia a Deuda Oculta:** Errores de tipado, advertencias de compilador o parches temporales sin documentar están prohibidos.

---

## 2. Las 10 Reglas de Oro del Desarrollador

### Regla 1: TypeScript Estricto sin Concesiones (Zero `any`)
* Queda terminantemente prohibido el uso del tipo `any`.
* Si un tipo es dinámico o desconocido, se debe utilizar `unknown` junto con *Type Guards* o aserciones seguras (`typeof`, `instanceof`, validadores de esquema).
* Se deben emplear **Discriminated Unions** (uniones etiquetadas) para modelar estados complejos de UI (ej: `idle`, `calculating`, `success`, `error`).

### Regla 2: Desacoplamiento de la Lógica de Negocio (Clean Architecture)
* Los componentes React (`.tsx`) son exclusivamente **adaptadores de presentación**. No contienen fórmulas matemáticas, ni parsing complejo, ni algoritmos de simulación.
* Toda la lógica matemática reside en módulos puros (`src/core/`) que pueden ejecutarse de forma aislada en Node o vitest sin React.
* La comunicación entre el dominio y la vista se realiza exclusivamente a través de **Custom Hooks**.

### Regla 3: Inmutabilidad Absoluta
* Ningún cálculo o actualización debe mutar el estado existente.
* Se debe usar siempre clonado inmutable o funciones de mapeo (`map`, `filter`, spread operator estructurado).
* Los arrays y objetos de configuración se tratan como datos congelados (*read-only semantics*).

### Regla 4: Estado Mínimo y Datos Derivados (No redundancia)
* No almacenar en el estado lo que pueda calcularse sobre la marcha.
* Si el *True Speed* de un campeón depende de la velocidad base y los artefactos, no se guarda como estado independiente: se deriva usando `useMemo` o durante la renderización si el cálculo es ligero.

### Regla 5: Uso Racional y Estricto de `useEffect`
* `useEffect` es un mecanismo para sincronizarse con sistemas externos (APIs, DOM imperativo, temporizadores), **nunca** para sincronizar dos estados locales de React entre sí.
* Todo efecto secundario debe tener su correspondiente función de limpieza (*cleanup function*) si suscribe eventos o listeners.

### Regla 6: Manejo Defensivo de Errores y Validaciones
* Todo input numérico proveniente del usuario debe validarse contra límites físicos válidos (ej: velocidades no pueden ser negativas, porcentajes entre 0 y 100).
* Se deben implementar **Error Boundaries** granulares para aislar fallos en tarjetas individuales sin tumbar la SPA completa.

### Regla 7: CSS Vanilla Puro y Modular (Cero Tailwind)
* Los estilos se construirán con CSS Vanilla moderno, aprovechando:
  - Custom Properties (`--primary-color`, `--card-bg`, `--font-mono`, etc.).
  - Flexbox y CSS Grid moderno.
  - Soporte de subgrid y container queries donde aplique.
  - Diseño Glassmorphism con `backdrop-filter: blur()`.
* No se instalan librerías de estilos masivas sin autorización previa del supervisor.

### Regla 8: Convención de Nomenclatura Estricta
* **Componentes:** `PascalCase` (ej: `ChampionCard.tsx`, `SpeedTable.tsx`).
* **Custom Hooks:** `camelCase` con prefijo `use` (ej: `useClanBossCalculator.ts`, `useTeamStorage.ts`).
* **Utilidades / Funciones:** `camelCase` orientadas a la acción (ej: `calculateTrueSpeed()`, `formatTurnNumber()`).
* **Tipos e Interfaces:** `PascalCase` (ej: `Champion`, `BattleRound`, `BossDifficulty`).
* **Constantes Globales:** `UPPER_SNAKE_CASE` (ej: `DEFAULT_TEAM_CONFIG`, `MAX_SIMULATION_TURNS`).

### Regla 9: Commits Semánticos y Trazabilidad
Todo commit de control de versiones debe apegarse al estándar de Conventional Commits:
* `feat:` Nueva característica para el usuario.
* `fix:` Corrección de un defecto o bug.
* `refactor:` Mejora de estructura sin alterar el comportamiento observable.
* `perf:` Optimización de rendimiento.
* `style:` Cambios puramente estéticos o de formateo.
* `docs:` Documentación en código o archivos en `/recursos/`.
* `chore:` Mantenimiento de configuración, dependencias o scripts.

### Regla 10: Auditoría Preventiva de Calidad (Pre-Commit Checklist)
Antes de declarar lista una tarea o presentarla al supervisor, el desarrollador ejecuta y valida:
```bash
npm run lint      # Debe arrojar 0 advertencias y 0 errores
npm run build     # Debe compilar el bundle TypeScript y Vite limpiamente
```

---

## 3. Protocolo de Trabajo Diario del Desarrollador con el Supervisor

1. **Revisión del Estado Inicial:** Leer `planner.md` para validar el foco del día o de la sesión.
2. **Definición de Contratos:** Redactar los tipos y modelos antes de codificar la interfaz.
3. **Desarrollo Incremental:** Codificar en módulos pequeños y testeables.
4. **Auto-Review:** Revisar el diff visual y técnico del código antes de pedir feedback.
5. **Registro en Bitácora:** Documentar las decisiones y cambios en `recursos/bitacora.md`.
6. **Entrega al Supervisor:** Demostración en vivo en navegador con confirmación de criterios.
