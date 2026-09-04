import { PRESETS, PARTS_DATABASE } from './js/data.js';

// Normalize PRESETS
const NORMPRESETS = (() => {
  if (Array.isArray(PRESETS)) {
    const out = {};
    PRESETS.forEach(p => { out[p.id || p.name] = p; });
    return out;
  }
  return PRESETS || {};
})();

const buildState = { cpu: null, motherboard: null, cooler: null, ram: null, gpu: null, ssd: null, hdd: null, psu: null, case: null, monitor: null };
const presetKey = 'ultimate';
const preset = NORMPRESETS[presetKey];

Object.keys(buildState).forEach(cat => {
    const partId = preset.parts[cat];
    if (partId) {
    buildState[cat] = PARTS_DATABASE[cat].find(p => p.id === partId) || null;
    if (buildState[cat] === null) console.log(`FAILED to find ${partId} in ${cat}`);
    } else {
    buildState[cat] = null;
    }
});

console.log('SSD found:', buildState.ssd ? buildState.ssd.name : 'NULL');
console.log('Case found:', buildState.case ? buildState.case.name : 'NULL');
