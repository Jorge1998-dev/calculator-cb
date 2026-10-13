import fs from 'fs';

const content = fs.readFileSync('C:/Users/jorge/.gemini/antigravity-ide/brain/86ea474a-4f6d-43dd-b831-1b5bc7ac2680/.system_generated/steps/1286/content.md', 'utf8');

// Let's find all champion links or champion media
const champLinks = new Set();
const linkRegex = /href="(\/guias-de-campeones\/hidalgos\/[^"]+)"/g;
let m;
while ((m = linkRegex.exec(content)) !== null) {
  champLinks.add(m[1]);
}

const mediaUrls = new Set();
const mediaRegex = /https:\/\/[^"'\s]+(?:supabase|champion-media|champion_media)[^"'\s]+/g;
while ((m = mediaRegex.exec(content)) !== null) {
  mediaUrls.add(m[0]);
}

console.log('Champ links in Hidalgos:', Array.from(champLinks).length);
console.log('Sample links:', Array.from(champLinks).slice(0, 10));
console.log('Media URLs in Hidalgos:', Array.from(mediaUrls).length);
console.log('Sample media:', Array.from(mediaUrls).slice(0, 10));
