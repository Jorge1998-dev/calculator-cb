import fs from 'fs';

// Read engine
let code = fs.readFileSync('src/core/calculator/engine.ts', 'utf8');

// Replace do-while with while
code = code.replace(
  'do {\n        for (const actor of allActors) {',
  'while (allActors.every((a) => a.turnMeter < 100)) {\n        for (const actor of allActors) {'
);
code = code.replace(
  '} while (allActors.every((a) => a.turnMeter < 100));',
  '}'
);

// Remove artificial decay protections
code = code.replace(
  `        // Bufos colocados en la misma ronda del Boss antes de su impacto no decaen en la preparación
        if (e.type === 'buff' && e.appliedAtBossRound === bossTurnCount) {
          return e;
        }
        if (didExtendBuffsThisTurn && e.type === 'buff') {
          return e;
        }`,
  `        // Decaimiento natural al terminar el turno de la entidad activa`
);

fs.writeFileSync('scratch/pure_engine.ts', code);
console.log('pure_engine.ts created!');
