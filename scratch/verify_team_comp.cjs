const fs = require('fs');
const path = require('path');

const champions = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/champions.json'), 'utf8'));

// Build team of: Wixwell, Titus, Anchorite, Lydia, Mikage
const wix = champions.find(c => (c.spanishName || c.name).toLowerCase().includes('wixwell'));
const titus = champions.find(c => (c.spanishName || c.name).toLowerCase().includes('titus'));
const anc = champions.find(c => (c.spanishName || c.name).toLowerCase().includes('anacoreta') || (c.name || '').toLowerCase().includes('anchorite'));
const lyd = champions.find(c => (c.spanishName || c.name).toLowerCase().includes('lydia'));
const mik = champions.find(c => (c.spanishName || c.name).toLowerCase().includes('mikage'));

console.log('Selected team:');
console.log('1. Leader:', wix ? (wix.spanishName || wix.name) : 'Missing');
console.log('2. DPS:', titus ? (titus.spanishName || titus.name) : 'Missing');
console.log('3. Extender 1:', anc ? (anc.spanishName || anc.name) : 'Missing');
console.log('4. Debuffer/Blocker:', lyd ? (lyd.spanishName || lyd.name) : 'Missing');
console.log('5. Extender 2:', mik ? (mik.spanishName || mik.name) : 'Missing');
