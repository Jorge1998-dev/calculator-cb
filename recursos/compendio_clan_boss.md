# 🐉 COMPENDIO ENCICLOPÉDICO Y MOTOR DE CLAN BOSS
> **Proyecto:** Calculat-Boss-Clan (SPA)  
> **Propósito:** Registro técnico, matemático, estratégico y enciclopédico de *Raid: Shadow Legends* enfocado en maximizar el daño y dominar el Clan Boss.  
> **Supervisor:** Jorge  
> **Líder Técnico:** Senior Full Stack React Developer & Arquitecto Frontend  
> **Fuentes de Verificación:** DeadwoodJedi (mecanismo base), HellHades, Ayumilove, SendaPlays y Data Mining del motor del juego.  

---

## 1. Arquitectura y Almacenamiento Local (Cero Backend Externo)

Cumpliendo con la directiva arquitectónica del supervisor (**cero backend externo; todos los recursos embebidos en el cliente**), la SPA aloja directamente:
* **Base de datos íntegra de Campeones:** Archivo local `src/data/champions.json` con los **1,047 campeones oficiales** clasificados en 6 rarezas con sus marcos cromáticos tácticos:
  * **Míticos:** 34 campeones *(Marco Rojo brillante / Animado)*
  * **Legendarios:** 395 campeones *(Marco Dorado)*
  * **Épicos:** 297 campeones *(Marco Morado)*
  * **Raros:** 230 campeones *(Marco Azul)*
  * **Poco comunes:** 72 campeones *(Marco Verde)*
  * **Comunes:** 19 campeones *(Marco Gris)*
  * **Total auditado:** **1,047 campeones** con estadísticas base ($HP$, $ATK$, $DEF$, $SPD$, $C.RATE$, $C.DMG$, $RES$, $ACC$), habilidades detalladas ($A1$, $A2$, $A3$, $A4$, Pasivas), enfriamientos (*base* y *booked*), daño de escala, efectos lógicos y auras.
* **Motor de Simulación Determinista:** Cálculo en el hilo del cliente (Web Worker / motor TypeScript puro) para generar los 50 turnos de combate en `< 10ms`.

---

## 2. Anatomía y Mecánicas del Clan Boss (Señor del Clan)

### 2.1 Dificultades y Velocidades Base del Clan Boss
El Clan Boss tiene valores de velocidad absolutos según su dificultad:

| Dificultad | Velocidad Base ($SPD$) | Turno Límite Soft/Hard | Vida Total | Daño para Cofre Máximo |
| :--- | :---: | :---: | :---: | :---: |
| **Ultra-Nightmare (UNM)** | **190.00** | Turno 20 / Turno 50 | ~1,080,000,000 | 70.37M (1 Llave) |
| **Nightmare (NM)** | **170.00** | Turno 20 / Turno 50 | ~537,000,000 | 39.14M (1 Llave) |
| **Brutal** | **160.00** | Turno 20 / Turno 50 | ~268,000,000 | 21.90M (1 Llave) |
| **Hard** | **140.00** | Turno 20 / Turno 50 | ~134,000,000 | 11.51M (1 Llave) |
| **Normal** | **130.00** | Turno 20 / Turno 50 | ~67,000,000 | 6.42M (1 Llave) |
| **Easy** | **90.00** | Turno 20 / Turno 50 | ~33,000,000 | 2.76M (1 Llave) |

---

### 2.2 Rotación de Habilidades del Clan Boss (Ciclo de 3 Turnos)
El Clan Boss ejecuta un ciclo cerrado que se repite cada 3 turnos:

```
[Turno 1: AOE 1] ───► [Turno 2: AOE 2] ───► [Turno 3: STUN (Monotarget)] ───► [Repetición]
```

#### Habilidades del Clan Boss por Afinidad:

1. **Golpe de Aturdimiento / STUN (A1 - *Crushing Force*):**
   * **Objetivo:** 1 solo campeón (prioriza campeones según afinidad contraria, ausencia de bufo de defensa o falta de escudo, o líder si no hay diferencias).
   * **Efecto:** Aplica Aturdimiento (*Stun*) por 1 turno. Si no se bloquea o limpia, el campeón pierde su turno y no reduce los tiempos de enfriamiento de sus habilidades.

2. **Primer Ataque de Área / AOE 1 (A3):**
   * **Vacío (Void):** *Dark Nova* (daño puro a todo el equipo, sin desbufo adicional).
   * **Espíritu (Spirit):** *Numbing Fear* (aplica **Reducción de Velocidad del 15%** por 2 turnos a todo el equipo — *Causa #1 de desincronización si no hay Bloquear Desbufos*).
   * **Fuerza (Force):** *Belittle* (aplica **Reducción de Ataque del 25%** por 2 turnos a todo el equipo).
   * **Magia (Magic):** *Swirling Darkness* (aplica **Reducción de Puntería del 25%** por 2 turnos a todo el equipo).

3. **Segundo Ataque de Área / AOE 2 (A2):**
   * **Vacío (Void):** *Dark Nova* (aplica 1 o 2 **Venenos del 2.5%** por 2 turnos a todo el equipo).
   * **Afinidades (Spirit/Force/Magic):** *Crash Through* (se coloca a sí mismo un bufo de **Aumento de Ataque del 25%** por 2 turnos).

---

### 2.3 Mecánica de Furia (Soft Enrage & Hard Enrage)
* **Turno 1 al 20:** El daño escala suavemente por cada turno completado.
* **Turno 20 al 49 (Soft Enrage):** El daño escala exponencialmente e ignora un porcentaje creciente de defensa.
* **Turno 50 (Hard Enrage):** El Clan Boss obtiene ataque infinito, **ignora Bloquear Daño e Inmortal** y aniquila inmediatamente a cualquier composición.

---

### 2.4 Inmunidades Canónicas del Clan Boss (Demon Lord)
Por diseño intrínseco de *Raid: Shadow Legends* (Habilidades pasivas *Resiliencia Infernal* e *Inmunidad Todopoderosa*), el Clan Boss posee inmunidades absolutas que **nunca pueden ser superadas por Puntería**:

| Categoría | Efectos Inmunes (NO pueden colocarse en el Boss) |
| :--- | :--- |
| **Control de Masas (CC)** | Aturdimiento (*Stun*), Congelar (*Freeze*), Dormir (*Sleep*), Incitar (*Provoke*), Miedo (*Fear*), Miedo de Verdad (*True Fear*), Petrificación (*Petrification*), Oveja (*Sheep*). |
| **Bloqueo de Habilidades** | **Bloquear Habilidades Activas** (*Block Active Skills*), **Bloquear Habilidades Pasivas** (*Block Passive Skills*). *(Aparece "INMUNE" al intentar aplicarlo)*. |
| **Manipulación de Velocidad/TM**| **Reducir Velocidad** (*Decrease SPD* / -15% o -30%), **Reducción de Barra de Turno** (*Turn Meter Reduction*). La velocidad y progresión de turnos del Clan Boss son matemáticamente inalterables. |
| **Mecánicas de Vida** | Reducción de HP Máximo (*Destroy MAX HP*), Intercambio/Balanceo de HP (*HP Exchange*), Muerte Instantánea. |

#### ✅ Debufos que SÍ se pueden colocar en el Clan Boss (Límite: 10 simultáneos):
* **Disminuir Defensa 60% / 30%** (`def-debuff`)
* **Debilitar 25% / 15%** (`weaken`)
* **Disminuir Ataque 50% / 25%** (`atk-debuff`)
* **Sensibilidad al Veneno 25% / 50%** (`poison-sensitivity`)
* **Venenos 5% / 2.5%** (`poison`)
* **Quemar HP** (`hp-burn`)
* **Bloquear Bufos** (`block-buffs`) *(Evita que el Boss se coloque Aumento de Ataque en afinidades)*
* **Sanguijuela / Chupar Vida** (`leech`)
* **Disminuir Puntería 50%** (`acc-debuff`)
* **Disminuir Daño Crítico 25%** / **Disminuir Prob. Crítica 30%**
* **Maleficio** (`hex`) y **Azufre** (`brimstone`)

---

## 3. El Motor Matemático de Turnos (*Speed Tuning Engine*)

### 3.1 La Fórmula de *True Speed* (Velocidad Verdadera)
En el juego, la velocidad mostrada en el perfil del campeón es un número redondeado, pero el motor interno maneja números de coma flotante exactos derivados de los sets de artefactos y la maestría *Lore of Steel*.

$$\text{TrueSpeed} = \Big( S_{\text{total}} - S_{\text{base}} - \text{round}(S_{\text{base}} \times L) - (\text{hasLore} ? \text{round}(S_{\text{base}} \times L \times 0.15) : 0) + S_{\text{base}} + (S_{\text{base}} \times L) + (\text{hasLore} ? S_{\text{base}} \times L \times 0.15 : 0) + \frac{\text{Aura}}{100} \times S_{\text{base}} + S_{\text{plano}} \Big) \times (1 + S_{\text{buff}})$$

Donde:
* $S_{\text{total}}$: Velocidad mostrada en el juego.
* $S_{\text{base}}$: Velocidad base nativa del campeón (a nivel 60).
* $L$: Porcentaje fraccionario exacto aportado por los sets equipados.
* $\text{hasLore}$: `true` si el campeón posee la maestría *Sabiduría del Mal* (+15% a bonus de sets básicos).
* $\text{Aura}$: Porcentaje del aura de velocidad del líder (solo auras activas en "Todas las batallas").
* $S_{\text{buff}}$: Multiplicador de bufo/desbufo de velocidad (+0.30 para bufo de 30%, -0.30 para desbufo de 30%).

#### Constantes de Precisión Binaria de Sets de Artefactos:
Para replicar con exactitud el comportamiento de punto flotante de 32 bits de Raid Shadow Legends:
* **Set de Velocidad (Speed):** $\frac{515396075}{4294967296} \approx 0.11999999988$ (12%)
* **Set de Percepción (Perception):** $\frac{214748364}{4294967296} \approx 0.04999999988$ (5%)
* **Set de Rapidez Furiosa (Swift Parry):** $\frac{773094113}{4294967296} \approx 0.17999999988$ (18%)
* **Set de Justiciero (Righteous):** $\frac{429496729}{4294967296} \approx 0.09999999988$ (10%)
* **Set de Protección (Protection):** $\frac{1030792151}{4294967296} \approx 0.23999999985$ (24%)

---

### 3.2 El Ciclo de Ticks y la Barra de Turno (*Turn Meter*)
El combate en Raid no es por turnos fijos; avanza mediante **Ticks** discretos de acción:

1. **Aumento en cada Tick:** En cada ciclo o tick de reloj del combate, la barra de turno de cada entidad (los 5 campeones y el Boss) se incrementa según su *True Speed*:
   $$\Delta \text{TurnMeter} = \text{TrueSpeed} \times 0.07$$
2. **Umbral de Turno ($\ge 100\%$):** Los ticks continúan acumulándose hasta que al menos una entidad alcanza o supera el 100% de Turn Meter (o umbral normalizado).
3. **Prioridad y Desempate:**
   * La entidad con el Turn Meter más alto toma el turno inmediatamente.
   * Si hay un empate perfecto de Turn Meter, la prioridad se define por el orden de ranura en el equipo:
     $$\text{Líder (Slot 0)} \longrightarrow \text{Slot 1} \longrightarrow \text{Slot 2} \longrightarrow \text{Slot 3} \longrightarrow \text{Slot 4} \longrightarrow \text{Clan Boss}$$
4. **Vaciado de Turn Meter:** Tras tomar su acción, el Turn Meter de la entidad vuelve a $0$ (o conserva el exceso si se trata de un corte específico).
5. **Turnos Extra:** Si una habilidad otorga "Turno Extra", la entidad actúa de nuevo de inmediato sin avanzar los ticks del combate ni permitir que otras entidades tomen turno.

---

### 3.3 Gestión y Expiración de Efectos (Bufos y Desbufos)
* **Reducción de duración al inicio de turno (`turn-start`):** Habilidades defensivas y de supervivencia reducen su contador al iniciar el turno del campeón.
* **Reducción de duración al final de turno (`turn-end`):** Desbufos y bufos ofensivos se descuentan tras finalizar la acción.
* **Límite de Desbufos:** El Clan Boss solo puede albergar un **máximo de 10 desbufos simultáneos**. Cualquier desbufo adicional aplicado cuando la barra está llena se pierde (falla).

---

## 4. Pilares de Maximización de Daño (Estrategia 1-Key UNM: 70.37M+)

Para lograr hacer 1-Key en Ultra Pesadilla (70.37 millones de daño en una sola llave), cada elemento debe estar milimétricamente ajustado:

### 4.1 Desbufos Esenciales en el Clan Boss (Uptime del 100%)
1. **Disminuir Ataque 50% (*Decrease ATK*):** Reduce el daño entrante a la mitad. Es obligatorio en cualquier composición no-inmortal para sobrevivir más allá del turno 20.
2. **Disminuir Defensa 60% (*Decrease DEF*):** Aumenta el daño de todos los ataques directos de tus campeones en aproximadamente un $+140\%$.
3. **Debilitar 25% (*Weaken*):** Multiplica todo el daño infligido al Boss (directo, Warmaster y Giant Slayer) en un $+25\%$.
4. **Venenos 5% (*Poison*):** Cada veneno de 5% inflige **50,000 de daño fijo** cada vez que el Clan Boss toma un turno en Ultra Pesadilla. Un escuadrón con 7 venenos activos genera $350,000$ por turno solo de veneno.
5. **Quemar HP (*HP Burn*):** Inflige **75,000 de daño fijo** por turno en Ultra Pesadilla.
6. **Sensibilidad a Veneno 25% (*Poison Sensitivity*):** Aumenta el daño de cada veneno de 50,000 a 62,500 por turno.

---

### 4.2 Maestrías Clave para Clan Boss
* **Maestro de la Guerra (*Warmaster*):**
  * 60% de probabilidad de infligir daño adicional equivalente al 4% del HP máximo del objetivo (tope de ~65,000 a 75,000 de daño por golpe en Boss).
  * Ideal para campeones con habilidades de 1 o 2 golpes por habilidad.
* **Matagigantes (*Giant Slayer*):**
  * 30% de probabilidad en cada impacto de infligir daño basado en el HP del Boss.
  * Obligatorio para campeones con habilidades de 3 o más impactos (ej: Fahrakin, Turvold, Ninja A1).
* **Sabiduría del Mal (*Lore of Steel*):**
  * Incrementa en un +15% los bonus de conjuntos de artefactos de 2 piezas (Velocidad, Vida, Defensa, Puntería, Percepción).
* **⚠️ Maestrías Prohibidas en Speed Tuning:**
  * *Ciclo de Venganza (Cycle of Revenge)*, *Respuesta Rápida (Rapid Response)*, *Celeridad Arcana (Arcane Celerity)*.
  * Estas maestrías añaden Turn Meter aleatorio cuando los aliados reciben golpes críticos o se expiran bufos, rompiendo inmediatamente la sincronización del equipo.

---

### 4.3 Bendiciones del Alma (*Blessings*) para Daño Extremo
* **Azufre (*Brimstone*):**
  * Al golpear, probabilidad de colocar el desbufo *Azufre (Smite)*. Cada vez que el Clan Boss lanza AOE1 o AOE2, recibe un impacto explosivo de **250,000 de daño directo**. Imprescindible para alcanzar el umbral de 1-Key.
* **Crueldad (*Cruelty*):**
  * Destruye de forma acumulativa hasta un **20% de la defensa plana del Clan Boss**, permitiendo que todo el daño de ataque y defensa escale drásticamente.
* **Toque Fantasma (*Phantom Touch*):**
  * Otorga una probabilidad en cada golpe de infligir daño extra escalado por el Ataque del campeón.
* **Presencia Dominante (*Commanding Presence*):**
  * Aumenta la potencia del aura del líder hasta en un 35%, elevando las auras de velocidad o ataque.

---

## 5. Arquetipos y Composiciones Meta de Clan Boss

### 5.1 Composiciones Inmortales / Bloquear Daño (*Unkillable & Block Damage*)
Permiten sobrevivir con certeza matemática hasta el turno 50:
1. **Myth-Heir (3:1 Demytha / 2:1 Escuadrón):**
   * *Núcleo:* Demytha (Bloquear Daño cada 3 turnos sincronizada), Heiress (Limpia el aturdimiento y desbufos del Boss en cada turno), Seeker (+30% Turn Meter y bufo de ATK en ciclo 2:1), Deacon Armstrong (Aura de velocidad, reducción de turn meter y aumento de velocidad).
   * *DPS:* Ninja, Geomancer, Gnut, o Dracomorph.
2. **Bateater (2:1 Inmortal Constante):**
   * *Núcleo:* Maneater x2 (Inmortal y Bloquear Desbufos alternado continuo), Seeker (acelerador 2:1), Pain Keeper (reductor de enfriamiento), DPS libre.
3. **Budget Unkillable:**
   * Maneater + Pain Keeper + "Stun Target" (campeón con stats bajos para absorber el golpe de aturdimiento con Inmortal activo).
4. **Tower / Warcaster:**
   * Roshcard the Tower (Bloquear Daño 2 turnos) + Warcaster / Santa.

### 5.2 Composición Escudo Infinito (*Infinity Shield*)
* *Núcleo:* Underpriest Brogni (escudos reflejantes gigantes que no caducan) + Krisk the Ageless / Sandlashed Survivor / Godseeker Aniri (extensores de bufos) + Corpulent Cadaver (daño que escala hasta decenas de millones con el valor del escudo).

### 5.3 Composición Tradicional de Mitigación Máxima (*Killable 2:1*)
* *Núcleo:* Doble Protección de Aliados (*Ally Protection*, ej: Toragi + Trumborr o Skullcrusher + Martyr), +60% Defensa, Fortalecer (+25% *Strengthen*), Disminuir Ataque permanente, y Sanación Continua / Sanguijuela (*Leech*).

---

## 6. Integración en la SPA Calculat-Boss-Clan

Toda la base descrita anteriormente constituye el motor del producto:
* **Frontend:** Panel interactivo de configuración de 5 campeones idéntico al estándar DeadwoodJedi con selector de 859 campeones con autocompletado y carga instantánea de stats/habilidades.
* **Timeline Grid:** Matriz visual interactiva donde cada fila/columna refleja las acciones de los 5 campeones intercaladas con AOE1, AOE2 y STUN del Boss.
* **Simulador Matemático Puro:** Motor en `src/core/calculator/engine.ts` que ejecuta el algoritmo canónico con soporte de auras, maestrías, bendiciones, sets y habilidades.
