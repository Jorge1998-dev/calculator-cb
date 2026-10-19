import type {
  ArtifactSetChoice,
  ClanBossAffinity,
  ClanBossDifficulty,
  TeamMemberConfig,
  SkillConfig,
  SimulationTurnLog,
  SimulationResult,
  SimulationActorState,
} from '../../types';

// Exact floating point binary constants used by Raid: Shadow Legends engine
export const SET_SPEED_CONSTANTS: Record<ArtifactSetChoice, number> = {
  none: 0,
  speed: 515396075 / 4294967296, // ~0.12 (12%)
  perception: 214748364 / 4294967296, // ~0.05 (5%)
  righteous: 429496729 / 4294967296, // ~0.10 (10%)
  swift_parry: 773094113 / 4294967296, // ~0.18 (18%)
  protection_2: 515396075 / 4294967296, // ~0.12 (12%)
  protection_5: 1030792151 / 4294967296, // ~0.24 (24%)
  supersonic_2: 515396075 / 4294967296, // ~0.12 (12%)
  killstroke: 214748364 / 4294967296, // ~0.05 (5%)
  divine_speed: 515396075 / 4294967296, // ~0.12 (12%)
  defense: 0,
  life: 0,
  immortal: 0,
  accuracy: 0,
  resistance: 0,
  critical_rate: 0,
  cruel: 0,
  defiant: 0,
  resilience: 0,
  toxic: 0,
  lifesteal: 0,
  stalwart: 0,
  savage: 0,
  lethal: 0,
  reflex: 0,
  relentless: 0,
  guardian: 0,
  bolster: 0,
  stone_skin: 0,
};

// Sets affected by Lore of Steel (+15% to 2-piece basic set bonuses)
export const LORE_OF_STEEL_SETS = new Set<ArtifactSetChoice>([
  'speed',
  'perception',
  'righteous',
  'divine_speed',
  'killstroke',
]);

export const BOSS_SPEED_BY_DIFFICULTY: Record<ClanBossDifficulty, number> = {
  'Easy': 90,
  'Normal': 130,
  'Hard': 140,
  'Brutal': 160,
  'Nightmare': 170,
  'Ultra-Nightmare': 190,
};

/**
 * Calculates effective defense taking into account base defense and Defense Aura %
 */
export function calculateEffectiveDefense(
  baseDef: number,
  totalDef: number,
  defAuraPercent: number
): number {
  if (baseDef <= 0) return totalDef;
  const auraBonus = Math.round((defAuraPercent / 100) * baseDef);
  return totalDef + auraBonus;
}

/**
 * Calculates Clan Boss damage mitigation percentage based on effective defense
 * Formula: DEF / (DEF + 1200) * 100%
 */
export function calculateDamageMitigation(effectiveDef: number): number {
  if (effectiveDef <= 0) return 0;
  return (effectiveDef / (effectiveDef + 1200)) * 100;
}

/**
 * Calculates shield durability / effective health multiplier based on mitigation
 * Formula: 1 + (DEF / 1200)
 */
export function calculateShieldMultiplier(effectiveDef: number): number {
  if (effectiveDef <= 0) return 1;
  return 1 + effectiveDef / 1200;
}

/**
 * Calculates the exact True Speed of a champion.
 * Supports both traditional 3-slot sets and dynamic equippedSets list (up to 9 pieces).
 */
export function calculateTrueSpeed(
  baseSpeed: number,
  totalSpeed: number,
  sets: ArtifactSetChoice[],
  hasLoreOfSteel: boolean,
  speedAuraPercent: number,
  speedBuffFactor: number = 0,
  flatBonus: number = 0,
  equippedSets?: Array<{ id: string; set: string; pieces: number }>
): number {
  if (baseSpeed <= 0) return totalSpeed;

  let speedBonus = 0;
  let loreBonus = 0;

  if (equippedSets && equippedSets.length > 0) {
    for (const eq of equippedSets) {
      const setId = eq.set.toLowerCase();
      const p = eq.pieces;

      if (setId === 'speed' || setId === 'velocidad') {
        const count = Math.floor(p / 2);
        const factor = count * (515396075 / 4294967296);
        speedBonus += factor;
        loreBonus += factor;
      } else if (setId === 'perception' || setId === 'percepcion') {
        const count = Math.floor(p / 2);
        const factor = count * (214748364 / 4294967296);
        speedBonus += factor;
        loreBonus += factor;
      } else if (setId === 'righteous' || setId === 'justiciero') {
        const count = Math.floor(p / 2);
        const factor = count * (429496729 / 4294967296);
        speedBonus += factor;
        loreBonus += factor;
      } else if (setId === 'divine_speed' || setId === 'velocidad_divina') {
        const count = Math.floor(p / 2);
        const factor = count * (515396075 / 4294967296);
        speedBonus += factor;
        loreBonus += factor;
      } else if (setId === 'killstroke' || setId === 'golpe_mortal') {
        const count = Math.floor(p / 2);
        const factor = count * (214748364 / 4294967296);
        speedBonus += factor;
        loreBonus += factor;
      } else if (setId === 'swift_parry') {
        if (p >= 4) speedBonus += 773094113 / 4294967296;
      } else if (setId === 'protection') {
        if (p >= 5) speedBonus += 1030792151 / 4294967296;
        else if (p >= 2) speedBonus += 515396075 / 4294967296;
      } else if (setId === 'supersonic') {
        if (p >= 9) speedBonus += (515396075 / 4294967296) + 0.32;
        else if (p >= 6) speedBonus += (515396075 / 4294967296) + 0.20;
        else if (p >= 4) speedBonus += (515396075 / 4294967296) + 0.10;
        else if (p >= 2) speedBonus += 515396075 / 4294967296;
      } else if (setId === 'pinpoint') {
        if (p >= 4) speedBonus += 0.10;
        else if (p >= 2) speedBonus += 0.05;
      }
    }
  } else {
    for (const set of sets) {
      if (set === 'none') continue;
      const factor = SET_SPEED_CONSTANTS[set] || 0;
      speedBonus += factor;
      if (LORE_OF_STEEL_SETS.has(set)) {
        loreBonus += factor;
      }
    }
  }

  const roundedBaseBonus = Math.round(baseSpeed * speedBonus);
  const roundedLoreBonus = hasLoreOfSteel ? Math.round(baseSpeed * loreBonus * 0.15) : 0;
  const exactLore = hasLoreOfSteel ? baseSpeed * loreBonus * 0.15 : 0;
  const auraBonus = (speedAuraPercent / 100) * baseSpeed;

  const baseFormula =
    totalSpeed -
    baseSpeed -
    roundedBaseBonus -
    roundedLoreBonus +
    baseSpeed +
    baseSpeed * speedBonus +
    exactLore +
    auraBonus +
    flatBonus;

  return baseFormula * (1 + speedBuffFactor);
}

/**
 * Determines current speed modifier from active effects
 */
function getSpeedModifier(effects: SimulationActorState['effects']): number {
  let mod = 0;
  const speedBuff = effects.find((e) => e.name === 'speed-buff');
  const speedDebuff = effects.find((e) => e.name === 'speed-debuff');

  if (speedBuff) mod += speedBuff.amount ?? 0.3;
  if (speedDebuff) mod -= speedDebuff.amount ?? 0.3;

  return mod;
}

/**
 * Runs the deterministic Clan Boss turn simulation.
 * Replicates the exact tick engine: 0.07 * TrueSpeed per tick up to 50 Boss turns.
 */
export function runClanBossSimulation(
  teamMembers: TeamMemberConfig[],
  difficulty: ClanBossDifficulty,
  affinity: ClanBossAffinity,
  maxBossTurns: number = 50
): SimulationResult {
  // Determine leader and active speed aura
  const leader = teamMembers.find((m) => m.isLeader) || teamMembers[0];
  const activeSpdAura =
    leader?.auraType === 'spd' ? leader.auraPercent : leader?.customAuraPercent || 0;

  const bossBaseSpeed = BOSS_SPEED_BY_DIFFICULTY[difficulty] || 190;

  // Initialize actors
  const actors: SimulationActorState[] = teamMembers.map((member) => {
    const sets = [member.set1, member.set2, member.set3];
    const spdAuraToUse = member.overrideAura
      ? (member.auraType === 'spd' ? member.auraPercent : member.customAuraPercent)
      : activeSpdAura;

    const trueSpd = calculateTrueSpeed(
      member.baseSpeed,
      member.totalSpeed,
      sets,
      member.hasLoreOfSteel,
      spdAuraToUse,
      0,
      0,
      member.equippedSets
    );

    return {
      id: member.id,
      name: member.championName || `Champion ${member.slotIndex + 1}`,
      slotIndex: member.slotIndex,
      color: member.color,
      isBoss: false,
      totalSpeed: member.totalSpeed,
      baseSpeed: member.baseSpeed,
      trueSpeed: trueSpd,
      turnMeter: 0,
      hasExtraTurn: false,
      hasUsedOpener: false,
      effects: [],
      skillConfigs: member.skillConfigs.map((s) => ({
        ...s,
        current_cooldown: 0,
        isOpener: !!s.isOpener,
      })),
    };
  });

  // Boss actor
  const bossActor: SimulationActorState = {
    id: 'boss-clan',
    name: 'Clan Boss',
    slotIndex: 99,
    color: '#ef4444',
    isBoss: true,
    totalSpeed: bossBaseSpeed,
    baseSpeed: bossBaseSpeed,
    trueSpeed: bossBaseSpeed,
    turnMeter: 0,
    hasExtraTurn: false,
    hasUsedOpener: false,
    effects: [],
    skillConfigs: [
      { id: 'A1', alias: 'STUN', name: 'Crushing Force', priority: 1, cooldown: 0, delay: 0, current_cooldown: 0, isOpener: false },
      { id: 'A2', alias: 'AOE2', name: affinity === 'Void' ? 'Dark Nova' : 'Crash Through', priority: 2, cooldown: 3, delay: 0, current_cooldown: 0, isOpener: false },
      { id: 'A3', alias: 'AOE1', name: affinity === 'Spirit' ? 'Numbing Fear' : affinity === 'Force' ? 'Belittle' : affinity === 'Magic' ? 'Swirling Darkness' : 'Dark Nova', priority: 3, cooldown: 3, delay: 0, current_cooldown: 0, isOpener: false },
    ],
  };

  const allActors = [...actors, bossActor];
  const turns: SimulationTurnLog[] = [];
  let bossTurnCount = 0;
  let safetyLoopLimit = 1200;

  while (bossTurnCount < maxBossTurns && safetyLoopLimit > 0) {
    safetyLoopLimit--;

    // 1. Check extra turn
    let actingActor = allActors.find((a) => a.hasExtraTurn);
    if (actingActor) {
      actingActor.hasExtraTurn = false;
    } else {
      // 2. Tick loop until someone reaches >= 100% TM (Raid Canonical Tick Engine)
      while (allActors.every((a) => a.turnMeter < 100)) {
        for (const actor of allActors) {
          const speedMod = getSpeedModifier(actor.effects);
          const memberConfig = teamMembers[actor.slotIndex];
          const spdAuraToUse = memberConfig?.overrideAura
            ? (memberConfig.auraType === 'spd' ? memberConfig.auraPercent : memberConfig.customAuraPercent)
            : activeSpdAura;

          const currentTrueSpeed = actor.isBoss
            ? actor.baseSpeed * (1 + speedMod)
            : calculateTrueSpeed(
                actor.baseSpeed,
                actor.totalSpeed,
                [memberConfig?.set1 || 'none', memberConfig?.set2 || 'none', memberConfig?.set3 || 'none'],
                memberConfig?.hasLoreOfSteel || false,
                spdAuraToUse,
                speedMod,
                0,
                memberConfig?.equippedSets
              );

          // Standard Raid tick rate: 7% per 100 speed per tick (0.07 * TrueSpeed)
          const delta = (currentTrueSpeed * 0.07);
          actor.turnMeter += delta;
        }
      }

      // 3. Find actor with highest Turn Meter. In case of tie, lower slotIndex breaks tie.
      const highestTm = Math.max(...allActors.map((a) => a.turnMeter));
      const candidates = allActors.filter((a) => Math.abs(a.turnMeter - highestTm) < 0.0001);
      actingActor = candidates.sort((a, b) => a.slotIndex - b.slotIndex)[0];
    }

    if (!actingActor) break;

    // Snapshot turn meters before reset
    const tmSnapshot = allActors.map((a) => ({
      actorId: a.id,
      actorName: a.name,
      slotIndex: a.slotIndex,
      turnMeter: Math.round(a.turnMeter * 100) / 100,
    }));

    // Reset acting actor's turn meter
    actingActor.turnMeter = 0;

    // --- MANEJO DE CAMPEÓN ATURDIDO (STUN) ---
    const stunIndex = actingActor.effects.findIndex((e) => e.name === 'stun');
    if (stunIndex !== -1 && !actingActor.isBoss) {
      // El campeón PIERDE SU TURNO por estar aturdido
      actingActor.effects.splice(stunIndex, 1); // Se consume el stun

      // Cooldowns NO se reducen (se quedan congelados durante el stun)
      // Efectos con reduceDurationAt 'turn-end' no bajan su duración ya que no tomó acción normal
      const effectsSnapshot = allActors.flatMap((a) =>
        a.effects.map((e) => ({
          targetName: a.name,
          name: e.name,
          type: e.type,
          duration: e.duration,
          amount: e.amount,
        }))
      );

      turns.push({
        turnIndex: turns.length + 1,
        bossRound: bossTurnCount,
        bossPhase: (bossTurnCount % 3 === 1 ? 'AOE1' : bossTurnCount % 3 === 2 ? 'AOE2' : 'STUN'),
        actorId: actingActor.id,
        actorName: actingActor.name,
        actorSlot: actingActor.slotIndex,
        isBoss: false,
        color: actingActor.color,
        skillUsed: {
          id: 'STUNNED',
          name: 'Aturdido (Turno Perdido)',
          alias: 'STUN',
        },
        turnMetersSnapshot: tmSnapshot,
        effectsSnapshot,
        isStunnedTurnSkipped: true,
      });

      continue; // Pasa inmediatamente al siguiente actor
    }

    // 4. Reduce effect duration at turn-start
    actingActor.effects = actingActor.effects
      .map((e) => (e.reduceDurationAt === 'turn-start' ? { ...e, duration: e.duration - 1 } : e))
      .filter((e) => e.duration > 0);

    // 4b. Reduce active cooldowns and delays at start of actor's turn (Raid canonical timing)
    for (const sc of actingActor.skillConfigs) {
      if (!sc.isPassive && (sc.current_cooldown || 0) > 0) {
        sc.current_cooldown = Math.max(0, (sc.current_cooldown || 0) - 1);
      }
      if (!sc.isPassive && (sc.delay || 0) > 0) {
        sc.delay = Math.max(0, sc.delay - 1);
      }
    }

    // 5. Select skill: Regla de Habilidad Inicial (Opener) en primer turno, luego orden de prioridad acordado
    let chosenSkill: SkillConfig | undefined;
    let isOpenerUsed = false;

    // Si es un campeón aliado y aún no ha ejecutado su primer turno/acción, verificar si tiene Habilidad Inicial configurada
    if (!actingActor.isBoss && !actingActor.hasUsedOpener) {
      const openerCandidate = actingActor.skillConfigs.find(
        (s) => !!s.isOpener && !s.isPassive && !s.disabled && (s.current_cooldown || 0) === 0 && (s.delay || 0) === 0
      );
      if (openerCandidate) {
        chosenSkill = openerCandidate;
        isOpenerUsed = true;
      }
      // Se marca consumida la regla inicial para este campeón (a partir del siguiente turno seguirá estrictamente la prioridad acordada)
      actingActor.hasUsedOpener = true;
    }

    if (!chosenSkill) {
      const availableSkills = actingActor.skillConfigs
        .filter((s) => !s.isPassive && !s.disabled && (s.priority || 0) > 0)
        .slice()
        .sort((a, b) => b.priority - a.priority);

      chosenSkill = availableSkills.find(
        (s) => (s.current_cooldown || 0) === 0 && (s.delay || 0) === 0
      );

      if (!chosenSkill) {
        // Fallback to active non-disabled A1 or any available active skill
        chosenSkill = actingActor.skillConfigs.find(
          (s) => !s.isPassive && !s.disabled && s.id === 'A1'
        ) || actingActor.skillConfigs.find(
          (s) => !s.isPassive && !s.disabled
        ) || actingActor.skillConfigs[0];
      }
    }

    // Determine Clan Boss phase if Boss acts
    let currentPhase: 'AOE1' | 'AOE2' | 'STUN';
    if (actingActor.isBoss) {
      bossTurnCount++;
      const mod3 = bossTurnCount % 3;
      if (mod3 === 1) currentPhase = 'AOE1';
      else if (mod3 === 2) currentPhase = 'AOE2';
      else currentPhase = 'STUN';
    } else {
      const mod3 = (bossTurnCount + 1) % 3;
      if (mod3 === 1) currentPhase = 'AOE1';
      else if (mod3 === 2) currentPhase = 'AOE2';
      else currentPhase = 'STUN';
    }

    // Telemetría específica de Boss Stun & Debuffs
    let stunTargetName: string | undefined;
    let stunResultStatus: 'blocked' | 'intercepted' | 'stunned' | undefined;

    // Inmunidades canónicas del Clan Boss (Demon Lord) en Raid: Shadow Legends:
    // CC (Stun, Freeze, Sleep, Provoke, Fear, True Fear, Petrification, Sheep),
    // Bloquear Habilidades Activas y Pasivas, y Reducción de Velocidad (Decrease SPD).
    const CLAN_BOSS_IMMUNITIES = new Set([
      'block-active-skills',
      'block_active_skills',
      'bloquear-habilidades-activas',
      'block-passive-skills',
      'block_passive_skills',
      'bloquear-habilidades-pasivas',
      'speed-debuff',
      'speeddown',
      'red-vel',
      'red-vel-1',
      'red-vel-2',
      'stun',
      'aturdir',
      'freeze',
      'congelar',
      'sleep',
      'dormir',
      'provoke',
      'incitar',
      'fear',
      'miedo',
      'true-fear',
      'miedo-de-verdad',
      'petrification',
      'petrificacion',
      'sheep',
      'oveja',
    ]);

    // Helper: Aplicar debufo al Clan Boss respetando el límite estricto de 10 debufos y sus inmunidades oficiales
    const addDebuffToBoss = (debuffName: string, duration: number, amount?: number) => {
      const cleanName = debuffName.toLowerCase().trim();
      // Si el Clan Boss es inmune a este desbufo, no se aplica a la barra de efectos
      if (CLAN_BOSS_IMMUNITIES.has(cleanName)) {
        return;
      }

      const activeBossDebuffs = bossActor.effects.filter((e) => e.type === 'debuff');
      const existing = bossActor.effects.find((e) => e.name === cleanName && e.type === 'debuff');
      if (existing && cleanName !== 'poison') {
        existing.duration = Math.min(3, Math.max(existing.duration, duration));
        if (amount !== undefined) {
          existing.amount = Math.max(existing.amount || 0, amount);
        }
      } else if (activeBossDebuffs.length < 10) {
        bossActor.effects.push({
          name: cleanName,
          type: 'debuff',
          duration: Math.min(3, duration),
          amount,
          reduceDurationAt: 'turn-end',
        });
      }
    };

    // Helper: Aplicar bufo a un campeón aliado respetando la regla estricta de Raid (Bufos únicos, sin duplicados)
    const applyBuffToActor = (
      actor: SimulationActorState,
      buffName: string,
      duration: number,
      amount?: number
    ) => {
      // Regla canónica de Raid: Intercept (Intercipio) NO tiene duración de turnos, opera exclusivamente por CARGAS (stacks)
      if (buffName === 'intercept') {
        const existing = actor.effects.find((e) => e.name === 'intercept');
        const finalStacks = Math.min((existing?.amount || 0) + (amount || 1), 3);
        if (existing) {
          existing.amount = finalStacks;
          existing.duration = finalStacks;
        } else {
          actor.effects.push({
            name: 'intercept',
            type: 'buff',
            duration: finalStacks,
            amount: finalStacks,
            reduceDurationAt: 'turn-end',
            isAddedThisTurn: false,
            appliedAtBossRound: bossTurnCount,
          });
        }
        return;
      }

      const isCaster = actor === actingActor;
      const existing = actor.effects.find((e) => e.name === buffName && e.type === 'buff');
      if (existing) {
        // En Raid: Shadow Legends los bufos son estrictamente únicos por tipo.
        // Si ya está activo, se refresca la duración (máximo canónico en juego real: 6 turnos)
        existing.duration = Math.min(6, Math.max(existing.duration, duration));
        existing.appliedAtBossRound = bossTurnCount;
        if (isCaster) existing.isAddedThisTurn = true;
        if (amount !== undefined) {
          existing.amount = Math.max(existing.amount || 0, amount);
        }
      } else {
        actor.effects.push({
          name: buffName,
          type: 'buff',
          duration: Math.min(6, duration),
          amount,
          reduceDurationAt: 'turn-end',
          isAddedThisTurn: isCaster,
          appliedAtBossRound: bossTurnCount,
        });
      }
    };

    // Helper: Aplicar debufo a un campeón aliado con verificación de Bloquear Debufos / Interceptar
    const tryApplyDebuffToChamp = (champ: SimulationActorState, debuffName: string, duration: number, amount?: number) => {
      const hasBlockDebuffs = champ.effects.some((e) => e.name === 'block-debuffs');
      if (hasBlockDebuffs) return 'blocked';

      // En Raid: Shadow Legends, Intercept (Intercipio) intercepta EXCLUSIVAMENTE debufos de control (CC: Stun, etc.)
      const isCC = ['stun', 'aturdir', 'freeze', 'congelar', 'sleep', 'dormir', 'provoke', 'fear', 'petrification', 'sheep'].includes(debuffName.toLowerCase());
      if (isCC) {
        const interceptIdx = champ.effects.findIndex((e) => e.name === 'intercept');
        if (interceptIdx !== -1) {
          const interceptEff = champ.effects[interceptIdx];
          if (interceptEff.amount && interceptEff.amount > 1) {
            interceptEff.amount -= 1;
          } else {
            champ.effects.splice(interceptIdx, 1);
          }
          return 'intercepted';
        }
      }

      const existingDebuff = champ.effects.find((e) => e.name === debuffName && e.type === 'debuff');
      if (existingDebuff && debuffName !== 'poison') {
        existingDebuff.duration = Math.max(existingDebuff.duration, duration);
      } else {
        champ.effects.push({
          name: debuffName,
          type: 'debuff',
          duration,
          amount,
          reduceDurationAt: 'turn-end',
        });
      }
      return 'applied';
    };

    // 8. Execute skill mechanics
    let turnDamage = 0;
    if (actingActor.isBoss) {
      // --- MECÁNICAS REALES DEL JEFE DE CLAN ---
      if (currentPhase === 'AOE1') {
        // Debufo de afinidad
        if (affinity === 'Spirit') {
          for (const champ of actors) {
            tryApplyDebuffToChamp(champ, 'speed-debuff', 2, 0.3);
          }
        } else if (affinity === 'Force') {
          for (const champ of actors) {
            tryApplyDebuffToChamp(champ, 'atk-debuff', 2, 0.5);
          }
        } else if (affinity === 'Magic') {
          for (const champ of actors) {
            tryApplyDebuffToChamp(champ, 'acc-debuff', 2, 0.5);
          }
        }
      } else if (currentPhase === 'AOE2') {
        // Envenenamiento de área (2 venenos de 2 turnos)
        for (const champ of actors) {
          tryApplyDebuffToChamp(champ, 'poison', 2, 0.05);
          tryApplyDebuffToChamp(champ, 'poison', 2, 0.05);
        }
      } else if (currentPhase === 'STUN') {
        // --- SELECCIÓN INTELIGENTE DE OBJETIVO DE STUN (IA OFICIAL DE RAID) ---
        let targetCandidate = actors.find((a) => {
          const cfg = teamMembers[a.slotIndex];
          const aff = cfg?.championData?.class.affinity;
          if (affinity === 'Force' && aff === 'Magic') return true;
          if (affinity === 'Magic' && aff === 'Spirit') return true;
          if (affinity === 'Spirit' && aff === 'Force') return true;
          return false;
        });

        if (!targetCandidate) {
          targetCandidate = actors.find((a) => {
            const hasProt = a.effects.some((e) => e.name === 'block-debuffs' || e.name === 'intercept');
            return !hasProt;
          });
        }

        if (!targetCandidate) {
          targetCandidate = actors[0];
        }

        stunTargetName = targetCandidate.name;

        const hasBlockDebuffs = targetCandidate.effects.some((e) => e.name === 'block-debuffs');
        if (hasBlockDebuffs) {
          stunResultStatus = 'blocked';
        } else {
          const interceptIdx = targetCandidate.effects.findIndex((e) => e.name === 'intercept');
          if (interceptIdx !== -1) {
            stunResultStatus = 'intercepted';
            const eff = targetCandidate.effects[interceptIdx];
            if (eff.amount && eff.amount > 1) {
              eff.amount -= 1;
            } else {
              targetCandidate.effects.splice(interceptIdx, 1);
            }
          } else {
            stunResultStatus = 'stunned';
            targetCandidate.effects.push({
              name: 'stun',
              type: 'debuff',
              duration: 1,
              reduceDurationAt: 'turn-start',
            });
          }
        }
      }
    } else {
      // --- TURNO DE CAMPEÓN ---
      const champConfig = teamMembers[actingActor.slotIndex];
      const champSkills = champConfig?.championData?.skills || [];
      const champNameLower = (champConfig?.championName || actingActor.name).toLowerCase();
      const champSpanishLower = (champConfig?.championData?.spanishName || '').toLowerCase();
      const isWixwell = champNameLower.includes('wixwell') || champSpanishLower.includes('wixwell');
      const isAnchorite = champNameLower.includes('anchorite') || champSpanishLower.includes('anacoreta');
      const isMikage = champNameLower.includes('mikage') || champSpanishLower.includes('mikage');
      const isLydia = champNameLower.includes('lydia') || champSpanishLower.includes('lydia');
      const isTitus = champNameLower.includes('titus') || champSpanishLower.includes('titus');

      const matchedSkillData = champSkills.find(
        (sk) => sk.name.toLowerCase() === chosenSkill.name.toLowerCase()
      );

      const skillNameLower = (chosenSkill.name + ' ' + (matchedSkillData?.description || '')).toLowerCase();

      let isHandledSpecifically = false;

      // --- WIXWELL: MOTOR DE ESCUDO CRECIENTE E INTERCEPTACIÓN ---
      if (isWixwell) {
        if (chosenSkill.id === 'A3' || skillNameLower.includes('codex') || skillNameLower.includes('intercipio')) {
          isHandledSpecifically = true;
          actors.forEach((a) => {
            applyBuffToActor(a, 'shield', 2, 0.35);
            applyBuffToActor(a, 'def-buff', 2, 0.6);
            applyBuffToActor(a, 'intercept', 2, 2);
          });
        } else if (chosenSkill.id === 'A2' || skillNameLower.includes('tempest') || skillNameLower.includes('conocimiento')) {
          isHandledSpecifically = true;
          addDebuffToBoss('def-debuff', 2, 0.6);
          // Wixwell A2: Extiende la duración de los bufos de TODOS los aliados en 1 turno (tope canónico en juego real: 6 turnos)
          actors.forEach((a) => {
            a.effects.forEach((e) => {
              if (e.type === 'buff' && e.name !== 'intercept') {
                e.duration = Math.min(6, e.duration + 1);
                if (e.name === 'shield') {
                  e.amount = Math.min((e.amount || 0.35) * 1.25, 5.0);
                }
              }
            });
          });
        } else if (chosenSkill.id === 'A1' || skillNameLower.includes('deadbolt') || skillNameLower.includes('cerrojo')) {
          isHandledSpecifically = true;
          // Wixwell A1: Ataque con 50% [Disminuir ATK] por 2 turnos
          addDebuffToBoss('atk-debuff', 2, 0.5);
        }
      }

      // --- ANCHORITE / ANACORETA: EXTENSOR DE BUFOS & APOYO ---
      if (isAnchorite) {
        if (chosenSkill.id === 'A2' || skillNameLower.includes('prayer') || skillNameLower.includes('proeza')) {
          isHandledSpecifically = true;
          actors.forEach((a) => {
            // Remueve 1 debufo aleatorio de todos los aliados
            const debuffIdx = a.effects.findIndex((e) => e.type === 'debuff');
            if (debuffIdx !== -1) a.effects.splice(debuffIdx, 1);
            // Extiende la duración de todos los bufos de TODOS los aliados en 1 turno (máx 6 turnos)
            a.effects.forEach((e) => {
              if (e.type === 'buff' && e.name !== 'intercept') {
                e.duration = Math.min(6, e.duration + 1);
              }
            });
          });
        } else if (chosenSkill.id === 'A3' || skillNameLower.includes('trust') || skillNameLower.includes('confianza') || skillNameLower.includes('sacred') || skillNameLower.includes('skill 3')) {
          isHandledSpecifically = true;
          actors.forEach((a) => {
            applyBuffToActor(a, 'crit-buff', 2, 0.3);
          });
        }
      }

      // --- LADY MIKAGE: EXTENSORA DE BUFOS, EXTENSORA DE DEBUFOS & ATAQUE CONJUNTO ---
      if (isMikage) {
        if (chosenSkill.id === 'A2' || skillNameLower.includes('silk') || skillNameLower.includes('seda') || skillNameLower.includes('trampa') || skillNameLower.includes('skill 2')) {
          isHandledSpecifically = true;
          // 1. Extiende la duración de los bufos de TODOS los aliados en 1 turno (máx 6 turnos)
          actors.forEach((a) => {
            a.effects.forEach((e) => {
              if (e.type === 'buff' && e.name !== 'intercept') {
                e.duration = Math.min(6, e.duration + 1);
              }
            });
          });
          // 2. Reduce la duración de desbufos en aliados en 1 turno
          actors.forEach((a) => {
            a.effects = a.effects
              .map((e) => (e.type === 'debuff' ? { ...e, duration: e.duration - 1 } : e))
              .filter((e) => e.duration > 0);
          });
          // 3. Extiende la duración de TODOS los debufos en el Clan Boss en 1 turno (máx canónico de 3 turnos)
          bossActor.effects.forEach((e) => {
            if (e.type === 'debuff') {
              e.duration = Math.min(3, e.duration + 1);
            }
          });
        } else if (chosenSkill.id === 'A3' || skillNameLower.includes('duality') || skillNameLower.includes('danza') || skillNameLower.includes('dualidad') || skillNameLower.includes('skill 3')) {
          isHandledSpecifically = true;
          actors.forEach((a) => {
            applyBuffToActor(a, 'atk-buff', 2, 0.5);
          });
        }
      }

      // --- LYDIA LA SIRENA: DISMINUIR DEF, DEBILITAR, FORTALECER, VELOCIDAD, SENSIBILIDAD AL VENENO Y BLOQUEAR BUFOS ---
      if (isLydia) {
        if (chosenSkill.id === 'A2' || skillNameLower.includes('siren') || skillNameLower.includes('lamento')) {
          isHandledSpecifically = true;
          // Lamento de Sirena (A2): Reducir DEF 60% + Debilitar 25% al Boss, y Fortalecer 25% + Aumentar VEL 30% a todos los aliados
          addDebuffToBoss('def-debuff', 2, 0.6);
          addDebuffToBoss('weaken', 2, 0.25);
          actors.forEach((a) => {
            applyBuffToActor(a, 'strengthen', 2, 0.25);
            applyBuffToActor(a, 'speed-buff', 2, 0.3);
          });
        } else if (
          chosenSkill.id === 'A3' ||
          skillNameLower.includes('nullification') ||
          skillNameLower.includes('nulificacion') ||
          skillNameLower.includes('anulacion')
        ) {
          isHandledSpecifically = true;
          // Nulificación (A3): Ataca a 1 enemigo 2 veces.
          // 1er golpe: Aplica Sensibilidad al Veneno 25% por 2 turnos al Clan Boss.
          // 2do golpe: Aplica Bloquear Bufos por 2 turnos al Clan Boss.
          addDebuffToBoss('poison-sensitivity', 2, 0.25);
          addDebuffToBoss('block-buffs', 2);
        } else if (
          chosenSkill.id === 'A1' ||
          skillNameLower.includes('oppression') ||
          skillNameLower.includes('opresion')
        ) {
          isHandledSpecifically = true;
          // Opresión (A1): Ataca a 1 enemigo. Aplica o aumenta la duración de Sensibilidad al Veneno en el Boss en +1 turno
          const existingPoisonSense = bossActor.effects.find(
            (e) => e.name === 'poison-sensitivity' && e.type === 'debuff'
          );
          if (existingPoisonSense) {
            existingPoisonSense.duration = Math.min(3, existingPoisonSense.duration + 1);
          } else {
            addDebuffToBoss('poison-sensitivity', 2, 0.25);
          }
        }
      }

      // --- TITUS PLUMANEGRA: ESCALADO DE DEFENSA, DISMINUIR ATK Y DEFENSA ---
      if (isTitus) {
        if (chosenSkill.id === 'A1' || skillNameLower.includes('strike') || skillNameLower.includes('golpe')) {
          isHandledSpecifically = true;
          // Titus A1: Ataca con 50% [Disminuir ATK] por 2 turnos
          addDebuffToBoss('atk-debuff', 2, 0.5);
        } else if (chosenSkill.id === 'A2' || skillNameLower.includes('skill 2') || skillNameLower.includes('habilidad 2')) {
          isHandledSpecifically = true;
          // Titus A2: Ataca a todos los enemigos. Aplica 60% [Disminuir DEF] por 2 turnos
          addDebuffToBoss('def-debuff', 2, 0.6);
        }
      }

      // Procesar habilidades genéricas de base de datos solo si no fue manejada específicamente
      if (!isHandledSpecifically) {
        const skillEffects = Array.isArray(matchedSkillData?.effect)
          ? matchedSkillData.effect
          : matchedSkillData?.effect
          ? [matchedSkillData.effect]
          : [];

        for (const eff of skillEffects) {
          const turns = eff.turns || 2;
          const target = eff.champions || 'allies';
          const targetActors = target === 'self' ? [actingActor] : actors;

          if (eff.id === 'add_buff' && eff.buff) {
            const b = eff.buff.toLowerCase();
            if (b.includes('speed') || b === 'speedup') {
              targetActors.forEach((a) => applyBuffToActor(a, 'speed-buff', turns, 0.3));
            } else if (b.includes('def') || b === 'defup') {
              targetActors.forEach((a) => applyBuffToActor(a, 'def-buff', turns, 0.6));
            } else if (b.includes('shield')) {
              targetActors.forEach((a) => applyBuffToActor(a, 'shield', turns, 0.35));
            } else if (b.includes('block_debuff') || b.includes('block-debuff')) {
              targetActors.forEach((a) => applyBuffToActor(a, 'block-debuffs', turns, 1.0));
            } else if (b.includes('intercept') || b.includes('inmutable')) {
              targetActors.forEach((a) => applyBuffToActor(a, 'intercept', turns, 2));
            } else if (b.includes('atk') || b === 'atkup') {
              targetActors.forEach((a) => applyBuffToActor(a, 'atk-buff', turns, 0.5));
            } else if (b.includes('crit')) {
              targetActors.forEach((a) => applyBuffToActor(a, 'crit-buff', turns, 0.3));
            } else if (b === 'extend_buff') {
              actors.forEach((a) => a.effects.forEach((e) => {
                if (e.type === 'buff' && e.name !== 'intercept') {
                  e.duration = Math.min(6, e.duration + 1);
                }
              }));
            }
          } else if (eff.id === 'add_debuff' && eff.debuff) {
            const d = eff.debuff.toLowerCase();
            if (d.includes('def')) addDebuffToBoss('def-debuff', turns, 0.6);
            if (d.includes('atk')) addDebuffToBoss('atk-debuff', turns, 0.5);
            if (d.includes('weak')) addDebuffToBoss('weaken', turns, 0.25);
            if (d.includes('speed')) addDebuffToBoss('speed-debuff', turns, 0.3);
            if (d.includes('burn')) addDebuffToBoss('hp-burn', turns, 0.03);
            if (d.includes('poison_sense') || d.includes('poison-sensitivity') || d.includes('sensibilidad')) {
              addDebuffToBoss('poison-sensitivity', turns, 0.25);
            } else if (d.includes('poison')) {
              addDebuffToBoss('poison', turns, 0.05);
            }
            if (d.includes('blockbuff') || d.includes('block-buff') || d.includes('bloquear-bufo')) {
              addDebuffToBoss('block-buffs', turns);
            }
          }
        }
      }

      // --- CÁLCULO DE DAÑO DEL TURNO (BASADO EN STATS REALES: ATK, DEF, HP, P.CRITIC Y D.CRITIC) ---
      const hasDefDebuff = bossActor.effects.some((e) => e.name === 'def-debuff');
      const hasWeaken = bossActor.effects.some((e) => e.name === 'weaken');
      const defMultiplier = hasDefDebuff ? 1.6 : 1.0;
      const weakenMultiplier = hasWeaken ? 1.25 : 1.0;
      const bossDebuffMultiplier = defMultiplier * weakenMultiplier;

      // 1. Determinar stat primario y su valor efectivo con bufos de combate (DEF, HP, ATK o Híbrido)
      const skillScaling = chosenSkill.damageStat;
      const primaryStat = skillScaling || champConfig?.primaryStat || (isTitus ? 'DEF_HP' : isWixwell ? 'DEF' : 'ATK');
      const hasDefBuff = actingActor.effects.some((e) => e.name === 'def-buff');
      const hasAtkBuff = actingActor.effects.some((e) => e.name === 'atk-buff');

      const baseDefVal = champConfig?.effectiveDefense || champConfig?.totalDefense || 3000;
      const buffedDef = baseDefVal * (hasDefBuff ? 1.6 : 1.0);

      const baseAtkVal = champConfig?.effectiveAttack || champConfig?.totalAttack || 2500;
      const buffedAtk = baseAtkVal * (hasAtkBuff ? 1.5 : 1.0);

      const effHp = champConfig?.effectiveHP || champConfig?.totalHP || 45000;

      let buffedStatVal = 2500;
      if (primaryStat === 'DEF') {
        buffedStatVal = buffedDef;
      } else if (primaryStat === 'HP') {
        // En Raid, habilidades basadas en HP usan ~0.20-0.25 del HP Máximo como base de daño
        buffedStatVal = effHp * 0.22;
      } else if (primaryStat === 'DEF_HP') {
        // HÍBRIDO DEF + HP (Titus Plumanegra y tanques híbridos)
        buffedStatVal = (buffedDef * 0.75) + (effHp * 0.12);
      } else if (primaryStat === 'ATK_DEF') {
        buffedStatVal = (buffedAtk * 0.6) + (buffedDef * 0.5);
      } else if (primaryStat === 'ATK_HP') {
        buffedStatVal = (buffedAtk * 0.6) + (effHp * 0.12);
      } else {
        buffedStatVal = buffedAtk;
      }

      // 2. Multiplicador de Crítico (P.Critic y D.Critic)
      const hasCritBuff = actingActor.effects.some((e) => e.name === 'crit-buff');
      const rawCrate = (champConfig?.effectiveCritRate ?? champConfig?.totalCritRate ?? 100) + (hasCritBuff ? 30 : 0);
      const effectiveCrate = Math.min(100, Math.max(0, rawCrate));
      const rawCdmg = (champConfig?.effectiveCritDamage ?? champConfig?.totalCritDamage ?? 0) + (hasCritBuff ? 30 : 0);
      const critMultiplier = 1 + (effectiveCrate / 100) * (rawCdmg / 100);

      // 3. Multiplicador de habilidad (A1: 3.5x, A2: 4.0x, A3: 4.2x / apoyo)
      let skillMultiplier = 3.6;
      if (chosenSkill.id === 'A1') skillMultiplier = 3.5;
      else if (chosenSkill.id === 'A2') skillMultiplier = 4.0;
      else if (chosenSkill.id === 'A3') skillMultiplier = 4.2;

      // Mitigación estándar de armadura del Clan Boss
      const cbMitigationFactor = 0.38;

      // Bonus por Maestría Maestro de la Guerra (Warmaster) ~65k proc en 60% de golpes
      const warmasterAvg = 39000;

      // Cálculo del golpe estándar basado en estadísticas
      const standardHitDamage = Math.round(
        (buffedStatVal * skillMultiplier * critMultiplier * cbMitigationFactor) * bossDebuffMultiplier + warmasterAvg
      );

      if (isTitus) {
        if (chosenSkill.id === 'A3') {
          turnDamage = 0; // Habilidad de apoyo (Confidente de Androc)
        } else if (chosenSkill.id === 'A2') {
          // A2 (Estudiante de la Guerra): Escala con DEF, D.Critic y el tamaño total acumulado del Escudo
          const hasShield = actingActor.effects.some((e) => e.name === 'shield');
          const shieldBonus = hasShield
            ? Math.min(Math.round(Math.pow(Math.max(bossTurnCount, 0), 2.12) * 850), 3800000)
            : 40000;
          const titusCritMult = 1 + (rawCdmg / 100);
          const baseTitusHit = (buffedStatVal * 4.2 * titusCritMult * cbMitigationFactor);
          turnDamage = Math.round((baseTitusHit + shieldBonus + warmasterAvg) * bossDebuffMultiplier);
        } else {
          turnDamage = standardHitDamage;
        }
      } else if (isMikage && chosenSkill.id === 'A3') {
        // Lady Mikage A3 (Decreto Imperial): Ataque conjunto de todos los aliados
        turnDamage = Math.round(standardHitDamage * 2.8);
      } else if (chosenSkill.id === 'A3' && (isAnchorite || isWixwell)) {
        // Habilidades puras de bufos/curación sin daño directo
        turnDamage = 0;
      } else {
        turnDamage = standardHitDamage;
      }
    }

    // 6. Set cooldown for executed skill (passives don't burn turn cooldowns)
    if (!chosenSkill.isPassive) {
      chosenSkill.current_cooldown = chosenSkill.cooldown;
    }

    // 7. Snapshot de efectos y debufos ACTIVOS durante esta acción (capturado con el estado real durante el turno)
    const effectsSnapshot = allActors.flatMap((a) =>
      a.effects.map((e) => ({
        targetName: a.name,
        name: e.name,
        type: e.type,
        duration: e.duration,
        amount: e.amount,
      }))
    );

    const bossDebuffsSnapshot = bossActor.effects
      .filter((e) => e.type === 'debuff')
      .map((e) => ({
        name: e.name,
        type: 'debuff' as const,
        duration: e.duration,
        amount: e.amount,
      }));

    // 8. Reduce effect duration at turn-end for acting actor (Canonical Raid decay tras concluir la acción)
    actingActor.effects = actingActor.effects
      .map((e) => {
        if (e.isAddedThisTurn) {
          return { ...e, isAddedThisTurn: false };
        }
        if (e.name === 'intercept') {
          return e; // Las cargas de Intercept NO decaen por turnos
        }
        return e.reduceDurationAt === 'turn-end' ? { ...e, duration: e.duration - 1 } : e;
      })
      .filter((e) => e.duration > 0);

    turns.push({
      turnIndex: turns.length + 1,
      bossRound: bossTurnCount,
      bossPhase: currentPhase,
      actorId: actingActor.id,
      actorName: actingActor.name,
      actorSlot: actingActor.slotIndex,
      isBoss: actingActor.isBoss,
      color: actingActor.color,
      skillUsed: {
        id: chosenSkill.id,
        name: chosenSkill.name,
        alias: chosenSkill.alias,
      },
      isOpenerUsed: isOpenerUsed || undefined,
      turnMetersSnapshot: tmSnapshot,
      effectsSnapshot,
      stunTarget: stunTargetName,
      stunResult: stunResultStatus,
      bossDebuffs: bossDebuffsSnapshot,
      damageDealtThisTurn: turnDamage,
    });
  }

  // Resumen de daño acumulado y desglose por campeón
  const damageBreakdown: Record<string, number> = {};
  let totalTeamDamage = 0;
  turns.forEach((t) => {
    if (!t.isBoss && t.damageDealtThisTurn) {
      totalTeamDamage += t.damageDealtThisTurn;
      damageBreakdown[t.actorName] = (damageBreakdown[t.actorName] || 0) + t.damageDealtThisTurn;
    }
  });

  // Detectar si la composición tiene a Wixwell y extensores (Infinite Shield Setup)
  const champNames = teamMembers.map((m) => (m.championName || '').toLowerCase());
  const hasWixwell = champNames.some((n) => n.includes('wixwell'));
  const hasAnchorite = champNames.some((n) => n.includes('anchorite') || n.includes('anacoreta'));
  const hasMikage = champNames.some((n) => n.includes('mikage'));
  const isInfiniteShieldSetup = hasWixwell && (hasAnchorite || hasMikage);

  // Calcular métricas matemáticas de sintonía ("Cuadre") de cada campeón respecto a la velocidad del Boss
  const championSyncMetrics = teamMembers.map((m) => {
    const actor = actors.find((a) => a.slotIndex === m.slotIndex);
    const champTurns = turns.filter((t) => !t.isBoss && t.actorSlot === m.slotIndex);
    const turnsTaken = champTurns.length;
    const turnsPerBossTurn = bossTurnCount > 0 ? turnsTaken / bossTurnCount : 0;
    const trueSpd = actor?.trueSpeed || m.trueSpeed;
    const ratioVsBoss = bossBaseSpeed > 0 ? trueSpd / bossBaseSpeed : 0;
    const effectiveRatioWithSpdBuff = (trueSpd * 1.3) / bossBaseSpeed;

    let syncLabel = '⚠️ Descuadrado';
    let isSynced = false;

    if (turnsPerBossTurn >= 1.9) {
      syncLabel = '2:1 Cuadrado (2 turnos por ataque del Boss)';
      isSynced = true;
    } else if (turnsPerBossTurn >= 1.25 && turnsPerBossTurn <= 1.45) {
      syncLabel = '4:3 Cuadrado (4 turnos cada 3 del Boss)';
      isSynced = true;
    } else if (turnsPerBossTurn >= 0.95 && turnsPerBossTurn <= 1.05) {
      syncLabel = '1:1 Cuadrado (1 turno por ataque del Boss)';
      isSynced = true;
    } else if (effectiveRatioWithSpdBuff >= 1.75) {
      syncLabel = '⚠️ Descuadrado (Cercano a 2:1 pero pierde rotación)';
    }

    const champName = m.championName || `Slot ${m.slotIndex + 1}`;
    const champDmg = champTurns.reduce((acc, t) => acc + (t.damageDealtThisTurn || 0), 0);
    const damagePercent = totalTeamDamage > 0 ? Math.round((champDmg / totalTeamDamage) * 100) : 0;

    return {
      slotIndex: m.slotIndex,
      championName: champName,
      slotColor: m.color,
      trueSpeed: Math.round(trueSpd * 100) / 100,
      effectiveSpeed: Math.round(trueSpd * 1.3 * 100) / 100,
      ratioVsBoss: Math.round(ratioVsBoss * 100) / 100,
      turnsTaken,
      turnsPerBossTurn: Math.round(turnsPerBossTurn * 100) / 100,
      syncLabel,
      isSynced,
      damageDealt: champDmg,
      damagePercent,
    };
  });

  return {
    turns,
    totalBossTurns: bossTurnCount,
    champions: actors,
    totalTeamDamage,
    championDamageBreakdown: damageBreakdown,
    isInfiniteShieldSetup,
    bossDifficulty: difficulty,
    bossAffinity: affinity,
    bossSpeed: bossBaseSpeed,
    championSyncMetrics,
  };
}
