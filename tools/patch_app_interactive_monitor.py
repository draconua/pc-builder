import re

with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. FIX: Slot Card Click Listeners (only .select-btn opens drawer, not whole card)
old_slot_listener = """  // Checklist slot clicks
  document.querySelectorAll('.slot-card').forEach(card => {
    const category = card.dataset.category;
    
    // Choose item when select button or card itself clicked (if empty)
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-btn')) {
        e.stopPropagation();
        removePart(category);
      } else if (e.target.classList.contains('slot-buy-link')) {
        e.stopPropagation();
      } else {
        openDrawer(category);
      }
    });
  });"""

new_slot_listener = """  // Checklist slot buttons (ONLY .select-btn opens drawer, not whole card)
  document.querySelectorAll('.slot-card').forEach(card => {
    const category = card.dataset.category;
    
    const selectBtn = card.querySelector('.select-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDrawer(category);
      });
    }

    const removeBtn = card.querySelector('.remove-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removePart(category);
      });
    }
  });"""

if old_slot_listener in js:
    js = js.replace(old_slot_listener, new_slot_listener)
    print("Replaced slot-card click listeners with select-btn only.")
else:
    # Try regex replacement if indentation or whitespace differs
    pattern = r'// Checklist slot clicks\s*document\.querySelectorAll\(\'\.slot-card\'\)[\s\S]*?card\.addEventListener\(\'click\'[\s\S]*?\}\);\s*\}\);'
    match = re.search(pattern, js)
    if match:
        js = js[:match.start()] + new_slot_listener + js[match.end():]
        print("Replaced slot-card click listeners via regex.")
    else:
        print("WARNING: Could not find old_slot_listener.")

# 2. FIX: updateAnalogs implementation (proper class, formatPrice, stopPropagation)
old_analogs_pattern = r'function updateAnalogs\(category, currentPart\)\s*\{[\s\S]*?box\.classList\.remove\(\'hidden\'\);\s*\}'
new_analogs_code = """function updateAnalogs(category, currentPart) {
    const box = document.getElementById(`${category}-analogs-box`);
    const list = document.getElementById(`${category}-analogs-list`);
    if (!box || !list) return;

    if (!currentPart) {
      box.classList.add('hidden');
      return;
    }

    let candidates = [];
    const pool = PARTS_DATABASE[category] || [];

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
        candidates = pool.filter(c => c.id !== currentPart.id && Math.abs(c.price - currentPart.price) <= 40 && c.type !== currentPart.type);
        if (candidates.length === 0) candidates = pool.filter(c => c.id !== currentPart.id && Math.abs(c.price - currentPart.price) <= 20);
        break;
      case 'ram':
        candidates = pool.filter(r => r.id !== currentPart.id && r.type === currentPart.type && Math.abs(r.price - currentPart.price) <= 30);
        break;
      case 'ssd':
        const isM2 = currentPart.interface && currentPart.interface.includes('M.2');
        candidates = pool.filter(s => s.id !== currentPart.id && (s.interface && s.interface.includes('M.2')) === isM2 && Math.abs(s.price - currentPart.price) <= 30);
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

    candidates.sort((a, b) => Math.abs(a.price - currentPart.price) - Math.abs(b.price - currentPart.price));
    candidates = candidates.slice(0, 3);

    list.innerHTML = '';
    candidates.forEach(alt => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'analog-chip-btn';
      chip.innerHTML = `<strong>${alt.name}</strong> <span class="analog-chip-price">${formatPrice(alt.price)}</span>`;
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        pushHistory();
        buildState[category] = alt;
        if (category === 'cpu' && buildState.motherboard && buildState.motherboard.socket !== alt.socket) {
          buildState.motherboard = null;
        }
        if (category === 'motherboard' && buildState.ram && buildState.ram.type !== alt.ramType) {
          buildState.ram = null;
        }
        updateUI();
      });
      list.appendChild(chip);
    });

    box.classList.remove('hidden');
}"""

match = re.search(old_analogs_pattern, js)
if match:
    js = js[:match.start()] + new_analogs_code + js[match.end():]
    print("Updated updateAnalogs with button chips, formatPrice, and stopPropagation.")
else:
    print("WARNING: Could not find old updateAnalogs pattern.")

# 3. FIX: updateFpsPanel (target fps-matrix-tbody, toggle placeholder & table container)
old_fps_pattern = r'function updateFpsPanel\(\)\s*\{[\s\S]*?tbody\.innerHTML\s*=\s*results\.map[\s\S]*?\}\.join\(\'\'\);\s*\}'
new_fps_code = """function updateFpsPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  const placeholder = document.getElementById('fps-placeholder');
  const tableContainer = document.getElementById('fps-table-container');
  const tbody = document.getElementById('fps-matrix-tbody');

  if (!cpu || !gpu) {
    if (placeholder) placeholder.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    if (tbody) tbody.innerHTML = '';
    return;
  }

  if (placeholder) placeholder.classList.add('hidden');
  if (tableContainer) tableContainer.classList.remove('hidden');
  if (!tbody) return;

  const results = estimateAllFPS(cpu, gpu);
  
  tbody.innerHTML = results.map(r => `
    <tr>
      <td>
        <div class="game-cell">
          <span class="game-icon">${getGameIcon(r.game)}</span>
          <div class="game-info">
            <span class="game-name">${r.game}</span>
            <span class="game-genre">${r.genre}</span>
          </div>
        </div>
      </td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps1080)}">${r.fps1080} FPS</span></td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps1440)}">${r.fps1440} FPS</span></td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps4k)}">${r.fps4k} FPS</span></td>
    </tr>
  `).join('');
}"""

match = re.search(old_fps_pattern, js)
if match:
    js = js[:match.start()] + new_fps_code + js[match.end():]
    print("Updated updateFpsPanel with proper container toggling and fps-matrix-tbody.")
else:
    print("WARNING: Could not find old updateFpsPanel pattern.")

# 4. ADD: updateMonitorPanel and getMonitorRecommendation functions
monitor_logic = """
// =============================================================
// MONITOR RECOMMENDATION & SELECTION ENGINE
// =============================================================

function getMonitorRecommendation(gpu) {
  if (!gpu) {
    return {
      badge: 'Ожидание видеокарты',
      badgeClass: 'rec-badge-neutral',
      title: 'Подбор под видеокарту',
      desc: 'Выберите видеокарту в конфигураторе, чтобы система рассчитала оптимальное разрешение и герцовку для вашей системы.',
      quickIds: ['mon-24g2', 'mon-vg27aq', 'mon-27gp95r']
    };
  }

  const gpuScore = gpu.gpuScore || 50;

  // 1. Ultra / 4K Flagship: RTX 4090, 5080, 5090, 4080 Super, RX 7900 XTX (gpuScore >= 80)
  if (gpuScore >= 80) {
    return {
      badge: '🔥 4K UHD & 240Hz OLED',
      badgeClass: 'rec-badge-ultra',
      title: 'Рекомендация: 4K 144Hz+ или 1440p 240Hz OLED',
      desc: `С флагманской ${gpu.name} играть в 1080p — пустая трата потенциала. Карта создана для 4K Ultra (60-100+ FPS) либо ультра-скоростного 1440p 240Hz OLED гейминга с мгновенным откликом.`,
      quickIds: ['mon-27gp95r', 'mon-pg27aqdm', 'mon-m28u', 'mon-neo-g7']
    };
  }
  // 2. Balanced / Sweet Spot: RTX 4070, 4070S, 4070 Ti, RX 7800 XT, 7900 GRE, RX 9070/9070XT (gpuScore >= 50)
  else if (gpuScore >= 50) {
    return {
      badge: '⚡ Золотой стандарт: 1440p 2K (165-180Hz)',
      badgeClass: 'rec-badge-balanced',
      title: 'Рекомендация: 27\\" 1440p 165Hz+ Fast IPS',
      desc: `Видеокарта ${gpu.name} — идеальный выбор для 1440p Quad HD. 27-дюймовый Fast IPS 165-180Hz обеспечит высокую плотность пикселей и плавный фреймрейт 100+ FPS.`,
      quickIds: ['mon-27gp850', 'mon-vg27aq', 'mon-g272qpf', 'mon-g27q']
    };
  }
  // 3. Budget / eSports: RX 6600, RTX 3060, RTX 4060, Arc A580 (gpuScore < 50)
  else {
    return {
      badge: '🎯 Киберспорт: 1080p Full HD (165-180Hz)',
      badgeClass: 'rec-badge-budget',
      title: 'Рекомендация: 24\\" 1080p 165-180Hz Fast IPS',
      desc: `Для ${gpu.name} оптимальным выбором является Full HD 1080p. Высокая герцовка 165-180Hz на IPS-матрице подарит мгновенный отклик и высокий соревновательный FPS.`,
      quickIds: ['mon-24g2', 'mon-g24f2', 'mon-vg27aq']
    };
  }
}

function updateMonitorPanel() {
  const panel = document.getElementById('monitor-panel');
  if (!panel) return;

  const gpu = buildState.gpu;
  const currentMonitor = buildState.monitor;
  const rec = getMonitorRecommendation(gpu);

  // Update recommendation card
  const badgeEl = document.getElementById('monitor-tier-badge');
  const titleEl = document.getElementById('monitor-rec-title');
  const descEl = document.getElementById('monitor-rec-desc');
  
  if (badgeEl) {
    badgeEl.textContent = rec.badge;
    badgeEl.className = `monitor-tier-badge ${rec.badgeClass}`;
  }
  if (titleEl) titleEl.textContent = rec.title;
  if (descEl) descEl.textContent = rec.desc;

  // Selected state vs Empty state
  const emptyState = document.getElementById('monitor-empty-state');
  const cardState = document.getElementById('monitor-selected-card');

  if (currentMonitor) {
    if (emptyState) emptyState.classList.add('hidden');
    if (cardState) {
      cardState.classList.remove('hidden');
      const nameEl = document.getElementById('monitor-selected-name');
      const priceEl = document.getElementById('monitor-selected-price');
      const specsEl = document.getElementById('monitor-selected-specs');

      if (nameEl) nameEl.textContent = currentMonitor.name;
      if (priceEl) priceEl.textContent = formatPrice(currentMonitor.price);
      if (specsEl) specsEl.innerHTML = formatSpecsAsSlackCode(currentMonitor.specs);
    }
  } else {
    if (emptyState) emptyState.classList.remove('hidden');
    if (cardState) cardState.classList.add('hidden');
  }

  // Quick Picks List
  const quickList = document.getElementById('monitor-quick-picks-list');
  if (quickList) {
    quickList.innerHTML = '';
    const pool = PARTS_DATABASE.monitor || [];
    const recommendedMonitors = rec.quickIds
      .map(id => pool.find(m => m.id === id))
      .filter(Boolean);

    recommendedMonitors.forEach(mon => {
      const isSelected = currentMonitor && currentMonitor.id === mon.id;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `monitor-quick-chip ${isSelected ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="quick-mon-name">${mon.name}</span>
        <span class="quick-mon-price">${formatPrice(mon.price)}</span>
      `;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pushHistory();
        buildState.monitor = mon;
        updateUI();
      });
      quickList.appendChild(btn);
    });
  }
}
"""

if 'function updateMonitorPanel' not in js:
    # Inject before updateBottleneckPanel
    pos = js.find('function updateBottleneckPanel')
    if pos != -1:
        js = js[:pos] + monitor_logic + "\n" + js[pos:]
        print("Injected monitor recommendation logic.")
    else:
        print("WARNING: Could not find updateBottleneckPanel to inject monitor logic.")
else:
    print("Monitor logic already present.")

# 5. In updateUI, call updateMonitorPanel()
if 'updateMonitorPanel();' not in js:
    js = js.replace('updateBottleneckPanel();', 'updateBottleneckPanel();\n  updateMonitorPanel();')
    print("Added updateMonitorPanel() call into updateUI().")

# 6. In init(), wire up monitor buttons
monitor_init_listeners = """
  // Monitor panel button listeners
  const btnSelectMon = document.getElementById('btn-select-monitor');
  if (btnSelectMon) {
    btnSelectMon.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer('monitor');
    });
  }

  const btnChangeMon = document.getElementById('btn-change-monitor');
  if (btnChangeMon) {
    btnChangeMon.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer('monitor');
    });
  }

  const btnRemoveMon = document.getElementById('btn-remove-monitor');
  if (btnRemoveMon) {
    btnRemoveMon.addEventListener('click', (e) => {
      e.stopPropagation();
      pushHistory();
      buildState.monitor = null;
      updateUI();
    });
  }

  const btnMonStore = document.getElementById('monitor-store-hub-btn');
  if (btnMonStore) {
    btnMonStore.addEventListener('click', (e) => {
      e.stopPropagation();
      if (buildState.monitor) {
        openRetailersModal(buildState.monitor);
      }
    });
  }
"""

if 'btnSelectMon' not in js:
    # Insert before window.addEventListener('DOMContentLoaded', init);
    pos = js.find("window.addEventListener('DOMContentLoaded', init);")
    if pos != -1:
        # Find end of init function
        init_end = js.rfind('}', 0, pos)
        js = js[:init_end] + monitor_init_listeners + "\n" + js[init_end:]
        print("Attached monitor button event listeners inside init().")
    else:
        print("WARNING: Could not find DOMContentLoaded to attach monitor listeners.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Saved js/app.js successfully.")
