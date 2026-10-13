import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('public/assets/buffs-sprite.png');
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
const stride = 1 + width * 4;

function getPixel(x, y) {
  const rowOffset = y * stride + 1;
  const pOffset = rowOffset + x * 4;
  return {
    r: decompressed[pOffset],
    g: decompressed[pOffset + 1],
    b: decompressed[pOffset + 2],
    a: decompressed[pOffset + 3]
  };
}

// Let's sample a vertical line through the middle of the first icon (e.g. x = 60)
// To see where icons start and end along Y
for (let y = 30; y < 450; y++) {
  const p = getPixel(60, y);
  const isBlue = (p.b > 120 && p.r < 30 && p.g > 40 && p.g < 110);
  const isGold = (p.r > 110 && p.r < 180 && p.g > 90 && p.g < 150 && p.b > 30 && p.b < 90);
  if (isGold) {
    // console.log('Y=' + y + ' GOLD');
  }
}

// Check row boxes:
// 4 rows of icons
// Let's test Y intervals:
// Row 0: around y = 100 to 170?
// Let's measure across x from 20 to 920 at a known row
console.log('Sampling done');
// Let's find the 4 row ranges by counting blue pixels across each Y line
const blueCountsPerY = [];
for (let y = 0; y < height; y++) {
  let count = 0;
  for (let x = 0; x < width; x++) {
    const p = getPixel(x, y);
    if (p.b > 110 && p.b < 190 && p.r < 40 && p.g > 40 && p.g < 120) {
      count++;
    }
  }
  blueCountsPerY.push({ y, count });
}

// Group into rows where count > 100
let rows = [];
let currentRow = null;
for (const item of blueCountsPerY) {
  if (item.count > 150) {
    if (!currentRow) currentRow = { start: item.y, end: item.y };
    else currentRow.end = item.y;
  } else {
    if (currentRow && (currentRow.end - currentRow.start) > 20) {
      rows.push(currentRow);
    }
    currentRow = null;
  }
}
if (currentRow) rows.push(currentRow);

console.log('Detected Icon Rows (Y ranges):', rows);

// Now for row 0, detect icon columns (X ranges)
if (rows.length > 0) {
  const midY = Math.floor((rows[0].start + rows[0].end) / 2);
  const blueCountsPerX = [];
  for (let x = 0; x < width; x++) {
    let count = 0;
    for (let y = rows[0].start; y <= rows[0].end; y++) {
      const p = getPixel(x, y);
      if (p.b > 110 && p.b < 190 && p.r < 40 && p.g > 40 && p.g < 120) {
        count++;
      }
    }
    blueCountsPerX.push({ x, count });
  }

  let cols = [];
  let currentCol = null;
  for (const item of blueCountsPerX) {
    if (item.count > 20) {
      if (!currentCol) currentCol = { start: item.x, end: item.x };
      else currentCol.end = item.x;
    } else {
      if (currentCol && (currentCol.end - currentCol.start) > 20) {
        cols.push(currentCol);
      }
      currentCol = null;
    }
  }
  if (currentCol) cols.push(currentCol);
  console.log('Detected Icon Columns (X ranges) in Row 0:', cols.length, 'columns:');
  console.log(cols);
}
