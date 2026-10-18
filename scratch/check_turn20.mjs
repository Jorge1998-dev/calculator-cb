import fs from 'fs';
import { runClanBossSimulation } from './engine.mjs';
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

const result = runClanBossSimulation(teamMembers, 'Brutal', 'Void', 20);

let runningDamage = 0;
let bossTurnCount = 0;
let titusDmgAtTurn20 = [];

for (const t of result.turns) {
  if (t.isBoss) {
    bossTurnCount++;
  } else {
    runningDamage += t.damageDealtThisTurn || 0;
    if (bossTurnCount === 19 || bossTurnCount === 20) {
      if (t.actorName.includes('Titus')) {
        titusDmgAtTurn20.push({ turnIndex: t.turnIndex, bossRound: t.bossRound, skill: t.skillUsed.id, dmg: t.damageDealtThisTurn, totalSoFar: runningDamage });
      }
    }
  }
}

console.log('--- TITUS GOLPES EN TORNO AL TURNO 20 DEL BOSS ---');
console.log(titusDmgAtTurn20);
console.log(`\nDAÑO TOTAL ACUMULADO AL TURNO 20: ${runningDamage.toLocaleString()}`);
console.log('\nDesglose por campeón:');
for (const [c, d] of Object.entries(result.championDamageBreakdown)) {
  console.log(`- ${c}: ${d.toLocaleString()}`);
}
