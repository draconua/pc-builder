import { PARTS_DATABASE } from '../js/data.js';
import { buildFromCurated } from '../js/autobuild.js';
import fs from 'fs';

const cache = JSON.parse(fs.readFileSync('./data/prices_pl.json', 'utf-8')).prices;
for (const cat in PARTS_DATABASE) {
  PARTS_DATABASE[cat].forEach(p => {
    if (cache[p.id]) {
      p.pricePLN = cache[p.id].pricePLN;
    }
  });
}

console.log('=== TEST 3000 zł ===');
const r3000 = buildFromCurated(3000, PARTS_DATABASE);
console.log('Tier:', r3000.tier.title);
console.log('Total:', r3000.totalPLN, 'zł (budget: 3000 zł)');
console.log('Parts:', Object.values(r3000.build).filter(Boolean).map(p => `${p.name} (${p.pricePLN || Math.round(p.price*4.05)} zł)`).join('\n  '));

console.log('\n=== TEST 5000 zł ===');
const r5000 = buildFromCurated(5000, PARTS_DATABASE);
console.log('Tier:', r5000.tier.title);
console.log('Total:', r5000.totalPLN, 'zł (budget: 5000 zł)');
console.log('Parts:', Object.values(r5000.build).filter(Boolean).map(p => `${p.name} (${p.pricePLN || Math.round(p.price*4.05)} zł)`).join('\n  '));

console.log('\n=== TEST 7500 zł ===');
const r7500 = buildFromCurated(7500, PARTS_DATABASE);
console.log('Tier:', r7500.tier.title);
console.log('Total:', r7500.totalPLN, 'zł (budget: 7500 zł)');
console.log('Parts:', Object.values(r7500.build).filter(Boolean).map(p => `${p.name} (${p.pricePLN || Math.round(p.price*4.05)} zł)`).join('\n  '));
