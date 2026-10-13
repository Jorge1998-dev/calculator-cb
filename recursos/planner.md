# 📋 PLANNER DE PROYECTO: CALCULAT-BOSS-CLAN (SPA)
> **Documento de Alineación Estratégica y Seguimiento con el Supervisor**  
> **Supervisor / Stakeholder:** Jorge  
> **Rol Técnico:** Senior Full Stack React Developer & Arquitecto Frontend  
> **Estado:** Fase 0 — Planificación, Estandarización y Setup Arquitectónico  
> **Última Actualización:** 2026-10-11  

---

## 1. Visión General del Proyecto

**Calculat-Boss-Clan** es una Single Page Application (SPA) de alto rendimiento orientada a la simulación, cálculo matemático de daño, optimización de velocidad (*speed tuning*), sincronización de turnos y configuración estratégica de equipos contra el Clan Boss.

### Objetivos Clave:
1. **Precisión Matemática Absoluta:** Motor de simulación determinista para turnos, buffs/debuffs, maestrías y multiplicadores de daño.
2. **Experiencia de Usuario Premium:** Interfaz oscura, moderna, responsiva, fluida (60 FPS estables) y libre de latencia percibida.
3. **Robustez y Resiliencia:** Arquitectura desacoplada, tipado estricto de punta a punta con TypeScript y cero errores en tiempo de ejecución.
4. **Persistencia y Portabilidad:** Guardado local seguro (LocalStorage / IndexedDB) y capacidad de exportar/importar composiciones de equipo (JSON).

---

## 2. Protocolo de Comunicación y Alineación con el Supervisor

Para asegurar la máxima transparencia, control de calidad y alineación técnica, se establecen las siguientes reglas de trabajo:

| Canal / Mecanismo | Frecuencia | Propósito | Responsable |
| :--- | :--- | :--- | :--- |
| **Revisión de Planner** | Al inicio y fin de cada iteración | Validar objetivos, alcance y fechas compromiso | Supervisor & Dev Senior |
| **Sincronización de Bitácora** | En cada cambio funcional o técnico | Registrar justificación, impacto y archivos modificados | Dev Senior |
| **Revisión de Código / Gate QA** | Antes de integrar a la rama principal | Validar cumplimiento de estándares React y TypeScript | Supervisor (Aprobación) |
| **Checkpoints de Bloqueo** | Inmediato ante impedimentos | Escalar riesgos técnicos o decisiones de negocio | Dev Senior |

---

## 3. Matriz RACI del Proyecto

* **R (Responsible):** Desarrollador Senior Full Stack (ejecución, arquitectura, testing).
* **A (Accountable):** Jorge (Supervisor - aprobación final de requisitos, alcance y entregas).
* **C (Consulted):** Guías oficiales de React, estándares comunitarios y reglas del juego.
* **I (Informed):** Registro en Bitácora para trazabilidad permanente.

---

## 4. Hoja de Ruta (Roadmap Global)

```
[Fase 0: Cimientos, Dominio y Dataset] (COMPLETADA)
  ├── Estructura documental (/recursos/)
  ├── Compendio enciclopédico de Clan Boss (recursos/compendio_clan_boss.md)
  ├── Base de datos canónica de 1,047 campeones (src/data/champions.json)
  ├── Catálogo maestro de 48 sets de artefactos (src/data/artifacts.json)
  ├── Ingeniería inversa de fórmulas de True Speed y ticks de 0.07
  └── Definición de estándares React 19 & TypeScript Estricto
          ↓
[Fase 1: Dominio y Motor de Simulación] (COMPLETADA)
  ├── Modelos de datos estrictos en TypeScript (src/types/index.ts)
  ├── Motor matemático de ticks deterministas (src/core/calculator/engine.ts)
  ├── Simulación reactiva de 50 turnos de Clan Boss (AOE1, AOE2, STUN)
  └── Mitigación de daño y cálculo de durabilidad de escudos
          ↓
[Fase 2: Arquitectura de Componentes & Design System] (COMPLETADA)
  ├── Tokens visuales en CSS Vanilla (src/styles/tokens.css, global.css)
  ├── Tarjetas de campeón con colores de slot (Azul, Morado, Verde, Amarillo, Naranja)
  ├── Línea de tiempo visual agrupada por rondas y fases del Boss
  └── Panel de previsión con True Speed, DEF Efectiva, Mitigación y Factor Escudo
          ↓
[Fase 3: Flexibilidad Táctica y Personalización por el Usuario] (COMPLETADA)
  ├── Auras de Líder totalmente editables (Velocidad % y Defensa %) con presets rápidos
  ├── Estadísticas Base y Totales editables por campeón (Base SPD, Total SPD, Base DEF, Total DEF)
  ├── Soporte para conjuntos vacíos / none ("Piezas sueltas / Sin Set Cuadrado")
  ├── Botón de acción rápida para vaciar sets
  ├── Selector de dificultades UNM, NM, Brutal, Hard, Normal, Easy y afinidades
  └── Carga de presets meta (Myth-Heir 3:1, Bateater 2:1) y persistencia en LocalStorage
          ↓
[Fase 4: Optimización, QA Extremo y Despliegue]
  ├── Performance profiling (Lighthouse, Core Web Vitals)
  ├── Auditoría de accesibilidad (WCAG AA)
  └── Entrega de versión v1.0.0
```

---

## 5. Criterios de Aceptación Globales (Definition of Done de la SPA)

- [ ] **Rendimiento:** Cálculos reactivos con respuesta en `< 16ms` (sin bloquear el hilo principal).
- [ ] **Calidad de Código:** Cero errores de ESLint, cero warnings, cero tipos `any` en TypeScript.
- [ ] **Diseño Visual:** Interfaz de estética gamer/táctica premium, tipografía moderna, paleta de colores curada y micro-animaciones funcionales.
- [ ] **Responsive Design:** 100% adaptable para Desktop, Tablet y Mobile sin solapamientos ni desbordamientos horizontales.
- [ ] **Manejo de Estados de Error:** Error boundaries granulares y validaciones de entrada con feedback inmediato para el usuario.
- [ ] **Trazabilidad:** Todo cambio registrado minuciosamente en `recursos/bitacora.md`.

---

## 6. Registro de Riesgos y Planes de Mitigación

| Riesgo Identificado | Severidad | Mitigación Planificada |
| :--- | :--- | :--- |
| Complejidad en la sincronización de turnos por fracciones de velocidad (*true speed*) | Alta | Aislar el cálculo en un módulo matemático puro desacoplado de React con pruebas unitarias exhaustivas. |
| Re-renderizados excesivos al modificar stats de un campeón en tiempo real | Media | Uso de estado estructurado, selectores atómicos y derivación de cálculos con `useDeferredValue` o memoización selectiva. |
| Pérdida de configuraciones de usuario en recargas | Baja | Capa de persistencia automática en `localStorage` con validación de esquema para evitar corrupción de datos. |

---

## 7. Próximos Pasos Inmediatos para Revisión con el Supervisor
1. Validación por parte de Jorge del compendio de Clan Boss y dataset local de 859 campeones (`recursos/compendio_clan_boss.md` y `src/data/champions.json`).
2. Aprobación de la estructura de carpetas sugerida para `src/`.
3. Kick-off formal de la **Iteración 1: Limpieza de boilerplate, Arquitectura de Carpetas y Design System Base en CSS Vanilla**.
