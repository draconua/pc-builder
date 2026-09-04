// tools/sanitize_all_legacy.js — Full cleanup of legacy pre-sanity Ceneo prices
const fs = require('fs');
const filePath = 'data/prices_pl.json';

const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

let cleaned = 0;
for (const id in data.prices) {
  const item = data.prices[id];
  const p = item.pricePLN;

  // Sanity check across all categories:
  if (id.startsWith('ssd-') && id.includes('1tb') && p > 450) {
    delete data.prices[id];
    cleaned++;
  } else if (id.startsWith('ssd-') && id.includes('2tb') && p > 800) {
    delete data.prices[id];
    cleaned++;
  } else if (id.startsWith('gpu-') && (id.includes('4070') || id.includes('7800xt') || id.includes('7900')) && p > 4800) {
    delete data.prices[id];
    cleaned++;
  } else if (id.startsWith('gpu-') && (id.includes('4060') || id.includes('6600') || id.includes('7600')) && p > 2200) {
    delete data.prices[id];
    cleaned++;
  } else if (id.startsWith('cpu-') && (id.includes('5500') || id.includes('4100') || id.includes('12100') || id.includes('5600')) && p > 750) {
    delete data.prices[id];
    cleaned++;
  } else if (id.startsWith('mb-') && (id.includes('b650') || id.includes('b550') || id.includes('b760')) && p > 1200) {
    delete data.prices[id];
    cleaned++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Cleaned ${cleaned} legacy pre-sanity prices. Total valid cache entries: ${Object.keys(data.prices).length}`);
