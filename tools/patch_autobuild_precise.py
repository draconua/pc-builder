with open("js/app.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace generateAutoBuild with the new intelligent optimizer
new_autobuild_function = """  function generateAutoBuild(budgetUSD) {
    const sortedGpus = [...PARTS_DATABASE.gpu].sort((a,b) => b.price - a.price);
    const sortedCpus = [...PARTS_DATABASE.cpu].sort((a,b) => b.price - a.price);

    // Initial allocations: GPU ~42%, CPU ~22%
    let gpu = sortedGpus.find(g => g.price <= budgetUSD * 0.44) || sortedGpus[sortedGpus.length - 1];
    let cpu = sortedCpus.find(c => c.price <= budgetUSD * 0.23) || sortedCpus[sortedCpus.length - 1];

    function assemble(c, g) {
      // MB matching CPU socket
      const mbPool = PARTS_DATABASE.motherboard
        .filter(m => m.socket === c.socket)
        .sort((a,b) => a.price - b.price);
      
      // RAM matching CPU ramType
      const ramDdr = c.ramType || 'DDR5';
      const ramPool = PARTS_DATABASE.ram
        .filter(r => r.type === ramDdr)
        .sort((a,b) => a.price - b.price);

      // Cooler matching CPU TDP
      const cpuTdp = c.maxTdp || c.tdp || 65;
      const coolerPool = PARTS_DATABASE.cooler
        .filter(k => (k.maxTdp || 150) >= cpuTdp)
        .sort((a,b) => a.price - b.price);

      // PSU matching System TDP + 20% margin
      const estTdp = cpuTdp + (g.tdp || 150) + 100;
      const psuPool = PARTS_DATABASE.psu
        .filter(p => p.wattage >= estTdp * 1.2)
        .sort((a,b) => a.price - b.price);

      // Case fitting GPU length
      const casePool = PARTS_DATABASE.case
        .filter(cs => !cs.maxGpuLength || cs.maxGpuLength >= (g.length || 280))
        .sort((a,b) => a.price - b.price);

      // SSD
      const ssdPool = [...PARTS_DATABASE.ssd].sort((a,b) => a.price - b.price);

      let mb = mbPool.find(m => m.price >= budgetUSD * 0.10) || mbPool[0] || PARTS_DATABASE.motherboard[0];
      let ram = ramPool.find(r => r.capacity === (budgetUSD >= 1200 ? '32GB' : '16GB')) || ramPool[0] || PARTS_DATABASE.ram[0];
      let cooler = coolerPool.find(k => budgetUSD >= 1800 ? k.type === 'aio' : true) || coolerPool[0] || PARTS_DATABASE.cooler[0];
      let psu = psuPool[0] || PARTS_DATABASE.psu[0];
      let cs = casePool.find(cas => budgetUSD >= 1500 ? cas.price >= 80 : true) || casePool[0] || PARTS_DATABASE.case[0];
      let ssd = ssdPool.find(s => budgetUSD >= 1500 ? s.capacity === '2TB' : s.capacity === '1TB') || ssdPool[0] || PARTS_DATABASE.ssd[0];

      return { cpu: c, gpu: g, motherboard: mb, ram, cooler, psu, case: cs, ssd, hdd: null, monitor: null };
    }

    let build = assemble(cpu, gpu);
    let total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);

    // Iteratively downgrade GPU/CPU if over user's budget
    while (total > budgetUSD && sortedGpus.indexOf(gpu) < sortedGpus.length - 1) {
      const nextGpuIdx = sortedGpus.indexOf(gpu) + 1;
      gpu = sortedGpus[nextGpuIdx];
      build = assemble(cpu, gpu);
      total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);
    }

    while (total > budgetUSD && sortedCpus.indexOf(cpu) < sortedCpus.length - 1) {
      const nextCpuIdx = sortedCpus.indexOf(cpu) + 1;
      cpu = sortedCpus[nextCpuIdx];
      build = assemble(cpu, gpu);
      total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);
    }

    buildState = build;
    updateUI();
  }"""

import re
pattern = r'  function generateAutoBuild\(budgetUSD\)\s*\{.*?buildState\s*=\s*\{.*?\};\s*updateUI\(\);\s*\}'
code = re.sub(pattern, new_autobuild_function, code, flags=re.DOTALL)

# Update Popover logic to respect currency (PLN vs USD)
popover_currency_logic = """
    // Update Popover UI whenever currency changes
    window.syncAutobuildCurrency = function() {
      if (!budgetRange || !budgetDisplay) return;
      const isPln = currentCurrency === 'PLN';
      const rate = isPln ? (EXCHANGE_RATES.PLN || 4.05) : 1;
      const symbol = isPln ? 'zł' : '$';

      if (isPln) {
        budgetRange.min = 2000;
        budgetRange.max = 16000;
        budgetRange.step = 100;
        if (parseInt(budgetRange.value, 10) < 2000) budgetRange.value = 5000;
      } else {
        budgetRange.min = 500;
        budgetRange.max = 4000;
        budgetRange.step = 50;
        if (parseInt(budgetRange.value, 10) > 4000 || parseInt(budgetRange.value, 10) < 500) budgetRange.value = 1200;
      }

      budgetDisplay.textContent = `${budgetRange.value} ${symbol}`;

      // Update quick budget chips
      const quickVals = isPln ? [3000, 5000, 7500, 10000] : [800, 1200, 1800, 2500];
      quickBudgetBtns.forEach((btn, idx) => {
        if (quickVals[idx]) {
          btn.setAttribute('data-val', quickVals[idx]);
          btn.textContent = `${quickVals[idx]} ${symbol}`;
          btn.classList.toggle('active', btn.getAttribute('data-val') === budgetRange.value);
        }
      });
    };

    // Budget slider sync
    if (budgetRange && budgetDisplay) {
      budgetRange.addEventListener('input', () => {
        const val = budgetRange.value;
        const symbol = currentCurrency === 'PLN' ? 'zł' : '$';
        budgetDisplay.textContent = `${val} ${symbol}`;
        quickBudgetBtns.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-val') === val);
        });
      });
    }

    // Quick budget chips
    quickBudgetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = btn.getAttribute('data-val');
        const symbol = currentCurrency === 'PLN' ? 'zł' : '$';
        if (budgetRange) budgetRange.value = val;
        if (budgetDisplay) budgetDisplay.textContent = `${val} ${symbol}`;
        quickBudgetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Generate action
    if (autoBuildConfirmBtn) {
      autoBuildConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawBudget = budgetRange ? parseInt(budgetRange.value, 10) : (currentCurrency === 'PLN' ? 5000 : 1200);
        // Convert to USD for internal calculation
        const rate = currentCurrency === 'PLN' ? (EXCHANGE_RATES.PLN || 4.05) : 1;
        const budgetUSD = Math.round(rawBudget / rate);
        
        pushHistory();
        generateAutoBuild(budgetUSD);
        autobuildPopover.classList.add('hidden');
      });
    }
"""

old_popover_body = """    // Budget slider sync
    if (budgetRange && budgetDisplay) {
      budgetRange.addEventListener('input', () => {
        const val = budgetRange.value;
        budgetDisplay.textContent = `$${val}`;
        quickBudgetBtns.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-val') === val);
        });
      });
    }

    // Quick budget chips
    quickBudgetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = btn.getAttribute('data-val');
        if (budgetRange) budgetRange.value = val;
        if (budgetDisplay) budgetDisplay.textContent = `$${val}`;
        quickBudgetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Resolution chips
    resChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        resChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Generate action
    if (autoBuildConfirmBtn) {
      autoBuildConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const budget = budgetRange ? parseInt(budgetRange.value, 10) : 1200;
        pushHistory();
        generateAutoBuild(budget);
        autobuildPopover.classList.add('hidden');
      });
    }"""

if old_popover_body in code:
    code = code.replace(old_popover_body, popover_currency_logic)
    print("Replaced popover body with currency-aware auto-build logic!")
else:
    print("Old popover body not matched directly, replacing via regex...")
    pattern2 = r'    // Budget slider sync.*?autobuildPopover\.classList\.add\(\'hidden\'\);\s*\}\);'
    code = re.sub(pattern2, popover_currency_logic, code, flags=re.DOTALL)

# Also call syncAutobuildCurrency inside setCurrency
code = code.replace("updateUI();\n}", "updateUI();\n  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();\n}")

# And inside init()
code = code.replace("setupEventListeners();", "setupEventListeners();\n  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated js/app.js with precise budget-constrained auto-builder!")
