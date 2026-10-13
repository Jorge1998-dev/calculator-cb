import https from 'https';

const SUPABASE_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnB3dHdqdnliZGxmeXRiam1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzUxODgsImV4cCI6MjA3ODM1MTE4OH0.s7fj7Y-0JjRphoucHeCJ5cn5mt6qEclq-GZHvfNbsPM';

function getTitus() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/champions?slug=eq.titus-plumanegra`;
    https.get(url, {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  const titus = await getTitus();
  console.log('Titus full record:');
  console.log(JSON.stringify(titus[0], null, 2));
}

run();
