import { PARTS_DATABASE } from '../js/data.js';
import { CURATED_BASELINES } from '../js/autobuild.js';

console.log('--- Validating ALL IDs in CURATED_BASELINES ---');
let missing = 0;
CURATED_BASELINES.forEach(tier => {
  for (const vKey in tier.variants) {
    const template = tier.variants[vKey];
    for (const cat in template) {
      const id = template[cat];
      const found = (PARTS_DATABASE[cat] || []).find(p => p.id === id);
      if (!found) {
        console.log(`❌ Tier [${tier.id}] (${vKey}) -> ${cat}: "${id}" NOT FOUND in PARTS_DATABASE.${cat}!`);
        missing++;
      }
    }
  }
});

if (missing === 0) {
  console.log('✅ ALL IDs in CURATED_BASELINES ARE 100% VALID!');
} else {
  console.log(`⚠️ Total missing IDs: ${missing}`);
}
