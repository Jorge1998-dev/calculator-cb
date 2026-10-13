const fs = require('fs');
const path = require('path');

const championsPath = path.join(__dirname, '../src/data/champions.json');
const sendaPath = path.join(__dirname, '../src/data/sendaplays_champions.json');

const champions = JSON.parse(fs.readFileSync(championsPath, 'utf8'));
const sendaList = JSON.parse(fs.readFileSync(sendaPath, 'utf8'));

// Build lookup map for Senda champions
const sendaBySlug = new Map();
const sendaByNameNorm = new Map();

function norm(s) {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

sendaList.forEach(c => {
  if (c.slug) sendaBySlug.set(norm(c.slug), c);
  if (c.name) sendaByNameNorm.set(norm(c.name), c);
});

// Map English or abbreviated faction names to official Spanish
const FACTION_MAP = {
  'banner lords': 'Hidalgos',
  'hidalgos': 'Hidalgos',
  'high elves': 'Altos Elfos',
  'altos elfos': 'Altos Elfos',
  'sacred order': 'Orden Sagrada',
  'orden sagrada': 'Orden Sagrada',
  'barbarians': 'Bárbaros',
  'bárbaros': 'Bárbaros',
  'barbaros': 'Bárbaros',
  'ogryn tribes': 'Ogretes',
  'ot': 'Ogretes',
  'ogretes': 'Ogretes',
  'lizardmen': 'Hombres Lagarto',
  'hombres lagarto': 'Hombres Lagarto',
  'skinwalkers': 'Cambiapieles',
  'cambiapieles': 'Cambiapieles',
  'orcs': 'Orcos',
  'orcos': 'Orcos',
  'demonspawn': 'Engendros',
  'engendros': 'Engendros',
  'undead hordes': 'No Muertos',
  'undead': 'No Muertos',
  'no muertos': 'No Muertos',
  'dark elves': 'Elfos Oscuros',
  'elfos oscuros': 'Elfos Oscuros',
  'knights revenant': 'Aparecidos',
  'knight revenant': 'Aparecidos',
  'aparecidos': 'Aparecidos',
  'dwarves': 'Enanos',
  'enanos': 'Enanos',
  'shadowkin': 'Sombríos',
  'sombrios': 'Sombríos',
  'sombríos': 'Sombríos',
  'sylvan watchers': 'Vigías Silvanos',
  'vigías silvanos': 'Vigías Silvanos',
  'vigias silvanos': 'Vigías Silvanos',
  'ar': 'Argonitas',
  'argonitas': 'Argonitas',
};

let enrichedCount = 0;
champions.forEach(c => {
  // Determine standard Spanish faction
  const rawFaction = (c.spanishFaction || c.class?.faction || '').toLowerCase().trim();
  const stdFaction = FACTION_MAP[rawFaction] || c.spanishFaction || c.class?.faction || 'Desconocida';
  c.spanishFaction = stdFaction;

  // Try to match with senda champion
  const normName = norm(c.name);
  const normEng = norm(c.englishName);
  const normSpanish = norm(c.spanishName);
  const normSlug = norm(c.sendaSlug);

  const senda =
    sendaBySlug.get(normSlug) ||
    sendaByNameNorm.get(normSpanish) ||
    sendaByNameNorm.get(normName) ||
    sendaByNameNorm.get(normEng);

  if (senda) {
    enrichedCount++;
    c.sendaSlug = senda.slug;
    c.spanishName = senda.name;
    c.spanishFaction = senda.faction === 'Sombrios' ? 'Sombríos' : senda.faction;
    if (senda.image_url) {
      c.avatarUrl = senda.image_url;
    }
    // Store useful Senda guide data directly
    c.sendaGuide = {
      slug: senda.slug,
      faction: c.spanishFaction,
      role: senda.role,
      uses: senda.uses,
      gear: senda.gear,
      blessings: senda.blessings,
      relics: senda.relics,
      youtubeLink: senda.youtube_link,
      videoPreview: senda.video_preview,
      equipment: senda.equipment,
    };
  }
});

fs.writeFileSync(championsPath, JSON.stringify(champions, null, 2), 'utf8');
console.log(`Updated champions.json. Enriched with SendaPlays guide data: ${enrichedCount}/${champions.length}`);

// Verify factions distribution
const counts = {};
champions.forEach(c => {
  counts[c.spanishFaction] = (counts[c.spanishFaction] || 0) + 1;
});
console.log('Final Spanish Factions Distribution:', counts);
