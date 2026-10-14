import fs from 'fs';
import path from 'path';

// Read all filenames from src/assets/icons
const iconsDir = path.resolve('src/assets/icons');
const files = fs.readdirSync(iconsDir);

console.log(`Registered files in src/assets/icons (${files.length}):`);
files.forEach(f => console.log(` - ${f}`));

// Test common queries
const testCases = [
  { name: 'shield', type: 'buff' },
  { name: 'intercept', type: 'buff' },
  { name: 'speed-buff', type: 'buff' },
  { name: 'def-buff', type: 'buff' },
  { name: 'counterattack', type: 'buff' },
  { name: 'block-debuffs', type: 'buff' },
  { name: 'poison', type: 'debuff' }, // Not in folder -> should be default debuff
  { name: 'red-def', type: 'debuff' }, // Not in folder -> should be default debuff
  { name: 'unknown-buff-xyz', type: 'buff' }, // Not in folder -> should be default buff
];

console.log('\nTest Case Evaluation:');
testCases.forEach(tc => {
  const isDebuff = tc.type === 'debuff' || tc.name.includes('debuff') || tc.name.includes('red-') || tc.name.includes('poison');
  const clean = tc.name.toLowerCase();
  
  // Simulated lookup
  const registered = files.map(f => f.replace(/\.(webp|png|svg)$/i, '').toLowerCase());
  const found = registered.includes(clean);
  console.log(`[${tc.name}] (${tc.type}) -> ${found ? 'REGISTERED ICON' : (isDebuff ? 'DEFAULT DEBUFF ICON (default-debuff.svg)' : 'DEFAULT BUFF ICON (default-buff.svg)')}`);
});
