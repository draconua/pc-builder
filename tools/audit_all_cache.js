// tools/audit_all_cache.js
const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf-8');
const cache = JSON.parse(fs.readFileSync('data/prices_pl.json', 'utf-8')).prices;

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
        baseUSD: parseFloat(m[3] || 100),
        basePLN: Math.round(parseFloat(m[3] || 100) * 4.05),
        category: cat
      };
    }
  }
});

console.log('--- AUDITING ALL CACHED PRICES AGAINST BASELINE ---');
let badCount = 0;
const badIds = [];
for (const id in cache) {
  const c = cache[id];
  const p = parts[id];
  if (!p) continue;
  const ratio = c.pricePLN / p.basePLN;
  if (ratio > 1.6 || ratio < 0.4) {
    console.log(`🚨 [${p.category}] ${p.name} (${id}): Cached = ${c.pricePLN} zł | Expected = ${p.basePLN} zł (Ratio: ${ratio.toFixed(2)}x) [${c.source || 'Ceneo'}]`);
    badCount++;
    badIds.push(id);
  }
}
console.log(`\nTotal poisoned entries found: ${badCount} out of ${Object.keys(cache).length}`);
