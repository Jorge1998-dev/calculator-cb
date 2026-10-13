import https from 'https';

const SUPABASE_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnB3dHdqdnliZGxmeXRiam1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzUxODgsImV4cCI6MjA3ODM1MTE4OH0.s7fj7Y-0JjRphoucHeCJ5cn5mt6qEclq-GZHvfNbsPM';

function queryTable(tableName) {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=5`;
    const req = https.get(url, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function run() {
  const tables = ['campeones', 'champions', 'guias_campeones', 'facciones', 'factions', 'champion_guides'];
  for (const t of tables) {
    const res = await queryTable(t);
    console.log(`Table '${t}': status ${res.status}`);
    if (res.status === 200) {
      console.log(`Result for ${t}:`, res.data.slice(0, 300));
    }
  }
}

run();
