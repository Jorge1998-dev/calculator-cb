import fs from 'fs';

const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));
const lydia = champions.find(c => c.name.toLowerCase().includes('lydia the deathsiren'));

console.log('Lydia skills count:', lydia.skills.length);
for (const s of lydia.skills) {
  console.log(`- ${s.name} (CD: ${s.cooldown}, Booked: ${s.booked_cooldown})`);
}
