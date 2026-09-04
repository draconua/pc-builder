with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Update import to include RETAILER_INFO
js = js.replace(
    "import { PARTS_DATABASE, PRESETS as _RAW_PRESETS, CATEGORIES } from './data.js?v=20260903_2';",
    "import { PARTS_DATABASE, PRESETS as _RAW_PRESETS, CATEGORIES, RETAILER_INFO } from './data.js?v=20260903_3';"
)

# 2. Add Slack Code Formatter & Retailers Modal logic & Draft storage
new_helpers = """
// Slack Code Formatter: Converts raw specs into styled monospace pills
function formatSpecsAsSlackCode(specsStr) {
  if (!specsStr) return '';
  const parts = specsStr.split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
  return parts.map(p => `<span class="slack-code-tag">${p}</span>`).join(' ');
}

// Auto-save & restore draft build in localStorage
const DRAFT_STORAGE_KEY = 'pc-builder-active-draft';

function saveDraftBuild() {
  try {
    const draft = {};
    for (const cat of CATEGORIES) {
      draft[cat] = buildState[cat] ? buildState[cat].id : null;
    }
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch (e) {}
}

function loadDraftBuild() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return false;
    const draft = JSON.parse(raw);
    let loadedAny = false;
    for (const cat of CATEGORIES) {
      if (draft[cat] && PARTS_DATABASE[cat]) {
        const found = PARTS_DATABASE[cat].find(p => p.id === draft[cat]);
        if (found) {
          buildState[cat] = found;
          loadedAny = true;
        }
      }
    }
    return loadedAny;
  } catch (e) {
    return false;
  }
}

// Multi-Retailer Store Aggregator Modal
function openRetailersModal(part) {
  if (!part) return;
  const modal = document.getElementById('retailers-modal');
  const titleEl = document.getElementById('retailer-modal-part-name');
  const gridEl = document.getElementById('retailer-grid');
  if (!modal || !gridEl) return;

  if (titleEl) titleEl.textContent = part.name;

  const stores = RETAILER_INFO || [];
  gridEl.innerHTML = stores.map(store => {
    const buyUrl = (part.buyLinks && part.buyLinks[store.id])
      ? part.buyLinks[store.id]
      : `https://www.google.com/search?q=${encodeURIComponent(part.name + ' kupić')}`;

    return `
      <a href="${buyUrl}" target="_blank" rel="noopener noreferrer" class="retailer-card">
        <div class="retailer-card-header">
          <span class="retailer-icon">${store.icon}</span>
          <span class="retailer-badge" style="background: ${store.color}18; color: ${store.color}; border: 1px solid ${store.color}44;">${store.badge}</span>
        </div>
        <div class="retailer-name">${store.name}</div>
        <span class="retailer-jump-btn">Смотреть цены ↗</span>
      </a>
    `;
  }).join('');

  modal.classList.add('active');
}

// Drawer Quick Brand / Platform Filters
let currentDrawerFilter = 'all';

function renderDrawerQuickFilters(category) {
  const container = document.getElementById('drawer-brand-chips');
  if (!container) return;
  container.innerHTML = '';

  const filterConfigs = {
    cpu: [
      { label: 'Все', key: 'all' },
      { label: 'AMD AM5', key: 'AM5' },
      { label: 'AMD AM4', key: 'AM4' },
      { label: 'Intel 1700', key: 'LGA1700' },
      { label: 'Intel 1851', key: 'LGA1851' }
    ],
    gpu: [
      { label: 'Все', key: 'all' },
      { label: 'NVIDIA RTX', key: 'NVIDIA' },
      { label: 'AMD Radeon', key: 'AMD' },
      { label: 'Intel Arc', key: 'Intel' },
      { label: '16GB+ VRAM', key: '16gb' }
    ],
    motherboard: [
      { label: 'Все', key: 'all' },
      { label: 'AM5', key: 'AM5' },
      { label: 'LGA1700', key: 'LGA1700' },
      { label: 'ATX', key: 'ATX' },
      { label: 'Micro-ATX', key: 'Micro-ATX' },
      { label: 'Mini-ITX', key: 'Mini-ITX' }
    ],
    ram: [
      { label: 'Все', key: 'all' },
      { label: 'DDR5', key: 'DDR5' },
      { label: 'DDR4', key: 'DDR4' },
      { label: '32GB', key: '32GB' },
      { label: '64GB', key: '64GB' }
    ],
    cooler: [
      { label: 'Все', key: 'all' },
      { label: 'Воздушные', key: 'air' },
      { label: 'СЖО (AIO)', key: 'aio' }
    ],
    psu: [
      { label: 'Все', key: 'all' },
      { label: '750W+', key: '750' },
      { label: '850W+', key: '850' },
      { label: '1000W+', key: '1000' },
      { label: 'SFX', key: 'SFX' }
    ],
    case: [
      { label: 'Все', key: 'all' },
      { label: 'ATX', key: 'ATX' },
      { label: 'Micro-ATX', key: 'Micro-ATX' },
      { label: 'Mini-ITX', key: 'Mini-ITX' }
    ]
  };

  const chips = filterConfigs[category] || [{ label: 'Все', key: 'all' }];

  chips.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `geek-brand-chip ${currentDrawerFilter === c.key ? 'active' : ''}`;
    btn.textContent = c.label;
    btn.addEventListener('click', () => {
      currentDrawerFilter = c.key;
      container.querySelectorAll('.geek-brand-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPartsList();
    });
    container.appendChild(btn);
  });
}
"""

# Insert helpers right before init
init_pos = js.find("function init()")
if init_pos != -1:
    js = js[:init_pos] + new_helpers + "\n" + js[init_pos:]

# 3. In openDrawer, call renderDrawerQuickFilters
open_drawer_pos = js.find("function openDrawer(category) {")
if open_drawer_pos != -1:
    old_od = "  elements.drawer.classList.add('active');\n  \n  renderPartsList();"
    new_od = "  elements.drawer.classList.add('active');\n  currentDrawerFilter = 'all';\n  renderDrawerQuickFilters(category);\n  renderPartsList();"
    js = js.replace(old_od, new_od)

# 4. In renderPartsList, support currentDrawerFilter
old_search_filter = """  // Filter text search
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.part.name.toLowerCase().includes(q) ||
      item.part.brand.toLowerCase().includes(q) ||
      item.part.specs.toLowerCase().includes(q)
    );
  }"""

new_search_filter = """  // Filter text search
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.part.name.toLowerCase().includes(q) ||
      item.part.brand.toLowerCase().includes(q) ||
      item.part.specs.toLowerCase().includes(q)
    );
  }

  // Filter Quick Brand / Platform Chips
  if (currentDrawerFilter && currentDrawerFilter !== 'all') {
    const f = currentDrawerFilter.toLowerCase();
    filtered = filtered.filter(item => {
      const p = item.part;
      if (f === '16gb') return (p.vram || 0) >= 16;
      if (f === '750') return (p.wattage || 0) >= 750;
      if (f === '850') return (p.wattage || 0) >= 850;
      if (f === '1000') return (p.wattage || 0) >= 1000;
      if (f === 'air') return p.type === 'air';
      if (f === 'aio') return p.type === 'aio';
      return (
        (p.socket && p.socket.toLowerCase() === f) ||
        (p.brand && p.brand.toLowerCase().includes(f)) ||
        (p.ramType && p.ramType.toLowerCase() === f) ||
        (p.formFactor && p.formFactor.toLowerCase() === f) ||
        (p.specs && p.specs.toLowerCase().includes(f))
      );
    });
  }"""

js = js.replace(old_search_filter, new_search_filter)

# 5. In renderPartsList, render specs with Slack Code tags and add Store button
old_card_html = """      <div class="part-card-header">
        <div>
          <span class="part-brand">${part.brand}</span>
          <h4 class="part-name">${part.name}</h4>
        </div>
        <span class="part-price">${formatPrice(part.price)}</span>
      </div>
      <p class="part-specs">${part.specs}</p>
      ${tierBarHtml}
      <div class="part-card-footer">
        ${isCompatible 
          ? `<span class="part-tag compatible">${t('drawer.tag.ok')}</span>` 
          : `<span class="part-tag incompatible" title="${errorMsg}">${t('drawer.tag.fail')}</span>`
        }
        <button class="select-part-btn">${isSelected ? t('slot.selected') : t('slot.select')}</button>
      </div>"""

new_card_html = """      <div class="part-card-header">
        <div>
          <span class="part-brand">${part.brand}</span>
          <h4 class="part-name">${part.name}</h4>
        </div>
        <span class="part-price">${formatPrice(part.price)}</span>
      </div>
      <div class="part-specs-pills">${formatSpecsAsSlackCode(part.specs)}</div>
      ${tierBarHtml}
      <div class="part-card-footer">
        <div class="footer-left-tags">
          ${isCompatible 
            ? `<span class="part-tag compatible">${t('drawer.tag.ok')}</span>` 
            : `<span class="part-tag incompatible" title="${errorMsg}">${t('drawer.tag.fail')}</span>`
          }
          <button type="button" class="part-store-btn" data-part-id="${part.id}" title="Сравнить цены в 8 магазинах">🏪 Цены ↗</button>
        </div>
        <button class="select-part-btn">${isSelected ? t('slot.selected') : t('slot.select')}</button>
      </div>"""

js = js.replace(old_card_html, new_card_html)

# Add event listener for part-store-btn in renderPartsList
old_card_event = """    card.addEventListener('click', () => {
      selectPart(activeCategory, part);
    });"""

new_card_event = """    const storeBtn = card.querySelector('.part-store-btn');
    if (storeBtn) {
      storeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRetailersModal(part);
      });
    }

    card.addEventListener('click', () => {
      selectPart(activeCategory, part);
    });"""

js = js.replace(old_card_event, new_card_event)

# 6. In updateUI, format specs with Slack Code and openRetailersModal on buyLink
old_slot_update = """      selectedDiv.querySelector('.slot-selected-name').textContent = part.name;
      selectedDiv.querySelector('.slot-selected-specs').textContent = part.specs;
      priceEl.textContent = formatPrice(part.price);

      // Buy links logic
      if (buyLink && part.buyLinks) {
        buyLink.classList.remove('hidden');
        if (currentCurrency === 'PLN') {
          buyLink.href = part.buyLinks.xkom || part.buyLinks.morele || part.buyLinks.amazon;
        } else {
          buyLink.href = part.buyLinks.amazon;
        }
      }"""

new_slot_update = """      selectedDiv.querySelector('.slot-selected-name').textContent = part.name;
      selectedDiv.querySelector('.slot-selected-specs').innerHTML = formatSpecsAsSlackCode(part.specs);
      priceEl.textContent = formatPrice(part.price);

      // Multi-Store Buy Popover trigger
      if (buyLink) {
        buyLink.classList.remove('hidden');
        buyLink.title = "Где купить: E-Katalog, Morele, x-kom, Rozetka, MediaExpert...";
        buyLink.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openRetailersModal(part);
        };
      }"""

js = js.replace(old_slot_update, new_slot_update)

# 7. Add saveDraftBuild() inside selectPart, clearBuild, removePart, applyPreset
js = js.replace("buildState[category] = part;\n  closeDrawer();\n  updateUI();", "buildState[category] = part;\n  saveDraftBuild();\n  closeDrawer();\n  updateUI();")
js = js.replace("function clearBuild() {", "function clearBuild() {\n  localStorage.removeItem(DRAFT_STORAGE_KEY);")

# In init(), load draft if no URL code is present
old_init_load = "  loadBuildFromUrl();\n  updateUI();"
new_init_load = """  const hasUrlBuild = window.location.search.includes('b=');
  if (hasUrlBuild) {
    loadBuildFromUrl();
  } else {
    loadDraftBuild();
  }
  updateUI();"""
js = js.replace(old_init_load, new_init_load)

# 8. Setup close button for retailers modal in setupEventListeners
retailers_listener = """  // Close Retailers Modal
  const retClose = document.getElementById('retailers-modal-close');
  const retModal = document.getElementById('retailers-modal');
  if (retClose && retModal) {
    retClose.addEventListener('click', () => retModal.classList.remove('active'));
    retModal.addEventListener('click', (e) => {
      if (e.target === retModal) retModal.classList.remove('active');
    });
  }

  // Geek Sort Chips in Drawer
  document.querySelectorAll('.geek-sort-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.geek-sort-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortOrder = btn.dataset.sort;
      renderPartsList();
    });
  });

  // Geek Compat Toggle in Drawer
  const btnToggleCompat = document.getElementById('btn-toggle-compat');
  const compatLabel = document.getElementById('compat-toggle-label');
  if (btnToggleCompat) {
    btnToggleCompat.addEventListener('click', () => {
      hideIncompatible = !hideIncompatible;
      btnToggleCompat.classList.toggle('active', hideIncompatible);
      if (compatLabel) {
        compatLabel.textContent = hideIncompatible ? 'Совместимые: ВКЛ' : 'Все детали: ВКЛ';
      }
      renderPartsList();
    });
  }

  // Keyboard shortcut Ctrl+K to search
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (!elements.drawer.classList.contains('active')) {
        openDrawer(activeCategory || 'cpu');
      }
      const searchInput = document.getElementById('parts-search');
      if (searchInput) searchInput.focus();
    }
  });
"""

js = js.replace("// Translations logic", retailers_listener + "\n// Translations logic")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Injected Slack Code formatting, Multi-Retailer modal, Geek Drawer chips and Draft saving!")
