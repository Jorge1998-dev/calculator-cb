import fs from 'fs';

// Let's test the damage formula with Jorge's team stats:
const team = [
  { name: 'Lady Mikage', stat: 'ATK', val: 4200, crate: 100, cdmg: 220 },
  { name: 'Lydia la Sirena', stat: 'ATK', val: 3100, crate: 100, cdmg: 200 },
  { name: 'Anacoreta', stat: 'ATK', val: 2200, crate: 75, cdmg: 150 },
  { name: 'Guardacámara Wixwell', stat: 'DEF', val: 4600, crate: 85, cdmg: 180 },
  { name: 'Titus Plumanegra', stat: 'DEF', val: 3800, crate: 100, cdmg: 240 },
];

console.log("Calculando daño base promedio por golpe con Debufs Boss (Disminuir DEF + Debilitar = 2.0x):");
for (const c of team) {
  const isDef = c.stat === 'DEF';
  const buffedStat = c.val * (isDef ? 1.6 : 1.5);
  const critMult = 1 + (c.crate / 100) * (c.cdmg / 100);
  const skillMult = 3.6; // average
  // Against UNM Clan Boss Armor with -60% DEF
  const rawHit = (buffedStat * skillMult * critMult * 0.38) * 2.0 + 39000;
  console.log(`  ${c.name.padEnd(22)} (${c.stat}: ${c.val}, CDMG: ${c.cdmg}%): ~${Math.round(rawHit).toLocaleString()} dmg por ataque`);
}
