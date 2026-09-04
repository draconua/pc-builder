// tools/test_baseline_engine.js — Test Curated Baseline Archetypes + Smart Step-Up Engine
const fs = require('fs');

// Curated Baseline Templates (in PLN)
// Each template represents an engineered, zero-bottleneck golden build.
const CURATED_BASELINES = [
  {
    id: 'tier-3000',
    budgetPLN: 3000,
    title: '1080p Киберспорт & Входной гейминг',
    variants: {
      all: { cpu: 'cpu-r5-5600', gpu: 'gpu-rx6600', mb: 'mb-b550m-ds3h', ram: 'ram-k-16-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-p3-1tb' },
      amd: { cpu: 'cpu-r5-5600', gpu: 'gpu-rx6600', mb: 'mb-b550m-ds3h', ram: 'ram-k-16-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-p3-1tb' },
      intel: { cpu: 'cpu-i3-12100f', gpu: 'gpu-rx6600', mb: 'mb-h610m-k', ram: 'ram-k-16-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-p3-1tb' },
      nvidia: { cpu: 'cpu-r5-5600', gpu: 'gpu-rtx3050', mb: 'mb-b550m-ds3h', ram: 'ram-k-16-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-p3-1tb' }
    }
  },
  {
    id: 'tier-4000',
    budgetPLN: 4000,
    title: '1080p Ultra / 1440p Entry',
    variants: {
      all: { cpu: 'cpu-r5-5600', gpu: 'gpu-rtx4060', mb: 'mb-b550m-ds3h', ram: 'ram-k-32-3200', cooler: 'clr-ak400', psu: 'psu-650-g6', case: 'case-cc560', ssd: 'ssd-p3-1tb' },
      amd: { cpu: 'cpu-r5-5600', gpu: 'gpu-rx7600xt', mb: 'mb-b550m-ds3h', ram: 'ram-k-32-3200', cooler: 'clr-ak400', psu: 'psu-650-g6', case: 'case-cc560', ssd: 'ssd-p3-1tb' },
      intel: { cpu: 'cpu-i5-12600kf', gpu: 'gpu-rtx4060', mb: 'mb-b760m-ds3h-d4', ram: 'ram-k-32-3200', cooler: 'clr-peerless120se', psu: 'psu-650-g6', case: 'case-cc560', ssd: 'ssd-p3-1tb' },
      nvidia: { cpu: 'cpu-r5-5600', gpu: 'gpu-rtx4060', mb: 'mb-b550m-ds3h', ram: 'ram-k-32-3200', cooler: 'clr-ak400', psu: 'psu-650-g6', case: 'case-cc560', ssd: 'ssd-p3-1tb' }
    }
  },
  {
    id: 'tier-5000',
    budgetPLN: 5000,
    title: 'AM5 Современный 1440p Гейминг',
    variants: {
      all: { cpu: 'cpu-r5-7600', gpu: 'gpu-rtx4060ti-16g', mb: 'mb-b650m-k', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-ak400', psu: 'psu-650-g6', case: 'case-4000d', ssd: 'ssd-sn580-1tb' },
      amd: { cpu: 'cpu-r5-7600', gpu: 'gpu-rx7700xt', mb: 'mb-b650m-k', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-ak400', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn580-1tb' },
      intel: { cpu: 'cpu-i5-14400f', gpu: 'gpu-rtx4060ti-16g', mb: 'mb-b760m-aorus-elite-ax', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-ak400', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn580-1tb' },
      nvidia: { cpu: 'cpu-r5-7600', gpu: 'gpu-rtx4060ti-16g', mb: 'mb-b650m-k', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-ak400', psu: 'psu-650-g6', case: 'case-4000d', ssd: 'ssd-sn580-1tb' }
    }
  },
  {
    id: 'tier-6500',
    budgetPLN: 6500,
    title: '1440p Sweet Spot (Золотой стандарт)',
    variants: {
      all: { cpu: 'cpu-r5-7600x', gpu: 'gpu-rtx4070s', mb: 'mb-b650m-aorus-elite-ax', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-peerless120se', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' },
      amd: { cpu: 'cpu-r5-9600x', gpu: 'gpu-rx9070', mb: 'mb-b850-gaming-wifi', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-phantom120', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' },
      intel: { cpu: 'cpu-i5-14600kf', gpu: 'gpu-rtx4070s', mb: 'mb-b760-tomahawk', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-phantom120', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' },
      nvidia: { cpu: 'cpu-r5-7600x', gpu: 'gpu-rtx4070s', mb: 'mb-b650m-aorus-elite-ax', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-peerless120se', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' }
    }
  },
  {
    id: 'tier-8000',
    budgetPLN: 8000,
    title: '1440p High-Refresh / 4K Entry',
    variants: {
      all: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx4070tis', mb: 'mb-b650-tomahawk', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-phantom120', psu: 'psu-purepower12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' },
      amd: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rx9070xt', mb: 'mb-b850-aorus-elite', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-phantom120', psu: 'psu-purepower12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' },
      intel: { cpu: 'cpu-u7-265kf', gpu: 'gpu-rtx4070tis', mb: 'mb-z890-pro-rs', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-lf3-360', psu: 'psu-purepower12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' },
      nvidia: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx4070tis', mb: 'mb-b650-tomahawk', ram: 'ram-ripjaws-s5-32-6000', cooler: 'clr-phantom120', psu: 'psu-purepower12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' }
    }
  },
  {
    id: 'tier-10000',
    budgetPLN: 10000,
    title: '4K High-End Enthusiast',
    variants: {
      all: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx5080', mb: 'mb-x870-tomahawk', ram: 'ram-trident-z5-32-6400', cooler: 'clr-lf3-360', psu: 'psu-darkpower13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' },
      amd: { cpu: 'cpu-r7-9800x3d', gpu: 'gpu-rx7900xtx', mb: 'mb-x870e-aorus-pro', ram: 'ram-trident-z5-32-6400', cooler: 'clr-lf3-360', psu: 'psu-darkpower13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' },
      intel: { cpu: 'cpu-u9-285k', gpu: 'gpu-rtx5080', mb: 'mb-z890-tomahawk', ram: 'ram-trident-z5-32-6400', cooler: 'clr-lf3-360', psu: 'psu-darkpower13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' },
      nvidia: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx5080', mb: 'mb-x870-tomahawk', ram: 'ram-trident-z5-32-6400', cooler: 'clr-lf3-360', psu: 'psu-darkpower13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' }
    }
  },
  {
    id: 'tier-15000',
    budgetPLN: 15000,
    title: 'Флагман мечты (RTX 5090)',
    variants: {
      all: { cpu: 'cpu-r7-9800x3d', gpu: 'gpu-rtx5090', mb: 'mb-x870e-crosshair', ram: 'ram-trident-z5-rgb-64-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' },
      amd: { cpu: 'cpu-r9-9950x3d', gpu: 'gpu-rtx5090', mb: 'mb-x870e-crosshair', ram: 'ram-trident-z5-rgb-64-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' },
      intel: { cpu: 'cpu-u9-285k', gpu: 'gpu-rtx5090', mb: 'mb-z890-rog-strix-f', ram: 'ram-trident-z5-rgb-64-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' },
      nvidia: { cpu: 'cpu-r7-9800x3d', gpu: 'gpu-rtx5090', mb: 'mb-x870e-crosshair', ram: 'ram-trident-z5-rgb-64-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' }
    }
  }
];

console.log(`Configured ${CURATED_BASELINES.length} curated tiers.`);
