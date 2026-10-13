import fs from 'fs';
import https from 'https';

const SUPABASE_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnB3dHdqdnliZGxmeXRiam1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzUxODgsImV4cCI6MjA3ODM1MTE4OH0.s7fj7Y-0JjRphoucHeCJ5cn5mt6qEclq-GZHvfNbsPM';

function fetchAll() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/champions?select=*&order=id.asc&limit=1000`;
    https.get(url, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching all champions from SendaPlays...');
  const sendaChamps = await fetchAll();
  console.log(`Retrieved ${sendaChamps.length} champions from SendaPlays!`);

  // Save raw sendaplays data
  fs.writeFileSync('src/data/sendaplays_champions.json', JSON.stringify(sendaChamps, null, 2));

  // Build an avatar mapping { name: imageUrl, slug: imageUrl }
  const avatarMap = {};
  for (const c of sendaChamps) {
    if (c.image_url) {
      avatarMap[c.name.toLowerCase().trim()] = c.image_url;
      avatarMap[c.slug.toLowerCase().trim()] = c.image_url;
      // Also unaccented name
      const unaccented = c.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      avatarMap[unaccented] = c.image_url;
    }
  }

  fs.writeFileSync('src/data/championAvatars.json', JSON.stringify(avatarMap, null, 2));
  console.log(`Saved ${Object.keys(avatarMap).length} avatar lookup entries to src/data/championAvatars.json`);
}

run();
