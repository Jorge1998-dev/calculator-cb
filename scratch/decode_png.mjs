import fs from 'fs';
import zlib from 'zlib';

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let idatBuffers = [];
  let width = 0;
  let height = 0;

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idatBuffers.push(buf.slice(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }

  const decompressed = zlib.inflateSync(Buffer.concat(idatBuffers));
  const bpp = 4;
  const rawStride = 1 + width * bpp;
  const pixels = Buffer.alloc(width * height * 4);

  const prevRow = Buffer.alloc(width * bpp);
  const currRow = Buffer.alloc(width * bpp);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * rawStride];
    const srcRow = decompressed.slice(y * rawStride + 1, (y + 1) * rawStride);

    for (let i = 0; i < srcRow.length; i++) {
      const a = i >= bpp ? currRow[i - bpp] : 0;
      const b = prevRow[i];
      const c = i >= bpp ? prevRow[i - bpp] : 0;

      let val = srcRow[i];
      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        val = (val + pr) & 0xff;
      }
      currRow[i] = val;
    }

    currRow.copy(pixels, y * width * 4);
    currRow.copy(prevRow);
  }

  return { width, height, pixels };
}

const { width, height, pixels } = decodePng('public/assets/buffs-sprite.png');

function getPixel(x, y) {
  const idx = (y * width + x) * 4;
  return { r: pixels[idx], g: pixels[idx + 1], b: pixels[idx + 2], a: pixels[idx + 3] };
}

// Let's check Gold/Bronze border color or blue color across y
// Check Y = 10 to 100 for Row 0:
const goldPerY = [];
for (let y = 0; y < height; y++) {
  let count = 0;
  for (let x = 0; x < width; x++) {
    const p = getPixel(x, y);
    // Gold/bronze border: r > 100, g > 80, b < 90
    if (p.r > 90 && p.r < 180 && p.g > 80 && p.g < 160 && p.b > 30 && p.b < 95) count++;
  }
  goldPerY.push(count);
}

// Find horizontal lines of gold borders
const goldLines = [];
for (let y = 0; y < height; y++) {
  if (goldPerY[y] > 100) goldLines.push(y);
}
console.log('Gold horizontal border Y lines:', goldLines);

// Let's compute the grid:
// Icons are 11 columns across!
// Let's check the X positions of gold borders:
const goldPerX = [];
for (let x = 0; x < width; x++) {
  let count = 0;
  for (let y = 0; y < height; y++) {
    const p = getPixel(x, y);
    if (p.r > 90 && p.r < 180 && p.g > 80 && p.g < 160 && p.b > 30 && p.b < 95) count++;
  }
  goldPerX.push(count);
}
const goldXLines = [];
for (let x = 0; x < width; x++) {
  if (goldPerX[x] > 40) goldXLines.push(x);
}
console.log('Gold vertical border X lines:', goldXLines);
