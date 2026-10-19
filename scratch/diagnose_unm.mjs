import fs from 'fs';
import { runClanBossSimulation } from '../src/core/calculator/engine.ts';
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
      isLeader: idx === 3, // Wixwell Leader
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

for (const diff of ['Nightmare', 'Ultra-Nightmare']) {
  console.log(`\n=================== SIMULACION EN ${diff.toUpperCase()} ===================`);
  const res = runClanBossSimulation(buildTeam(), diff, 'Void', 25);
  
  let totalDmg = 0;
  let bTurn = 0;
  let turnsByBossRound = {};

  for (const t of res.turns) {
    if (t.isBoss) {
      bTurn++;
      turnsByBossRound[bTurn] = turnsByBossRound[bTurn] || [];
      turnsByBossRound[bTurn].push(`BOSS ${t.bossPhase}`);
    } else {
      totalDmg += (t.damageDealtThisTurn || 0);
      turnsByBossRound[bTurn + 1] = turnsByBossRound[bTurn + 1] || [];
      turnsByBossRound[bTurn + 1].push(`${t.actorName} [${t.skillUsed.id}]`);
    }
    if (bTurn === 19 && t.isBoss) {
      console.log(`>>> AL LLEGAR A TURNO DEL JEFE 19: Daño Acumulado = ${totalDmg.toLocaleString()}`);
    }
  }

  console.log(`Daño total acumulado a turno 20: ${totalDmg.toLocaleString()}`);
  
  // Imprimir rondas 1 a 6 y 18 a 21
  for (let r = 1; r <= 6; r++) {
    console.log(`Ronda ${r}: ${(turnsByBossRound[r] || []).join(', ')}`);
  }
  for (let r = 18; r <= 21; r++) {
    console.log(`Ronda ${r}: ${(turnsByBossRound[r] || []).join(', ')}`);
  }
}
