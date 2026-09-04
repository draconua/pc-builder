import { PARTS_DATABASE } from '../js/data.js';
import { CURATED_BASELINES } from '../js/autobuild.js';
import fs from 'fs';

const cached = JSON.parse(fs.readFileSync('./data/prices_pl.json', 'utf-8')).prices;

const t5000 = CURATED_BASELINES.find(t => t.id === 'tier-5000').variants.all;
console.log('Tier 5000 parts with their current live prices in app:');
let total = 0;
for (const cat in t5000) {
  const id = t5000[cat];
  const p = (PARTS_DATABASE[cat] || []).find(item => item.id === id);
  if (!p) {
    console.log(`ERROR: ${cat} with ID ${id} NOT FOUND!`);
    continue;
  }
  const cachedItem = cached[id];
  const price = cachedItem ? cachedItem.pricePLN : Math.round(p.price * 4.05);
  console.log(`${cat}: ${p.name} -> ${price} zł (cache: ${!!cachedItem})`);
  total += price;
}
console.log('--- SUM of Tier 5000 template:', total, 'zł');
