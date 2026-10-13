const https = require('https');

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  const html = await fetchPage('https://hellhades.com/raid/champions/demytha/');
  const regex = /https:\/\/hellhades\.com\/wp-content\/uploads\/[^"'\s>]+\.(?:jpg|png|webp)/gi;
  const matches = html.match(regex);
  console.log('Matches:', Array.from(new Set(matches || [])).slice(0, 15));
}

main();
