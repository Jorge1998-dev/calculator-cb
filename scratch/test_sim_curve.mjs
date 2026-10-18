import fs from 'fs';

// Let's test simulation with calibrated curve
// In engine, each boss round has champions attacking.
// At power 1.4 - 1.6:
// Let's simulate turn by turn and compute totals at turn 5, 20, 137.

function runTest(power) {
  const c = 602500 / Math.pow(20, power);
  
  let totalDmg = 0;
  let totalAt5 = 0;
  let totalAt20 = 0;
  let titusHit20 = 0;
  let titusHit5 = 0;
  
  // 137 boss rounds
  for (let round = 0; round < 137; round++) {
    // Other 4 champs: ~4 actions with buffs/debuffs
    // Base damage per non-Titus action: ~35k * 2.0 = 70k, plus Warmaster procs ~65k
    // Total other 4 champs per round: ~4 * 80k = 320k
    const otherChampsDmg = 4 * 75000;
    
    // Titus acts 1 to 2 times per round (let's say 1.6 times per round in 2:1 tune)
    const factor = Math.min(c * Math.pow(Math.max(round, 1), power), 8500000);
    const titusHit = Math.round((60000 + factor) * 2.0);
    const titusRoundDmg = titusHit * 1.6;
    
    totalDmg += otherChampsDmg + titusRoundDmg;
    
    if (round === 4) {
      totalAt5 = totalDmg;
      titusHit5 = titusHit;
    }
    if (round === 19) {
      totalAt20 = totalDmg;
      titusHit20 = titusHit;
    }
  }
  
  console.log(`Power ${power}: Total@5=${totalAt5.toLocaleString()}, Total@20=${totalAt20.toLocaleString()}, Hit@20=${titusHit20.toLocaleString()}, Total@137=${totalDmg.toLocaleString()}`);
}

for (const p of [1.4, 1.45, 1.5, 1.55, 1.6, 1.7]) {
  runTest(p);
}
