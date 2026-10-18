import fs from 'fs';
import { runClanBossSimulation } from './calibrated_engine.mjs';
import { parseChampionSkills } from './skillUtils.mjs';

const rawChampions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));

const champNames = [
  'Lady Mikage',
  'Lydia the Deathsiren',
  'Anchorite',
  'Vault Keeper Wixwell',
  'Titus Plumanegra',
];
const speeds = [248, 245, 242, 238, 215];

const teamMembers = [0, 1, 2, 3, 4].map((idx) => {
  const targetName = champNames[idx];
  const found = rawChampions.find(
    (c) =>
      c.name.toLowerCase() === targetName.toLowerCase() ||
      (c.spanishName && c.spanishName.toLowerCase().includes(targetName.toLowerCase())) ||
      (c.englishName && c.englishName.toLowerCase().includes(targetName.toLowerCase()))
  );
  const baseSpd = found?.stats.spd || 100;
  const baseDef = found?.stats.def || 1400;
  const skills = parseChampionSkills(found || null);
  const tunedSkills = skills.map((sk) => {
    if (sk.id === 'A3') return { ...sk, isOpener: true, priority: 2 };
    if (sk.id === 'A2') return { ...sk, isOpener: false, priority: 3 };
    if (sk.id === 'A1') return { ...sk, priority: 1 };
    return sk;
  });
  return {
    id: `slot-${idx}`,
    slotIndex: idx,
    championName: found?.spanishName || targetName,
    championData: found || null,
    baseSpeed: baseSpd,
    totalSpeed: speeds[idx],
    baseDefense: baseDef,
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

// Run for 47 turns
const res47 = runClanBossSimulation(teamMembers, 'Brutal', 'Void', 47);

let dmgAt40 = 0;
let dmgAt46 = 0;
let titusHit46 = 0;
let bTurns = 0;
let totalSoFar = 0;

for (const t of res47.turns) {
  if (t.isBoss) {
    bTurns++;
    if (bTurns === 40) dmgAt40 = totalSoFar;
    if (bTurns === 46) dmgAt46 = totalSoFar;
  } else {
    totalSoFar += (t.damageDealtThisTurn || 0);
    if (t.actorName.includes('Titus') && (bTurns === 45 || bTurns === 46)) {
      titusHit46 = t.damageDealtThisTurn;
    }
  }
}

console.log('Telemetry Comparison:');
console.log(`- Simulator Total @ Turn 40: ${dmgAt40.toLocaleString()} (Real: 67,996,267)`);
console.log(`- Simulator Total @ Turn 46: ${dmgAt46.toLocaleString()} (Real: 93,040,805)`);
console.log(`- Simulator Titus Hit @ Turn 46: ${titusHit46.toLocaleString()} (Real: 7,677,657)`);
