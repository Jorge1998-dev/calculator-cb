import fs from 'fs';

const content = fs.readFileSync('C:/Users/jorge/.gemini/antigravity-ide/brain/86ea474a-4f6d-43dd-b831-1b5bc7ac2680/.system_generated/steps/1288/content.md', 'utf8');

const idx = content.indexOf('eurpwtwjvybdlfytbjmk.supabase.co');
if (idx !== -1) {
  console.log('Surrounding context in HTML:');
  console.log(content.slice(Math.max(0, idx - 200), idx + 300));
}
