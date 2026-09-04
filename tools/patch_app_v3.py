with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Update import
js = js.replace("import { estimateFPS, analyzeBottleneck } from './performance.js", "import { estimateAllFPS, estimateFPS, analyzeBottleneck } from './performance.js")

# 2. Add CPU analogs rendering function
cpu_analogs_code = """
// Render CPU Analogs / Competitor Alternatives
function renderCpuAnalogs(cpu) {
  const container = document.getElementById('cpu-analogs-box');
  const list = document.getElementById('cpu-analogs-list');
  if (!container || !list) return;

  if (!cpu) {
    container.classList.add('hidden');
    list.innerHTML = '';
    return;
  }

  // Find direct alternatives: prefer different brand, similar tier (+-1) and similar price (+-30%)
  const alternatives = PARTS_DATABASE.cpu.filter(p => {
    if (p.id === cpu.id) return false;
    const isOtherBrand = p.brand !== cpu.brand;
    const tierDiff = Math.abs((p.tier || 5) - (cpu.tier || 5));
    const priceRatio = p.price / cpu.price;
    return (isOtherBrand && tierDiff <= 1) || (tierDiff === 0 && priceRatio >= 0.75 && priceRatio <= 1.35);
  }).slice(0, 3);

  if (alternatives.length === 0) {
    container.classList.add('hidden');
    list.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  list.innerHTML = alternatives.map(alt => {
    const formattedPrice = formatPrice(alt.price);
    return `<button type="button" class="analog-chip-btn" data-id="${alt.id}" title="${alt.name}">
      <strong>${alt.name.replace('AMD ', '').replace('Intel ', '')}</strong>
      <span>${formattedPrice}</span>
    </button>`;
  }).join('');

  list.querySelectorAll('.analog-chip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const altId = btn.getAttribute('data-id');
      const altPart = PARTS_DATABASE.cpu.find(p => p.id === altId);
      if (altPart) {
        pushHistory();
        buildState.cpu = altPart;
        // If motherboard socket does not match, reset motherboard for compatibility
        if (buildState.motherboard && buildState.motherboard.socket !== altPart.socket) {
          buildState.motherboard = null;
        }
        updateUI();
      }
    });
  });
}
"""

# Inject renderCpuAnalogs right after renderGpuAnalogs
gpu_analogs_idx = js.find("function renderGpuAnalogs(gpu)")
if gpu_analogs_idx != -1:
    end_of_func = js.find("}\n\n", gpu_analogs_idx)
    js = js[:end_of_func+2] + "\n" + cpu_analogs_code + "\n" + js[end_of_func+2:]

# Call renderCpuAnalogs inside updateUI
target_ui_call = "renderGpuAnalogs(buildState.gpu);"
js = js.replace(target_ui_call, "renderGpuAnalogs(buildState.gpu);\n  renderCpuAnalogs(buildState.cpu);")

# 3. Update updateFpsPanel to multi-resolution table
new_fps_panel = """// Update FPS Panel (All 3 Resolutions Simultaneously)
function updateFpsPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  const placeholder = document.getElementById('fps-placeholder');
  const tableContainer = document.getElementById('fps-table-container');
  const tbody = document.getElementById('fps-matrix-tbody');

  if (!cpu || !gpu) {
    if (placeholder) placeholder.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    return;
  }

  if (placeholder) placeholder.classList.add('hidden');
  if (tableContainer) tableContainer.classList.remove('hidden');
  if (!tbody) return;

  const games = estimateAllFPS(cpu.tier, gpu.tier);

  const getBadgeClass = (fps) => {
    if (fps >= 120) return 'fps-tag-ultra';
    if (fps >= 75) return 'fps-tag-high';
    if (fps >= 60) return 'fps-tag-medium';
    return 'fps-tag-low';
  };

  tbody.innerHTML = games.map(g => `
    <tr>
      <td class="col-game">
        <div class="game-meta">
          <strong class="game-name">${g.game}</strong>
          <span class="game-genre">${g.genre}</span>
        </div>
      </td>
      <td class="col-res">
        <span class="fps-badge ${getBadgeClass(g.fps1080)}">${g.fps1080} FPS</span>
      </td>
      <td class="col-res">
        <span class="fps-badge ${getBadgeClass(g.fps1440)}">${g.fps1440} FPS</span>
      </td>
      <td class="col-res">
        <span class="fps-badge ${getBadgeClass(g.fps4k)}">${g.fps4k} FPS</span>
      </td>
    </tr>
  `).join('');
}"""

import re
pattern_fps = r'// Update FPS estimation panel.*?\}\s*\}\s*\}'
js = re.sub(pattern_fps, new_fps_panel, js, flags=re.DOTALL)

# 4. Update generateAutoBuild to respect CPU brand and GPU brand filters
new_autobuild_sig = "function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {"
js = re.sub(r'function generateAutoBuild\(budgetUSD.*?\)\s*\{', new_autobuild_sig, js)

filter_brands_code = """    let sortedGpus = [...PARTS_DATABASE.gpu];
    let sortedCpus = [...PARTS_DATABASE.cpu];

    if (gpuBrand !== 'all') {
      sortedGpus = sortedGpus.filter(g => g.brand.toLowerCase() === gpuBrand.toLowerCase());
      if (sortedGpus.length === 0) sortedGpus = [...PARTS_DATABASE.gpu];
    }
    if (cpuBrand !== 'all') {
      sortedCpus = sortedCpus.filter(c => c.brand.toLowerCase() === cpuBrand.toLowerCase());
      if (sortedCpus.length === 0) sortedCpus = [...PARTS_DATABASE.cpu];
    }

    sortedGpus.sort((a,b) => b.price - a.price);
    sortedCpus.sort((a,b) => b.price - a.price);"""

old_sort = """    const sortedGpus = [...PARTS_DATABASE.gpu].sort((a,b) => b.price - a.price);
    const sortedCpus = [...PARTS_DATABASE.cpu].sort((a,b) => b.price - a.price);"""

js = js.replace(old_sort, filter_brands_code)

# 5. Wire up brand chips and targetRes in Popover
popover_wireup = """    // CPU & GPU Brand Chips
    let selectedCpuBrand = 'all';
    let selectedGpuBrand = 'all';
    let selectedTargetRes = '1440p';

    document.querySelectorAll('#cpu-brand-group .choice-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('#cpu-brand-group .choice-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedCpuBrand = chip.getAttribute('data-cpu-brand');
      });
    });

    document.querySelectorAll('#gpu-brand-group .choice-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('#gpu-brand-group .choice-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedGpuBrand = chip.getAttribute('data-gpu-brand');
      });
    });

    resChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        resChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedTargetRes = chip.getAttribute('data-res');
      });
    });

    // Generate action
    if (autoBuildConfirmBtn) {
      autoBuildConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawBudget = budgetRange ? parseInt(budgetRange.value, 10) : (currentCurrency === 'PLN' ? 5000 : 1200);
        const rate = currentCurrency === 'PLN' ? (EXCHANGE_RATES.PLN || 4.05) : 1;
        const budgetUSD = Math.round(rawBudget / rate);
        
        pushHistory();
        generateAutoBuild(budgetUSD, selectedTargetRes, selectedCpuBrand, selectedGpuBrand);
        autobuildPopover.classList.add('hidden');
      });
    }"""

old_wireup_pat = r'// Resolution chips switching.*?autobuildPopover\.classList\.add\(\'hidden\'\);\s*\}\);\s*\}'
js = re.sub(old_wireup_pat, popover_wireup, js, flags=re.DOTALL)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/app.js with CPU analogs, brand filtering, and multi-res FPS matrix!")
