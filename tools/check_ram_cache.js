const fs = require('fs');
const prices = JSON.parse(fs.readFileSync('data/prices_pl.json', 'utf-8')).prices;
console.log('ram-grs32g-6000:', prices['ram-grs32g-6000']);
console.log('\nAll RAM items in cache:');
for (const id in prices) {
  if (id.startsWith('ram-')) {
    console.log(`${id}: ${prices[id].pricePLN} zł`);
  }
}
