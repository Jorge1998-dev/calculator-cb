import https from 'https';

const SUPABASE_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnB3dHdqdnliZGxmeXRiam1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzUxODgsImV4cCI6MjA3ODM1MTE4OH0.s7fj7Y-0JjRphoucHeCJ5cn5mt6qEclq-GZHvfNbsPM';

function getAllChampions() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/champions?select=id,slug,name,faction,rarity,affinity,type,image_url&limit=1000`;
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
  const champs = await getAllChampions();
  console.log(`Fetched ${champs.length} champions from SendaPlays!`);
  console.log('Sample 3:');
  console.log(champs.slice(0, 3));

  // Count by faction
  const byFaction = {};
  for (const c of champs) {
    byFaction[c.faction] = (byFaction[c.faction] || 0) + 1;
  }
  console.log('Champions by faction:', byFaction);
}

run();
