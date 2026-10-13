import https from 'https';

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
  const slugs = ['vault-keeper-wixwell', 'lady-mikage', 'lydia-the-deathsiren', 'maneater', 'krisk-the-ageless'];
  for (const slug of slugs) {
    const html = await fetchPage(`https://hellhades.com/raid/champions/${slug}/`);
    const regex = new RegExp(`https:\\/\\/hellhades\\.com\\/wp-content\\/uploads\\/[^"\'\\s>]*(?:${slug.replace(/-/g, '[-_]?')})[^"\'\\s>]*\\.(?:jpg|png|webp)`, 'gi');
    const matches = html.match(regex);
    console.log(slug, matches ? matches[0] : 'not found');
  }
}

main();
