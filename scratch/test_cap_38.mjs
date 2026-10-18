import fs from 'fs';
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

let engineCode = fs.readFileSync('scratch/engine.mjs', 'utf8');

// With cap of 3.8M instead of 8.5M:
// Max hit with weaken = (60k + 3.8M) * 2 = 7.72M!
// Max hit without weaken = (60k + 3.8M) * 1.6 = 6.17M!
const newFormula = `const shieldScaleFactor = hasShield ? Math.min(Math.round(Math.pow(Math.max(bossTurnCount, 0), 2.2) * 829), 3800000) : 4e4;`;
engineCode = engineCode.replace(/const shieldScaleFactor = hasShield \? Math\.min\(bossTurnCount \* 18e4, 18e6\) : 4e4;/, newFormula);
fs.writeFileSync('scratch/capped_engine.mjs', engineCode);

const { runClanBossSimulation } = await import('./capped_engine.mjs');

const res83 = runClanBossSimulation(teamMembers, 'Brutal', 'Void', 83);
let dmgAt5 = 0, dmgAt20 = 0, dmgAt40 = 0, dmgAt46 = 0, dmgAt82 = 0;
let bTurns = 0, totalSoFar = 0;

for (const t of res83.turns) {
  if (t.isBoss) {
    bTurns++;
    if (bTurns === 5) dmgAt5 = totalSoFar;
    if (bTurns === 20) dmgAt20 = totalSoFar;
    if (bTurns === 40) dmgAt40 = totalSoFar;
    if (bTurns === 46) dmgAt46 = totalSoFar;
    if (bTurns === 82) dmgAt82 = totalSoFar;
  } else {
    totalSoFar += (t.damageDealtThisTurn || 0);
  }
}

console.log('--- REPORTE TELEMETRÍA 5 PUNTOS REALES ---');
console.log(`Turno 5:  Sim=${dmgAt5.toLocaleString()} | Real=4,501,469`);
console.log(`Turno 20: Sim=${dmgAt20.toLocaleString()} | Real=27,581,119`);
console.log(`Turno 40: Sim=${dmgAt40.toLocaleString()} | Real=67,996,267`);
console.log(`Turno 46: Sim=${dmgAt46.toLocaleString()} | Real=93,040,805`);
console.log(`Turno 82: Sim=${dmgAt82.toLocaleString()} | Real=237,155,291`);
