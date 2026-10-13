import https from 'https';

const SUPABASE_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnB3dHdqdnliZGxmeXRiam1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzUxODgsImV4cCI6MjA3ODM1MTE4OH0.s7fj7Y-0JjRphoucHeCJ5cn5mt6qEclq-GZHvfNbsPM';

function queryChampion(name) {
  return new Promise((resolve) => {
    const url = `${SUPABASE_URL}/rest/v1/champions?select=*&limit=1&name=ilike.*${encodeURIComponent(name)}*`;
    https.get(url, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function run() {
  const titus = await queryChampion('Titus');
  console.log('Titus data:');
  console.log(JSON.stringify(titus, null, 2));

  // Let's get total count of champions in the table
  const countUrl = `${SUPABASE_URL}/rest/v1/champions?select=id`;
  https.get(countUrl, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Prefer': 'count=exact'
    }
  }, (res) => {
    console.log('Content-Range header:', res.headers['content-range']);
  });
}

run();
