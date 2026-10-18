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

// Replace Titus damage so:
// A3 = 0 damage (Support buff skill!)
// A1 = Normal damage (~120k * debuffMultiplier)
// A2 = Mega damage with shield scaling (7.67M / 5.37M)!
const correctTitusDamage = `
      if (isTitus) {
        if (chosenSkill.id === "A3") {
          turnDamage = 0;
        } else if (chosenSkill.id === "A2") {
          const hasShield = actingActor.effects.some((e) => e.name === "shield");
          const shieldScaleFactor = hasShield ? Math.min(Math.round(Math.pow(Math.max(bossTurnCount, 0), 2.2) * 829), 3800000) : 4e4;
          turnDamage = Math.round((6e4 + shieldScaleFactor) * bossDebuffMultiplier);
        } else {
          turnDamage = Math.round((45e3 + bossTurnCount * 800) * bossDebuffMultiplier);
        }
      } else {
        turnDamage = Math.round((35e3 + bossTurnCount * 1200) * bossDebuffMultiplier);
      }
`;

engineCode = engineCode.replace(/if \(isTitus\) \{[\s\S]*?\} else \{[\s\S]*?turnDamage = Math\.round\(\(35e3 \+ bossTurnCount \* 1200\) \* bossDebuffMultiplier\);[\s\S]*?\}/, correctTitusDamage);
fs.writeFileSync('scratch/realistic_engine.mjs', engineCode);

const { runClanBossSimulation } = await import('./realistic_engine.mjs');

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

console.log('--- REPORTE TELEMETRÍA EXACTA CON HABILIDADES CORRECTAS ---');
console.log(`Turno 5:  Sim=${dmgAt5.toLocaleString()} | Real=4,501,469`);
console.log(`Turno 20: Sim=${dmgAt20.toLocaleString()} | Real=27,581,119`);
console.log(`Turno 40: Sim=${dmgAt40.toLocaleString()} | Real=67,996,267`);
console.log(`Turno 46: Sim=${dmgAt46.toLocaleString()} | Real=93,040,805`);
console.log(`Turno 82: Sim=${dmgAt82.toLocaleString()} | Real=237,155,291`);
