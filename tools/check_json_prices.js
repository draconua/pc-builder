// Check prices_pl.json
const fs = require('fs');
const raw = fs.readFileSync('data/prices_pl.json', 'utf-8');
const data = JSON.parse(raw);

console.log('Total items in cache:', Object.keys(data.prices).length);
['gpu-rtx4070tis', 'gpu-rtx4060ti-16g', 'cpu-r7-7800x3d', 'cpu-r5-7600'].forEach(id => {
  if (data.prices[id]) {
    console.log(`${id}:`, data.prices[id]);
  }
});
