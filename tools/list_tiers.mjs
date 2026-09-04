import { PARTS_DATABASE } from './js/data.js';

console.log('--- CPUS ---');
PARTS_DATABASE.cpu.forEach(c => console.log(`${c.id}: ${c.name} (tier: ${c.tier}, price: $${c.price})`));

console.log('--- GPUS ---');
PARTS_DATABASE.gpu.forEach(g => console.log(`${g.id}: ${g.name} (tier: ${g.tier}, price: $${g.price})`));
