import { PARTS_DATABASE } from './js/data.js';

let missingCpu = 0;
PARTS_DATABASE.cpu.forEach(c => {
  if (!c.cpuScore) {
    console.error('Missing cpuScore:', c.id, c.name);
    missingCpu++;
  }
});

let missingGpu = 0;
PARTS_DATABASE.gpu.forEach(g => {
  if (!g.gpuScore) {
    console.error('Missing gpuScore:', g.id, g.name);
    missingGpu++;
  }
});

console.log(`Verified scores: CPUs checked = ${PARTS_DATABASE.cpu.length} (missing: ${missingCpu}), GPUs checked = ${PARTS_DATABASE.gpu.length} (missing: ${missingGpu})`);
