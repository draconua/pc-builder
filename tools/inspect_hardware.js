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

console.log('--- CPUS in DB (' + listCategory('cpu').length + ') ---');
console.log(listCategory('cpu').join('\n'));

console.log('\n--- GPUS in DB (' + listCategory('gpu').length + ') ---');
console.log(listCategory('gpu').join('\n'));
