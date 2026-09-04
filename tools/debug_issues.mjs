import { PARTS_DATABASE, PRESETS } from './js/data.js';
import { checkCompatibility } from './js/compatibility.js';

const build = {};
for (const cat in PRESETS.ultimate.parts) {
  const pid = PRESETS.ultimate.parts[cat];
  build[cat] = PARTS_DATABASE[cat]?.find(p => p.id === pid) || null;
}

// Swap PSU to 650W
build.psu = PARTS_DATABASE.psu.find(p => p.wattage <= 650);

const issues = checkCompatibility(build);
console.log('Issues:', issues);
