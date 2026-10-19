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

const res = runClanBossSimulation(team, 'Ultra-Nightmare', 'Force', 10);
let bTurn = 0;
console.log('--- REPORTE DE DURACIÓN DE ESCUDOS Y BUFOS EN UNM (RONDAS 1 A 10) ---');
for (const t of res.turns) {
  if (t.isBoss) {
    bTurn++;
    const bossDebuffs = (t.effectsSnapshot || []).filter(e => e.targetName === 'Clan Boss' && e.type === 'debuff');
    const bDebStr = bossDebuffs.map(d => `${d.name}:${d.duration}t`).join(', ') || 'Ninguno';
    console.log(`\n=== JEFE TURNO ${bTurn} (${t.bossPhase}) === [Debufs Boss: ${bDebStr}]`);
    
    for (const name of ['Lady Mikage', 'Lydia la Sirena', 'Anacoreta', 'Guardacámara Wixwell', 'Titus Plumanegra']) {
      const buffs = (t.effectsSnapshot || []).filter(e => e.targetName === name && e.type === 'buff');
      const shield = buffs.find(b => b.name === 'shield');
      const spd = buffs.find(b => b.name === 'speed-buff');
      const def = buffs.find(b => b.name === 'def-buff');
      console.log(`  ${name.padEnd(22)}: Escudo=${shield ? (shield.duration + 't').padEnd(3) : 'OFF'} | Vel=${spd ? (spd.duration + 't').padEnd(3) : 'OFF'} | Def=${def ? (def.duration + 't').padEnd(3) : 'OFF'} | (Total: ${buffs.length} bufos)`);
    }
  }
}
