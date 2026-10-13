import fs from 'fs';

const rawChamps = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));
const sendaChamps = JSON.parse(fs.readFileSync('src/data/sendaplays_champions.json', 'utf8'));

console.log(`Original champions.json: ${rawChamps.length}`);
console.log(`SendaPlays champions: ${sendaChamps.length}`);

// Build lookup map from SendaPlays by Spanish name and slug
const sendaByName = new Map();
const sendaBySlug = new Map();

for (const sc of sendaChamps) {
  sendaByName.set(sc.name.toLowerCase().trim(), sc);
  sendaBySlug.set(sc.slug.toLowerCase().trim(), sc);
  const unaccented = sc.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  sendaByName.set(unaccented, sc);
}

// Check how many match
let matched = 0;
for (const rc of rawChamps) {
  const n = rc.name.toLowerCase().trim();
  const unaccented = rc.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const found = sendaByName.get(n) || sendaByName.get(unaccented);
  if (found) {
    matched++;
    rc.avatarUrl = found.image_url;
    rc.spanishName = found.name;
    rc.spanishFaction = found.faction;
    rc.sendaSlug = found.slug;
  }
}

console.log(`Matched ${matched} / ${rawChamps.length} champions directly!`);

// Let's check Titus Plumanegra
const titusSenda = sendaByName.get('titus plumanegra');
console.log('Titus Senda exists?', Boolean(titusSenda));
if (titusSenda) {
  // Check if Titus is in rawChamps
  const hasTitus = rawChamps.find(c => c.name.toLowerCase().includes('titus') || (c.spanishName && c.spanishName.toLowerCase().includes('titus')));
  console.log('Titus in rawChamps?', Boolean(hasTitus));
  if (!hasTitus) {
    console.log('Adding Titus Plumanegra to rawChamps from SendaPlays!');
    rawChamps.push({
      name: titusSenda.name,
      spanishName: titusSenda.name,
      spanishFaction: titusSenda.faction,
      sendaSlug: titusSenda.slug,
      avatarUrl: titusSenda.image_url,
      class: {
        faction: 'Banner Lords', // Hidalgos
        rarity: titusSenda.rarity === 'Legendario' ? 'Legendary' : titusSenda.rarity,
        role: 'Defense',
        affinity: 'Void'
      },
      stats: {
        hp: titusSenda.stats.hp,
        atk: titusSenda.stats.attack,
        def: titusSenda.stats.defense,
        spd: titusSenda.stats.speed,
        crate: titusSenda.stats.critRate,
        cmdg: titusSenda.stats.critDamage,
        resist: titusSenda.stats.resistance,
        acc: titusSenda.stats.accuracy
      },
      skills: titusSenda.skills.map((sk, idx) => ({
        name: sk.name,
        cooldown: sk.cooldown || 0,
        booked_cooldown: sk.cooldown ? Math.max(0, sk.cooldown - (sk.levels ? sk.levels.filter(l => l.includes('Reutilización')).length : 0)) : 0,
        description: sk.description,
        damage_based_on: ['DEF'],
        passive: sk.name.includes('Pasiva') ? [{ id: 'passive_skill' }] : [],
        books: sk.levels || [],
        effect: sk.buffDebuff ? sk.buffDebuff.map(b => ({ id: 'add_buff', buff: b })) : null
      }))
    });
  }
}

// Save enriched champions.json
fs.writeFileSync('src/data/champions.json', JSON.stringify(rawChamps, null, 2));
console.log(`Saved enriched champions.json with ${rawChamps.length} champions!`);
