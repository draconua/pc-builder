// Test running buildFromCurated with 5000 PLN and 5400 PLN
import { PARTS_DATABASE } from '../js/data.js';
import { buildFromCurated } from '../js/autobuild.js';

console.log('--- Testing 5000 PLN ---');
const res5000 = buildFromCurated(5000, PARTS_DATABASE, { cpuBrand: 'all', gpuBrand: 'all' });
console.log('Tier:', res5000.tier.title);
console.log('CPU:', res5000.build.cpu.name);
console.log('GPU:', res5000.build.gpu.name);
console.log('RAM:', res5000.build.ram.name);
console.log('SSD:', res5000.build.ssd.name);
console.log('Total PLN:', res5000.totalPLN);
console.log('Upgrades:', res5000.upgrades);

console.log('\n--- Testing 5500 PLN (+500 surplus) ---');
const res5500 = buildFromCurated(5500, PARTS_DATABASE, { cpuBrand: 'all', gpuBrand: 'all' });
console.log('Tier:', res5500.tier.title);
console.log('CPU:', res5500.build.cpu.name);
console.log('GPU:', res5500.build.gpu.name);
console.log('RAM:', res5500.build.ram.name);
console.log('SSD:', res5500.build.ssd.name);
console.log('Cooler:', res5500.build.cooler.name);
console.log('Total PLN:', res5500.totalPLN);
console.log('Upgrades applied:', res5500.upgrades);

console.log('\n--- Testing 7500 PLN ---');
const res7500 = buildFromCurated(7500, PARTS_DATABASE, { cpuBrand: 'all', gpuBrand: 'all' });
console.log('Tier:', res7500.tier.title);
console.log('CPU:', res7500.build.cpu.name);
console.log('GPU:', res7500.build.gpu.name);
console.log('Total PLN:', res7500.totalPLN);
