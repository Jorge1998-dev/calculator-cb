# ⚛️ ESTÁNDARES Y MEJORES PRÁCTICAS REACT (GUÍA MAESTRA)
> **Proyecto:** Calculat-Boss-Clan (SPA)  
> **Versión de React:** React 19+ con TypeScript 6 & Vite  
> **Propósito:** Manual de ingeniería exhaustivo con las mejores prácticas, patrones de diseño, optimización de rendimiento y reglas de desarrollo para aplicaciones React modernas.  
> **Autor:** Senior Full Stack React Developer  
> **Supervisor:** Jorge  

---

## 1. Fundamentos de Arquitectura en React Moderno (React 19)

### 1.1 El Paradigma Declarativo y Funcional
En React, la interfaz de usuario es una **función pura del estado**:
$$\text{UI} = f(\text{State})$$
* **Determinismo:** Dados los mismos *props* y el mismo *estado*, un componente debe renderizar exactamente el mismo JSX.
* **Sin Mutación:** Nunca alteres variables externas ni objetos de estado directamente durante el renderizado.
* **Efectos Secundarios Fuera de Render:** Toda mutación, llamada a APIs, o interacción con el DOM imperativo pertenece a controladores de eventos (*event handlers*) o a `useEffect`.

### 1.2 Novedades Clave en React 19
1. **Soporte Nativo de `ref` como Prop:**  
   Ya no es necesario usar `forwardRef`. Los componentes funcionales pueden recibir `ref` directamente en sus props.
   ```tsx
   // En React 19:
   interface InputProps {
     label: string;
     ref?: React.Ref<HTMLInputElement>;
   }
   export function CustomInput({ label, ref, ...props }: InputProps) {
     return (
       <label>
         {label}
         <input ref={ref} {...props} />
       </label>
     );
   }
   ```
2. **Acciones y Formularios Asíncronos:**  
   React 19 introduce hooks como `useActionState` y `useOptimistic` para manejar transiciones de estado asíncronas sin necesidad de gestionar manualmente múltiples flags booleanos (`isLoading`, `isError`).
3. **Manejo de Promesas con `use()`:**  
   La API `use(promise)` permite leer recursos asíncronos directamente dentro de componentes y Suspense, simplificando la gestión de flujos de datos.

---

## 2. Estructura de Carpetas Escalable (Feature-Driven Architecture)

Para proyectos SPA de alta exigencia, se adopta una arquitectura modular basada en **Dominio / Funcionalidades**, que separa claramente la lógica pura de la UI:

```
src/
├── assets/                  # Imágenes, SVGs, íconos vectoriales
├── core/                    # DOMINIO PURO (Independiente de React)
│   ├── calculator/          # Motor matemático de velocidad y Clan Boss
│   │   ├── engine.ts        # Algoritmo de turnos y sincronización
│   │   ├── damage.ts        # Fórmulas de daño y mitigación
│   │   └── constants.ts     # Multiplicadores fijos, stats base del Boss
│   └── models/              # Tipos puros de negocio (Champion, Boss, Buff)
├── components/              # UI COMPONENTES COMPARTIDOS (Design System)
│   ├── ui/                  # Componentes atómicos (Button, Input, Card, Modal, Badge)
│   ├── layout/              # Header, Navbar, Footer, Container, Grid
│   └── feedback/            # Toast, Spinner, ErrorBoundary, Tooltip
├── features/                # MÓDULOS DE NEGOCIO / PANTALLAS
│   ├── champion-config/     # Configuración de los 5 campeones
│   │   ├── components/      # ChampionCard, ArtifactSelector, MasteryToggle
│   │   ├── hooks/           # useChampionConfig.ts
│   │   └── types.ts         # Tipos específicos del módulo
│   ├── timeline-simulator/  # Visualizador de turnos del combate
│   │   ├── components/      # TurnTable, SpeedGraph, DesyncAlert
│   │   └── hooks/           # useSimulationPlayback.ts
│   └── presets-manager/     # Guardar, importar y exportar equipos
├── hooks/                   # Custom Hooks globales (useLocalStorage, useDebounce, useMediaQuery)
├── styles/                  # Sistema de Estilos CSS Vanilla
│   ├── tokens.css           # Variables de color, espaciado, tipografía, sombras
│   ├── reset.css            # Normalización y reset moderno
│   └── global.css           # Clases utilitarias y estilos base de la SPA
├── types/                   # Definiciones TypeScript globales
└── utils/                   # Helpers genéricos (formateadores, validadores, math)
```

---

## 3. Principios de Diseño de Componentes (Clean Components)

### 3.1 Principio de Responsabilidad Única (SRP)
Un componente debe hacer **una sola cosa** y hacerla de forma excelente. Si un componente supera las 150-200 líneas, es un síntoma claro de que debe subdividirse en subcomponentes o delegar su lógica a un Custom Hook.

### 3.2 Patrón Contenedor y Presentación (Smart vs Dumb)
* **Presentacionales (Dumb):** Reciben datos vía `props` y emiten eventos vía callbacks (`onClick`, `onChange`). No conocen de dónde vienen los datos. Son fáciles de testear y reutilizar.
* **Contenedores (Smart):** Orquestan el estado, llaman a los Custom Hooks y pasan los datos a los componentes presentacionales.

### 3.3 Patrón Compound Components
Ideal para componentes con múltiples partes interconectadas (ej: un selector de dificultad del Clan Boss):

```tsx
// Ejemplo conceptual de Compound Component
<BossSelector value={selectedBoss} onChange={setSelectedBoss}>
  <BossSelector.Header title="Seleccionar Dificultad" />
  <BossSelector.Option difficulty="Nightmare" speed={170} />
  <BossSelector.Option difficulty="UltraNightmare" speed={190} />
</BossSelector>
```

---

## 4. Gestión de Estado: Reglas y Jerarquía

### 4.1 La Jerarquía de Estados
1. **Estado Local (`useState`, `useReducer`):** Para datos que solo conciernen a un componente (ej: campo de texto abierto/cerrado, hover).
2. **Estado Compartido de Módulo (Context API / Custom Hook):** Para compartir datos entre componentes hermanos sin *prop drilling* excesivo.
3. **Estado Global Persistente:** Configuración del equipo de 5 campeones guardada en `localStorage`.
4. **Estado de URL (Query Params):** Para compartir builds o simulaciones mediante un enlace reproducible.

### 4.2 La Regla de Oro: "Calcula en Render, No Sincronices Estados"
Un error común es duplicar datos en el estado y sincronizarlos con `useEffect`.

❌ **Anti-patrón (Sincronización innecesaria):**
```tsx
// MAL: Estado redundante y sincronización con useEffect
const [speed, setSpeed] = useState(100);
const [auraPercent, setAuraPercent] = useState(15);
const [effectiveSpeed, setEffectiveSpeed] = useState(115);

useEffect(() => {
  setEffectiveSpeed(speed * (1 + auraPercent / 100));
}, [speed, auraPercent]); // Provoca un segundo re-renderizado innecesario
```

✅ **Patrón Correcto (Estado derivado directo):**
```tsx
// BIEN: Cálculo durante el renderizado (sin efectos, sin lag, atómico)
const [speed, setSpeed] = useState(100);
const [auraPercent, setAuraPercent] = useState(15);

// Se calcula instantáneamente en el mismo ciclo de render
const effectiveSpeed = useMemo(() => {
  return calculateTrueSpeed(speed, auraPercent);
}, [speed, auraPercent]);
```

---

## 5. El Uso Riguroso de Hooks y Prevención de Anti-Patrones

### 5.1 Anatomía Correcta de `useEffect`
* **Cuándo USAR `useEffect`:**
  - Suscribirse a un evento global del navegador (`window.addEventListener('resize', ...)`).
  - Integrarse con APIs de terceros no-React o APIs del DOM nativo (ej: `IntersectionObserver`, `canvas`).
  - Sincronizar un timer o animación imperativa.
* **Cuándo NO USAR `useEffect`:**
  - Para transformar datos de un prop o estado (hazlo en el cuerpo del componente).
  - Para responder a acciones del usuario (hazlo en el manejador del evento, ej: `onClick`).
* **Siempre retornar Cleanup:**
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  window.addEventListener('keydown', handleKeyDown);
  
  // Cleanup obligatorio para prevenir fugas de memoria
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [onClose]);
```

### 5.2 Optimización con `useMemo` y `useCallback`
* **No sobre-optimizar:** Operaciones elementales (sumar dos números, concatenar un string) no deben envolverse en `useMemo` porque la sobrecarga del hook supera el costo del cálculo.
* **Cuándo son indispensables:**
  1. Simulaciones pesadas del motor matemático (ej: calcular 50 turnos de combate entre 6 entidades).
  2. Estabilidad de referencias de objetos o funciones pasadas como dependencias a otros hooks o a componentes envueltos en `React.memo`.

### 5.3 Concurrencia con `useTransition` y `useDeferredValue`
En una calculadora compleja, modificar un slider de velocidad no debe congelar la escritura del usuario.
```tsx
import { useState, useDeferredValue } from 'react';

export function SpeedSimulator() {
  const [speedInput, setSpeedInput] = useState(200);
  // Valor diferido para cálculos intensivos sin bloquear la interacción del input
  const deferredSpeed = useDeferredValue(speedInput);
  
  // La UI de entrada responde a 60 FPS, mientras la simulación pesada procesa deferredSpeed
  const simulationResults = useMemo(() => {
    return runHeavyClanBossSimulation(deferredSpeed);
  }, [deferredSpeed]);

  return (
    <div>
      <input 
        type="range" 
        value={speedInput} 
        onChange={(e) => setSpeedInput(Number(e.target.value))} 
      />
      <TimelineView results={simulationResults} />
    </div>
  );
}
```

---

## 6. TypeScript Avanzado Aplicado a React

### 6.1 Tipado Estricto de Componentes y Props
```tsx
import React, { type ComponentPropsWithoutRef, type ReactNode } from 'react';

// Props con extensión de atributos HTML estándar
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  disabled,
  className = '',
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || isLoading}
      {...restProps}
    >
      {isLoading ? <span className="spinner" aria-hidden="true" /> : leftIcon}
      <span>{children}</span>
    </button>
  );
}
```

### 6.2 Estados Discriminados (Discriminated Unions)
Modelar estados asíncronos mediante tipos mutuamente excluyentes previene estados imposibles (como tener `isLoading: true` y `data: validData` simultáneamente):

```tsx
export type SimulationState =
  | { status: 'idle' }
  | { status: 'calculating'; progress: number }
  | { status: 'success'; timeline: BattleRound[]; desyncTurn: number | null }
  | { status: 'error'; message: string; code: 'INVALID_SPEED' | 'MISSING_CHAMPION' };
```

---

## 7. Directrices de Rendimiento y Rendering en SPA

1. **Evitar Funciones Inline en Bucles Extensos:**  
   Al renderizar tablas de 50 o 100 turnos, no declarar funciones anónimas dentro de cada celda.
2. **Claves de Lista (`key`) Estables y Únicas:**  
   Nunca usar el índice del array (`index`) como `key` si los elementos se reordenan, filtran o eliminan. Utilizar un identificador único persistente (ej: `turn.id` o `champion.uuid`).
3. **Lazy Loading de Vistas Complejas:**  
   Utilizar `React.lazy` y `Suspense` para dividir vistas de análisis pesadas (como gráficos o exportadores masivos) y reducir el tiempo de carga inicial (*First Contentful Paint*).
4. **Respetar el Budget de Render (16.6ms):**  
   Cualquier cálculo síncrono que tome más de 16 milisegundos degradará la fluidez visual a menos de 60 FPS.

---

## 8. Accesibilidad (a11y) y Estándares Web

* **Navegación por Teclado:** Todo control interactivo (`button`, `input`, `select`) debe ser accesible vía `Tab` y accionable con `Enter` o `Espacio`.
* **Roles ARIA y Etiquetas:**
  - Los campos de entrada numéricos deben contar con su `<label htmlFor="...">`.
  - Iconos puramente decorativos deben llevar `aria-hidden="true"`.
  - Alertas dinámicas de error o desincronización deben incluir `role="alert"` y `aria-live="polite"`.
* **Contraste de Color:** La paleta oscura de la SPA debe garantizar un ratio de contraste mínimo de `4.5:1` para texto estándar respecto al fondo (WCAG 2.1 Nivel AA).

---

## 9. Checklist de Autocontrol del Desarrollador (React Quality Gate)

Antes de considerar que un componente o funcionalidad está completa, verificar:
- [ ] ¿El componente tiene una única responsabilidad?
- [ ] ¿Los nombres de props y funciones revelan claramente su intención?
- [ ] ¿El estado es mínimo y los datos dependientes son calculados/derivados?
- [ ] ¿Se manejaron los estados vacíos, de carga y de error (*Empty, Loading, Error states*)?
- [ ] ¿No existen tipos `any` ni aserciones inseguras (`as unknown as Type`)?
- [ ] ¿Los efectos secundarios tienen su correspondiente limpieza (*cleanup*)?
- [ ] ¿El renderizado no bloquea la interactividad en dispositivos de gama media?
- [ ] ¿Cumple con el diseño visual oscuro, moderno y responsivo acordado?
