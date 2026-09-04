const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf-8');

['case', 'monitor'].forEach(cat => {
  const regex = new RegExp(`${cat}:\\s*\\[([\\s\\S]*?)\\]\\s*,`, 'i');
  const match = content.match(regex);
  if (match) {
    console.log(`${cat} block length: ${match[1].length}`);
    const items = match[1].match(/id:\s*'[^']+'/g);
    console.log(`${cat} items count: ${items ? items.length : 0}`);
  } else {
    console.log(`${cat} block NOT MATCHED`);
  }
});
