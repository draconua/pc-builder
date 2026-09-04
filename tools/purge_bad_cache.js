// tools/purge_bad_cache.js
const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf-8');
const cachePath = 'data/prices_pl.json';
const cacheData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));

const parts = {};
const categories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor'];
categories.forEach(cat => {
  const catRegex = new RegExp(`${cat}:\\s*\\[([\\s\\S]*?)\\]\\s*,`, 'i');
  const catMatch = content.match(catRegex);
  if (catMatch) {
    const itemRegex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:[^}]+price:\s*([0-9.]+))?/g;
    let m;
    while ((m = itemRegex.exec(catMatch[1])) !== null) {
      parts[m[1]] = {
        name: m[2],
        basePLN: Math.round(parseFloat(m[3] || 100) * 4.05),
        category: cat
      };
    }
  }
});

let purged = 0;
for (const id in cacheData.prices) {
  const c = cacheData.prices[id];
  const p = parts[id];
  if (!p) {
    delete cacheData.prices[id];
    purged++;
    continue;
  }
  const ratio = c.pricePLN / p.basePLN;
  // If price is > 1.45x or < 0.5x of baseline, purge it!
  if (ratio > 1.45 || ratio < 0.5) {
    console.log(`Purging ${id} (${p.name}): ${c.pricePLN} zł vs expected ${p.basePLN} zł (ratio: ${ratio.toFixed(2)})`);
    delete cacheData.prices[id];
    purged++;
  }
}

fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2), 'utf-8');
console.log(`\nSuccessfully purged ${purged} bad prices! Valid remaining in cache: ${Object.keys(cacheData.prices).length}`);
