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

// Function to encode RGBA buffer to PNG
function createPng(cropWidth, cropHeight, cropPixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(cropWidth, 0);
  ihdr.writeUInt32BE(cropHeight, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6 = RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  
  function makeChunk(type, data) {
    const chunk = Buffer.alloc(12 + data.length);
    chunk.writeUInt32BE(data.length, 0);
    chunk.write(type, 4);
    data.copy(chunk, 8);
    // CRC
    const crc = crc32(chunk.slice(4, 8 + data.length));
    chunk.writeInt32BE(crc, 8 + data.length);
    return chunk;
  }

  // Prepend filter byte 0 to each scanline
  const rawData = Buffer.alloc(cropHeight * (1 + cropWidth * 4));
  for (let y = 0; y < cropHeight; y++) {
    rawData[y * (1 + cropWidth * 4)] = 0; // None filter
    cropPixels.copy(rawData, y * (1 + cropWidth * 4) + 1, y * cropWidth * 4, (y + 1) * cropWidth * 4);
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));
  const ihdrChunk = makeChunk('IHDR', ihdr);

  return Buffer.concat([signature, ihdrChunk, idat, iend]);
}

// CRC32 implementation
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return ~c;
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

const { width, height, pixels } = decodePng('public/assets/buffs-sprite.png');
console.log('Source loaded:', width, height);

const outDir = 'public/assets/buffs';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Coordinates
const colX = [10, 102, 195, 287, 379, 472, 564, 656, 749, 841, 934];
const rowY = [104, 196, 288, 381];
const iconSize = 74;

// Names mapping by [row][col] - Exactly verified against in-game Raid: Shadow Legends glossary
const buffNames = [
  ['heal_1', 'heal_2', 'atk_1', 'atk_2', 'def_1', 'def_2', 'spd_1', 'spd_2', 'crate_1', 'crate_2', 'cdmg_1'],
  ['cdmg_2', 'acc_1', 'acc_2', 'res_1', 'res_2', 'block_debuffs', 'strengthen_1', 'strengthen_2', 'ally_protect_1', 'ally_protect_2', 'veil'],
  ['pveil', 'shield', 'revive_on_death', 'unkillable', 'block_damage', 'bone_armor', 'reflect_damage_1', 'reflect_damage_2', 'counterattack', 'taunt', 'knight_shield'],
  ['sleep_barrier', 'breastplate', 'shield_alt', 'stone_skin', 'fire_shield', 'intercept', 'fury']
];

let saved = 0;
for (let r = 0; r < buffNames.length; r++) {
  for (let c = 0; c < buffNames[r].length; c++) {
    const name = buffNames[r][c];
    const sx = colX[c];
    const sy = rowY[r];

    // Crop pixels
    const crop = Buffer.alloc(iconSize * iconSize * 4);
    for (let y = 0; y < iconSize; y++) {
      const srcY = sy + y;
      if (srcY >= height) continue;
      for (let x = 0; x < iconSize; x++) {
        const srcX = sx + x;
        if (srcX >= width) continue;
        const srcIdx = (srcY * width + srcX) * 4;
        const destIdx = (y * iconSize + x) * 4;
        crop[destIdx] = pixels[srcIdx];
        crop[destIdx + 1] = pixels[srcIdx + 1];
        crop[destIdx + 2] = pixels[srcIdx + 2];
        crop[destIdx + 3] = pixels[srcIdx + 3];
      }
    }

    const png = createPng(iconSize, iconSize, crop);
    fs.writeFileSync(`${outDir}/${name}.png`, png);
    saved++;
  }
}

console.log(`Saved ${saved} native Raid buff icons to ${outDir}/`);
