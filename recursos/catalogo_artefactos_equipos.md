# 🛡️ CATÁLOGO MAESTRO DE EQUIPAMIENTO Y ARTEFACTOS
> **Proyecto:** Calculat-Boss-Clan (SPA)  
> **Propósito:** Catálogo exhaustivo de todas las piezas, ranuras, conjuntos de artefactos, accesorios especiales y su impacto matemático en la simulación del Clan Boss.  
> **Supervisor:** Jorge  
> **Líder Técnico:** Senior Full Stack React Developer & Arquitecto Frontend  
> **Dataset Local Programático:** [`src/data/artifacts.json`](file:///c:/Users/jorge/Documents/Calculadora%20CB/Calculat-Boss-Clan/src/data/artifacts.json)  

---

## 1. Las 9 Ranuras de Equipamiento en *Raid: Shadow Legends*

Cada campeón puede equipar exactamente **6 Artefactos** y **3 Accesorios**:

```
        ARTEFACTOS (6 RANURAS)                    ACCESORIOS (3 RANURAS)
┌──────────────┬──────────────┬──────────────┐   ┌──────────────┬──────────────┬──────────────┐
│  1. ARMA     │  2. CASCO    │  3. ESCUDO   │   │  7. ANILLO   │  8. AMULETO  │ 9. ESTANDARTE│
│ (Fila Sup.)  │ (Fila Sup.)  │ (Fila Sup.)  │   │  (Joya 1)    │  (Joya 2)    │  (Joya 3)    │
├──────────────┼──────────────┼──────────────┤   └──────────────┴──────────────┴──────────────┘
│  4. GUANTES  │  5. PECHERA  │  6. BOTAS    │
│ (Fila Inf.)  │ (Fila Inf.)  │ (Fila Inf.)  │
└──────────────┴──────────────┴──────────────┘
```

### 1.1 Estadísticas Principales (*Main Stats*) y Secundarias (*Substats*) por Ranura

| Ranura | Estadística Principal Fija | Estadísticas Principales Variables | Estadísticas Secundarias Posibles (*Substats*) | Relevancia en Clan Boss |
| :--- | :--- | :--- | :--- | :--- |
| **1. Arma (*Weapon*)** | **Ataque Plano ($ATK$)** | Ninguna (Siempre $ATK$ plano) | $HP\%$, $DEF\%$, $SPD$, $C.RATE$, $C.DMG$, $ACC$, $RES$ *(No puede tener DEF plana)* | Substats de $SPD$, $C.RATE$ y $DEF\%$. |
| **2. Casco (*Helmet*)** | **Vida Plana ($HP$)** | Ninguna (Siempre $HP$ plana) | $ATK\%$, $DEF\%$, $SPD$, $C.RATE$, $C.DMG$, $ACC$, $RES$ *(No puede tener HP plana)* | Substats de $SPD$, $C.RATE$ y $ACC$. |
| **3. Escudo (*Shield*)** | **Defensa Plana ($DEF$)** | Ninguna (Siempre $DEF$ plana) | $HP\%$, $ATK\%$, $SPD$, $C.RATE$, $C.DMG$, $ACC$, $RES$ *(No puede tener ATK plano)* | Substats de $SPD$, $HP\%$ y $ACC$. |
| **4. Guantes (*Gauntlets*)** | Variable | **$DEF\%$, $HP\%$, $C.DMG\%$, $C.RATE\%$**, $ATK\%$, $HP$, $DEF$, $ATK$ | Todas excepto la estadística principal activa | $DEF\%$ o $HP\%$ para tanques; $C.DMG\%$ o $C.RATE\%$ para DPS. |
| **5. Pechera (*Chestplate*)** | Variable | **$DEF\%$, $HP\%$, $ACC$**, $ATK\%$, $RES$, $HP$, $DEF$, $ATK$ | Todas excepto la estadística principal activa | $DEF\%$ o $HP\%$ para supervivencia; $ACC$ para debuffers. |
| **6. Botas (*Boots*)** | Variable | **$SPD$ (Velocidad Plana)**, $DEF\%$, $HP\%$, $ATK\%$, $HP$, $DEF$, $ATK$ | Todas excepto la estadística principal activa | **$SPD$ OBLIGATORIA (35-45 SPD)** para speed tuning. |
| **7. Anillo (*Ring*)** | Variable | $HP$, $DEF$, $ATK$ (Valores Planos) | $HP\%$, $DEF\%$, $ATK\%$, $HP$, $DEF$, $ATK$ | $DEF\%$ y $HP\%$ para aumentar mitigación. |
| **8. Amuleto (*Amulet*)** | Variable | **$C.DMG\%$**, $HP$, $DEF$, $ATK$ | $ACC$, $RES$, $HP\%$, $DEF\%$, $ATK\%$, $HP$, $DEF$, $ATK$ | $C.DMG\%$ para nukers; $HP/DEF$ para tanques. |
| **9. Estandarte (*Banner*)** | Variable | **$ACC$ (Puntería)**, $RES$, $HP$, $DEF$, $ATK$ | **$SPD$**, $HP\%$, $DEF\%$, $ATK\%$, $HP$, $DEF$, $ATK$ | **$ACC$ con Substat de $SPD$** es la pieza más codiciada. |

---

## 2. Clasificación Completa de Conjuntos de Artefactos

### 2.1 Conjuntos Básicos de 2 Piezas (*Afectados por Sabiduría del Mal / Lore of Steel +15%*)

Estos conjuntos aumentan las estadísticas base del campeón. Cuando el campeón tiene la maestría **Sabiduría del Mal (*Lore of Steel*)**, el porcentaje que otorgan se multiplica por un factor de $+15\%$:

$$\text{BonusEfectivo} = \text{BonusBase} \times 1.15$$

| Conjunto | Piezas | Bono Base | Con *Lore of Steel* | Tier en Clan Boss | Impacto Estratégico en Clan Boss |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Velocidad (*Speed*)** | 2 | **+12% SPD** | **+13.8% SPD** | **SSS** | **El conjunto angular del juego.** Permite calibrar las velocidades exactas al decimal. |
| **Percepción (*Perception*)** | 2 | **+5% SPD / +40 ACC** | **+5.75% SPD / +46 ACC** | **SSS** | **El mejor set de forja.** Otorga velocidad y resuelve la puntería requerida (220-250 ACC). |
| **Justiciero (*Righteous*)** | 2 | **+10% SPD / +40 RES** | **+11.5% SPD / +46 RES** | **SSS** | Acelerador de élite casi idéntico al de velocidad con bono de resistencia. |
| **Defensa (*Defense*)** | 2 | **+15% DEF** | **+17.25% DEF** | **S** | Fundamental para alcanzar 3,500-4,200 DEF en composiciones killable. |
| **Desafiante (*Defiant*)** | 2 | **+10% DEF / -15% Daño AoE** | **+11.5% DEF / -15% AoE** | **SSS** | **Top Mitigación:** Reduce el daño recibido por AOE1 y AOE2 del Clan Boss. |
| **Vida (*Life*)** | 2 | **+15% HP** | **+17.25% HP** | **A** | Escala de salud para campeones que pegan por HP y supervivencia general. |
| **Puntería (*Accuracy*)** | 2 | **+40 ACC** | **+46 ACC** | **S** | Garantiza la aplicación infalible de desbufos en UNM. |
| **Cruel (*Cruel*)** | 2 | **+15% ATK / Ignora 5% DEF** | **+17.25% ATK** | **SS** | Aumenta drásticamente el daño de campeones de ataque e ignora defensa. |
| **Inmortal (*Immortal*)** | 2 | **+15% HP / Cura 3% por turno** | **+17.25% HP** | **S** | Regeneración pasiva que alivia el trabajo del sanador. |
| **Golpe Mortal (*Killstroke*)** | 2 | **+20% C.DMG / +5% SPD** | **+23% C.DMG / +5.75% SPD** | **SS** | Combinación letal de velocidad y daño crítico. |
| **Prob. Crítico (*Crit Rate*)**| 2 | **+12% C.RATE** | **+13.8% C.RATE** | **A** | Asegura el 100% de tasa crítica para consistencia en cada golpe. |
| **Daño Crítico (*Crit DMG*)** | 2 | **+20% C.DMG** | **+23% C.DMG** | **A** | Multiplicador de daño masivo para nukers de daño directo. |
| **Resiliencia (*Resilience*)** | 2 | **+10% HP / +10% DEF** | **+11.5% HP / +11.5% DEF** | **S** | Híbrido defensivo de bajo costo de forja. |
| **Fatal (*Fatal*)** | 2 | **+10% ATK / +5% C.RATE** | **+11.5% ATK** | **A** | Eficiencia ofensiva para nukers. |
| **Entereza (*Fortitude*)** | 2 | **+40 RES / +10% DEF** | **+11.5% DEF** | **B** | Relleno defensivo secundario. |
| **Celo (*Zeal*)** | 2 | **+3% a +12% daño (por HP obj.)**| — | **A** | Multiplicador de daño plano. |

---

### 2.2 Conjuntos Divinos de 2 Piezas (*Afectados por Lore of Steel + Escudo Inicial*)

| Conjunto | Piezas | Beneficios | Con *Lore of Steel* | Tier en Clan Boss |
| :--- | :---: | :--- | :---: | :---: |
| **Velocidad Divina (*Divine Speed*)** | 2 | **+12% SPD / Escudo 15% HP por 3 turnos** | **+13.8% SPD** | **SSS** |
| **Vida Divina (*Divine Life*)** | 2 | **+15% HP / Escudo 15% HP por 3 turnos** | **+17.25% HP** | **A** |
| **Ataque Divino (*Divine Offense*)** | 2 | **+15% ATK / Escudo 15% HP por 3 turnos** | **+17.25% ATK** | **B** |
| **Prob. Crítico Divina (*Divine Crit*)**| 2 | **+12% C.RATE / Escudo 15% HP por 3 turnos**| **+13.8% C.RATE**| **A** |

---

### 2.3 Conjuntos de 4 Piezas (*NO afectados por Lore of Steel*)

| Conjunto | Beneficio Principal | Tier en Clan Boss | Rol y Utilidad Táctica en Clan Boss |
| :--- | :--- | :---: | :--- |
| **Incondicional (*Stalwart*)** | **-30% daño de área (AoE) recibido** | **SSS** | **La máxima protección en composiciones tradicionales:** El Boss golpea en área 2 de cada 3 turnos. Al reducir ese daño un 30%, permite alcanzar fácilmente el turno 50. |
| **Tóxico (*Toxic*)** | **50% prob. de aplicar Veneno 2.5% por 2 turnos** | **SSS** | **Motor pasivo de daño:** Cada campeón en set Tóxico genera múltiples venenos que infligen 25k-50k por tick sin necesidad de tener habilidades de veneno nativas. |
| **Robo de Vida (*Lifesteal*)**| **Cura el 30% del daño infligido** | **SS** | **El sostén clásico de Clan Boss:** En combinación con Warmaster/Giant Slayer (65k de daño proc), cada golpe restaura la barra de salud del campeón al 100%. |
| **Salvaje (*Savage*)** | **Ignora el 25% de la Defensa enemiga** | **SS** | Multiplicador de daño masivo para nukers en composiciones 1-Key Unkillable. |
| **Letal (*Lethal*)** | **+10% C.RATE e Ignora 25% de DEF** | **SSS** | Versión superior de Salvaje con bono de crítico integrado (Torre del Destino). |
| **Apoyo (*Bolster*)** | **+20% HP, Escudo protegido 30% y cura 10%/turno** | **SS** | Proporciona un escudo imposible de remover que absorbe los primeros embates del combate. |
| **Guardián (*Guardian*)** | **Absorbe 10% del daño de aliados y cura 10%/turno**| **SS** | Distribuye el daño mitigando la fragilidad de los aliados más débiles. |
| **Sed de Sangre (*Bloodthirst*)**| **+12% C.RATE, cura 30% daño y genera escudo** | **SS** | Evolución directa de Robo de Vida que no desperdicia la sobrecuración. |
| **Regeneración (*Regen*)** | **Cura el 15% de HP al inicio de cada turno** | **A** | Ideal para campeones de apoyo o mitigación pura que no hacen daño suficiente para curarse con Lifesteal. |
| **Furia (*Fury*)** | **Hasta +25% daño según el HP perdido** | **A** | Espectacular en composiciones Inmortales (*Unkillable*) donde los campeones luchan con 1 HP constante. |
| **Escudo (*Shield*)** | **Escudo del 30% del HP del portador por 3 turnos** | **A** | Estabiliza los primeros turnos del combate. |
| **Reflejos (*Reflex*)** | **40% prob. de reducir 1 turno de CD al azar** | **A (Condicional)**| Excelente en campeones con una única habilidad activa (ej: Demytha / Brogni), pero requiere ajuste en speed tune. |

---

### 2.4 Conjuntos Variables de 1 a 9 Piezas (*Míticos y Avanzados*)

| Conjunto | Piezas | Bonificaciones Acumulativas | Impacto en Calculadora Clan Boss |
| :--- | :---: | :--- | :--- |
| **Protección (*Protection*)** | **1 a 9** | • **2 pcs:** **+12% SPD** (constante fraccionario)<br>• **5 pcs:** **+12% SPD adicional (Total: +24% SPD)**<br>• **Protege bufos** con hasta 100% de probabilidad (4, 6 y 9 pcs). | **CRÍTICO PARA SPEED TUNE:** Permite alcanzar hasta +24% de velocidad pasiva y evita que el Boss o desincronías remuevan bufos vitales. |
| **Supersónico (*Supersonic*)** | **1 a 9** | • **2 pcs:** **+12% SPD**<br>• **4 pcs:** **+10% SPD**<br>• **6 pcs:** **+10% SPD**<br>• **9 pcs:** **+12% SPD** (Total astronómico de velocidad). | Máximo acelerador para builds de alta frecuencia (turnos 2:1 y 3:1). |
| **Despiadado (*Merciless*)** | **1 a 9** | • Stats masivos de ATK y C.DMG<br>• **3 y 7 pcs:** +5% SPD<br>• **4 pcs:** 30% prob. reducción de CD<br>• **8 pcs:** 35% prob. Turno Extra<br>• **9 pcs:** Ignora 20% DEF. | Extremo para daño masivo, pero requiere precaución si se usan 8 piezas en composiciones no adaptables. |
| **Asesino (*Slayer*)** | **1 a 9** | • +C.DMG, +SPD (+5% en 2, 5 y 8 pcs)<br>• Ignora hasta 30% DEF en habilidades AoE. | Daño y velocidad para nukers polivalentes. |
| **Precisión Milimétrica (*Pinpoint*)** | **1 a 9** | • +ACC, +SPD (+5% en 2 y 6 pcs), +C.DMG<br>• Ignora hasta 30% DEF irresistible. | Ideal para campeones debuffers de daño híbrido. |
| **Piel de Piedra (*Stoneskin*)** | **1 a 9** | • +HP, +DEF, +RES<br>• Bufo de Piel de Piedra (inmunidad temporal por 1 o 2 turnos). | Absorbe los primeros impactos, pero no mitiga el turno 50. |

---

### 2.5 Accesorios Especiales con Efectos de Conjunto (1 a 3 Piezas)

| Accesorio | Piezas | Efecto por Pieza Equipada | Utilidad en Clan Boss |
| :--- | :---: | :--- | :--- |
| **Escudo de Sangre (*Bloodshield*)** | 1 a 3 | Otorga un **Escudo del 5% del daño infligido** por 1 turno tras cada golpe. | **Crucial en Infinity Comps:** Alimenta los escudos infinitos de Underpriest Brogni y mitiga golpes del Boss. |
| **Limpieza (*Cleansing*)** | 1 a 3 | **8% prob. por pieza (hasta 24%)** de remover 1 desbufo al inicio del turno. | Red de seguridad para limpiar el Aturdimiento o la Reducción de Velocidad si falla el Bloquear Desbufos. |
| **Venganza (*Revenge*)** | 1 a 3 | **5% prob. por pieza (hasta 15%)** de contraatacar con A1 al recibir daño. | Genera ataques adicionales gratuitos que activan Warmaster y colocan desbufos sin avanzar el reloj de combate. |
| **Refresco (*Refresh*)** | 1 a 3 | **5% prob. por pieza (hasta 15%)** de no activar enfriamiento en la habilidad usada. | ⚠️ **Peligro en Speed Tune:** Puede alterar el orden fijo de habilidades protectoras. |

---

## 3. ⚠️ Matriz de Alerta: Conjuntos y Efectos Prohibidos en Speed Tuning

En una calculadora de Clan Boss, la precisión depende de la **predictibilidad matemática absoluta**. Ciertos conjuntos introducen aleatoriedad (*RNG*) en el Turn Meter o en los turnos extra, provocando que los bufos de **Inmortal** o **Bloquear Daño** se caigan antes de que el Boss ataque:

| Conjunto / Accesorio | Razón del Peligro | Efecto en la Simulación |
| :--- | :--- | :--- |
| **Furia Vengadora (*Relentless*)** | 18% probabilidad de Turno Extra | El campeón actúa dos veces, gastando un turno de sus bufos defensivos y quedando vulnerable al siguiente golpe del Clan Boss. |
| **Frenesí (*Frenzy*)** | Llena Turn Meter al perder HP | Cada golpe del Boss llena la barra del campeón de forma descontrolada, rompiendo la secuencia de turnos. |
| **Impulso (*Impulse*)** | 12% prob. de reducir cooldown | Hace que el campeón lance sus habilidades antes de lo previsto, desfasando la rotación de protección. |
| **Accesorio de Refresco (*Refresh*)** | 5-15% prob. de reset de cooldown | Desincroniza el ciclo de rotación A1/A2/A3 prefijado. |

---

## 4. Integración Matemática en la Calculadora SPA

Para calcular con exactitud la velocidad en la SPA:
1. **Detección de Sets:** La calculadora lee los conjuntos equipados en el campeón.
2. **Aplicación de Constantes de Punto Flotante:** Si el campeón lleva 2 piezas de Velocidad ($515396075 / 4294967296$), Percepción ($214748364 / 4294967296$) o Protección, se aplican los multiplicadores nativos de Raid.
3. **Multiplicador de Lore of Steel:** Si el toggle de la maestría está activo, se multiplica el bono del set básico por $1.15$.
4. **Cálculo de Ticks:** La True Speed resultante se traduce directamente en la ganancia de barra de turno:
   $$\text{TM Gain per Tick} = \text{TrueSpeed} \times 0.07$$
