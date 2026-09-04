// js/autobuild.js — Curated Baseline Archetypes + Smart Step-Up Upgrade Engine
export const CURATED_BASELINES = [
  {
    id: 'tier-3000',
    budgetPLN: 3000,
    title: '1080p Киберспорт & Входной гейминг',
    description: 'Народная база на 6 ядрах и RX 6600. Отличный фреймрейт в CS2, Dota 2, GTA V и танках.',
    variants: {
      all: { cpu: 'cpu-r5-5600', gpu: 'gpu-rx6600', motherboard: 'mb-b550m-ds3h', ram: 'ram-k16g-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-sn580-1tb' },
      amd: { cpu: 'cpu-r5-5600', gpu: 'gpu-rx6600', motherboard: 'mb-b550m-ds3h', ram: 'ram-k16g-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-sn580-1tb' },
      intel: { cpu: 'cpu-i3-12100f', gpu: 'gpu-rx6600', motherboard: 'mb-h610m-k', ram: 'ram-k16g-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-sn580-1tb' },
      nvidia: { cpu: 'cpu-r5-5600', gpu: 'gpu-rtx3050', motherboard: 'mb-b550m-ds3h', ram: 'ram-k16g-3200', cooler: 'clr-ak400', psu: 'psu-cv550', case: 'case-cc560', ssd: 'ssd-sn580-1tb' }
    }
  },
  {
    id: 'tier-4000',
    budgetPLN: 4000,
    title: '1080p Ultra / 1440p Entry',
    description: 'Идеальный баланс для всех современных новинок на высоких настройках графики.',
    variants: {
      all: { cpu: 'cpu-r5-5600', gpu: 'gpu-rtx4060', motherboard: 'mb-b550m-ds3h', ram: 'ram-gv32g-3200', cooler: 'clr-ak400', psu: 'psu-evga-650g6', case: 'case-cc560', ssd: 'ssd-sn580-1tb' },
      amd: { cpu: 'cpu-r5-5600', gpu: 'gpu-rx7600xt', motherboard: 'mb-b550m-ds3h', ram: 'ram-gv32g-3200', cooler: 'clr-ak400', psu: 'psu-evga-650g6', case: 'case-cc560', ssd: 'ssd-sn580-1tb' },
      intel: { cpu: 'cpu-i5-12600kf', gpu: 'gpu-rtx4060', motherboard: 'mb-b760m-ds3h-d4', ram: 'ram-gv32g-3200', cooler: 'clr-pa120-se', psu: 'psu-evga-650g6', case: 'case-cc560', ssd: 'ssd-sn580-1tb' },
      nvidia: { cpu: 'cpu-r5-5600', gpu: 'gpu-rtx4060', motherboard: 'mb-b550m-ds3h', ram: 'ram-gv32g-3200', cooler: 'clr-ak400', psu: 'psu-evga-650g6', case: 'case-cc560', ssd: 'ssd-sn580-1tb' }
    }
  },
  {
    id: 'tier-5000',
    budgetPLN: 5000,
    title: 'AM5 Современный 1440p Гейминг',
    description: 'Переход на сокет AM5 с памятью DDR5 и видеокартой 16GB. Огромный задел под апгрейд.',
    variants: {
      all: { cpu: 'cpu-r5-7600', gpu: 'gpu-rtx4060ti-16g', motherboard: 'mb-b650m-k', ram: 'ram-grs32g-6000', cooler: 'clr-ak400', psu: 'psu-evga-650g6', case: 'case-4000d', ssd: 'ssd-sn580-1tb' },
      amd: { cpu: 'cpu-r5-7600', gpu: 'gpu-rx7700xt', motherboard: 'mb-b650m-k', ram: 'ram-grs32g-6000', cooler: 'clr-ak400', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn580-1tb' },
      intel: { cpu: 'cpu-i5-14400f', gpu: 'gpu-rtx4060ti-16g', motherboard: 'mb-b760m-aorus-elite-ax', ram: 'ram-grs32g-6000', cooler: 'clr-ak400', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn580-1tb' },
      nvidia: { cpu: 'cpu-r5-7600', gpu: 'gpu-rtx4060ti-16g', motherboard: 'mb-b650m-k', ram: 'ram-grs32g-6000', cooler: 'clr-ak400', psu: 'psu-evga-650g6', case: 'case-4000d', ssd: 'ssd-sn580-1tb' }
    }
  },
  {
    id: 'tier-6500',
    budgetPLN: 6500,
    title: '1440p Sweet Spot (Золотой стандарт)',
    description: 'Золотая середина 2026 года: RTX 4070 SUPER / RX 9070 для ультра-настроек в 2K 140+ FPS.',
    variants: {
      all: { cpu: 'cpu-r5-7600x', gpu: 'gpu-rtx4070s', motherboard: 'mb-b650m-aorus-elite-ax', ram: 'ram-grs32g-6000', cooler: 'clr-pa120-se', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' },
      amd: { cpu: 'cpu-r5-9600x', gpu: 'gpu-rx9070', motherboard: 'mb-b850-gaming-wifi', ram: 'ram-grs32g-6000', cooler: 'clr-ps120', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' },
      intel: { cpu: 'cpu-i5-14600kf', gpu: 'gpu-rtx4070s', motherboard: 'mb-b760-tomahawk', ram: 'ram-grs32g-6000', cooler: 'clr-ps120', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' },
      nvidia: { cpu: 'cpu-r5-7600x', gpu: 'gpu-rtx4070s', motherboard: 'mb-b650m-aorus-elite-ax', ram: 'ram-grs32g-6000', cooler: 'clr-pa120-se', psu: 'psu-rm750e', case: 'case-4000d', ssd: 'ssd-sn850x-1tb' }
    }
  },
  {
    id: 'tier-8000',
    budgetPLN: 8000,
    title: '1440p High-Refresh / 4K Entry',
    description: 'Культовый игровой процессор Ryzen 7 7800X3D и мощный видеоускоритель с 16GB памяти.',
    variants: {
      all: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx4070tis', motherboard: 'mb-b650-tomahawk', ram: 'ram-grs32g-6000', cooler: 'clr-ps120', psu: 'psu-pp12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' },
      amd: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rx9070xt', motherboard: 'mb-b850-aorus-elite', ram: 'ram-grs32g-6000', cooler: 'clr-ps120', psu: 'psu-pp12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' },
      intel: { cpu: 'cpu-u7-265kf', gpu: 'gpu-rtx4070tis', motherboard: 'mb-z890-pro-rs', ram: 'ram-grs32g-6000', cooler: 'clr-lf3-360', psu: 'psu-pp12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' },
      nvidia: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx4070tis', motherboard: 'mb-b650-tomahawk', ram: 'ram-grs32g-6000', cooler: 'clr-ps120', psu: 'psu-pp12m-850', case: 'case-lancool3', ssd: 'ssd-sn850x-2tb' }
    }
  },
  {
    id: 'tier-10000',
    budgetPLN: 10000,
    title: '4K High-End Enthusiast',
    description: 'Next-Gen сборка с RTX 5080, водяным охлаждением 360мм и премиальным корпусом.',
    variants: {
      all: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx5080', motherboard: 'mb-x870-tomahawk', ram: 'ram-gtz32g-6400', cooler: 'clr-lf3-360', psu: 'psu-dpp13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' },
      amd: { cpu: 'cpu-r7-9800x3d', gpu: 'gpu-rx7900xtx', motherboard: 'mb-x870e-aorus-pro', ram: 'ram-gtz32g-6400', cooler: 'clr-lf3-360', psu: 'psu-dpp13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' },
      intel: { cpu: 'cpu-u9-285k', gpu: 'gpu-rtx5080', motherboard: 'mb-z890-tomahawk', ram: 'ram-gtz32g-6400', cooler: 'clr-lf3-360', psu: 'psu-dpp13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' },
      nvidia: { cpu: 'cpu-r7-7800x3d', gpu: 'gpu-rtx5080', motherboard: 'mb-x870-tomahawk', ram: 'ram-gtz32g-6400', cooler: 'clr-lf3-360', psu: 'psu-dpp13-1000', case: 'case-h9flow', ssd: 'ssd-990pro-2tb' }
    }
  },
  {
    id: 'tier-15000',
    budgetPLN: 15000,
    title: 'Флагман мечты (RTX 5090)',
    description: 'Ультимативный компьютер на базе мощнейшей в мире RTX 5090 32GB и топового процессора.',
    variants: {
      all: { cpu: 'cpu-r7-9800x3d', gpu: 'gpu-rtx5090', motherboard: 'mb-x870e-crosshair', ram: 'ram-gtzrgb64g-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-gx1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' },
      amd: { cpu: 'cpu-r9-9950x3d', gpu: 'gpu-rtx5090', motherboard: 'mb-x870e-crosshair', ram: 'ram-gtzrgb64g-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-gx1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' },
      intel: { cpu: 'cpu-u9-285k', gpu: 'gpu-rtx5090', motherboard: 'mb-z890-rog-strix-f', ram: 'ram-gtzrgb64g-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-gx1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' },
      nvidia: { cpu: 'cpu-r7-9800x3d', gpu: 'gpu-rtx5090', motherboard: 'mb-x870e-crosshair', ram: 'ram-gtzrgb64g-6400', cooler: 'clr-kraken-360', psu: 'psu-vertex-gx1200', case: 'case-o11devo', ssd: 'ssd-990pro-4tb' }
    }
  }
];

export function buildFromCurated(budgetPLN, partsDb, options = {}) {
  const cpuBrand = (options.cpuBrand || 'all').toLowerCase();
  const gpuBrand = (options.gpuBrand || 'all').toLowerCase();
  const ratePLN = 4.05;

  let variantKey = 'all';
  if (cpuBrand === 'amd' && gpuBrand === 'amd') variantKey = 'amd';
  else if (cpuBrand === 'intel') variantKey = 'intel';
  else if (gpuBrand === 'nvidia') variantKey = 'nvidia';
  else if (cpuBrand === 'amd') variantKey = 'amd';

  // Helper to compute total price of a template with current database prices
  function getTemplateCost(template) {
    let sum = 0;
    for (const cat in template) {
      const part = (partsDb[cat] || []).find(p => p.id === template[cat]);
      if (part) {
        sum += (part.pricePLN || Math.round(part.price * ratePLN));
      }
    }
    return sum;
  }

  // 1. Pick the best tier whose actual template cost fits comfortably within budgetPLN (or closest below)
  let matchedTier = CURATED_BASELINES[0];
  for (const tier of CURATED_BASELINES) {
    const tpl = tier.variants[variantKey] || tier.variants['all'];
    const cost = getTemplateCost(tpl);
    if (cost <= budgetPLN * 1.05) {
      matchedTier = tier;
    }
  }

  const template = matchedTier.variants[variantKey] || matchedTier.variants['all'];

  function findPart(category, id) {
    return (partsDb[category] || []).find(p => p.id === id) || (partsDb[category] || [])[0];
  }

  const activeBuild = {
    cpu: findPart('cpu', template.cpu),
    gpu: findPart('gpu', template.gpu),
    motherboard: findPart('motherboard', template.motherboard),
    ram: findPart('ram', template.ram),
    cooler: findPart('cooler', template.cooler),
    psu: findPart('psu', template.psu),
    case: findPart('case', template.case),
    ssd: findPart('ssd', template.ssd),
    hdd: null,
    monitor: null
  };

  function calcBuildTotalPLN() {
    let sum = 0;
    for (const k in activeBuild) {
      if (activeBuild[k]) {
        sum += (activeBuild[k].pricePLN || Math.round(activeBuild[k].price * ratePLN));
      }
    }
    return sum;
  }

  let currentTotal = calcBuildTotalPLN();
  let surplus = budgetPLN - currentTotal;
  const appliedUpgrades = [];

  // 2. SMART STEP-UP UPGRADES (ONLY if surplus > 0 and won't exceed budget)
  if (surplus >= 180 && activeBuild.ssd && activeBuild.ssd.capacity === '1TB') {
    const betterSsd = (partsDb.ssd || []).find(s => s.interface !== 'SATA' && s.capacity === '2TB' && s.price > activeBuild.ssd.price);
    if (betterSsd) {
      const costDiff = (betterSsd.pricePLN || Math.round(betterSsd.price * ratePLN)) - (activeBuild.ssd.pricePLN || Math.round(activeBuild.ssd.price * ratePLN));
      if (costDiff <= surplus && (currentTotal + costDiff) <= budgetPLN * 1.02) {
        appliedUpgrades.push(`SSD: 1TB ➔ 2TB NVMe (${betterSsd.name})`);
        activeBuild.ssd = betterSsd;
        currentTotal += costDiff;
        surplus -= costDiff;
      }
    }
  }

  if (surplus >= 120 && activeBuild.cooler && activeBuild.cooler.type === 'air' && activeBuild.cooler.price < 50) {
    const dualTower = (partsDb.cooler || []).find(c => c.id === 'clr-pa120-se' || c.id === 'clr-ak620');
    if (dualTower) {
      const costDiff = (dualTower.pricePLN || Math.round(dualTower.price * ratePLN)) - (activeBuild.cooler.pricePLN || Math.round(activeBuild.cooler.price * ratePLN));
      if (costDiff <= surplus && (currentTotal + costDiff) <= budgetPLN * 1.02) {
        appliedUpgrades.push(`Кулер: 2-башенный тихий ${dualTower.name}`);
        activeBuild.cooler = dualTower;
        currentTotal += costDiff;
        surplus -= costDiff;
      }
    }
  }

  return {
    build: activeBuild,
    tier: matchedTier,
    upgrades: appliedUpgrades,
    totalPLN: calcBuildTotalPLN()
  };
}
