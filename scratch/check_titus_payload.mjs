import fs from 'fs';

const content = fs.readFileSync('C:/Users/jorge/.gemini/antigravity-ide/brain/86ea474a-4f6d-43dd-b831-1b5bc7ac2680/.system_generated/steps/1286/content.md', 'utf8');

console.log('Contains titus?', content.toLowerCase().includes('titus'));
console.log('Contains plumanegra?', content.toLowerCase().includes('plumanegra'));

// Let's search for any strings matching champion names or images in script chunks
const chunks = content.match(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g);
console.log('next_f chunks count:', chunks ? chunks.length : 0);
