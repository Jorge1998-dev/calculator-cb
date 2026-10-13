import fs from 'fs';

// Let's create an HTML visual index of all 40 cropped icons alongside their row and column
const html = `<!DOCTYPE html>
<html>
<head>
  <title>Buff Icons Review</title>
  <style>
    body { background: #0f172a; color: #fff; font-family: sans-serif; padding: 20px; }
    .grid { display: grid; grid-template-columns: repeat(11, 1fr); gap: 10px; }
    .card { background: #1e293b; border: 1px solid #334155; padding: 8px; text-align: center; border-radius: 6px; }
    img { width: 48px; height: 48px; display: block; margin: 0 auto 6px; }
    .label { font-size: 11px; word-break: break-all; }
    .coords { font-size: 10px; color: #94a3b8; }
  </style>
</head>
<body>
  <h2>40 Buff Icons Extracted</h2>
  <div class="grid">
    ${fs.readdirSync('public/assets/buffs').map(file => {
      return `<div class="card">
        <img src="${file}" alt="${file}" />
        <div class="label">${file}</div>
      </div>`;
    }).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync('public/assets/buffs/index.html', html);
console.log('Generated visual index at public/assets/buffs/index.html');
