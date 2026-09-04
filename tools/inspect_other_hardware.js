const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf-8');

function listCategory(cat) {
  const regex = new RegExp(`${cat}:\\s*\\[([\\s\\S]*?)\\]\\s*,`, 'i');
  const match = content.match(regex);
  if (!match) return [];
  const names = [];
  const nameRegex = /name:\s*'([^']+)'/g;
  let m;
  while ((m = nameRegex.exec(match[1])) !== null) {
    names.push(m[1]);
  }
  return names;
}

['motherboard', 'ram', 'ssd', 'psu', 'case', 'cooler', 'monitor'].forEach(cat => {
  console.log(`\n--- ${cat.toUpperCase()} (${listCategory(cat).length}) ---`);
  console.log(listCategory(cat).slice(0, 6).join(', ') + '...');
});
