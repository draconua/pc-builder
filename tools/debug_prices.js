// tools/debug_prices.js
const fs = require('fs');
const prices = JSON.parse(fs.readFileSync('data/prices_pl.json', 'utf-8')).prices;

console.log('--- 3000 zł template parts and prices ---');
const t3000 = ['cpu-r5-5600', 'gpu-rx6600', 'mb-b550m-ds3h', 'ram-k-16-3200', 'clr-ak400', 'psu-cv550', 'case-cc560', 'ssd-sn580-1tb'];
let sum = 0;
t3000.forEach(id => {
  const p = prices[id] ? prices[id].pricePLN : 'NO CACHE';
  console.log(`${id}: ${p} zł`);
  if (prices[id]) sum += prices[id].pricePLN;
});
console.log('Total for 3000 template with cached prices:', sum);
