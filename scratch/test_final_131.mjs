import fs from 'fs';
import { runClanBossSimulation } from './engine_updated.mjs';
import { parseChampionSkills } from './skillUtils.mjs';

const rawChampions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));

// Exact team from screenshot: Wixwell, Titus, Demytha, Lydia, Lady Mikage
const champNames = [
  'Vault Keeper Wixwell',
  'Titus Plumanegra',
  'Demytha',
  'Lydia the Deathsiren',
  'Lady Mikage',
];
const speeds = [238, 215, 242, 245, 248];

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
    totalDefense: idx === 0 ? 4600 : idx === 1 ? 3800 : 3200,
    isLeader: idx === 0, // Wixwell Leader
    auraType: idx === 0 ? 'def' : 'none',
    auraPercent: idx === 0 ? 28 : 0, // 28% DEF aura in screenshot
    hasNativeAura: idx === 0,
    customAuraPercent: 0,
    customDefAuraPercent: idx === 0 ? 28 : 0,
    overrideAura: false,
    equippedSets: [],
    set1: 'none',
    set2: 'none',
    set3: 'none',
    skillConfigs: tunedSkills,
    trueSpeed: speeds[idx],
    effectiveDefense: idx === 0 ? 4600 : idx === 1 ? 3800 : 3200,
    damageMitigation: 67,
    shieldMultiplier: 3,
  };
});

// Run for 131 turns on Nightmare
const res131 = runClanBossSimulation(teamMembers, 'Nightmare', 'Void', 131);

console.log('=== RESULTADO SIMULADOR 131 TURNOS (PESADILLA) ===');
console.log(`Daño Total Simulador: ${res131.totalTeamDamage.toLocaleString()}`);
console.log(`Daño Total Real (Juego): 424,610,026 (424.6M)`);
console.log('\nDesglose por Campeón:');
for (const [name, dmg] of Object.entries(res131.championDamageBreakdown)) {
  console.log(`- ${name}: ${dmg.toLocaleString()}`);
}
