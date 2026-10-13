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
  console.log('Snippet of 0_aerh3yau3qo.js:');
  console.log(js.slice(0, 1000));
}

run();
