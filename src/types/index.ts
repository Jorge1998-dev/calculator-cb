export type ClanBossDifficulty =
  | 'Easy'
  | 'Normal'
  | 'Hard'
  | 'Brutal'
  | 'Nightmare'
  | 'Ultra-Nightmare';

export type ClanBossAffinity = 'Void' | 'Spirit' | 'Force' | 'Magic';

export interface SkillEffect {
  id: string;
  amount?: number;
  turns?: number;
  enemy?: string;
  champions?: string;
  buff?: string;
  debuff?: string;
}

export interface SkillData {
  name: string;
  description: string;
  cooldown: number;
  booked_cooldown: number;
  cooldown_blocked?: number;
  damage_based_on?: string[];
  passive?: unknown[];
  effect?: SkillEffect[] | SkillEffect | null;
  books?: string[];
}

export interface ChampionClass {
  faction: string;
  rarity: 'Mythical' | 'Legendary' | 'Epic' | 'Rare' | 'Uncommon' | 'Common';
  role: 'Attack' | 'Defense' | 'Health' | 'Support';
  affinity: 'Force' | 'Magic' | 'Spirit' | 'Void';
}

export interface ChampionStats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  crate: number;
  cmdg?: number;
  cdmg?: number;
  resist: number;
  acc: number;
}

export interface ChampionData {
  name: string;
  class: ChampionClass;
  stats: ChampionStats;
  skills: SkillData[];
  avatarUrl?: string;
  spanishName?: string;
  englishName?: string;
  spanishFaction?: string;
  sendaSlug?: string;
  sendaGuide?: {
    slug: string;
    faction: string;
    role?: string;
    uses?: string;
    gear?: string[];
    blessings?: string[];
    relics?: string[];
    youtubeLink?: string | null;
    videoPreview?: string | null;
    equipment?: Record<string, unknown>;
  };
}

export interface SkillConfig {
  id: string; // e.g. 'A1', 'A2', 'A3', 'A4', 'P1', 'P2'
  alias: string;
  name: string;
  priority: number; // 1 = highest, 4 = lowest, 0 = disabled / passive
  cooldown: number;
  delay: number; // initial turns to wait before using
  current_cooldown?: number;
  isPassive?: boolean; // True if this skill is situational / passive (cannot be actively queued)
  disabled?: boolean; // True if this skill is blocked / "No Usar" in rotation
  isOpener?: boolean; // True if this skill is configured as the initial opening move (Apertura / Inicial)
  damageBasedOn?: string[]; // e.g. ['DEF'], ['HP'], ['ATK'], ['DEF', 'HP']
  damageStat?: DamageStatScaling;
}

export type DamageStatScaling =
  | 'DEF'
  | 'ATK'
  | 'HP'
  | 'DEF_HP' // Híbrido DEF + HP (Titus Plumanegra, tanques de salud)
  | 'ATK_DEF' // Híbrido ATK + DEF
  | 'ATK_HP' // Híbrido ATK + HP
  | 'ATK_SPD'; // Híbrido ATK + SPD

export type ArtifactSetChoice =
  | 'none'
  | 'speed'
  | 'perception'
  | 'righteous'
  | 'swift_parry'
  | 'protection_2'
  | 'protection_5'
  | 'supersonic_2'
  | 'killstroke'
  | 'divine_speed'
  | 'defense'
  | 'life'
  | 'immortal'
  | 'accuracy'
  | 'resistance'
  | 'critical_rate'
  | 'cruel'
  | 'defiant'
  | 'resilience'
  | 'toxic'
  | 'lifesteal'
  | 'stalwart'
  | 'savage'
  | 'lethal'
  | 'reflex'
  | 'relentless'
  | 'guardian'
  | 'bolster'
  | 'stone_skin';

export type AuraType = 'none' | 'spd' | 'def' | 'hp' | 'atk' | 'acc' | 'res' | 'crate';

export interface EquippedSet {
  id: string;
  set: string;
  pieces: number;
}

export interface TeamMemberConfig {
  id: string;
  slotIndex: number;
  color: string;
  colorAccent: string;
  championName: string;
  championData: ChampionData | null;
  isLeader: boolean;
  baseSpeed: number;
  totalSpeed: number;
  baseDefense: number;
  totalDefense: number;
  auraType: AuraType;
  auraPercent: number;
  hasNativeAura: boolean;
  nativeAuraDesc?: string;
  customAuraPercent: number; // User editable speed aura % (Leader applies to team)
  customDefAuraPercent: number; // User editable defense aura % (Leader applies to team)
  overrideAura?: boolean; // Whether member overrides the leader's aura
  hasLoreOfSteel: boolean;
  equippedSets: EquippedSet[]; // Up to 9 pieces total across 6 artifacts + 3 accessories
  set1: ArtifactSetChoice;
  set2: ArtifactSetChoice;
  set3: ArtifactSetChoice;
  trueSpeed: number;
  effectiveDefense: number; // Total DEF + Aura bonus
  damageMitigation: number; // % damage mitigation vs Clan Boss
  shieldMultiplier: number; // Shield durability factor (1 + DEF/1200)
  // Estadísticas completas de combate para modelado de daño exacto
  baseHP?: number;
  totalHP?: number;
  effectiveHP?: number;
  baseAttack?: number;
  totalAttack?: number;
  effectiveAttack?: number;
  baseCritRate?: number;
  totalCritRate?: number; // P.Critic en % (ej. 100%)
  effectiveCritRate?: number;
  baseCritDamage?: number;
  totalCritDamage?: number; // D.Critic en % (ej. 240%)
  effectiveCritDamage?: number;
  primaryStat?: DamageStatScaling;
  skillConfigs: SkillConfig[];
}

export interface ClanBossConfig {
  difficulty: ClanBossDifficulty;
  affinity: ClanBossAffinity;
  speed: number;
  speedAura: number;
}

export interface SimulationActorState {
  id: string;
  name: string;
  slotIndex: number;
  color: string;
  isBoss: boolean;
  totalSpeed: number;
  baseSpeed: number;
  trueSpeed: number;
  turnMeter: number;
  hasExtraTurn: boolean;
  hasUsedOpener?: boolean; // Rastrear si el campeón ya realizó su primer turno de combate
  effects: Array<{
    name: string;
    type: 'buff' | 'debuff';
    duration: number;
    amount?: number;
    reduceDurationAt: 'turn-start' | 'turn-end';
    isAddedThisTurn?: boolean;
    appliedAtBossRound?: number;
  }>;
  skillConfigs: SkillConfig[];
}

export interface SimulationTurnLog {
  turnIndex: number;
  bossRound: number;
  bossPhase: 'AOE1' | 'AOE2' | 'STUN';
  actorId: string;
  actorName: string;
  actorSlot: number;
  isBoss: boolean;
  color: string;
  skillUsed: {
    id: string;
    name: string;
    alias: string;
  };
  isOpenerUsed?: boolean;
  turnMetersSnapshot: Array<{
    actorId: string;
    actorName: string;
    slotIndex: number;
    turnMeter: number;
  }>;
  effectsSnapshot: Array<{
    targetName: string;
    name: string;
    type: 'buff' | 'debuff';
    duration: number;
    amount?: number;
  }>;
  // Specific Clan Boss Stun & Debuffs telemetry
  stunTarget?: string;
  stunResult?: 'blocked' | 'intercepted' | 'stunned';
  isStunnedTurnSkipped?: boolean;
  bossDebuffs?: Array<{
    name: string;
    type: 'debuff';
    duration: number;
    amount?: number;
  }>;
  shieldTotalPower?: number;
  damageDealtThisTurn?: number;
  totalCumulativeDamage?: number;
}

export interface ChampionSyncMetric {
  slotIndex: number;
  championName: string;
  slotColor?: string;
  trueSpeed: number;
  effectiveSpeed: number;
  ratioVsBoss: number;
  turnsTaken: number;
  turnsPerBossTurn: number;
  syncLabel: string;
  isSynced: boolean;
  damageDealt?: number;
  damagePercent?: number;
}

export interface SimulationResult {
  turns: SimulationTurnLog[];
  totalBossTurns: number;
  champions: SimulationActorState[];
  totalTeamDamage?: number;
  championDamageBreakdown?: Record<string, number>;
  maxShieldReached?: number;
  isInfiniteShieldSetup?: boolean;
  bossDifficulty: ClanBossDifficulty;
  bossAffinity: ClanBossAffinity;
  bossSpeed: number;
  championSyncMetrics?: ChampionSyncMetric[];
}
