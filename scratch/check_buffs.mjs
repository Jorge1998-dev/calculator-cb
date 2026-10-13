import https from 'https';

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  const htmlPlarium = await fetchPage('https://raid-support.plarium.com/hc/en-us/articles/360017680240-List-of-Buffs-and-Debuffs');
  const regex = /https:\/\/[^"'\s>]+\.(?:png|jpg|webp)/gi;
  const matches = (htmlPlarium.match(regex) || []).filter(u => u.includes('zendesk') || u.includes('plarium') || u.includes('user_uploaded') || u.includes('article_attachments'));
  console.log('Plarium Buff Images:', Array.from(new Set(matches)).slice(0, 20));

  const htmlFandom = await fetchPage('https://raidshadowlegends.fandom.com/wiki/Category:Buff_Icons');
  const fandomMatches = (htmlFandom.match(/https:\/\/[^"'\s>]*(?:Increase|Decrease|Block|Shield|Strengthen|Heal)[^"'\s>]*\.(?:png|webp)/gi) || []);
  console.log('Fandom Buff Images:', Array.from(new Set(fandomMatches)).slice(0, 20));
}

main();
