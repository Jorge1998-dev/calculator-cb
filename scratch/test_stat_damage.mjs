import fs from 'fs';
import { runClanBossSimulation } from '../src/core/calculator/engine.ts';
import { parseChampionSkills } from '../src/core/calculator/skillUtils.ts';

const rawChampions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));
const champNames = ['Lady Mikage', 'Lydia the Deathsiren', 'Anchorite', 'Vault Keeper Wixwell', 'Titus Plumanegra'];
const speeds = [248, 245, 242, 238, 215];

const team = [0, 1, 2, 3, 4].map((idx) => {
  const targetName = champNames[idx];
  const found = rawChampions.find(c => c.name.toLowerCase() === targetName.toLowerCase() || (c.spanishName && c.spanishName.toLowerCase().includes(targetName.toLowerCase())) || (c.englishName && c.englishName.toLowerCase().includes(targetName.toLowerCase())));
  const skills = parseChampionSkills(found || null);
  const tunedSkills = skills.map(sk => {
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
    baseHP: idx === 0 ? 21645 : idx === 3 ? 18500 : idx === 4 ? 18495 : 19155,
    totalHP: idx === 3 ? 52000 : idx === 4 ? 48000 : idx === 0 ? 44000 : idx === 1 ? 48000 : 50000,
    baseAttack: idx === 0 ? 1200 : idx === 3 ? 850 : idx === 4 ? 837 : 1046,
    totalAttack: idx === 0 ? 4200 : idx === 1 ? 3100 : idx === 2 ? 2200 : idx === 3 ? 1600 : 1800,
    baseCritRate: 15,
    totalCritRate: idx === 3 ? 85 : idx === 2 ? 75 : 100,
    baseCritDamage: idx === 3 || idx === 4 ? 63 : 50,
    totalCritDamage: idx === 4 ? 240 : idx === 0 ? 220 : idx === 1 ? 200 : idx === 3 ? 180 : 150,
    primaryStat: idx === 3 || idx === 4 ? 'DEF' : 'ATK',
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
    effectiveAttack: idx === 0 ? 4200 : idx === 1 ? 3100 : idx === 2 ? 2200 : idx === 3 ? 1600 : 1800,
    effectiveHP: idx === 3 ? 52000 : idx === 4 ? 48000 : idx === 0 ? 44000 : idx === 1 ? 48000 : 50000,
    effectiveCritRate: idx === 3 ? 85 : idx === 2 ? 75 : 100,
    effectiveCritDamage: idx === 4 ? 240 : idx === 0 ? 220 : idx === 1 ? 200 : idx === 3 ? 180 : 150,
    damageMitigation: 67,
    shieldMultiplier: 3,
  };
});

const res = runClanBossSimulation(team, 'Ultra-Nightmare', 'Force', 23);
let totalDmg = 0;
let bTurn = 0;
for (const t of res.turns) {
  if (t.isBoss) {
    bTurn++;
    if (bTurn === 22) {
      console.log(`>>> JEFE TURNO 22: Daño acumulado simulado = ${totalDmg.toLocaleString()} (Captura de Jorge: 24,079,113)`);
    }
  } else {
    totalDmg += (t.damageDealtThisTurn || 0);
  }
}
console.log(`Daño total final: ${totalDmg.toLocaleString()}`);
