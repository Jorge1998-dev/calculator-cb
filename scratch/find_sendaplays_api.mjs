import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const js = await fetchUrl('https://www.sendaplays.com/_next/static/chunks/0_aerh3yau3qo.js');
  console.log('JS length:', js.length);
  
  // Find supabase, fetch, or api calls
  const matches = js.match(/https:\/\/[a-z0-9]+\.supabase\.co[^\s"']*/g) || [];
  console.log('Supabase URLs:', Array.from(new Set(matches)));
  
  const apiMatches = js.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
  console.log('API routes:', Array.from(new Set(apiMatches)));

  // Look for any table queries or rpc
  const fromMatches = js.match(/\.from\(['"][^'"]+['"]\)/g) || [];
  console.log('Supabase .from():', Array.from(new Set(fromMatches)));
}

run();
