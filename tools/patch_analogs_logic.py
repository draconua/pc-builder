import re
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

universal_analogs_func = """
function updateAnalogs(category, currentPart) {
    const box = document.getElementById(`${category}-analogs-box`);
    const list = document.getElementById(`${category}-analogs-list`);
    if (!box || !list) return;

    if (!currentPart) {
      box.classList.add('hidden');
      return;
    }

    let candidates = [];
    const pool = PARTS_DATABASE[category] || [];

    // Logic based on category to find similar alternatives
    switch (category) {
      case 'cpu':
        candidates = pool.filter(c => c.id !== currentPart.id && Math.abs(c.cpuScore - currentPart.cpuScore) <= 15 && c.socket === currentPart.socket);
        break;
      case 'gpu':
        candidates = pool.filter(g => g.id !== currentPart.id && Math.abs(g.gpuScore - currentPart.gpuScore) <= 15);
        break;
      case 'motherboard':
        candidates = pool.filter(m => m.id !== currentPart.id && m.socket === currentPart.socket && Math.abs(m.price - currentPart.price) <= 50 && m.brand !== currentPart.brand);
        break;
      case 'cooler':
        candidates = pool.filter(c => c.id !== currentPart.id && Math.abs(c.price - currentPart.price) <= 40 && c.type !== currentPart.type); // suggest AIO vs Air
        if (candidates.length === 0) candidates = pool.filter(c => c.id !== currentPart.id && Math.abs(c.price - currentPart.price) <= 20);
        break;
      case 'ram':
        candidates = pool.filter(r => r.id !== currentPart.id && r.type === currentPart.type && Math.abs(r.price - currentPart.price) <= 30);
        break;
      case 'ssd':
        const isM2 = currentPart.interface.includes('M.2');
        candidates = pool.filter(s => s.id !== currentPart.id && s.interface.includes('M.2') === isM2 && Math.abs(s.price - currentPart.price) <= 30);
        break;
      case 'hdd':
        candidates = pool.filter(h => h.id !== currentPart.id && Math.abs(h.price - currentPart.price) <= 20);
        break;
      case 'psu':
        candidates = pool.filter(p => p.id !== currentPart.id && Math.abs(p.wattage - currentPart.wattage) <= 100 && Math.abs(p.price - currentPart.price) <= 40);
        break;
      case 'case':
        candidates = pool.filter(c => c.id !== currentPart.id && Math.abs(c.price - currentPart.price) <= 40);
        break;
      case 'monitor':
        candidates = pool.filter(m => m.id !== currentPart.id && m.resolution === currentPart.resolution && Math.abs(m.price - currentPart.price) <= 80);
        break;
    }

    if (candidates.length === 0) {
      box.classList.add('hidden');
      return;
    }

    // Sort by price proximity and take top 2-3
    candidates.sort((a, b) => Math.abs(a.price - currentPart.price) - Math.abs(b.price - currentPart.price));
    candidates = candidates.slice(0, 3);

    list.innerHTML = '';
    candidates.forEach(alt => {
      const chip = document.createElement('div');
      chip.className = 'analog-chip';
      chip.innerHTML = `<span>${alt.name}</span><span class="analog-price">${alt.price} zł</span>`;
      chip.addEventListener('click', () => {
        pushHistory();
        buildState[category] = alt;
        updateUI();
      });
      list.appendChild(chip);
    });

    box.classList.remove('hidden');
}
"""

# Replace the old analog functions
js = re.sub(r'function updateCpuAnalogs[\s\S]*?\}\n\s*\}\n', '', js)
js = re.sub(r'function updateGpuAnalogs[\s\S]*?\}\n\s*\}\n', '', js)

# Also in updateUI we need to replace the old calls
js = re.sub(r'updateCpuAnalogs\(buildState\.cpu\);', '', js)
js = re.sub(r'updateGpuAnalogs\(buildState\.gpu\);', '', js)

# Inject the new function before updateUI
ui_idx = js.find('function updateUI')
js = js[:ui_idx] + universal_analogs_func + "\n" + js[ui_idx:]

# In updateUI, after the CATEGORIES loop finishes, we should update all analogs
js = js.replace("updateSvgVisualizer();", "CATEGORIES.forEach(cat => updateAnalogs(cat, buildState[cat]));\n  updateSvgVisualizer();")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Injected universal updateAnalogs and removed old functions.")
