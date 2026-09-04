// tools/clean_bad_cache.js — Sanitize existing data/prices_pl.json
const fs = require('fs');
const filePath = 'data/prices_pl.json';

const raw = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(raw);

let cleaned = 0;
for (const id in data.prices) {
  const item = data.prices[id];
  // If pricePLN is anomalously high (e.g. RTX 4070 Ti Super at 10,530 zł, or RTX 4060 Ti at > 3000 zł)
  if (id.includes('4070') && item.pricePLN > 5000) {
    delete data.prices[id];
    cleaned++;
  } else if (id.includes('4060') && item.pricePLN > 2500) {
    delete data.prices[id];
    cleaned++;
  } else if (id.includes('7900') && item.pricePLN > 6000) {
    delete data.prices[id];
    cleaned++;
  } else if (id.includes('cpu-r') && item.pricePLN > 3000) {
    delete data.prices[id];
    cleaned++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Cleaned ${cleaned} legacy bad prices from cache. Remaining: ${Object.keys(data.prices).length}`);
