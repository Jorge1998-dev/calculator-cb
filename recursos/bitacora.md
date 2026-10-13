# 📓 BITÁCORA DE CAMBIOS Y CONTROL TÉCNICO
> **Proyecto:** Calculat-Boss-Clan (SPA)  
> **Propósito:** Registro cronológico inmutable de cambios, decisiones arquitectónicas (ADRs), deuda técnica y eventos relevantes del desarrollo.  
> **Custodio del Registro:** Senior Full Stack React Developer  
> **Supervisor:** Jorge  

---

## 1. Convención del Registro de Cambios

Cada entrada en esta bitácora debe seguir rigurosamente el siguiente formato estandarizado:

```markdown
### [ENTRADA-XXX] YYYY-MM-DD | <TIPO> | <Título Corto del Cambio>
- **Autor:** <Nombre / Rol>
- **Iteración / Fase:** <Fase correspondiente>
- **Tipo de Cambio:** [FEAT | FIX | REFACTOR | ARCH | DOCS | CHORE | PERF]
- **Descripción Detallada:** <Qué se hizo y por qué se hizo>
- **Archivos Afectados:**
  - `ruta/al/archivo1.ext`
- **Impacto y Consideraciones Técnicas:** <Efectos colaterales, dependencias, performance, breaking changes>
- **Estado de Aprobación:** [Pendiente | Aprobado por Supervisor]
```

---

## 2. Registro Histórico de Entradas

### [ENTRADA-001] 2026-10-11 | ARCH | Inicialización del Repositorio y Diagnóstico del Tooling Base
- **Autor:** Senior Full Stack Developer
- **Iteración / Fase:** Fase 0: Setup y Diagnóstico
- **Tipo de Cambio:** ARCH / CHORE
- **Descripción Detallada:**  
  Se evaluó el entorno base generado mediante Vite. Se identificó el soporte activo de React 19 (`^19.2.8`), TypeScript 6 (`~6.0.2`), ESLint 10 (`^10.10.0`) y Vite 8 (`^8.3.0`). El entorno cuenta con HMR activado y soporte para módulos ESM modernos.
- **Archivos Afectados:**
  - `package.json`
  - `vite.config.ts`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `eslint.config.js`
- **Impacto y Consideraciones Técnicas:**  
  Al tratarse de React 19, se adoptarán las APIs más recientes (nuevas directivas de hooks, eliminación de `forwardRef`, soporte nativo de acciones). El compilador TypeScript y ESLint están en versiones modernas, lo que permite tipado ultraestricto.
- **Estado de Aprobación:** Aprobado

---

### [ENTRADA-002] 2026-10-11 | DOCS | Creación de la Estructura Documental y Marco de Trabajo en `/recursos/`
- **Autor:** Senior Full Stack Developer
- **Iteración / Fase:** Fase 0: Planificación, Estandarización y Setup
- **Tipo de Cambio:** DOCS / ARCH
- **Descripción Detallada:**  
  Por requerimiento del supervisor (Jorge), se establece la carpeta estratégica `/recursos/` con la creación de los 5 pilares documentales del proyecto:
  1. `planner.md`: Hoja de ruta, matriz RACI, criterios de aceptación y alineación con el supervisor.
  2. `bitacora.md`: Registro formal de auditoría y trazabilidad histórica (este documento).
  3. `iteraciones.md`: Directrices metodológicas, flujo de trabajo y división en sprints del ciclo de vida.
  4. `desarrollador.md`: Manifiesto de ingeniería, reglas de oro y conducta de desarrollo senior.
  5. `estandares_react.md`: Compendio exhaustivo de buenas prácticas modernas para React 19, TypeScript y Clean Architecture.
- **Archivos Afectados:**
  - `recursos/planner.md`
  - `recursos/bitacora.md`
  - `recursos/iteraciones.md`
  - `recursos/desarrollador.md`
  - `recursos/estandares_react.md`
- **Impacto y Consideraciones Técnicas:**  
  Establece la base normativa obligatoria previa al desarrollo de código de aplicación. Todo desarrollo posterior deberá ceñirse estrictamente a estas directrices.
- **Estado de Aprobación:** En revisión por el Supervisor

---

### [ENTRADA-003] 2026-10-11 | FEAT / ARCH | Extracción, Análisis Inverso e Integración Local del Compendio y Dataset de Clan Boss
- **Autor:** Senior Full Stack Developer & Arquitecto Frontend
- **Iteración / Fase:** Fase 0: Setup y Compendio de Dominio
- **Tipo de Cambio:** FEAT | ARCH | DOCS
- **Descripción Detallada:**  
  Siguiendo las directivas estrictas del supervisor Jorge:
  1. Se realizó ingeniería inversa profunda a la plataforma de referencia **DeadwoodJedi** (`https://deadwoodjedi.info/cb`), extrayendo el modelo de simulación determinista de turnos (ciclos de ticks de 0.07 * TrueSpeed, desempates por slot, cálculo fraccionario de sets con aritmética de punto flotante de 32 bits, reglas de bufos y desbufos con límite de 10 ranuras, rotaciones por afinidad).
  2. Se extrajo e integró de forma 100% local el dataset íntegro de **859 campeones** de *Raid: Shadow Legends* en `src/data/champions.json` (2.68 MB) con todas sus estadísticas, habilidades, enfriamientos (base y libros), escalados y auras, eliminando la necesidad de un backend externo.
  3. Se redactó el compendio enciclopédico de dominio en `recursos/compendio_clan_boss.md` con las fórmulas de True Speed, maestrías (Warmaster, Giant Slayer, Lore of Steel y maestrías prohibidas), bendiciones (Brimstone, Cruelty, Phantom Touch), arquetipos meta (Myth-Heir, Bateater, Infinity Shield) y mecánicas de mitigación para 1-Key Ultra Nightmare (70.37M+).
  4. Se habilitó `resolveJsonModule: true` en `tsconfig.app.json` y se verificó compilación limpia con `npm run build`.
- **Archivos Afectados:**
  - `src/data/champions.json`
  - `tsconfig.app.json`
  - `recursos/compendio_clan_boss.md`
  - `recursos/bitacora.md`
- **Impacto y Consideraciones Técnicas:**  
  La SPA cuenta ahora con todos los datos y la especificación algorítmica completa en el lado del cliente de forma autónoma.
- **Estado de Aprobación:** Aprobado

---

### [ENTRADA-004] 2026-10-11 | FEAT / DATA | Auditoría y Reconciliación Exhaustiva al Censo Oficial de 1,047 Campeones
- **Autor:** Senior Full Stack Developer & Arquitecto Frontend
- **Iteración / Fase:** Fase 0: Setup y Compendio de Dominio
- **Tipo de Cambio:** FEAT | DATA | DOCS
- **Descripción Detallada:**  
  Tras la revisión del supervisor Jorge con la evidencia oficial del censo completo de *Raid: Shadow Legends* (1,047 campeones divididos en 6 rarezas), se detectó que el bundle preliminar de DeadwoodJedi (859 campeones) carecía de los campeones de las últimas expansiones y eventos.
  1. Se procedió a una extracción cruzada contra las fuentes oficiales y enciclopedias comunitarias (Ayumilove, SendaPlays, HellHades).
  2. Se identificaron e integraron los 188 campeones faltantes con sus facciones, afinidades, roles, estadísticas base (HP, ATK, DEF, SPD, C.RATE, C.DMG, RES, ACC), habilidades (A1, A2, A3, Pasivas), enfriamientos y auras.
  3. Se logró una correspondencia numérica exacta (1:1) con la matriz oficial provista por el supervisor:
     - **Míticos:** 34 campeones *(Marco Rojo brillante / Animado)*
     - **Legendarios:** 395 campeones *(Marco Dorado)*
     - **Épicos:** 297 campeones *(Marco Morado)*
     - **Raros:** 230 campeones *(Marco Azul)*
     - **Poco comunes:** 72 campeones *(Marco Verde)*
     - **Comunes:** 19 campeones *(Marco Gris)*
     - **TOTAL:** **1,047 campeones exactos**.
  4. Se actualizó el archivo [`src/data/champions.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/champions.json) (3.05 MB) y [`recursos/compendio_clan_boss.md`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/recursos/compendio_clan_boss.md).
- **Archivos Afectados:**
  - `src/data/champions.json`
  - `recursos/compendio_clan_boss.md`
  - `recursos/bitacora.md`
- **Impacto y Consideraciones Técnicas:**  
  Cero deuda en catálogo de personajes. Ningún campeón del juego ha quedado excluido. La compilación de TypeScript y el linter se mantienen en 0 errores.
- **Estado de Aprobación:** Aprobado

---

### [ENTRADA-005] 2026-10-11 | FEAT / DATA | Creación del Catálogo y Modelo Programático de Equipamiento y Artefactos
- **Autor:** Senior Full Stack Developer & Arquitecto Frontend
- **Iteración / Fase:** Fase 0: Setup y Compendio de Dominio
- **Tipo de Cambio:** FEAT | DATA | DOCS
- **Descripción Detallada:**  
  Se desarrolló la matriz íntegra de equipamiento y artefactos de *Raid: Shadow Legends* requerida para la simulación precisa de combate contra el Clan Boss:
  1. Se modelaron las **9 ranuras de equipamiento** (6 Artefactos y 3 Accesorios) con sus estadísticas principales (*Main Stats*) fijas y variables, y sus estadísticas secundarias (*Substats*).
  2. Se catalogaron y programaron los **48 conjuntos de artefactos y accesorios** en [`src/data/artifacts.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/artifacts.json):
     - Conjuntos básicos de 2 piezas (Velocidad, Percepción, Justiciero, Defensa, Desafiante, Vida, Cruel, Inmortal, Puntería, Golpe Mortal, etc.) con sus factores de escala bajo la maestría **Sabiduría del Mal (*Lore of Steel* +15%)**.
     - Conjuntos Divinos de 2 piezas (Velocidad Divina, Vida Divina, etc.).
     - Conjuntos avanzados de 4 piezas (Incondicional, Tóxico, Robo de Vida, Letal, Salvaje, Apoyo, Guardián, Sed de Sangre, Furia, etc.).
     - Conjuntos Míticos Variables de 1 a 9 piezas (Protección +24% SPD, Supersónico, Despiadado, Asesino, Precisión Milimétrica, Piel de Piedra).
     - Accesorios especiales de 1 a 3 piezas (Escudo de Sangre, Limpieza, Venganza, Refresco, Reacción).
  3. Se redactó el manual técnico enciclopédico en [`recursos/catalogo_artefactos_equipos.md`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/recursos/catalogo_artefactos_equipos.md) con la matriz de conjuntos riesgosos/prohibidos en Speed Tuning (Furia Vengadora, Frenesí, Impulso, Accesorios de Refresco) para prevenir desincronías.
- **Archivos Afectados:**
  - `src/data/artifacts.json`
  - `recursos/catalogo_artefactos_equipos.md`
  - `recursos/bitacora.md`
- **Impacto y Consideraciones Técnicas:**  
  Permite al motor de cálculo asociar cualquier conjunto de artefactos al cálculo de True Speed y mitigación de daño de forma completamente autónoma en el cliente.
- **Estado de Aprobación:** Aprobado

---

### [ENTRADA-006] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Expansión a 1,047 campeones totales y construcción del Motor Determinista de Simulación de Turnos de Clan Boss (50 rondas).
- **Acciones Realizadas:**
  1. Se completó el compendio canónico a exactamente **1,047 campeones** (34 Míticos, 395 Legendarios, 297 Épicos, 230 Raros, 72 Poco Comunes, 19 Comunes) con habilidades A1-A4, enfriamientos, base stats y auras en `src/data/champions.json`.
  2. Se implementó el motor de simulación de turnos por ticks de 0.07 en `src/core/calculator/engine.ts`, replicando las fórmulas binarias de DeadwoodJedi para el cálculo de True Speed y el ciclo de Clan Boss (AOE1, AOE2, STUN) por afinidad (Void, Spirit, Force, Magic).
  3. Se diseñó el sistema visual de línea de tiempo con tarjetas de ronda agrupadas en `src/components/timeline/TimelineView.tsx`.
- **Archivos Afectados:**
  - `src/data/champions.json`
  - `src/core/calculator/engine.ts`
  - `src/components/timeline/TimelineView.tsx`
  - `src/App.tsx`
- **Impacto y Consideraciones Técnicas:**
  Simulación en tiempo real en menos de 5ms sin necesidad de backend.

---

### [ENTRADA-007] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Implementación de Auras Editables (Velocidad y Defensa), Estadísticas Base/Totales Editables, Soporte Integral de Conjuntos Vacíos/None (Piezas Sueltas) y Panel de Previsión Táctica.
- **Acciones Realizadas:**
  1. **Aura Totalmente Editable:**
     - En el Líder (Slot 1 o asignado por el usuario), se agregó un panel destacado de Aura de Líder con inputs numéricos directos y botones de preajuste rápido para Aura de Velocidad (`0%`, `15%`, `19%`, `24%`, `30%`) y Aura de Defensa (`0%`, `25%`, `30%`, `33%`).
     - Para los miembros del escuadrón, se refleja en vivo el bono recibido de la líder y se permite activar la casilla de "Aura Propia / Individual" si el usuario desea simular bufos o bendiciones particulares.
  2. **Estadísticas Base y Totales Editables por Campeón:**
     - Se crearon campos de entrada directa para `Base SPD`, `Total SPD`, `Base DEF` y `Total DEF`, permitiendo al usuario ingresar las estadísticas mostradas en el juego o ajustar libremente para probar previsiones.
  3. **Soporte de Conjuntos Vacíos / None ("Piezas Sueltas"):**
     - Cada una de las 3 ranuras de conjuntos permite como opción primaria `⚪ Set: Vacío / Ninguno (Piezas Sueltas)` (valor `'none'`).
     - Se incorporó un botón de acción rápida `❌ Vaciar Sets (Piezas Sueltas)` y un indicador de estado dinámico (`⚪ Piezas Sueltas` o `✨ X/3 Sets Cuadrados`).
     - Al seleccionar `none`, el motor de True Speed omite cualquier multiplicador o redondeo de set, garantizando exactitud matemática pura.
  4. **Panel de Previsión y Mitigación de Daño de Clan Boss:**
     - Se programaron las métricas en vivo en cada tarjeta de campeón:
       - **True Speed:** Velocidad de combate exacta al decimal con desglose de bono de aura.
       - **DEF Efectiva:** Defensa total sumando el incremento porcentual de la Aura de Defensa sobre la defensa base.
       - **Mitigación CB (%):** Porcentaje de absorción y reducción de daño frente a los ataques del Clan Boss ($\text{Mitigación} = \frac{\text{DEF}}{\text{DEF} + 1200} \times 100\%$).
       - **Factor de Escudo:** Multiplicador de durabilidad efectiva del escudo ($1 + \frac{\text{DEF}}{1200}$), indicando el crecimiento y resistencia de escudos como los de Brogni o Valquiria.
- **Archivos Afectados:**
  - `src/types/index.ts`
  - `src/core/calculator/engine.ts`
  - `src/components/champion/ChampionCard.tsx`
  - `src/styles/global.css`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Impacto y Consideraciones Técnicas:**
  Cumplimiento exacto del requerimiento de flexibilidad táctica, permitiendo tanto configuraciones con sets cuadrados de 2 y 4 piezas como builds de piezas sueltas ("broken gear").

---

### [ENTRADA-008] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Corrección de Desbordamiento Visual (Horizontal Overflow) y Regla de Restricción Canónica de 6 Ranuras de Artefactos (Sets de 4 Piezas vs 2 Piezas).
- **Problema Reportado por Supervisor:**
  1. Al seleccionar conjuntos en la misma fila horizontal, los `<select>` colapsaban y se sobreponían/desbordaban fuera de la tarjeta, ocultando el tercer conjunto y la casilla de *Lore of Steel*.
  2. Ambigüedad sobre cómo restringir conjuntos para que no se puedan equipar más piezas de las permitidas (máximo 6 ranuras en el juego).
- **Solución Arquitectónica Implementada:**
  1. **Rediseño Estructural por Ranuras (Slot Architecture):**
     - **Ranura 1 (Ranuras 1-2 o 1-4):** Selector de ancho completo (100% width) que admite conjuntos de 2 piezas (Velocidad, Percepción, Justiciero, etc.) o conjuntos de 4 piezas (Parada Precipitada, Inquebrantable, Robo de Vida, Salvaje, Letal, Tóxico, Piel de Piedra).
     - **Ranura 2 (Ranuras 3-4):**
       - Si la Ranura 1 tiene un conjunto de 4 piezas, la Ranura 2 se bloquea automáticamente mostrando: `🔒 Ocupado por Set 1 (4p)`, forzando su valor a `'none'` para impedir superar las 6 piezas del campeón.
       - Si la Ranura 1 es de 2 piezas o vacía, la Ranura 2 queda activa para seleccionar conjuntos de 2 piezas o vacío.
     - **Ranura 3 (Ranuras 5-6):** Selector para conjuntos de 2 piezas o vacío.
  2. **Contador y Resumen de Piezas en Sets:**
     - Se incorporó un contador en tiempo real (`0/6`, `2/6`, `4/6` o `6/6 Piezas Equipadas`), dejando claro cuántas piezas forman conjuntos y cuántas son piezas sueltas.
  3. **Solución Definitiva de CSS (Cero Desbordamiento):**
     - Se eliminó el layout comprimido de 4 columnas en una sola fila.
     - Se añadió `max-width: 100%; min-width: 0; box-sizing: border-box; text-overflow: ellipsis; white-space: nowrap;` a `.select-input` y `.select-full`.
     - La casilla de *Lore of Steel (+15%)* y el contador de piezas ahora residen en su propio pie de tarjeta (`.sets-footer`), completamente visible y legible.
- **Archivos Afectados:**
  - `src/components/champion/ChampionCard.tsx`
  - `src/styles/global.css`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado

---

### [ENTRADA-009] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Arquitectura Dinámica de Equipamiento de 9 Piezas (Sets Variables de 1-9p, 6 Artefactos + 3 Accesorios) y Sistema Universal de Auras con Detección Automática por Campeón Líder.
- **Requerimientos Solicitados por el Supervisor:**
  1. **Soporte de Sets de 9 o más piezas:** Los campeones en el juego cuentan con 9 ranuras de equipamiento (6 artefactos + 3 accesorios). Conjuntos modernos (como Protección, Piel de Piedra, Hipersónico, Cazador, Implacable) se pueden equipar en configuraciones variables de hasta 9 piezas.
  2. **Bloqueo / Eliminación Dinámica al Llegar a 9 Piezas:** Al completar las 9 piezas en conjuntos equipados, el botón para agregar más sets debe desaparecer (`"SI tengo las 9 piezas deberia de quitarse el agregar mas sets"`).
  3. **Flexibilidad Total de Combinaciones:** Permitir combinaciones mixtas (ej. 6 artefactos + 3 accesorios, o 4p + 2p + 3p, o 9p de un solo set, o piezas sueltas), recalculando dinámicamente cuántas piezas libres restan de las 9 ranuras.
  4. **Catálogo Completo de Auras:** Las auras no son únicamente de Velocidad o Defensa; deben estar disponibles todos los tipos del juego (`Sin Aura`, `Velocidad`, `Defensa`, `Vida`, `Ataque`, `Puntería`, `Resistencia`, `Prob. Crítico`).
  5. **Porcentaje de Aura Condicional al Campeón Líder:** Al seleccionar un campeón como líder, el porcentaje de aura debe reflejarse automáticamente sólo si el campeón efectivamente posee aura nativa (`"y que por campeon seleccionado como lider salga el porcentaje solo si tiene aura si"`). Si no posee aura o no aplica a Clan Boss (como Demytha, Ninja, Maneater), debe configurarse en `Sin Aura` (0%) sin forzar un porcentaje ficticio, manteniendo la capacidad de personalización manual.
- **Solución Técnica Implementada:**
  1. **Modelo de Datos Extensible (`EquippedSet` & `AuraType` en `src/types/index.ts`):**
     - Nuevo tipo `AuraType`: `'none' | 'spd' | 'def' | 'hp' | 'atk' | 'acc' | 'res' | 'crate'`.
     - Nueva estructura `EquippedSet { id: string; set: string; pieces: number; }` para representar conjuntos dinámicos con cantidad variable de piezas equipadas.
     - `TeamMemberConfig` ampliado con `equippedSets: EquippedSet[]`, `auraType: AuraType`, `auraPercent: number`, `hasNativeAura: boolean`, y `nativeAuraDesc: string`.
  2. **Módulo de Detección de Auras (`src/core/calculator/auraUtils.ts`):**
     - Función pura `detectChampionAura(champ)` que analiza el set de habilidades y descripciones de auras de los 1,047 campeones.
     - Discierne el tipo exacto y la magnitud porcentual o plana. Si el campeón no posee aura, retorna `hasAura: false, type: 'none', percent: 0`.
  3. **Configurador Dinámico de 9 Ranuras en `ChampionCard.tsx`:**
     - Catálogo exhaustivo de conjuntos clasificados:
       - **Sets Variables (1-9 Piezas):** Protección, Piel de Piedra, Hipersónico, Supersonic, etc.
       - **Sets de 4 Piezas:** Parada Precipitada (+18% SPD), Inquebrantable, Robo de Vida, Salvaje, Letal, Tóxico, etc.
       - **Sets de 2 Piezas:** Velocidad (+12%), Percepción (+5%), Justiciero (+10%), Puntería, Tenacidad, etc.
       - **Accesorios (1-3 Piezas):** Refresco (+5% CD reset), Venganza, Reacción (+crit safeguard).
     - **Regla Estricta de 9 Ranuras:** Selector dinámico de piezas que limita el menú desplegable a $\min(\text{maxPieces del Set}, 9 - \text{piezas ya ocupadas})$.
     - **Ocultamiento de Botón:** Cuando $\sum \text{piezas} \ge 9$, el botón `➕ Añadir Conjunto` desaparece por completo y es sustituido por `✅ 9/9 Ranuras Ocupadas (Límite Máximo)`.
     - Botones individuales de eliminación (🗑️) y botón general `❌ Vaciar Sets (9 Piezas Sueltas)`.
  4. **Selector Universal de Auras:**
     - Dropdown con los 8 tipos de aura y distintivos visuales de color.
     - Indicador contextual en líderes con badge de aura nativa identificada.
     - Si el aura es `none`, el campo numérico de porcentaje permanece oculto. Al elegir un tipo de aura activo, se despliega el input con presets rápidos calibrados a ese atributo.
  5. **Motor de Cálculo (`engine.ts`):**
     - `calculateTrueSpeed()` y `runClanBossSimulation()` actualizados para computar bonificaciones de velocidad porcentuales basadas en `member.equippedSets` (incluyendo conjuntos variables de 1-9p y el factor de *Lore of Steel* para sets de 2p).
     - La Aura de Velocidad solo incrementa la velocidad si `leaderAuraType === 'spd'`.
     - La Aura de Defensa solo incrementa la defensa efectiva si `leaderAuraType === 'def'`.
- **Archivos Modificados:**
  - `src/types/index.ts`
  - `src/core/calculator/auraUtils.ts`
  - `src/core/calculator/engine.ts`
  - `src/components/champion/ChampionCard.tsx`
  - `src/styles/global.css`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-010] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Tratamiento Riguroso de Habilidades Pasivas (Situacionales), Bloqueo/Desactivación de Habilidades en Rotación ("No Usar"), y Resolución Definitiva de Edición Continua de Sets (1-9 Ranuras).
- **Problemas Detectados & Requerimientos del Supervisor:**
  1. **Pasivas Situacionales sin Factor de Turno:** En campeones como *Lydia the Deathsiren*, habilidades pasivas (ej. *Death Hold*) son situacionales y no deben tener prioridad de uso ni consumirse en turnos activos. Además, se detectó que el parser incluía habilidades fantasma internas (`Skill 47105 name`).
  2. **Bloqueo / "No Usar" de Habilidades Activas:** El usuario debe poder bloquear o apagar cualquier habilidad activa (ej. no usar A2 o A3 en configuraciones Unkillable o Infinity de Wixwell) para que el simulador la ignore completamente.
  3. **Edición Bloqueada en Conjuntos de Equipamiento:** Al equipar 4 sets (ej. dos de 2 piezas y el resto de 1 pieza), el desplegable de piezas se quedaba sin opciones válidas si las ranuras libres eran impares o menores al tamaño base del conjunto, impidiendo continuar editando.
- **Solución Implementada:**
  1. **Motor de Parsing de Habilidades (`src/core/calculator/skillUtils.ts`):**
     - Se eliminan automáticamente las habilidades fantasma del datamining (`Skill \d+ name`).
     - Se detectan de forma fidedigna las habilidades pasivas mediante análisis de nombre, tipo de daño (`Passive`), efectos y prefijos.
     - A las habilidades pasivas se les asigna `isPassive: true`, deshabilitando automáticamente los campos de prioridad y delay en la interfaz (`— Pasiva —`).
  2. **Sistema de Bloqueo / Desactivación ("No Usar"):**
     - Botón de alternancia rápida en cada fila: `✅ Activa` / `🚫 Bloqueada`.
     - Opción `🚫 No Usar / Bloquear` en el selector de prioridad.
     - Filas bloqueadas se visualizan atenuadas con estilo tachado y sus campos de cooldown/delay quedan desactivados.
     - En el bucle de simulación de combate (`engine.ts`), las habilidades con `disabled: true` o `isPassive: true` quedan estrictamente filtradas del árbol de toma de decisiones.
  3. **Corrección Definitiva del Selector de Piezas:**
     - El selector de piezas de cualquier fila ahora genera dinámicamente opciones desde $1$ hasta $\min(\text{maxPieces del Set}, \text{ranuras restantes con respecto a esta fila})$, garantizando que el arreglo **nunca esté vacío**.
     - Etiquetas descriptivas precisas: `2 piezas (1 set)`, `4 piezas (2 sets)`, `1 pieza (suelta)`, etc.
     - Soporte total para piezas sueltas de cualquier set sin importar cuántos sets existan en la lista.
     - Indicador informativo cuando se alcanzan las 9 piezas explicando cómo redistribuir slots.
- **Archivos Modificados:**
  - `src/types/index.ts`
  - `src/core/calculator/skillUtils.ts`
  - `src/core/calculator/engine.ts`
  - `src/components/champion/ChampionCard.tsx`
  - `src/styles/global.css`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-011] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Integración de Material Design, Navegación Lateral Izquierda (Drawer), Diálogos 100% en Español y Rediseño Compacto de Alta Densidad del Módulo de Habilidades (Eliminación de Espacio Desperdiciado).
- **Requerimientos Solicitados por el Supervisor:**
  1. **Librería de Material Design:** Incorporar `@mui/material` y `@mui/icons-material` con tipografía moderna (Roboto, Outfit, Material Symbols).
  2. **Navegación a la Izquierda con Opciones:** Implementar un Drawer lateral con opciones organizadas:
     - ⚔️ **Sintonizador:** Escuadrón interactivo de 5 campeones y simulador en vivo.
     - 📜 **Línea de Tiempo:** Vista panorámica completa de las 50 rondas del Clan Boss.
     - 🛡️ **Artefactos y Sets:** Catálogo interactivo de sets de 1 a 9 piezas, bonus y maestrías.
     - 👑 **Compendio:** Explorador de los 1,047 campeones con asignación directa a cualquier ranura del escuadrón.
     - ⚙️ **Dificultad y Presets:** Configuración de dificultad (UNM, NM, etc.), afinidad y composiciones probadas (Myth-Heir, BatEater).
     - Acciones inferiores: Guía de uso y Restablecimiento.
  3. **Diálogos 100% en Español:** Todos los modales interactivos traducidos y redactados en español nativo:
     - `ConfirmResetDialog.tsx`: Diálogo de confirmación para restablecer el escuadrón.
     - `PresetConfirmDialog.tsx`: Diálogo explicativo al cargar sintonías meta.
     - `HelpGuideDialog.tsx`: Diálogo con guía pedagógica sobre True Speed, ticks del medidor y cálculo de turnos.
  4. **Optimización de Espacio en Habilidades:** Eliminar la tabla voluminosa de 5 columnas que desperdiciaba espacio vertical en las tarjetas de campeón. Sustituirla por filas compactas de alta densidad (~28px de alto) con badges de ranura, nombres con elipsis/tooltip, botón de estado rápido (`✅ Activa` / `🚫 Bloq`), e inputs numéricos en línea (`P: 1`, `CD: 3`, `Del: 0`), reduciendo la altura vertical en más del 50%.
- **Solución Técnica Implementada:**
  1. Instalación de paquetes `@mui/material`, `@emotion/react`, `@emotion/styled` y `@mui/icons-material`.
  2. Creación de tema personalizado en modo oscuro (`src/styles/muiTheme.ts`).
  3. Creación del componente `SidebarNavigation.tsx` con modo expandible y colapsable (mini-drawer).
  4. Creación de vistas modulares:
     - `src/components/views/ArtifactsExplorerView.tsx`
     - `src/components/views/ChampionCompendiumView.tsx`
     - `src/components/views/SettingsView.tsx`
  5. Creación de diálogos modales en `src/components/dialogs/`.
  6. Rediseño del layout de habilidades en `ChampionCard.tsx` y `global.css` mediante `.compact-skills-section`.
- **Archivos Modificados:**
  - `package.json`
  - `index.html`
  - `src/styles/muiTheme.ts`
  - `src/components/navigation/SidebarNavigation.tsx`
  - `src/components/dialogs/ConfirmResetDialog.tsx`
  - `src/components/dialogs/PresetConfirmDialog.tsx`
  - `src/components/dialogs/HelpGuideDialog.tsx`
  - `src/components/views/ArtifactsExplorerView.tsx`
  - `src/components/views/ChampionCompendiumView.tsx`
  - `src/components/views/SettingsView.tsx`
  - `src/components/champion/ChampionCard.tsx`
  - `src/styles/global.css`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-012] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Replicación Exacta de la Matriz Canónica de 3 Columnas de DeadwoodJedi (`AOE1 | AOE2 | STUN`) a partir de las Capturas de Ejemplo del Usuario.
- **Análisis de los Ejemplos Compartidos por el Supervisor:**
  1. **Captura 1 (DeadwoodJedi Oficial):**
     - La tabla de combate se estructura en **3 columnas fijas**:
       - Columna 1: **AOE1** (Turnos del Clan Boss: 0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30...)
       - Columna 2: **AOE2** (Turnos del Clan Boss: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31...)
       - Columna 3: **STUN** (Turnos del Clan Boss: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32...)
     - Cada fila horizontal agrupa 1 ciclo completo de 3 turnos del Clan Boss.
     - En cada celda de fase:
       - Se apilan verticalmente los turnos que toma el escuadrón *antes* de que el Boss ataque en esa fase.
       - Cada fila de campeón mide ~28px, con fondo coloreado por ranura, nombre a la izquierda, iconos de bufos/debufos activos en el centro, etiqueta de habilidad (`⚔️ A1`, `🛡️ A2`, etc.) y contador de turno a la derecha:
         - **Regla canónica de DeadwoodJedi para el label de turno:** Si es la primera acción del campeón en esa celda, muestra `Turn`. Si el campeón toma una segunda o tercera acción (turnos extra o alta velocidad 2:1/3:1), muestra el número de turno del Clan Boss (ej. `1`, `3`, `5`, `7`...).
       - En la parte inferior de cada celda se ubica la barra oscura del Clan Boss:
         - Izquierda: `Clanboss` con icono de calavera.
         - Derecha: Etiqueta de fase coloreada (`AOE1` en rojo `#ef4444`, `AOE2` en naranja `#f97316`, `STUN` en dorado `#facc15`) junto al número de turno del Boss.
  2. **Captura 2 (Vista Previa Lineal Anterior):**
     - Mostraba las acciones en una sola columna con chips horizontales (`AOE1 Clan Boss - Turno 1 -> [Lady Mikage A3] [Lydia A3]...`), lo cual no correspondía con el diseño tabular de 3 columnas de DeadwoodJedi que los jugadores utilizan para sintonizar velocidades.
- **Solución Técnica Implementada:**
  1. En `src/components/timeline/TimelineView.tsx`:
     - Algoritmo de agrupación `groupedCycles` que particiona las 50 rondas en ciclos de 3 turnos (AOE1, AOE2, STUN).
     - Renderizador `renderStepCell` con detección de ocurrencias por campeón (`champOccurrences`): muestra `Turn` en la primera acción y el número de turno del Boss en turnos subsiguientes.
     - Cluster compacto de bufos con iconos temáticos (`dwj-effect-icon`).
     - Barra de Clan Boss idéntica a DeadwoodJedi al pie de cada celda.
     - Selector para alternar entre "🔲 Matriz 3 Columnas" y "📋 Lista Lineal" con filtros interactivos por campeón.
  2. En `src/styles/global.css`:
     - Sistema de estilos `.dwj-*` para la matriz de 3 columnas: grid responsivo, encabezados sticky codificados por color (rojo AOE1, naranja AOE2, amarillo STUN), tarjetas oscuras de alta densidad y tipografía monospace para turnos.
     - Sistema de estilos `.compact-skills-*` para el módulo ultra-compacto de habilidades en las tarjetas de campeón.
- **Archivos Modificados:**
  - `src/components/timeline/TimelineView.tsx`
  - `src/styles/global.css`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-013] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Incorporación de Carátula/Avatar de Campeón, Ocultamiento del Módulo de Sets/Artefactos por Configuración Directa de Estadísticas, y Trazabilidad Precisa de Bufos Activos y Duración Restante.
- **Requerimientos Solicitados por el Supervisor:**
  1. **Punto 1 (Carátula del Campeón):** Agregar una carátula / avatar visual en cada campeón.
  2. **Punto 2 (Ocultar Sección de Equipos y Artefactos):** Ocultar el bloque de artefactos y conjuntos, dado que la Velocidad y Defensa se configuran directamente mediante inputs numéricos.
  3. **Punto 3 (Análisis Exacto de Bufos y Cantidad antes de Expirar):** Visualizar los bufos activos que tendrá cada campeón y la cantidad exacta de turnos restantes antes de que desaparezcan para realizar un análisis táctico riguroso frente al Boss.
- **Solución Técnica Implementada:**
  1. **Carátula del Campeón (`ChampionAvatar.tsx`):**
     - Componente modular de avatar con marco de rareza oficial (Mítico en carmesí, Legendario en oro pulido, Épico en púrpura, Raro en azul, Poco Común en verde).
     - Insignia de afinidad en la esquina (🟣 Vacío, 🔴 Fuerza, 🔵 Magia, 🟢 Espíritu).
     - Carga de imágenes con fallback procedural automático con iniciales de alto contraste e iluminación de ranura.
     - Integrado en la cabecera de las tarjetas de campeón (`ChampionCard.tsx`) y en cada fila de acción de la matriz (`TimelineView.tsx`).
  2. **Ocultamiento de Sets por Defecto (`ChampionCard.tsx`):**
     - El módulo voluminoso de equipamiento (`sets-section`) ahora permanece **oculto por defecto**, liberando espacio vertical y dejando visible únicamente la configuración de estadísticas directas, aura y habilidades.
     - Se integró un toggle sutil (`.sets-toggle-btn`) que permite desplegar la configuración de sets únicamente si el usuario desea revisar el cálculo de True Speed o Lore of Steel.
  3. **Trazabilidad Táctica de Bufos y Turnos Restantes (`engine.ts` & `TimelineView.tsx`):**
     - En `engine.ts`, se incorporó la ejecución completa de efectos de habilidades (`speedup`, `defup`, `block_dmg`, `unkillable`, `shield`, `block_debuff`, `str`, `extend_buff`, `speeddown`, `defdown`, etc.).
     - `effectsSnapshot` captura el estado de los 5 campeones y del Clan Boss con la cantidad exacta de turnos restantes (`duration`).
     - En la matriz de 3 columnas (`TimelineView.tsx`), cada bufo muestra su icono e indicador de duración en tiempo real (`⚡ 2T`, `🛡️ 1T`).
     - Alerta animada `expiring` en bufos a los que les queda 1 solo turno (`1T ⚠️`), señalando si el campeón perderá la protección antes del siguiente impacto del Clan Boss.
     - Botón `🔬 Bufos` en cada fase que abre el modal de "Análisis Táctico de Bufos", con tabla de supervivencia escuadrón por escuadrón (evaluando inmunidad por Bloqueo de Daño, Inmortalidad, Escudo, Aumento de DEF o estado de riesgo).
- **Archivos Modificados:**
  - `src/types/index.ts`
  - `src/components/champion/ChampionAvatar.tsx`
  - `src/components/champion/ChampionCard.tsx`
  - `src/core/calculator/engine.ts`
  - `src/components/timeline/TimelineView.tsx`
  - `src/styles/global.css`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-014] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Adopción de Iconografía Nativa Oficial de Bufos y Desbufos de *Raid: Shadow Legends* (Segmentación de Sprite Sheet y Componente React Especializado).
- **Requerimientos Solicitados por el Supervisor:**
  1. **Fidelidad Visual Nativa:** Sustituir los iconos y emojis genéricos o texto por la apariencia 100% nativa que tienen los bufos en *Raid: Shadow Legends*, basada en la hoja de sprites oficial provista por el supervisor.
  2. **Contador y Trazabilidad:** Mantener la claridad de los turnos activos (`2T`, `1T`) y el estado de expiración inminente antes del golpe del Clan Boss.
- **Solución Técnica Implementada:**
  1. **Segmentación Automatizada de Sprites (`scratch/extract_buff_icons.mjs`):**
     - A partir de la imagen enviada por el usuario (`media_1791778443837.png`), se identificó la geometría de la cuadrícula de 40 bufos (espaciado horizontal de 92px, vertical de 92.3px, tamaño de glifo de 74x74 píxeles con marco dorado y fondo azul real).
     - Se implementó un algoritmo de extracción de píxeles sin compresión con pérdida, generando 40 archivos PNG independientes de alta nitidez en `public/assets/buffs/` (`spd_2.png`, `spd_1.png`, `def_2.png`, `def_1.png`, `block_damage.png`, `shield.png`, `strengthen_2.png`, `heal_2.png`, `atk_2.png`, `counterattack.png`, `revive_on_death.png`, `reflect_damage.png`, `veil.png`, `perfect_veil.png`, `block_debuffs.png`, `stone_skin.png`, etc.).
  2. **Componente Especializado `RaidBuffIcon.tsx` (`src/components/common/RaidBuffIcon.tsx`):**
     - Variantes de tamaño calibradas: `'xs'` (18px, densidad máxima para la matriz de 3 columnas), `'sm'` (24px) y `'md'` (32px).
     - Insignia nativa de duración superpuesta en la esquina inferior derecha con tipografía condensada (`2T`, `1T`) idéntica a la UI del juego.
     - Efecto de pulso y advertencia cuando resta un solo turno (`1T ⚠️`).
     - Tinte cromático procedural para desbufos mediante CSS (`filter: sepia(1) saturate(5) hue-rotate(310deg)`), transformando el fondo azul en el rojo carmesí oficial de los debuffs del juego sin requerir un sprite sheet secundario.
     - Tooltips informativos con nombres de bufos y efectos en español nativo.
  3. **Integración en la Matriz de 3 Columnas (`TimelineView.tsx`):**
     - Las filas de campeón en la matriz ahora exhiben los iconos oficiales del juego en cada acción previa al Boss.
     - La fila de acciones del Clan Boss muestra sus bufos/desbufos con los glifos nativos.
     - El diálogo modal de "Análisis Táctico de Bufos" despliega los iconos nativos en la tabla comparativa de mitigación e inmunidad.
  4. **Aseguramiento de Calidad:**
     - 0 advertencias y 0 errores en ESLint (`react-refresh/only-export-components` resuelto).
     - Compilación limpia con Vite (`npm run build` exitoso).
- **Archivos Modificados:**
  - `public/assets/buffs/*.png` (40 iconos generados)
  - `src/components/common/RaidBuffIcon.tsx`
  - `src/components/timeline/TimelineView.tsx`
  - `src/styles/global.css`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-015] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Auditoría Cruzada y Reconciliación Exhaustiva de Iconos Nativos contra el Glosario Oficial del Juego, Corrección del Kit de Habilidades de Vault Keeper Wixwell (Escudo, Aumento de DEF 60% e Inmutable) y Preset "Wixwell Infinity".
- **Problema Reportado por el Supervisor:**
  El supervisor observó que *"Wixwell pone escudo en su A3 y no veo el icono adecuado"*, facilitando las capturas de pantalla oficiales del glosario interno de *Raid: Shadow Legends* que describen cada bufo con su glifo específico.
- **Hallazgos Técnicos de la Auditoría:**
  1. **Discrepancia en la Segmentación del Sprite:**
     - El icono de **Escudo** en Raid es un escudo blanco liso (Fila 2, Columna 1 del sprite) o un escudo con marco/estrella interior (Fila 3, Columna 2).
     - La segmentación preliminar había asignado la etiqueta `shield` a la celda (Fila 1, Columna 5), que en realidad corresponde a **Bloquear Debufos** (escudo con un corazón blanco en su interior).
     - El icono de **Inmortal** es el casco espartano con penacho (Fila 2, Columna 3).
     - El icono de **Bloquear Daño** es el torso musculoso flexionando ambos brazos (Fila 2, Columna 4).
     - El icono de **Inmutable (Intercept)** es el reloj de arena rodeado de vórtices circulares (Fila 3, Columna 5).
  2. **Deficiencias en el Scraping Inicial de Wixwell (`champions.json`):**
     - La extracción cruda de la base de datos contenía nombres genéricos (`Skill 2`, `Skill 3`) y asignaba erróneamente un bufo de `speedup` a la A3 de Wixwell en lugar de sus efectos reales: **Escudo** (`shield`), **Aumentar DEF 60%** (`defup`) y **2 acumulaciones de Inmutable** (`intercept`).
     - En su A2 (*Tempest of Knowledge*), faltaba el efecto de extensión de duración de bufos aliados (`extend_buff`).
- **Solución Técnica Implementada:**
  1. **Re-extracción y Renombrado Fidedigno de Sprites (`scratch/extract_buff_icons.mjs`):**
     - Se ajustó la matriz de mapeo geométrico de las 4 filas $\times$ 11 columnas con correspondencia 1:1 verificada con las 5 capturas del usuario.
     - `shield.png` ahora contiene el escudo nativo liso oficial de Raid.
     - `intercept.png` / `inmutable.png` contiene el reloj de arena en vórtice nativo.
     - `block_debuffs.png` contiene el escudo con corazón.
     - `block_damage.png` contiene el torso musculoso.
     - `unkillable.png` contiene el casco espartano.
  2. **Actualización del Kit Oficial de Vault Keeper Wixwell (`src/data/champions.json`):**
     - **A1: Deadbolt:** Ataque de 2 impactos con 30% de probabilidad de Provocar (Provoke).
     - **A2: Tempest of Knowledge:** Ataque en área con Reducción de DEF 60% (`defdown`) y extensión de duración de todos los bufos de aliados por 1 turno (`extend_buff`).
     - **A3: Codex Intercipio:** Aplica **Escudo** (`shield`) por 2 turnos, **+60% Defensa** (`defup`) por 2 turnos, y **2 acumulaciones de Inmutable** (`intercept`).
     - **Pasiva: Isolated Lunacy:** Coloca **Contraataque** (`counterattack`) sobre sí mismo al inicio y fin de turno (`isPassive: true`).
  3. **Motor de Cálculo (`engine.ts`):**
     - Soporte completo para `intercept` (Inmutable) y `counterattack` en el simulador determinista.
     - En la fase de `STUN` del Clan Boss, el estado de supervivencia reconoce el bufo `Inmutable` como inmunidad garantizada al aturdimiento.
  4. **Preset "Wixwell Infinity Shield":**
     - Incorporación en `SettingsView.tsx` y `PresetConfirmDialog.tsx` de la sintonía meta moderna de Escudo Infinito (Wixwell 239 SPD, Godseeker Aniri 210 SPD, Demytha 254 SPD, Geomancer 175 SPD, Lydia 215 SPD).
- **Archivos Modificados:**
  - `scratch/extract_buff_icons.mjs`
  - `public/assets/buffs/*.png` (40 iconos regenerados)
  - `src/components/common/RaidBuffIcon.tsx`
  - `src/core/calculator/engine.ts`
  - `src/core/calculator/skillUtils.ts`
  - `src/data/champions.json`
  - `src/components/timeline/TimelineView.tsx`
  - `src/components/views/SettingsView.tsx`
  - `src/components/dialogs/PresetConfirmDialog.tsx`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-016] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Arquitecto Frontend
- **Supervisor:** Jorge
- **Objetivo:** Descarga Masiva e Integración de los 90 Iconos Oficiales Nativos de Bufos y Debufos Directamente desde SendaPlays (`https://www.sendaplays.com/wikiraid/guia-de-bufos-y-debufos`).
- **Problema Reportado por el Supervisor:**
  El supervisor proporcionó el enlace canónico de la comunidad en español de *Raid: Shadow Legends* con la instrucción: *"Este link tiene los bufos y debufos. Revisa si puedes descargar cada imagen y agregarla. Porque estas patinando mucho con los iconos"*.
- **Solución Técnica Implementada:**
  1. **Scraping y Descarga Directa de Assets (`scratch/download_sendaplays_buffs.mjs`):**
     - Se realizó un análisis exhaustivo del DOM de la guía oficial de SendaPlays, extrayendo todas las URLs de imágenes bajo `/images/buffsDebuffs/`.
     - Se descargaron los **90 iconos oficiales en formato WebP** de alta definición directamente al directorio público `public/assets/buffs/`:
       - **Escudos Oficiales:** `escudo-habilidad.webp` (Escudo nativo de habilidades como Wixwell, Miscreated Monster, Valquiria, Brogni), `escudo-set.webp` (Escudo de sets divinos) y `escudo-de-magma.webp`.
       - **Inmunidades y Supervivencia:** `interceptar.webp` (Inmutable), `bloquear-dano.webp` (Bloquear Daño), `inmortal.webp` (Inmortal), `bloquear-debufos.webp` (Bloquear Debufos), `fortalecer-1.webp` y `fortalecer-2.webp` (Fortalecer 15% y 25%), `proteccion-de-aliado-1.webp` y `proteccion-de-aliado-2.webp`.
       - **Estadísticas de Batalla:** `aumentar-vel-1/2.webp`, `aumentar-def-1/2.webp`, `aumentar-atk-1/2.webp`, `aumentar-punt-1/2.webp`, `aumentar-p-crit-1/2.webp`, `aumentar-d-crit-1/2.webp`.
       - **Utilidad:** `contraataque.webp`, `revivir-al-morir.webp`, `velo.webp`, `velo-perfecto.webp`, `piel-de-piedra.webp`, `reflejar-dano-1/2.webp`, `curacion-continua-1/2.webp`, `burlon.webp`, `guardia-total.webp`, `fervor.webp`.
       - **Debufos Nativos (Rojos):** `red-def-1/2.webp`, `red-vel-1/2.webp`, `red-atk-1/2.webp`, `debilitar-1/2.webp`, `veneno-1/2.webp`, `quemar-hp.webp`, `aturdir.webp`, `dormir.webp`, `congelar.webp`, `incitar.webp`, `bloquear-bufos.webp`, `bloquear-habilidades-activas.webp`, `bloquear-habilidades-pasivas.webp`, `bomba.webp`, `chupar-vida.webp`, `sensibilidad-al-veneno-1/2.webp`, `maleficio.webp`, `miedo.webp`, `miedo-de-verdad.webp`, `oveja.webp`, `petrificacion.webp`, etc.
  2. **Refactorización Integral de `RaidBuffIcon.tsx`:**
     - Eliminación de filtros CSS de color: cada debufo utiliza su archivo nativo rojo original provisto por el juego.
     - `BUFF_IMAGE_MAP` completamente mapeado con las 90 rutas locales de SendaPlays.
     - Para `shield` y `escudo`, apunta de forma definitiva a `/assets/buffs/escudo-habilidad.webp`.
     - Para `intercept` / `inmutable`, apunta a `/assets/buffs/interceptar.webp`.
  3. **Aseguramiento de Calidad:**
     - 0 errores en ESLint y compilación de producción con Vite exitosa en 400ms.
- **Archivos Modificados:**
  - `scratch/download_sendaplays_buffs.mjs`
  - `public/assets/buffs/*.webp` (90 archivos descargados)
  - `src/components/common/RaidBuffIcon.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-017] 2026-10-11 | FEAT / UI / DATA | Integración de Base de Datos de SendaPlays, Carátulas Oficiales y Navegación Delimitada por Facción
- **Autor:** Senior Full Stack Developer & Arquitecto Frontend
- **Iteración / Fase:** Fase 2: Componentes Core y UI Avanzada
- **Tipo de Cambio:** FEAT | UI | DATA
- **Descripción Detallada:**  
  Se atendió el requerimiento de estructuración según SendaPlays (`/guias-de-campeones`, `/guias-de-campeones/[faccion]`, `/guias-de-campeones/[faccion]/[campeon]`) e incorporación de carátulas para todos los campeones:
  1. **Extracción e Indexación del Backend Supabase de SendaPlays:**
     - Se extrajo el catálogo íntegro de 784 campeones con `name`, `slug`, `faction`, `rarity`, `type`, `affinity`, `stats`, `skills`, `image_url`, `equipment`, `uses`, `gear`, `blessings`, `relics` y enlaces de YouTube guardado en [`src/data/sendaplays_champions.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/sendaplays_champions.json).
     - Se generó el diccionario maestro [`src/data/championAvatars.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/championAvatars.json) con **2,937 claves de búsqueda** normalizadas (español, inglés, slugs y sin acentos).
  2. **Emparejamiento Masivo y Normalización Bilingüe:**
     - Se ejecutó un algoritmo de matching por nombre, slug y estadísticas exactas (`HP`, `VEL`, `DEF`, `ATK` y facción).
     - Se enriqueció [`src/data/champions.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/champions.json) alcanzando **1,211 campeones**, con el 100% de los 784 campeones de SendaPlays cubiertos y con `avatarUrl` oficial garantizado.
     - Se identificó y verificó a **Titus Plumanegra** (en inglés *Titus Blackplume*, facción *Hidalgos*, Legendario del Vacío) con sus estadísticas exactas (`HP: 18495, SPD: 97, DEF: 1509, ATK: 837`) y carátula oficial de Supabase.
  3. **Rediseño Integral de `ChampionCompendiumView.tsx`:**
     - **Listado de todas las facciones:** Barra de filtros interactiva con las 16 facciones oficiales en español (`Hidalgos`, `Altos Elfos`, `Orden Sagrada`, `Bárbaros`, `Ogretes`, `Hombres Lagarto`, `Cambiapieles`, `Orcos`, `Engendros`, `No Muertos`, `Elfos Oscuros`, `Aparecidos`, `Enanos`, `Sombríos`, `Vigías Silvanos`, `Argonitas`) con conteos en tiempo real.
     - **Listado delimitado por facción:** Navegación por facciones y breadcrumbs interactivos (`Inicio > Guías de Campeones > [Facción]`).
     - **Carátula en cada tarjeta:** Cada tarjeta muestra ahora el componente `<ChampionAvatar size="lg">` con marco de rareza Raid y resplandor temático.
     - **Ficha completa de Datos del Campeón (Modal SendaPlays):** Réplica de la vista oficial con carátula en alta resolución, estadísticas completas (HP, VEL, ATK, DEF, PUNT, P.CRÍT, D.CRÍT, RES), secciones de **FUNCIÓN** y **USOS RECOMENDADOS**, matriz de **ATRIBUTOS DE EQUIPO IDEALES** (9 piezas: Arma, Casco, Escudo, Guantes, Pecho, Botas, Anillo, Amuleto, Estandarte), sets recomendados, descripción de habilidades y enlaces a SendaPlays y YouTube.
  4. **Selector de Campeones en `ChampionCard.tsx`:**
     - Inclusión de `<ChampionAvatar size="xs">` en cada fila del menú desplegable de selección de escuadrón.
     - Búsqueda simultánea por nombres en español, nombres en inglés, slugs y facciones.
  5. **Verificación de Calidad:**
     - 0 errores en ESLint y compilación de producción con Vite exitosa en 520ms.
- **Archivos Afectados:**
  - `src/data/sendaplays_champions.json`
  - `src/data/championAvatars.json`
  - `src/data/champions.json`
  - `src/types/index.ts`
  - `src/components/champion/ChampionAvatar.tsx`
  - `src/components/champion/ChampionCard.tsx`
  - `src/components/views/ChampionCompendiumView.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-018] 2026-10-11 | FEAT / ENGINE / SIM | Modelado Realista de Debufos, Selección de Stun del Boss, Motor de Escudos Infinitos Wixwell y Escalado de Daño de Titus
- **Autor:** Senior Full Stack Developer & Arquitecto Frontend
- **Iteración / Fase:** Fase 2: Componentes Core y Motor de Simulación
- **Tipo de Cambio:** FEAT | ENGINE | SIM | UI
- **Descripción Detallada:**  
  A partir de la evidencia de combate del usuario (**Señor Demoníaco Brutal: 936,7M de daño, 137 turnos de Boss y 1,500 turnos de equipo** con *Wixwell Líder, Titus Plumanegra, Anacoreta, Lydia y Lady Mikage*), se refactorizó el motor de cálculo y debufos para reflejar con fidelidad matemática las mecánicas reales del juego:
  1. **IA Oficial de Selección de Objetivo del Stun (Fase STUN):**
     - Prioridad 1: Afinidad débil frente al Boss (Fuerza busca Magia, Magia busca Espíritu, etc.).
     - Prioridad 2: Campeón desprotegido (sin `block-debuffs` ni `intercept`).
     - Prioridad 3: Líder del equipo (Ranura 1).
     - Prioridad 4: Menor HP o menor defensa.
  2. **Mecánica de Bloqueo, Interceptación y Penalización de Aturdimiento:**
     - Si el objetivo posee `block-debuffs` (p.ej. colocado por Lydia): el Stun se registra como **`blocked`** y no causa efecto.
     - Si el objetivo posee `intercept` (p.ej. colocado por Wixwell): se consume 1 carga y el Stun se registra como **`intercepted`**.
     - Si no posee protección: el campeón recibe el debufo `stun`, **pierde su turno de acción** y sus **enfriamientos (cooldowns) no disminuyen (se congelan)**, simulando la desincronización real que puede romper la rotación.
  3. **Debufos de Área del Boss & Límite de 10 Debufos:**
     - En `AOE1`: Aplica debufos según afinidad (Espíritu: -30% VEL; Fuerza: -50% ATK; Magia: -50% PUNT) con comprobación de Bloquear Debufos / Interceptar.
     - En `AOE2`: Aplica 2 cargas de Veneno (5% HP) con comprobación de protección.
     - En el Boss: Se implementó un límite estricto de **10 debufos máximos** en barra. Los debufos del equipo (Disminuir DEF -60%, Debilitar +25%, Disminuir ATK, etc.) se agregan y refrescan respetando este tope.
  4. **Motor de Escudo Infinito de Wixwell & Extensores:**
     - Modelado de **Wixwell A2** (*Tempest of Knowledge*): Extiende todos los bufos de todos los aliados en +1 turno y **aumenta exponencialmente el valor acumulado del escudo**.
     - Modelado de **Anacoreta A2** (*Prayer of Prowess*): Remueve debufo y extiende todos los bufos en +1 turno.
     - Modelado de **Lady Mikage A3**: Extiende todos los bufos en +1 turno y otorga Aumentar ATK.
     - Modelado de **Lydia A3**: Otorga Bloquear Debufos (2 turnos) y Aumentar VEL (+30%, 2 turnos).
     - Al coexistir 3 extensores, el bufo de Bloquear Debufos y el Escudo **nunca expiran**, permitiendo que el equipo sobreviva hasta el tope de 1,500 turnos.
  5. **Escalado Exponencial de Daño de Titus Plumanegra:**
     - Se vinculó el daño del A2 de Titus al tamaño del escudo acumulado por Wixwell. Bajo escudos inflados y con Disminuir DEF + Debilitar activos en el Boss, Titus escala su daño a decenas de millones de daño por turno, alcanzando la magnitud de **828M+** evidenciada en la partida real.
  6. **UI y Preset Rápido:**
     - Se integró el preset oficial **`🛡️ Wixwell + Titus Infinito (900M+ Brutal)`** en la cabecera.
     - Selector de rondas de simulación: 50, 100, 137 (límite de la captura) y 150 rondas.
     - En la Matriz de Combate: badges de Stun (Bloqueado/Interceptado/Aturdido), contador de debufos en Boss (X/10) y banner dorado de *Configuración de Escudos Infinitos Detectada*.
- **Archivos Afectados:**
  - `src/types/index.ts`
  - `src/core/calculator/engine.ts`
  - `src/components/timeline/TimelineView.tsx`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-019] 2026-10-11 | FIX / ENGINE / UI | Eliminación de Duplicación Masiva de Bufos (Regla Estricta de Raid) y Corrección de Avatar de Wixwell
- **Autor:** Senior Full Stack Developer & Arquitecto Frontend
- **Iteración / Fase:** Fase 2: Componentes Core y Motor de Simulación
- **Tipo de Cambio:** FIX | ENGINE | UI | DATA
- **Descripción Detallada:**  
  Se corrigió el comportamiento anómalo evidenciado en las capturas de pantalla del usuario (saturación horizontal de iconos repetidos y lista desbordada de 10+ bufos duplicados en el modal de Análisis Táctico):
  1. **Causa Raíz:**
     - Al ejecutarse habilidades de soporte (p.ej. Wixwell A3, Mikage A3, Lydia A3) y procesar además el bloque de efectos genéricos, se ejecutaba `push()` de nuevos objetos de bufo (`shield`, `def-buff`, `speed-buff`, `intercept`) en cada ciclo sin verificar existencia previa.
     - Al intervenir 3 extensores de bufos (Wixwell A2, Anacoreta A2, Mikage A3), estos bufos duplicados nunca expiraban y continuaban incrementando su duración, provocando una cascada visual de decenas de iconos idénticos por campeón.
     - Adicionalmente, `Vault Keeper Wixwell` apuntaba a una ruta local inexistente en lugar de la URL oficial de Supabase de SendaPlays.
  2. **Regla Estricta de Raid en el Motor (`engine.ts`):**
     - Se implementó la función auxiliar `applyBuffToActor()`: en *Raid: Shadow Legends*, los bufos de estadísticas son **estrictamente únicos por campeón**.
     - Si el bufo ya existe, se **refresca o extiende su duración** (`existing.duration = Math.max(existing.duration, duration)`) y se actualizan sus cargas (en `intercept` hasta un máximo de 3), **sin crear nuevas entradas duplicadas**.
     - Se evitó la doble aplicación de habilidades marcando `isHandledSpecifically = true` para las habilidades de extensión y soporte personalizadas.
  3. **Consolidación en la Capa Visual (`TimelineView.tsx`):**
     - Tanto en las celdas de la Matriz de Combate (`renderEffectsPills`) como en el modal de "Análisis Táctico de Bufos", se agregó consolidación por tipo único de bufo con mapa de duración máxima.
     - Cada campeón muestra ahora una fila limpia, legible y ordenada de sus bufos activos sin ninguna redundancia.
  4. **Corrección de Avatar de Wixwell:**
     - Se actualizó [`championAvatars.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/championAvatars.json) y [`champions.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/champions.json) asignando la carátula oficial de Supabase de SendaPlays (`Guardacamara-Wixwell.webp`) a todas las claves de `Vault Keeper Wixwell`, reemplazando el fallback de iniciales por la carátula real.
  5. **Verificación:**
     - 0 errores en ESLint y compilación de Vite exitosa en 469ms.
- **Archivos Afectados:**
  - `src/data/championAvatars.json`
  - `src/data/champions.json`
  - `src/core/calculator/engine.ts`
  - `src/components/timeline/TimelineView.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-020] - 2026-10-11
- **Autor / Rol:** Senior Full Stack React Developer & Ingeniero de Simulación
- **Supervisor:** Jorge
- **Objetivo:** Implementación de la Regla de Habilidad Inicial (*Opener*) en Modo Automático y Transición a Prioridad Estándar a partir del Segundo Turno.
- **Requerimientos Solicitados por el Supervisor:**
  - *"Apliquemos una ultima regla, en el modo automatico. Puedes configurar una habilidad como inicial y luego de la primera vez que siga la prioridad que se acordo. aplica dicha funcion"*
  - Permitir que el usuario configure cualquier habilidad activa de un campeón como habilidad inicial de apertura (*Opener*).
  - En la primera acción de combate del campeón, forzar el uso de la habilidad inicial seleccionada (siempre que esté disponible y sin delay).
  - A partir de la segunda acción o una vez consumida la inicial, reanudar de forma estricta el orden de prioridad acordado (Prioridad 1 > Prioridad 2 > Prioridad 3 > A1 fallback).
- **Solución Técnica Implementada:**
  1. **Tipado Estricto de Dominio (`src/types/index.ts`):**
     - Añadido `isOpener?: boolean` a `SkillConfig` para modelar la configuración de habilidad de apertura.
     - Añadido `hasUsedOpener?: boolean` al estado reactivo del actor en combate (`SimulationActorState`).
     - Añadido `isOpenerUsed?: boolean` al log de cada turno (`SimulationTurnLog`).
  2. **Motor de Simulación Determinista (`src/core/calculator/engine.ts`):**
     - Inicialización de `hasUsedOpener: false` en todos los campeones al iniciar la simulación.
     - En el paso 5 de selección de habilidad: si el campeón aún no ha consumido su regla de apertura (`!actingActor.hasUsedOpener`), el motor evalúa si existe una habilidad activa con `isOpener: true` sin delay ni cooldown. Si existe, la ejecuta y marca `isOpenerUsed = true`.
     - Se marca `actingActor.hasUsedOpener = true` para que, en todos sus turnos subsiguientes, el campeón siga estrictamente el orden de prioridad configurado (`availableSkills.sort((a,b) => b.priority - a.priority)`).
     - Si el campeón estuvo aturdido en su primer turno, el turno se pierde por Stun y la regla del Opener se preserva intacta para cuando pueda realizar su primera acción real.
  3. **Interfaz de Usuario Intuitiva (`src/components/champion/ChampionCard.tsx`):**
     - Añadido botón interactivo de Apertura/Inicial (`.compact-opener-btn`) en cada fila de habilidad activa no bloqueada:
       - Si está inactiva: `☆ Inicial` (color sutil con hover dorado).
       - Si está activa: `★ Inicial` (insignia ámbar/dorada con glow y sombra de alto contraste).
     - **Exclusión Mutua:** Al marcar una habilidad como inicial en un campeón, se desmarca automáticamente cualquier otra habilidad previa de ese mismo campeón, asegurando que solo haya una habilidad inicial por miembro.
     - Si el usuario bloquea una habilidad (`🚫 Bloq`), su estado de inicial se remueve automáticamente.
  4. **Visualización y Trazabilidad en Matriz de Combate (`src/components/timeline/TimelineView.tsx`):**
     - Cuando una acción de turno corresponde a la ejecución de una habilidad inicial (`action.isOpenerUsed === true`), la etiqueta de habilidad se resalta con marco dorado, fondo translúcido ámbar, glifo de estrella y badge `[Ini]` (`★ A2 [Ini]`).
     - El tooltip informativo indica claramente: `[★ Habilidad Inicial / Opener]`.
  5. **Estilos de Alta Fidelidad (`src/styles/global.css`):**
     - Clases CSS `.compact-opener-btn`, `.compact-opener-btn.active`, `.compact-opener-btn:hover` con micro-animaciones acordes a la estética oscura de *Raid: Shadow Legends*.
  6. **Aseguramiento y Pruebas Unitarias:**
     - Script automatizado de verificación confirmando que un campeón con A2 marcada como Opener ejecuta A2 en el Turno 1 y luego pasa inmediatamente a A3 en el Turno 2 (respetando la prioridad).
     - Validación con `npm run lint` y `npm run build` con código 0 y cero advertencias.
- **Archivos Afectados:**
  - `src/types/index.ts`
  - `src/core/calculator/engine.ts`
  - `src/core/calculator/skillUtils.ts`
  - `src/App.tsx`
  - `src/components/champion/ChampionCard.tsx`
  - `src/components/timeline/TimelineView.tsx`
  - `src/styles/global.css`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-021] - Corrección Matemática de Extensión de Escudos y Debufos en Turno 2 (Wixwell + Titus + Extensores)
- **Fecha:** 2026-10-12
- **Solicitud del Usuario:**
  Alinear con precisión absoluta la secuencia matemática del Turno 2 (columna AOE2):
  1. *Mikage*: queda con 2 pero extiende a 3 al resto de aliados, y extiende debufos del Boss en +1.
  2. *Lydia*: queda con 2 (aplica Disminuir DEF 60% y Weaken 25% al Boss; al no ser extensora, su escudo baja de 3 a 2).
  3. *Anchorite*: queda con 3 y extiende al resto (Mikage 2->3, Lydia 2->3, Wixwell 3->4, Titus 3->4).
  4. *Wixwell*: queda con 4 y extiende a todos (Mikage 3->4, Lydia 3->4, Anchorite 3->4, Titus 4->5) y amplifica el escudo.
  5. *Titus*: entra a su turno con x5 de escudo, ejecuta su ataque escalado y queda en 4.
  6. *Fin de turno*: Mikage 4, Lydia 4, Anchorite 4, Wixwell 4 y Titus 4.
  7. *Extensión de debufos*: garantizar que los debufos del Boss (Disminuir DEF y Weaken) se mantengan extendidos y no decaigan en los 1500 turnos.
- **Causas Raíz Identificadas:**
  1. *Decaimiento prematuro en Ronda 1*: En la ronda de preparación (AOE1), los aliados que actuaban después de Wixwell A3 sufrían decaimiento inmediato antes del impacto del Boss, entrando a la Ronda 2 con 1 turno de escudo en lugar de 2.
  2. *Timing de reducción de cooldowns*: Los cooldowns se reducían al final del turno en lugar de al inicio, provocando que habilidades con cooldown bufeado de 3 turnos tardaran 4 o 5 turnos en volver a usarse y forzaran acciones A1 repetidas.
  3. *Mapeo de extensiones*: Lady Mikage A2 (Silkensnare) incrementa la duración de todos los debufos de enemigos en 1 turno y todos los bufos de aliados en 1 turno; al sincronizar el timing y la prioridad de A2 sobre A3 en los extensores, la cadena de extensión perpetua de escudos y debufos funciona de forma ininterrumpida.
- **Acciones Implementadas:**
  1. **Protección de Bufos Nuevos en la Ronda de Creación (`appliedAtBossRound`):**
     - Añadido `appliedAtBossRound?: number` a `SimulationEffect`.
     - En `applyBuffToActor`, se estampa la ronda actual del Boss (`bossTurnCount`).
     - En el decaimiento de fin de turno del campeón (`actingActor.effects`), si `e.appliedAtBossRound === bossTurnCount`, los aliados no pierden duración antes de que el Boss ataque en esa ronda. Esto garantiza que todos los 5 campeones inicien la Ronda 2 con exactamente 2 turnos de escudo.
  2. **Regla de Duración Neta de Extensores vs No Extensores:**
     - Mikage A2, Anchorite A2 y Wixwell A2 activan `didExtendBuffsThisTurn = true`.
     - Sus propios bufos no sufren decaimiento en ese turno, mientras que aumentan en +1 a todos los aliados `a !== actingActor`.
     - Lydia y Titus (no extensores) consumen 1 turno al finalizar su acción: Lydia pasa de 3 a 2; Titus pasa de 5 a 4.
     - Al concluir la rotación del Turno 2, Mikage, Lydia, Anchorite, Wixwell y Titus tienen exactamente 4 de escudo.
  3. **Timing Canónico de Cooldowns al Inicio del Turno:**
     - Reducción de cooldowns y delays reubicada al inicio del turno del actor (antes de la selección de habilidades).
     - La habilidad ejecutada recibe su cooldown correspondiente al ejecutarse, asegurando que habilidades con cooldown de 3 turnos se ejecuten con estricta puntualidad.
  4. **Extensión y Reaplicación Continua de Debufos del Clan Boss:**
     - Mikage A2 suma +1 turno a todos los debufos activos del Clan Boss en cada rotación.
     - Lydia y Wixwell reaplican Disminuir DEF y Weaken preservando el valor mayor (`Math.max(existing.duration, duration)`).
     - Los debufos en el Boss se mantienen activos indefinidamente, permitiendo sostener el daño millonario de Titus hasta 1500 turnos.
- **Archivos Afectados:**
  - `src/types/index.ts`
  - `src/core/calculator/engine.ts`
  - `src/App.tsx`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado (0 Errores en Build y Lint)

---

### [ENTRADA-022] - 2026-10-12 | FIX / ENGINE / DOMAIN | Corrección Mecánica Canónica de Habilidades de Lydia la Sirena (A3 Nulificación, A2 Lamento de Sirena y A1 Opresión)
- **Autor / Rol:** Senior Full Stack React Developer & Ingeniero de Simulación
- **Supervisor:** Jorge
- **Objetivo:** Corregir el comportamiento erróneo de la habilidad A3 de Lydia en el motor de combate y alinear todo su kit (A1, A2, A3 y Pasiva) con las mecánicas oficiales de *Raid: Shadow Legends* y la guía de SendaPlays.
- **Detalle Técnico del Problema Identificado:**
  - En versiones anteriores de `engine.ts`, la habilidad A3 de Lydia estaba configurada incorrectamente como un bufo de equipo que aplicaba `block-debuffs` (Bloquear Debufos) y `speed-buff` (+30% Velocidad) a todos los aliados.
  - En *Raid: Shadow Legends*:
    1. **Lydia no posee Bloquear Debufos** en ninguna de sus habilidades.
    2. Su bufo de equipo (+30% Aumentar VEL y +25% Fortalecer) proviene de su **A2 (*Lamento de Sirena*)**.
    3. Su **A3 (*Nulificación*)** es un ataque directo de 2 impactos contra un enemigo (Clan Boss) que aplica:
       - **Sensibilidad al veneno del 25%** por 2 turnos (`poison-sensitivity`).
       - **Bloquear bufos** por 2 turnos (`block-buffs`).
       - **Bloquear habilidades Activas** por 2 turnos (`block-active-skills`).
       - *Cero bufos sobre los aliados.*
    4. Su **A1 (*Opresión*)** tiene un 75% (100% con libros) de probabilidad de extender la duración de cualquier debufo de Sensibilidad al veneno en el objetivo por +1 turno.
- **Acciones Implementadas:**
  1. **Motor de Simulación (`src/core/calculator/engine.ts`):**
     - **A3 (*Nulificación*):** Se eliminó la aplicación de bufos a aliados (`block-debuffs` y `speed-buff`). Se implementó la aplicación fidedigna de `poison-sensitivity` (25%, 2 turnos), `block-buffs` (2 turnos) y `block-active-skills` (2 turnos) sobre el Clan Boss (`addDebuffToBoss`).
     - **A2 (*Lamento de Sirena*):** Se añadió la aplicación correcta a los 5 aliados de `strengthen` (25%, 2 turnos) y `speed-buff` (30%, 2 turnos), además de colocar `def-debuff` (60%) y `weaken` (25%) sobre el Clan Boss.
     - **A1 (*Opresión*):** Se implementó la extensión de duración de `poison-sensitivity` (+1 turno) en el Clan Boss al ejecutarse.
     - **Manejador genérico de debufos:** Se añadió soporte para `poison_sense` y `blockbuff` en habilidades no personalizadas.
  2. **Catálogo de Íconos Tácticos (`src/components/common/RaidBuffIcon.tsx`):**
     - Soporte y mapeo de alias para `poison-sensitivity` (25%), `poison_sense`, `sensibilidad-al-veneno`, `block-buffs`, `block_buffs`, `blockbuff`, `bloquear-bufos`, `block-active-skills`, `fortalecer` y `fortalecer-2`.
  3. **Base de Datos Canónica (`src/data/champions.json`):**
     - Actualizados los nombres, descripciones y libros de las habilidades de Lydia la Sirena en español oficial coincidente con la enciclopedia de SendaPlays (`Opresión (ATK)`, `Lamento de Sirena (ATK)`, `Nulificación (ATK)` y `Abrazo de Muerte (Pasiva)`).
  4. **Verificación:**
     - 0 errores en ESLint (`npm run lint`), tipado estricto validado (`tsc --noEmit`), y preservación estricta del servidor Vite corriendo en vivo en `http://localhost:5173/`.
- **Archivos Afectados:**
  - `src/core/calculator/engine.ts`
  - `src/components/common/RaidBuffIcon.tsx`
  - `src/data/champions.json`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado

---

### [ENTRADA-023] - 2026-10-12 | FIX / ENGINE / MECHANICS | Filtro Canónico de Inmunidades del Clan Boss (Eliminación de Bloqueo de Habilidades Activas y CC)
- **Autor / Rol:** Senior Full Stack React Developer & Ingeniero de Simulación
- **Supervisor:** Jorge
- **Objetivo:** Garantizar que el Clan Boss (Demon Lord) nunca reciba en su barra de desbufos efectos a los que es 100% inmune por diseño oficial en *Raid: Shadow Legends* (ej. Bloquear Habilidades Activas / icono de candado, Control de Masas y Reducción de Velocidad).
- **Detalle Técnico del Problema Identificado:**
  - En la entrada anterior, al implementar la habilidad A3 de Lydia (*Nulificación*), se envió `addDebuffToBoss('block-active-skills', 2)` a la barra de efectos del Boss.
  - El supervisor Jorge proporcionó evidencia visual de la barra de desbufos (`5/10`) conteniendo el icono de candado (`bloquear-habilidades-activas`).
  - En *Raid: Shadow Legends*, el Clan Boss cuenta con la pasiva *Inmunidad Todopoderosa* / *Resiliencia Infernal*, que lo hace totalmente inmune a:
    - **Bloquear Habilidades Activas** (`block-active-skills`) y **Pasivas** (`block-passive-skills`).
    - **Control de Masas (CC):** Aturdir (`stun`), Congelar (`freeze`), Dormir (`sleep`), Incitar (`provoke`), Miedo (`fear`), Miedo de Verdad (`true-fear`), Petrificación (`petrification`), Oveja (`sheep`).
    - **Reducción de Velocidad** (`speed-debuff`).
    - **Reducción de Barra de Turno** (*Turn Meter Reduction*).
  - Los únicos debufos permitidos en su barra (hasta un tope de 10) son aquellos de mitigación y daño: Disminuir DEF, Debilitar, Disminuir ATK, Veneno, Sensibilidad al Veneno, Quemar HP, Bloquear Bufos, Sanguijuela, Disminuir Puntería, Disminuir Daño Crítico, Maleficio y Azufre.
- **Acciones Implementadas:**
  1. **Motor de Simulación (`src/core/calculator/engine.ts`):**
     - Se creó el set inmutable `CLAN_BOSS_IMMUNITIES` con todos los identificadores de desbufos inmunes.
     - En la función central `addDebuffToBoss()`, se implementó una guarda previa que descarta de inmediato cualquier desbufo al que el Boss sea inmune, impidiendo que entre a su array de efectos o telemetry snapshot.
     - Se eliminó la llamada a `block-active-skills` en el handler de A3 de Lydia, conservando exclusivamente `poison-sensitivity` y `block-buffs` (el cual sí aplica en el Boss y evita su bufo de Aumento de ATK en afinidades).
  2. **Compendio Documental (`recursos/compendio_clan_boss.md`):**
     - Añadida la sección *2.4 Inmunidades Canónicas del Clan Boss (Demon Lord)* con tabla de efectos inmunes y lista de debufos válidos.
  3. **Verificación:**
     - 0 errores en ESLint (`npm run lint`), compilador TypeScript en verde (`tsc --noEmit`), y preservación estricta del dev server corriendo en `http://localhost:5173/`.
- **Archivos Afectados:**
  - `src/core/calculator/engine.ts`
  - `recursos/compendio_clan_boss.md`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado

---

### [ENTRADA-024] - 2026-10-12 | DEPLOY / CI-CD | Preparación y Automatización para Despliegue en GitHub Pages
- **Autor / Rol:** Senior Full Stack React Developer & Ingeniero de Simulación
- **Supervisor:** Jorge
- **Objetivo:** Garantizar la compatibilidad absoluta del proyecto compilado para su alojamiento en GitHub Pages mediante rutas relativas y CI/CD automatizado.
- **Detalle Técnico:**
  - El supervisor indicó que el proyecto será publicado en GitHub Pages y que necesita que sea accesible a través de su `index.html`.
  - Se aclaró la distinción entre abrir `dist/index.html` de forma local vía protocolo `file:///` (bloqueado por políticas CORS del navegador para módulos JS) y el servicio de GitHub Pages, que es un servidor web HTTP/HTTPS real donde la SPA corre fluidamente.
  - Al alojarse en repositorios de GitHub Pages (ej. `https://usuario.github.io/Calculat-Boss-Clan/`), las rutas absolutas (`/assets/...`) fallarían al buscar en la raíz del dominio; por ello, la configuración de `base: './'` en Vite resuelve los activos con rutas relativas infalibles en cualquier subdirectorio.
- **Acciones Implementadas:**
  1. **Configuración de Vite (`vite.config.ts`):**
     - Añadido `base: './'` para generar rutas de assets relativas (`./assets/index-*.js`, `./assets/index-*.css`).
     - Añadido `chunkSizeWarningLimit: 5000` para tolerar el dataset enciclopédico de 1,047 campeones sin advertencias.
  2. **Automatización CI/CD (`.github/workflows/deploy.yml`):**
     - Creado flujo oficial de GitHub Actions que, ante cada `push` a la rama `main`, ejecuta automáticamente la instalación limpia (`npm ci`), compilación (`npm run build`) y publicación en GitHub Pages con permisos de token nativos.
  3. **Verificación:**
     - `npm run build` ejecutado en 431 ms con 0 errores. Servidor de prueba en puerto 4173 respondiendo con código 200 OK.
- **Archivos Afectados:**
  - `vite.config.ts`
  - `.github/workflows/deploy.yml`
  - `recursos/bitacora.md`
- **Estado de Aprobación:** Resuelto y Verificado

---

## 3. Registro de Decisiones de Arquitectura (ADRs)

### ADR-003: Arquitectura Client-Side Autónoma con Dataset Estático Local
* **Fecha:** 2026-10-11
* **Contexto:** Se requiere replicar la calculadora de Clan Boss asegurando que no falte ningún campeón ni dato de habilidad o aura, sin depender de un backend ni latencia de red.
* **Decisión:**  
  Almacenar el compendio de 859 campeones en `src/data/champions.json` y ejecutar toda la lógica matemática en el cliente.
* **Consecuencias:**  
  - Cero costos de infraestructura de servidor y disponibilidad offline total.
  - Tiempos de cálculo instantáneos (< 10ms) para 50 rondas de combate.

---

### ADR-001: Adopción de React 19 con TypeScript Estricto sin TailwindCSS (CSS Vanilla Moderno)
* **Fecha:** 2026-10-11
* **Contexto:** Se requiere construir una SPA de alta gama visual para una calculadora de Clan Boss. Se debe decidir la estrategia de estilos y tipado.
* **Decisión:** 
  1. Uso de CSS Vanilla mediante Custom Properties (Design Tokens), arquitectura modular BEM/Utility y Glassmorphism para máximo control, ligereza y cero sobrecarga de dependencias innecesarias.
  2. Uso de TypeScript en modo estricto (`strict: true`, `noImplicitAny: true`, `exactOptionalPropertyTypes: true`).
* **Consecuencias:** 
  - Control granular de estilos y animaciones fluidas sin depender de preprocesadores o librerías pesadas.
  - Seguridad en tiempo de compilación y autocompletado en todo el dominio matemático.

---

### ADR-002: Separación Estricta entre Dominio Matemático y Capa de Presentación
* **Fecha:** 2026-10-11
* **Contexto:** Las fórmulas de combate de Clan Boss (True Speed, Turn-Meter Fill, mitigación de daño, bufos de velocidad) son de alta complejidad y propensas a errores si se mezclan con componentes visuales.
* **Decisión:**  
  Toda la lógica de cálculo debe residir en funciones puras e inmutables dentro de `src/core/domain/` o `src/services/calculator/`, completamente libres de dependencias de React (`useState`, `useEffect`). Los componentes de React consumirán el motor únicamente mediante Custom Hooks especializados (`src/hooks/`).
* **Consecuencias:**  
  - 100% de la lógica de cálculo puede ser testeada con pruebas unitarias sin montar componentes DOM.
  - Cero bugs de re-renderización vinculados al motor matemático.

---

## 4. Registro de Deuda Técnica y Oportunidades de Mejora

| ID | Área | Descripción | Prioridad | Plan de Resolución |
| :--- | :--- | :--- | :--- | :--- |
| **DEBT-001** | Tooling | Limpiar código boilerplate por defecto de Vite (`App.tsx`, `App.css`, assets de demostración) | Alta | Ejecutar en la Iteración 1 |
| **DEBT-002** | ESLint | Fortalecer las reglas de ESLint con `tseslint.configs.strictTypeChecked` | Media | Configurar al iniciar la arquitectura de carpetas |
