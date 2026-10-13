const fs = require('fs');
const path = require('path');

const championsPath = path.join(__dirname, '../src/data/champions.json');
const sendaPath = path.join(__dirname, '../src/data/sendaplays_champions.json');
const avatarsPath = path.join(__dirname, '../src/data/championAvatars.json');

const champions = JSON.parse(fs.readFileSync(championsPath, 'utf8'));
const sendaList = JSON.parse(fs.readFileSync(sendaPath, 'utf8'));
const avatars = JSON.parse(fs.readFileSync(avatarsPath, 'utf8'));

function norm(s) {
  if (!s) return '';
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

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

const RARITY_MAP = {
  'mítico': 'Mythical',
  'mitico': 'Mythical',
  'mythical': 'Mythical',
  'legendario': 'Legendary',
  'legendary': 'Legendary',
  'épico': 'Epic',
  'epico': 'Epic',
  'epic': 'Epic',
  'raro': 'Rare',
  'rare': 'Rare',
  'poco común': 'Uncommon',
  'poco comun': 'Uncommon',
  'uncommon': 'Uncommon',
  'común': 'Common',
  'comun': 'Common',
  'common': 'Common',
};

const AFFINITY_MAP = {
  'vacío': 'Void',
  'vacio': 'Void',
  'void': 'Void',
  'fuerza': 'Force',
  'force': 'Force',
  'magia': 'Magic',
  'magic': 'Magic',
  'espíritu': 'Spirit',
  'espiritu': 'Spirit',
  'spirit': 'Spirit',
};

let matchedByStats = 0;
let matchedByName = 0;
let matchedBySlug = 0;
const matchedSendaIds = new Set();

// 1. First pass: direct name or slug match
sendaList.forEach(senda => {
  const normSendaName = norm(senda.name);
  const normSlug = norm(senda.slug);

  const found = champions.find(c => {
    return (
      norm(c.sendaSlug) === normSlug ||
      norm(c.name) === normSendaName ||
      norm(c.spanishName) === normSendaName ||
      norm(c.englishName) === normSendaName
    );
  });

  if (found) {
    matchedByName++;
    matchedSendaIds.add(senda.id);
    found.spanishName = senda.name;
    found.sendaSlug = senda.slug;
    found.spanishFaction = FACTION_MAP[senda.faction.toLowerCase()] || senda.faction;
    if (senda.image_url) {
      found.avatarUrl = senda.image_url;
      avatars[found.name.toLowerCase()] = senda.image_url;
      avatars[norm(found.name)] = senda.image_url;
      avatars[senda.name.toLowerCase()] = senda.image_url;
      avatars[norm(senda.name)] = senda.image_url;
      avatars[senda.slug] = senda.image_url;
    }
    found.sendaGuide = {
      slug: senda.slug,
      faction: found.spanishFaction,
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

// 2. Second pass: Match by exact stats within same faction & rarity
sendaList.forEach(senda => {
  if (matchedSendaIds.has(senda.id)) return;

  const sFaction = FACTION_MAP[senda.faction.toLowerCase()] || senda.faction;
  const sRarity = RARITY_MAP[senda.rarity?.toLowerCase()] || senda.rarity;
  const sHp = senda.stats?.hp;
  const sSpd = senda.stats?.speed;
  const sDef = senda.stats?.defense;

  if (!sHp || !sSpd || !sDef) return;

  const candidate = champions.find(c => {
    if (c.sendaSlug) return false; // already matched
    const cFaction = c.spanishFaction || FACTION_MAP[c.class?.faction?.toLowerCase()] || c.class?.faction;
    if (cFaction !== sFaction) return false;
    
    // Check stats
    const hpMatch = Math.abs((c.stats.hp || 0) - sHp) <= 10;
    const spdMatch = Math.abs((c.stats.spd || 0) - sSpd) <= 1;
    const defMatch = Math.abs((c.stats.def || 0) - sDef) <= 5;
    return hpMatch && spdMatch && defMatch;
  });

  if (candidate) {
    matchedByStats++;
    matchedSendaIds.add(senda.id);
    candidate.englishName = candidate.englishName || candidate.name;
    candidate.spanishName = senda.name;
    candidate.sendaSlug = senda.slug;
    candidate.spanishFaction = sFaction;
    if (senda.image_url) {
      candidate.avatarUrl = senda.image_url;
      avatars[candidate.name.toLowerCase()] = senda.image_url;
      avatars[norm(candidate.name)] = senda.image_url;
      avatars[senda.name.toLowerCase()] = senda.image_url;
      avatars[norm(senda.name)] = senda.image_url;
      avatars[senda.slug] = senda.image_url;
    }
    candidate.sendaGuide = {
      slug: senda.slug,
      faction: sFaction,
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

// 3. For any remaining Senda champions not in champions.json, create champion entry
let newlyCreated = 0;
sendaList.forEach(senda => {
  if (matchedSendaIds.has(senda.id)) return;

  const sFaction = FACTION_MAP[senda.faction.toLowerCase()] || senda.faction;
  const sRarity = RARITY_MAP[senda.rarity?.toLowerCase()] || 'Epic';
  const sAffinity = AFFINITY_MAP[senda.affinity?.toLowerCase()] || 'Void';

  const newChamp = {
    name: senda.name,
    spanishName: senda.name,
    englishName: senda.name,
    sendaSlug: senda.slug,
    spanishFaction: sFaction,
    class: {
      faction: sFaction,
      rarity: sRarity,
      role: senda.type || 'Attack',
      affinity: sAffinity,
    },
    stats: {
      hp: senda.stats?.hp || 15000,
      atk: senda.stats?.attack || 1000,
      def: senda.stats?.defense || 1000,
      spd: senda.stats?.speed || 100,
      crate: senda.stats?.critRate || 15,
      cmdg: senda.stats?.critDamage || 50,
      resist: senda.stats?.resistance || 30,
      acc: senda.stats?.accuracy || 0,
    },
    skills: (senda.skills || []).map((sk, idx) => ({
      cooldown: sk.cooldown || 0,
      booked_cooldown: sk.cooldown ? Math.max(sk.cooldown - 1, 1) : 0,
      cooldown_blocked: 0,
      damage_based_on: [senda.type === 'Defensa' ? 'DEF' : senda.type === 'Salud' ? 'HP' : 'ATK'],
      name: sk.name || `Habilidad ${idx + 1}`,
      description: sk.description || '',
      passive: sk.name?.toLowerCase().includes('pasiv') ? ['passive'] : [],
      effect: null,
      books: sk.levels || [],
    })),
    avatarUrl: senda.image_url,
    sendaGuide: {
      slug: senda.slug,
      faction: sFaction,
      role: senda.role,
      uses: senda.uses,
      gear: senda.gear,
      blessings: senda.blessings,
      relics: senda.relics,
      youtubeLink: senda.youtube_link,
      videoPreview: senda.video_preview,
      equipment: senda.equipment,
    },
  };

  champions.push(newChamp);
  matchedSendaIds.add(senda.id);
  newlyCreated++;

  if (senda.image_url) {
    avatars[senda.name.toLowerCase()] = senda.image_url;
    avatars[norm(senda.name)] = senda.image_url;
    avatars[senda.slug] = senda.image_url;
  }
});

fs.writeFileSync(championsPath, JSON.stringify(champions, null, 2), 'utf8');
fs.writeFileSync(avatarsPath, JSON.stringify(avatars, null, 2), 'utf8');

console.log(`Matched by name/slug: ${matchedByName}`);
console.log(`Matched by stats: ${matchedByStats}`);
console.log(`Newly created from Senda: ${newlyCreated}`);
console.log(`Total champions now: ${champions.length}`);
console.log(`Total Senda champs covered: ${matchedSendaIds.size} / ${sendaList.length}`);
