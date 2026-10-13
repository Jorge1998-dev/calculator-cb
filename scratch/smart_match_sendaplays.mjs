import fs from 'fs';

const rawChamps = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));
const sendaChamps = JSON.parse(fs.readFileSync('src/data/sendaplays_champions.json', 'utf8'));

// Faction mapping English <-> Spanish
const factionMap = {
  'Banner Lords': 'Hidalgos',
  'High Elves': 'Altos Elfos',
  'Sacred Order': 'Orden Sagrada',
  'Barbarians': 'Bárbaros',
  'Ogryn Tribes': 'Ogretes',
  'Lizardmen': 'Hombres Lagarto',
  'Skinwalkers': 'Cambiapieles',
  'Orcs': 'Orcos',
  'Demonspawn': 'Engendros',
  'Undead Hordes': 'No Muertos',
  'Dark Elves': 'Elfos Oscuros',
  'Knight Revenant': 'Aparecidos',
  'Dwarves': 'Enanos',
  'Shadowkin': 'Sombrios',
  'Sylvan Watchers': 'Vigías Silvanos',
  'Argonitas': 'Argonitas'
};

const rarityMap = {
  'Mythical': 'Mítico',
  'Legendary': 'Legendario',
  'Epic': 'Épico',
  'Rare': 'Raro',
  'Uncommon': 'Poco Común',
  'Common': 'Común'
};

const affinityMap = {
  'Void': 'Vacío',
  'Force': 'Fuerza',
  'Magic': 'Magia',
  'Spirit': 'Espíritu'
};

function normalize(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// 1. Map Senda by normalized name and normalized slug
const sendaNorm = new Map();
for (const sc of sendaChamps) {
  sendaNorm.set(normalize(sc.name), sc);
  sendaNorm.set(normalize(sc.slug), sc);
}

// Specific manual translations for champions where English and Spanish differ significantly
const manualAliases = {
  'titus blackplume': 'titus plumanegra',
  'vault keeper wixwell': 'vault keeper wixwell',
  'seeker': 'buscador',
  'heiress': 'heredera',
  'pain keeper': 'guardiana del dolor',
  'maneater': 'devorador de hombres',
  'dracomorph': 'dracomorfo',
  'deathless': 'inmortal',
  'frozen banshee': 'alma en pena helada',
  'gravechill killer': 'asesina tumba helada',
  'geomancer': 'geomante',
  'godseeker aniri': 'buscadora de dioses aniri',
  'skullcrown': 'coronacráneo',
  'skullcrusher': 'aplastacráneos',
  'bellower': 'bramador',
  'coldheart': 'corazón frío',
  'apothecary': 'boticario',
  'reliquary tender': 'guardiana del relicario',
  'broadmaw': 'bocagrande',
  'fayne': 'fayne',
  'ninja': 'ninja',
  'michinaki': 'michinaki',
  'acrizia': 'acrizia',
  'gnishak verminlord': 'gnishak señor de las alimañas',
  'teodor the savant': 'teodor el sabio',
  'corvis the corrupter': 'corvis el corruptor',
  'elva autumnborn': 'elva nacida en otoño',
  'pythion': 'pitión',
  'staltus dragonbane': 'staltus azote de dragones',
  'artak': 'artak',
  'wukong': 'rey mono sun wukong',
  'sun wukong': 'sun wukong',
  'supreme galek': 'galek supremo',
  'supreme kael': 'kael supremo',
  'supreme athel': 'athel suprema',
  'supreme elhain': 'elhain suprema',
  'taras the fierce': 'taras el fiero',
  'marichka the unbreakable': 'marichka la inquebrantable',
  'siegfrund the nephilim': 'siegfrund el nefilim',
  'cardiel': 'cardiel',
  'yumeko': 'yumeko',
  'duchess lilitu': 'duquesa lilitu',
  'krisk the ageless': 'krisk el eterno',
  'hephraak': 'hephraak',
  'harima': 'harima',
  'leorius the proud': 'leorius el orgulloso',
  'trunda giltmallet': 'trunda mazo dorado',
  'rotos the lost groom': 'rotos el novio perdido',
  'siphi the lost bride': 'siphi la novia perdida',
  'warlord': 'señor de la guerra',
  'nekhret the great': 'nekhret el grande',
  'turvold': 'turvold',
  'inquisitor shamael': 'inquisidor shamael',
  'chagur': 'chagur',
  'mashalled': 'mashalled',
  'ma\'shalled': 'mashalled',
  'ragash': 'ragash',
  'udk': 'esqueleto definitivo',
  'ultimate deathknight': 'esqueleto definitivo'
};

let matchedCount = 0;
const unmatched = [];

for (const rc of rawChamps) {
  const normName = normalize(rc.name);
  let matchedSenda = sendaNorm.get(normName);

  if (!matchedSenda) {
    // Check manual alias
    const alias = manualAliases[rc.name.toLowerCase().trim()];
    if (alias) {
      matchedSenda = sendaNorm.get(normalize(alias));
    }
  }

  if (!matchedSenda) {
    // Try matching if the Senda name contains the raw name or vice versa
    for (const sc of sendaChamps) {
      const sNorm = normalize(sc.name);
      if (sNorm.length > 5 && (normName.includes(sNorm) || sNorm.includes(normName))) {
        matchedSenda = sc;
        break;
      }
    }
  }

  if (matchedSenda) {
    matchedCount++;
    rc.spanishName = matchedSenda.name;
    rc.spanishFaction = matchedSenda.faction;
    rc.avatarUrl = matchedSenda.image_url;
    rc.sendaSlug = matchedSenda.slug;
    if (rc.name === 'Titus Blackplume') {
      rc.name = 'Titus Plumanegra';
      rc.englishName = 'Titus Blackplume';
      rc.stats.hp = matchedSenda.stats.hp;
      rc.stats.spd = matchedSenda.stats.speed;
      rc.stats.atk = matchedSenda.stats.attack;
      rc.stats.def = matchedSenda.stats.defense;
    }
  } else {
    unmatched.push(rc.name);
  }
}

console.log(`Matched ${matchedCount} / ${rawChamps.length} champions!`);

// Save updated champions.json
fs.writeFileSync('src/data/champions.json', JSON.stringify(rawChamps, null, 2));

// Update championAvatars.json with both raw names and spanish names
const finalAvatarMap = {};
for (const rc of rawChamps) {
  if (rc.avatarUrl) {
    finalAvatarMap[rc.name.toLowerCase().trim()] = rc.avatarUrl;
    if (rc.spanishName) finalAvatarMap[rc.spanishName.toLowerCase().trim()] = rc.avatarUrl;
    if (rc.englishName) finalAvatarMap[rc.englishName.toLowerCase().trim()] = rc.avatarUrl;
    finalAvatarMap[normalize(rc.name)] = rc.avatarUrl;
  }
}
for (const sc of sendaChamps) {
  if (sc.image_url) {
    finalAvatarMap[sc.name.toLowerCase().trim()] = sc.image_url;
    finalAvatarMap[sc.slug.toLowerCase().trim()] = sc.image_url;
    finalAvatarMap[normalize(sc.name)] = sc.image_url;
  }
}

fs.writeFileSync('src/data/championAvatars.json', JSON.stringify(finalAvatarMap, null, 2));
console.log(`Updated championAvatars.json with ${Object.keys(finalAvatarMap).length} lookup keys!`);
