// Check prices in test_autobuild_7500: why total was 17 083 zł?
import { PARTS_DATABASE } from '../js/data.js';
import { buildFromCurated } from '../js/autobuild.js';

const res = buildFromCurated(7500, PARTS_DATABASE, { cpuBrand: 'all', gpuBrand: 'all' });
console.log('Build components and their prices:');
let sumUSD = 0;
for (const k in res.build) {
  const p = res.build[k];
  if (p) {
    sumUSD += p.price;
    console.log(`${k}: ${p.name} | USD: ${p.price} | pricePLN: ${p.pricePLN}`);
  }
}
console.log('Sum in USD:', sumUSD, '| at 4.05 =', sumUSD * 4.05);
console.log('Total calculated in autobuild:', res.totalPLN);
