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

// Using: Math.min(Math.round(Math.pow(Math.max(bossTurnCount, 0), 1.68) * 3950), 7500000)
// At 20: 20^1.68 = 153.2 * 3950 = 605,140. (60000 + 605140) * 2 = 1,330,280!
// At 5: 5^1.68 = 15.02 * 3950 = 59,329. (60000 + 59329) * 2 = 238,658!
const newFormula = `const shieldScaleFactor = hasShield ? Math.min(Math.round(Math.pow(Math.max(bossTurnCount, 0), 1.68) * 3950), 7500000) : 4e4;`;
engineCode = engineCode.replace(/const shieldScaleFactor = hasShield \? Math\.min\(bossTurnCount \* 18e4, 18e6\) : 4e4;/, newFormula);
fs.writeFileSync('scratch/calibrated_engine.mjs', engineCode);

const { runClanBossSimulation } = await import('./calibrated_engine.mjs');

// Test 20 turns
const res20 = runClanBossSimulation(teamMembers, 'Brutal', 'Void', 20);
let dmgAt5 = 0;
let dmgAt20 = 0;
let titusHits = [];
let bTurns = 0;
let totalSoFar = 0;

for (const t of res20.turns) {
  if (t.isBoss) {
    bTurns++;
    if (bTurns === 5) dmgAt5 = totalSoFar;
    if (bTurns === 20) dmgAt20 = totalSoFar;
  } else {
    totalSoFar += (t.damageDealtThisTurn || 0);
    if (t.actorName.includes('Titus')) {
      titusHits.push({ bossRound: t.bossRound, dmg: t.damageDealtThisTurn, totalSoFar });
    }
  }
}

console.log(`Calibrated Results:`);
console.log(`- Total Damage at Boss Turn 5: ${dmgAt5.toLocaleString()}`);
console.log(`- Total Damage at Boss Turn 20: ${dmgAt20.toLocaleString()}`);
console.log(`- Titus Hit at Round 19/20: ${titusHits[titusHits.length - 1].dmg.toLocaleString()}`);

// Test 137 turns
const res137 = runClanBossSimulation(teamMembers, 'Brutal', 'Void', 137);
console.log(`- Total Damage at Boss Turn 137: ${res137.totalTeamDamage.toLocaleString()}`);
