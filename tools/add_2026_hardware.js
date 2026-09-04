// 1. Add missing CPUs, GPUs, and Motherboards in data.js
const fs = require('fs');
let data = fs.readFileSync('js/data.js', 'utf-8');

// --- NEW CPUS ---
const newCpus = `
    // Popular Value CPUs & 2026 Refresh
    { id: 'cpu-i5-12600kf', name: 'Intel Core i5-12600KF', brand: 'Intel', price: 155, socket: 'LGA1700', tdp: 125, maxTdp: 150, ramType: 'DDR4', cores: 10, freq: '3.7 GHz', tier: 6, cpuScore: 84, specs: '10 Cores (6P+4E) / 16 Threads, 3.7 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-12600KF') },
    { id: 'cpu-i5-13600kf', name: 'Intel Core i5-13600KF', brand: 'Intel', price: 239, socket: 'LGA1700', tdp: 125, maxTdp: 181, ramType: 'DDR5', cores: 14, freq: '3.5 GHz', tier: 7, cpuScore: 88, specs: '14 Cores (6P+8E) / 20 Threads, 3.5 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-13600KF') },
    { id: 'cpu-i5-14600kf', name: 'Intel Core i5-14600KF', brand: 'Intel', price: 259, socket: 'LGA1700', tdp: 125, maxTdp: 181, ramType: 'DDR5', cores: 14, freq: '3.5 GHz', tier: 7, cpuScore: 89, specs: '14 Cores (6P+8E) / 20 Threads, 3.5 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-14600KF') },
    { id: 'cpu-u5-225f', name: 'Intel Core Ultra 5 225F', brand: 'Intel', price: 209, socket: 'LGA1851', tdp: 65, maxTdp: 125, ramType: 'DDR5', cores: 10, freq: '3.3 GHz', tier: 6, cpuScore: 81, specs: '10 Cores (6P+4E) / 10 Threads, 3.3 GHz, 65W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 5 225F') },
    { id: 'cpu-u5-235', name: 'Intel Core Ultra 5 235', brand: 'Intel', price: 249, socket: 'LGA1851', tdp: 65, maxTdp: 125, ramType: 'DDR5', cores: 14, freq: '3.4 GHz', tier: 7, cpuScore: 84, specs: '14 Cores (6P+8E) / 14 Threads, 3.4 GHz, 65W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 5 235') },
    { id: 'cpu-r5-8400f', name: 'AMD Ryzen 5 8400F', brand: 'AMD', price: 135, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '4.2 GHz', tier: 4, cpuScore: 78, specs: '6 Cores / 12 Threads, 4.2 GHz, 65W, Zen 4, AM5', buyLinks: createBuyLinks('AMD Ryzen 5 8400F') },
    { id: 'cpu-r9-9900x3d', name: 'AMD Ryzen 9 9900X3D', brand: 'AMD', price: 549, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 12, freq: '4.4 GHz', tier: 10, cpuScore: 102, specs: '12 Cores / 24 Threads, 4.4 GHz, 3D V-Cache, Zen 5, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 9900X3D') },
`;

// --- NEW GPUS ---
const newGpus = `
    // 2025-2026 Volume Sellers & Next-Gen Mainstream
    { id: 'gpu-rtx5070ti', name: 'NVIDIA GeForce RTX 5070 Ti', brand: 'NVIDIA', price: 799, tdp: 300, vram: 16, tier: 9, gpuScore: 84, length: 300, specs: '16GB GDDR7, Next Gen 1440p / 4K Ultra, DLSS 4', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5070 Ti') },
    { id: 'gpu-rtx5060ti', name: 'NVIDIA GeForce RTX 5060 Ti 16GB', brand: 'NVIDIA', price: 479, tdp: 180, vram: 16, tier: 6, gpuScore: 56, length: 260, specs: '16GB GDDR7, 1440p Sweet Spot, DLSS 4', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5060 Ti') },
    { id: 'gpu-rtx5060', name: 'NVIDIA GeForce RTX 5060', brand: 'NVIDIA', price: 349, tdp: 130, vram: 12, tier: 5, gpuScore: 45, length: 240, specs: '12GB GDDR7, 1080p Ultra / 1440p Entry, DLSS 4', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5060') },
    { id: 'gpu-rx9060xt', name: 'AMD Radeon RX 9060 XT', brand: 'AMD', price: 399, tdp: 200, vram: 16, tier: 6, gpuScore: 54, length: 260, specs: '16GB GDDR6, RDNA 4, 1440p High Performance', buyLinks: createBuyLinks('AMD Radeon RX 9060 XT') },
    { id: 'gpu-rx9060', name: 'AMD Radeon RX 9060', brand: 'AMD', price: 299, tdp: 160, vram: 12, tier: 5, gpuScore: 44, length: 240, specs: '12GB GDDR6, RDNA 4, 1080p Ultra', buyLinks: createBuyLinks('AMD Radeon RX 9060') },
    { id: 'gpu-b570', name: 'Intel Arc B570', brand: 'Intel', price: 219, tdp: 150, vram: 10, tier: 3, gpuScore: 29, length: 240, specs: '10GB GDDR6, Battlemage, 1080p Esports & Creator', buyLinks: createBuyLinks('Intel Arc B570') },
`;

// --- NEW MOTHERBOARDS ---
const newMotherboards = `
    // B850 & B840 (AM5)
    { id: 'mb-b850m-ds3h', name: 'Gigabyte B850M DS3H', brand: 'Gigabyte', price: 129, socket: 'AM5', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'B850, Micro-ATX, 4xDDR5, PCIe 5.0 M.2, 2.5GbE', buyLinks: createBuyLinks('Gigabyte B850M DS3H') },
    { id: 'mb-b850-gaming-wifi', name: 'MSI B850 GAMING PLUS WIFI', brand: 'MSI', price: 179, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'B850, ATX, 4xDDR5, PCIe 5.0 M.2, Wi-Fi 7', buyLinks: createBuyLinks('MSI B850 GAMING PLUS WIFI') },
    { id: 'mb-b850-aorus-elite', name: 'Gigabyte B850 AORUS ELITE AX', brand: 'Gigabyte', price: 219, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'B850, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('Gigabyte B850 AORUS ELITE AX') },
    // B860 (LGA1851)
    { id: 'mb-b860-pro-rs', name: 'ASRock B860 Pro RS WiFi', brand: 'ASRock', price: 159, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX', specs: 'B860, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('ASRock B860 Pro RS WiFi') },
`;

// Insert into data.js
if (!data.includes('cpu-i5-12600kf')) {
  data = data.replace('cpu: [', 'cpu: [' + newCpus);
  console.log('Added new CPUs.');
}

if (!data.includes('gpu-rtx5070ti')) {
  data = data.replace('gpu: [', 'gpu: [' + newGpus);
  console.log('Added new GPUs.');
}

if (!data.includes('mb-b850-gaming-wifi')) {
  data = data.replace('motherboard: [', 'motherboard: [' + newMotherboards);
  console.log('Added new Motherboards.');
}

fs.writeFileSync('js/data.js', data, 'utf-8');
console.log('data.js updated with 2026 hardware successfully!');
