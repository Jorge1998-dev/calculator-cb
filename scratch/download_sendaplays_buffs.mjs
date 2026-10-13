import fs from 'fs';
import path from 'path';
import https from 'https';

const contentPath = 'C:/Users/jorge/.gemini/antigravity-ide/brain/86ea474a-4f6d-43dd-b831-1b5bc7ac2680/.system_generated/steps/1256/content.md';
const content = fs.readFileSync(contentPath, 'utf8');

// Find all image URLs under /images/buffsDebuffs/
const regex = /src="(\/images\/buffsDebuffs\/[^"]+)"/g;
const imageUrls = new Set();
let match;
while ((match = regex.exec(content)) !== null) {
  imageUrls.add(match[1]);
}

console.log(`Found ${imageUrls.size} unique buff/debuff images in Sendaplays guide!`);

const outDir = path.resolve('public/assets/buffs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function download(urlPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = `https://www.sendaplays.com${urlPath}`;
    const filename = path.basename(urlPath);
    const dest = path.join(outDir, filename);

    const file = fs.createWriteStream(dest);
    https.get(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`Status ${res.statusCode} for ${fullUrl}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ filename, size: fs.statSync(dest).size }));
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function run() {
  const list = Array.from(imageUrls);
  console.log('Downloading images:');
  const results = [];
  for (const u of list) {
    try {
      const res = await download(u);
      console.log(`✓ Downloaded ${res.filename} (${res.size} bytes)`);
      results.push(res);
    } catch (e) {
      console.error(`✗ Error downloading ${u}:`, e.message);
    }
  }
  console.log(`Successfully downloaded ${results.length} of ${list.length} images!`);
}

run();
