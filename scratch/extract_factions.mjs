import fs from 'fs';

const content = fs.readFileSync('C:/Users/jorge/.gemini/antigravity-ide/brain/86ea474a-4f6d-43dd-b831-1b5bc7ac2680/.system_generated/steps/1284/content.md', 'utf8');

const regex = /href="(\/guias-de-campeones\/[^"]+)"/g;
let m;
const factions = new Set();
while ((m = regex.exec(content)) !== null) {
  factions.add(m[1]);
}

console.log('Found faction links:');
console.log(Array.from(factions));
