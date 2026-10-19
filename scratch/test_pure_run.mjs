import fs from 'fs';
import { runClanBossSimulation } from './pure_engine.ts';
import { parseChampionSkills } from '../src/core/calculator/skillUtils.ts';

const rawChampions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));

const champNames = [
  'Lady Mikage',
  'Lydia the Deathsiren',
  'Anchorite',
  'Vault Keeper Wixwell',
  'Titus Plumanegra',
];
const speeds = [248, 245, 242, 238, 215];

function buildTeam() {
  return [0, 1, 2, 3, 4].map((idx) => {
    const targetName = champNames[idx];
    const found = rawChampions.find(c => c.name.toLowerCase().includes(targetName.toLowerCase()));
    const skills = parseChampionSkills(found || null);
    const tunedSkills = skills.map((sk) => {
      if (sk.id === 'A3') return { ...sk, isOpener: true, priority: 2 };
      if (sk.id === 'A2') return { ...sk, isOpener: false, priority: 3 };
      if (sk.id === 'A1') return { ...sk, priority: 1 };
      return sk;
    });
    return {
      id: 'slot-' + idx,
      slotIndex: idx,
      championName: found?.spanishName || targetName,
      championData: found || null,
      baseSpeed: found?.stats.spd || 100,
      totalSpeed: speeds[idx],
      baseDefense: found?.stats.def || 1400,
      totalDefense: idx === 3 ? 4600 : idx === 4 ? 3800 : 3200,
      isLeader: idx === 3,
      auraType: idx === 3 ? 'def' : 'none',
      auraPercent: idx === 3 ? 30 : 0,
      hasNativeAura: idx === 3,
      customAuraPercent: 0,
      customDefAuraPercent: idx === 3 ? 30 : 0,
      overrideAura: false,
      equippedSets: [],
      set1: 'none',
      set2: 'none',
      set3: 'none',
      skillConfigs: tunedSkills,
      trueSpeed: speeds[idx],
      effectiveDefense: idx === 3 ? 4600 : idx === 4 ? 3800 : 3200,
      damageMitigation: 67,
      shieldMultiplier: 3,
    };
  });
}

console.log('=== PURE ENGINE: ULTRA-PESADILLA (190 SPD - VOID) ===');
const simUNM = runClanBossSimulation(buildTeam(), 'Ultra-Nightmare', 'Void', 20);
let actionsBeforeBoss = [];
let cur = [];
let bTurn = 0;
for (const t of simUNM.turns) {
  if (t.isBoss) {
    bTurn++;
    actionsBeforeBoss.push({ round: bTurn, phase: t.bossPhase, count: cur.length, actors: cur });
    cur = [];
  } else {
    cur.push(`${t.actorName.split(' ')[0]} (${t.skillUsed.id})`);
  }
}

for (const a of actionsBeforeBoss.slice(0, 10)) {
  console.log(`Boss Turn ${a.round} [${a.phase}] -> ${a.count} acciones: ${a.actors.join(', ')}`);
}

// Check buffs at Turn 19 in UNM
const t19Turn = simUNM.turns.find(t => t.bossRound === 19 && !t.isBoss);
if (t19Turn) {
  console.log('\n--- Estado de Bufos en Turno 19 de UNM ---');
  for (const name of champNames) {
    const effs = t19Turn.effectsSnapshot.filter(e => e.targetName.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(e.targetName.toLowerCase()));
    console.log(`- ${name}: ${effs.map(e => `${e.name}(${e.duration}t)`).join(', ') || 'Sin bufos'}`);
  }
}
