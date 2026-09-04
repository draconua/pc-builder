import { PARTS_DATABASE } from '../js/data.js';
import { CURATED_BASELINES } from '../js/autobuild.js';

const t5000 = CURATED_BASELINES.find(t => t.id === 'tier-5000').variants.all;
console.log('Tier 5000 template parts:');
let sumUSD = 0;
let sumPLN = 0;
for (const cat in t5000) {
  const id = t5000[cat];
  const p = (PARTS_DATABASE[cat] || []).find(item => item.id === id);
  if (p) {
    const pln = p.pricePLN || Math.round(p.price * 4.05);
    sumUSD += p.price;
    sumPLN += pln;
    console.log(`${cat}: ${p.name} | USD $${p.price} | PLN ${pln} zł`);
  } else {
    console.log(`${cat}: NOT FOUND (${id})`);
  }
}
console.log('--- Total USD:', sumUSD);
console.log('--- Total PLN (at base):', sumPLN);
