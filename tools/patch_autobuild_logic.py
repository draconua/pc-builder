with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

new_func = """function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {
    const maxBudget = budgetUSD * 1.05; // 5% tolerance
    
    let validGpus = PARTS_DATABASE.gpu.filter(g => gpuBrand === 'all' || g.brand.toLowerCase() === gpuBrand.toLowerCase());
    let validCpus = PARTS_DATABASE.cpu.filter(c => cpuBrand === 'all' || c.brand.toLowerCase() === cpuBrand.toLowerCase());
    
    if (validGpus.length === 0) validGpus = PARTS_DATABASE.gpu;
    if (validCpus.length === 0) validCpus = PARTS_DATABASE.cpu;

    // Helper to assemble the rest of the PC around a CPU/GPU combo
    function assemble(c, g) {
      // MB matching CPU socket
      const mbPool = PARTS_DATABASE.motherboard.filter(m => m.socket === c.socket).sort((a,b) => a.price - b.price);
      // RAM matching CPU ramType
      const ramDdr = c.ramType || 'DDR5';
      const ramPool = PARTS_DATABASE.ram.filter(r => r.type === ramDdr).sort((a,b) => a.price - b.price);
      // Cooler matching CPU TDP
      const cpuTdp = c.maxTdp || c.tdp || 65;
      const coolerPool = PARTS_DATABASE.cooler.filter(k => (k.maxTdp || 150) >= cpuTdp).sort((a,b) => a.price - b.price);
      // PSU matching System TDP + 20% margin
      const estTdp = cpuTdp + (g.tdp || 150) + 100;
      const psuPool = PARTS_DATABASE.psu.filter(p => p.wattage >= estTdp * 1.2).sort((a,b) => a.price - b.price);
      // Case fitting GPU length
      const casePool = PARTS_DATABASE.case.filter(cs => !cs.maxGpuLength || cs.maxGpuLength >= (g.length || 280)).sort((a,b) => a.price - b.price);
      // SSD
      const ssdPool = [...PARTS_DATABASE.ssd].sort((a,b) => a.price - b.price);

      // Smart Tiering for supporting components based on budget
      let mb = mbPool.find(m => m.price >= budgetUSD * 0.10) || mbPool[0] || PARTS_DATABASE.motherboard[0];
      // For high-end budgets, ensure we don't pick A520/H610 boards if we have a top CPU
      if (budgetUSD >= 1200 && mb) {
         const betterMb = mbPool.find(m => m.price >= budgetUSD * 0.12 && !m.name.toLowerCase().includes('h610') && !m.name.toLowerCase().includes('a520'));
         if (betterMb) mb = betterMb;
      }
      
      let ram = ramPool.find(r => r.capacity === (budgetUSD >= 1200 ? '32GB' : '16GB')) || ramPool[0] || PARTS_DATABASE.ram[0];
      let cooler = coolerPool.find(k => budgetUSD >= 1800 ? k.type === 'aio' : true) || coolerPool[0] || PARTS_DATABASE.cooler[0];
      let psu = psuPool[0] || PARTS_DATABASE.psu[0];
      // For RTX 40/50 GPUs on high budgets, prefer ATX 3.0 PSU
      if (budgetUSD >= 1500 && (g.name.includes('RTX 40') || g.name.includes('RTX 50'))) {
         const atx3psu = psuPool.find(p => p.specs && p.specs.includes('ATX 3.0'));
         if (atx3psu) psu = atx3psu;
      }

      let cs = casePool.find(cas => budgetUSD >= 1500 ? cas.price >= 80 : true) || casePool[0] || PARTS_DATABASE.case[0];
      let ssd = ssdPool.find(s => budgetUSD >= 1500 ? s.capacity === '2TB' : s.capacity === '1TB') || ssdPool[0] || PARTS_DATABASE.ssd[0];

      const buildObj = { cpu: c, gpu: g, motherboard: mb, ram, cooler, psu, case: cs, ssd, hdd: null, monitor: null };
      const total = Object.values(buildObj).reduce((sum, p) => sum + (p ? p.price : 0), 0);
      return { buildObj, total };
    }

    let bestBuild = null;
    let bestScore = -1;

    // Weighting multiplier for GPU based on resolution
    const gpuWeight = targetRes === '4k' ? 3.0 : targetRes === '1440p' ? 2.2 : 1.5;

    // Brute-force all valid CPU/GPU combos (approx 44 * 29 = ~1200 iterations, takes <2ms in JS)
    for (const c of validCpus) {
      for (const g of validGpus) {
        const { buildObj, total } = assemble(c, g);
        
        if (total <= maxBudget) {
          // Verify synergy using analyzeBottleneck
          const bottleneck = analyzeBottleneck(c, g, targetRes);
          
          // Reject combinations that are severely CPU-bound (CPU is too weak for the GPU)
          // UNLESS the budget is super low (we might have no choice)
          if (bottleneck && bottleneck.isCpuBound && budgetUSD > 600) {
            continue; 
          }
          
          // Reject picking extreme CPUs (like Threadripper or 9950X) with weak GPUs for gaming
          if (bottleneck && bottleneck.isGpuBound && (c.price > g.price * 1.5)) {
             continue;
          }

          // Calculate a "Gaming Power Score"
          const score = (g.gpuScore * gpuWeight) + c.cpuScore;

          if (score > bestScore) {
            bestScore = score;
            bestBuild = buildObj;
          }
        }
      }
    }

    // Fallback if no build matched strict logic (e.g., budget is extremely low)
    if (!bestBuild) {
       // Just pick the cheapest valid CPU/GPU and assemble
       validCpus.sort((a,b) => a.price - b.price);
       validGpus.sort((a,b) => a.price - b.price);
       bestBuild = assemble(validCpus[0], validGpus[0]).buildObj;
    }

    buildState = bestBuild;
    updateUI();
}"""

old_func = re.search(r'function generateAutoBuild\(.*?\)\s*\{([\s\S]*?updateUI\(\);\n\s*)\}', js)
if old_func:
    js = js.replace(old_func.group(0), new_func)
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched generateAutoBuild to use intelligent combinatorial logic.")
else:
    print("Could not find generateAutoBuild in js/app.js")
