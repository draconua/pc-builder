import { PARTS_DATABASE } from '../js/data.js';

console.log('--- DDR5 RAMs in DB ---');
PARTS_DATABASE.ram.forEach(r => {
  if (r.type === 'DDR5') {
    console.log(`${r.id}: ${r.name} (${r.capacity})`);
  }
});

console.log('\n--- NVMe SSDs in DB ---');
PARTS_DATABASE.ssd.forEach(s => {
  if (s.interface !== 'SATA') {
    console.log(`${s.id}: ${s.name} (${s.capacity})`);
  }
});
