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
  const scripts = [
    'https://www.sendaplays.com/_next/static/chunks/0~tn_3grd_ivg.js',
    'https://www.sendaplays.com/_next/static/chunks/00_v32cl2msp..js',
    'https://www.sendaplays.com/_next/static/chunks/0o4u06v8ft5s1.js',
    'https://www.sendaplays.com/_next/static/chunks/16fhrv2xg48t2.js',
    'https://www.sendaplays.com/_next/static/chunks/0i.l9589uvx0j.js',
    'https://www.sendaplays.com/_next/static/chunks/0o6_wdp9axqu~.js',
    'https://www.sendaplays.com/_next/static/chunks/0yphbcti7.1uv.js',
    'https://www.sendaplays.com/_next/static/chunks/153rjmhlbi7c-.js',
    'https://www.sendaplays.com/_next/static/chunks/04cvo-d0_yyn1.js',
    'https://www.sendaplays.com/_next/static/chunks/0x~6988hz15p8.js',
    'https://www.sendaplays.com/_next/static/chunks/16bcb01p~1pa_.js'
  ];

  for (const s of scripts) {
    try {
      const js = await fetchUrl(s);
      // Search for eyJ (JWT token for supabase anon key) or supabase
      const jwtMatch = js.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+/g);
      if (jwtMatch) {
        console.log('Found Supabase JWT in', s, ':', jwtMatch);
      }
      const supa = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/g);
      if (supa) {
        console.log('Found Supabase URL in', s, ':', supa);
      }
    } catch (e) {
      // ignore
    }
  }
}

run();
