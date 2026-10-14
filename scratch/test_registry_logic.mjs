// Direct test of alias resolution in iconRegistry
const ALIAS_TO_FILENAME = {
  'shield': 'escudo-habilidad',
  'escudo': 'escudo-habilidad',
  'intercept': 'interceptar',
  'inmutable': 'interceptar',
  'speed-buff': 'aumentar-vel-2',
  'spd_2': 'aumentar-vel-2',
  'def-buff': 'aumentar-def-2',
  'counterattack': 'contraataque',
  'block-debuffs': 'bloquear-debufos',
};

const registered = new Set([
  'aumentar-atk-1', 'aumentar-atk-2', 'aumentar-d-crit-1', 'aumentar-d-crit-2',
  'aumentar-def-1', 'aumentar-def-2', 'aumentar-p-crit-1', 'aumentar-p-crit-2',
  'aumentar-punt-1', 'aumentar-punt-2', 'aumentar-vel-1', 'aumentar-vel-2',
  'bloquear-bufos', 'bloquear-dano', 'bloquear-debufos', 'contraataque',
  'curacion-continua-1', 'curacion-continua-2', 'default-buff', 'default-debuff',
  'escudo-de-magma', 'escudo-habilidad', 'escudo-set', 'fortalecer-1',
  'fortalecer-2', 'inmortal', 'interceptar', 'proteccion-de-aliado-1',
  'proteccion-de-aliado-2', 'reflejar-dano-1', 'reflejar-dano-2',
  'revivir-al-morir', 'velo-perfecto', 'velo'
]);

function testResolve(name, type) {
  const clean = name.toLowerCase();
  if (registered.has(clean)) {
    return { file: clean, registered: true };
  }
  const alias = ALIAS_TO_FILENAME[clean];
  if (alias && registered.has(alias)) {
    return { file: alias, registered: true };
  }
  const isDebuff = type === 'debuff' || clean.includes('debuff') || clean.includes('poison') || clean.includes('red-');
  return { file: isDebuff ? 'default-debuff' : 'default-buff', registered: false };
}

const tests = [
  { name: 'shield', type: 'buff', expected: 'escudo-habilidad' },
  { name: 'intercept', type: 'buff', expected: 'interceptar' },
  { name: 'speed-buff', type: 'buff', expected: 'aumentar-vel-2' },
  { name: 'counterattack', type: 'buff', expected: 'contraataque' },
  { name: 'block-debuffs', type: 'buff', expected: 'bloquear-debufos' },
  { name: 'poison', type: 'debuff', expected: 'default-debuff' },
  { name: 'red-def', type: 'debuff', expected: 'default-debuff' },
  { name: 'unknown-mystery-buff', type: 'buff', expected: 'default-buff' },
];

let allPassed = true;
tests.forEach(t => {
  const res = testResolve(t.name, t.type);
  const ok = res.file === t.expected;
  if (!ok) allPassed = false;
  console.log(`${ok ? '✓ PASS' : '✗ FAIL'}: ${t.name} -> ${res.file} (registered: ${res.registered})`);
});

console.log(`\nAll Passed: ${allPassed}`);
