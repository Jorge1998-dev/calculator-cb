import fs from 'fs';

const content = fs.readFileSync('C:/Users/jorge/.gemini/antigravity-ide/brain/86ea474a-4f6d-43dd-b831-1b5bc7ac2680/.system_generated/steps/1288/content.md', 'utf8');

// Find all script tags in Titus page
const scriptRegex = /<script[^>]*src="([^"]+)"/g;
let m;
const scripts = [];
while ((m = scriptRegex.exec(content)) !== null) {
  scripts.push(m[1]);
}

console.log('Scripts in Titus page:', scripts);

// Where is the avatar URL in Titus page?
const avatarRegex = /https:\/\/[^"'\s]+(?:champion-media|champion_media)[^"'\s]+/g;
while ((m = avatarRegex.exec(content)) !== null) {
  console.log('Avatar URL found:', m[0]);
}
