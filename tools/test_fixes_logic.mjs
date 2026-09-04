import { PARTS_DATABASE } from './js/data.js';

function getSuggestedFixes(issueMsg, buildState) {
  const fixes = [];

  // 1. PSU wattage issue
  if (issueMsg.toLowerCase().includes('power supply') || issueMsg.toLowerCase().includes('wattage') || issueMsg.toLowerCase().includes('overload')) {
    let estTdp = 100;
    if (buildState.cpu) estTdp += (buildState.cpu.maxTdp || buildState.cpu.tdp || 65);
    if (buildState.gpu) estTdp += (buildState.gpu.tdp || 150);
    const targetWattage = Math.max(750, Math.ceil((estTdp * 1.3) / 50) * 50);

    const candidates = PARTS_DATABASE.psu
      .filter(p => p.wattage >= targetWattage)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (candidates.length > 0) {
      fixes.push({
        title: `⚡ Рекомендуемые блоки питания (${targetWattage}W+):`,
        category: 'psu',
        parts: candidates
      });
    }
  }

  // 2. Socket mismatch
  if (issueMsg.includes('Socket Mismatch') && buildState.cpu && buildState.motherboard) {
    const mbOptions = PARTS_DATABASE.motherboard
      .filter(m => m.socket === buildState.cpu.socket)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (mbOptions.length > 0) {
      fixes.push({
        title: `⚡ Платы под сокет ${buildState.cpu.socket} (${buildState.cpu.name}):`,
        category: 'motherboard',
        parts: mbOptions
      });
    }

    const cpuOptions = PARTS_DATABASE.cpu
      .filter(c => c.socket === buildState.motherboard.socket)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (cpuOptions.length > 0) {
      fixes.push({
        title: `⚡ Либо процессоры под сокет ${buildState.motherboard.socket}:`,
        category: 'cpu',
        parts: cpuOptions
      });
    }
  }

  // 3. Memory Standard Mismatch
  if (issueMsg.includes('Memory Standard Mismatch') && buildState.motherboard) {
    const ramOptions = PARTS_DATABASE.ram
      .filter(r => r.type === buildState.motherboard.ramType)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (ramOptions.length > 0) {
      fixes.push({
        title: `⚡ Комплекты памяти стандарта ${buildState.motherboard.ramType}:`,
        category: 'ram',
        parts: ramOptions
      });
    }
  }

  return fixes;
}

// Test scenario 1: Weak PSU with 4090
const testBuild = {
  cpu: PARTS_DATABASE.cpu.find(c => c.id.includes('7800x3d')),
  gpu: PARTS_DATABASE.gpu.find(g => g.id.includes('4090')),
  motherboard: PARTS_DATABASE.motherboard.find(m => m.socket === 'AM5'),
  psu: PARTS_DATABASE.psu.find(p => p.wattage <= 600)
};

const fixes = getSuggestedFixes('Power Supply wattage is insufficient', testBuild);
console.log('Fixes for weak PSU:', fixes[0].title);
fixes[0].parts.forEach(p => console.log(' ->', p.name, p.wattage + 'W', p.price + '$'));
