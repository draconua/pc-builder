// =============================================================
// app.js — Main Application Controller
// =============================================================

import { PARTS_DATABASE, PRESETS as _RAW_PRESETS, CATEGORIES, COUNTRIES, RETAILERS_BY_COUNTRY } from './data.js?v=20260903_v6';
import { checkCompatibility } from './compatibility.js?v=20260903_v6';
import { t, setLanguage, getCurrentLanguage, initI18n } from './i18n.js?v=20260904_v15';
import { saveBuild, loadBuilds, deleteBuild } from './storage.js?v=20260903_v6';
import { estimateAllFPS, estimateFPS, analyzeBottleneck } from './performance.js?v=20260903_v6';
import { buildFromCurated, CURATED_BASELINES } from './autobuild.js?v=20260903_v7';

// Normalize PRESETS: support both Array [{id, name, parts}, ...] and Object {key: {name, parts}, ...}
const PRESETS = (() => {
  if (Array.isArray(_RAW_PRESETS)) {
    const out = {};
    _RAW_PRESETS.forEach(p => { out[p.id || p.name] = p; });
    return out;
  }
  return _RAW_PRESETS || {};
})();

// Normalize all parts in PARTS_DATABASE: ensure ram.ramType exists (may be ram.type in newer schemas)
Object.values(PARTS_DATABASE).forEach(category => {
  category.forEach(part => {
    if (part.type && !part.ramType) part.ramType = part.type;
    if (part.formFactor === undefined && part.form_factor) part.formFactor = part.form_factor;
  });
});


// History State for Undo
const historyStack = [];
let isUndoAction = false;

function pushHistory() {
  if (isUndoAction) {
    isUndoAction = false;
    return;
  }
  const snapshot = {
    cpu: buildState.cpu?.id,
    motherboard: buildState.motherboard?.id,
    cooler: buildState.cooler?.id,
    ram: buildState.ram?.id,
    gpu: buildState.gpu?.id,
    ssd: buildState.ssd?.id,
    hdd: buildState.hdd?.id,
    psu: buildState.psu?.id,
    case: buildState.case?.id,
    monitor: buildState.monitor?.id
  };
  historyStack.push(snapshot);
  if (historyStack.length > 20) historyStack.shift();
}

function undo() {
  if (historyStack.length < 2) return;
  historyStack.pop(); // remove current state
  const prevState = historyStack[historyStack.length - 1];
  isUndoAction = true;
  
  // Load previous state
  Object.keys(buildState).forEach(cat => {
    buildState[cat] = null;
    if (prevState[cat]) {
      const part = PARTS_DATABASE[cat].find(p => p.id === prevState[cat]);
      if (part) buildState[cat] = part;
    }
  });
  updateUI();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
}

// Application State
let buildState = {
  cpu: null,
  motherboard: null,
  cooler: null,
  ram: null,
  gpu: null,
  ssd: null,
  hdd: null,
  psu: null,
  case: null,
  monitor: null
};

let activeCategory = null;
let hideIncompatible = true;
let searchQuery = '';
let sortOrder = 'default';
let currentCurrency = 'PLN';
let selectedTargetRes = '1440p';

const EXCHANGE_RATES = { USD: 1, PLN: 4.05 };

// DOM Element cache
const elements = {
  themeToggle: document.getElementById('theme-toggle'),
  progressCircle: document.getElementById('progress-ring-circle'),
  progressText: document.getElementById('progress-text'),
  btnClear: document.getElementById('btn-clear'),
  btnSave: document.getElementById('btn-save'),
  btnCompare: document.getElementById('btn-compare'),
  btnTimelapse: document.getElementById('btn-timelapse'),
  btnExport: document.getElementById('btn-export'),
  btnShare: document.getElementById('btn-share'),
  totalPrice: document.getElementById('total-price'),
  powerValue: document.getElementById('power-value'),
  powerBar: document.getElementById('power-bar'),
  powerLimitText: document.getElementById('power-limit-text'),
  chassisStatus: document.getElementById('chassis-status'),
  fpsResolution: document.getElementById('fps-resolution'),
  fpsPlaceholder: document.getElementById('fps-placeholder'),
  fpsGrid: document.getElementById('fps-grid'),
  bottleneckPlaceholder: document.getElementById('bottleneck-placeholder'),
  bottleneckResult: document.getElementById('bottleneck-result'),
  bottleneckBar: document.getElementById('bottleneck-bar'),
  bottleneckText: document.getElementById('bottleneck-text'),
  compatibilityList: document.getElementById('compatibility-list'),
  savedBuildsList: document.getElementById('saved-builds-list'),
  
  // Drawer
  drawerOverlay: document.getElementById('drawer-overlay'),
  drawer: document.getElementById('drawer'),
  drawerTitle: document.getElementById('drawer-title'),
  drawerClose: document.getElementById('drawer-close'),
  partsSearch: document.getElementById('parts-search'),
  toggleCompat: document.getElementById('toggle-compat') || document.getElementById('filter-compat'),
  sortSelect: document.getElementById('sort-select'),
  partsList: document.getElementById('parts-list'),

  // Modals
  exportModal: document.getElementById('export-modal'),
  exportCloseBtn: document.getElementById('export-modal-close') || document.getElementById('modal-close-btn'),
  exportTextarea: document.getElementById('export-text') || document.getElementById('export-textarea'),
  btnCopySpec: document.getElementById('export-modal-copy') || document.getElementById('btn-copy-spec'),
  btnPrint: document.getElementById('btn-print'),

  saveModal: document.getElementById('save-modal'),
  saveCloseBtn: document.getElementById('save-modal-close') || document.getElementById('save-close-btn'),
  saveNameInput: document.getElementById('save-build-name') || document.getElementById('save-name-input'),
  saveConfirmBtn: document.getElementById('save-modal-confirm') || document.getElementById('save-confirm-btn'),

  comparisonModal: document.getElementById('comparison-modal'),
  comparisonClose: document.getElementById('comparison-modal-close') || document.getElementById('comparison-close'),
  comparisonContent: document.getElementById('comparison-content')
};


  // Smooth Floating Popover for Auto-Builder (No intrusive modal)
  const btnAutoBuilder = document.getElementById('btn-auto-builder');
  const autobuildPopover = document.getElementById('autobuild-popover');
  const popoverCloseBtn = document.getElementById('autobuild-popover-close');
  const budgetRange = document.getElementById('auto-budget-range');
  const budgetDisplay = document.getElementById('budget-display-val');
  const autoBuildConfirmBtn = document.getElementById('auto-build-confirm-btn');
  const quickBudgetBtns = document.querySelectorAll('.quick-budget-btn');
  const resChips = document.querySelectorAll('.res-chip');

  const autobuildBackdrop = document.getElementById('autobuild-backdrop');

  function openAutobuildPopover() {
    if (autobuildPopover) autobuildPopover.classList.remove('hidden');
    if (autobuildBackdrop) autobuildBackdrop.classList.remove('hidden');
  }

  function closeAutobuildPopover() {
    if (autobuildPopover) autobuildPopover.classList.add('hidden');
    if (autobuildBackdrop) autobuildBackdrop.classList.add('hidden');
  }

  if (btnAutoBuilder && autobuildPopover) {
    btnAutoBuilder.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autobuildPopover.classList.contains('hidden')) {
        openAutobuildPopover();
      } else {
        closeAutobuildPopover();
      }
    });

    if (popoverCloseBtn) {
      popoverCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAutobuildPopover();
      });
    }

    if (autobuildBackdrop) {
      autobuildBackdrop.addEventListener('click', () => {
        closeAutobuildPopover();
      });
    }


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

        // CPU & GPU Brand Chips
    let selectedCpuBrand = 'all';
    let selectedGpuBrand = 'all';
    // selectedTargetRes is global

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
        closeAutobuildPopover();
      });
    }


    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!autobuildPopover.contains(e.target) && !btnAutoBuilder.contains(e.target)) {
        closeAutobuildPopover();
      }
    });
  }

  async function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {
    const ratePLN = EXCHANGE_RATES['PLN'] || 4.05;
    const budgetPLN = Math.round(budgetUSD * ratePLN);

    // Show temporary thinking toast while AI reasons
    const thinkingToast = showToast({
      title: '✨ Gemini AI подбирает ПК...',
      message: 'Анализируем 200+ деталей и балансируем связку под ваш бюджет...',
      type: 'info',
      duration: 12000
    });

    try {
      // 1. Try Gemini AI Backend
      const response = await fetch('/api/ai-autobuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetPLN, targetRes, cpuBrand, gpuBrand })
      });

      const res = await response.json();

      if (res.ok && res.data && res.data.cpu) {
        // Hydrate parts from PARTS_DATABASE
        const aiParts = res.data;
        const findP = (cat, id) => (PARTS_DATABASE[cat] || []).find(p => p.id === id);

        const newBuild = {
          cpu: findP('cpu', aiParts.cpu),
          gpu: findP('gpu', aiParts.gpu),
          motherboard: findP('motherboard', aiParts.motherboard),
          ram: findP('ram', aiParts.ram),
          cooler: findP('cooler', aiParts.cooler),
          psu: findP('psu', aiParts.psu),
          case: findP('case', aiParts.case),
          ssd: findP('ssd', aiParts.ssd),
          hdd: null,
          monitor: null
        };

        // If AI picked valid core parts, apply it!
        if (newBuild.cpu && newBuild.gpu) {
          buildState = newBuild;
          updateUI();

          showToast({
            title: `🧠 Gemini AI: ${escapeHtml(aiParts.verdictTitle || 'Оптимальная связка')}`,
            htmlMessage: `<span style="color: #60a5fa; font-size: 0.8rem;">⚡ Собрано нейросетью под ${budgetPLN} zł:</span><br>${escapeHtml(aiParts.reasoning || '')}`,
            type: 'success',
            duration: 8000
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Gemini AI Auto-Build failed, switching to Curated Fallback:', e);
    }

    // 2. Fallback to Curated Baseline Archetypes
    const result = buildFromCurated(budgetPLN, PARTS_DATABASE, {
      cpuBrand,
      gpuBrand,
      targetRes
    });

    buildState = result.build;
    updateUI();

    const upgradesText = result.upgrades && result.upgrades.length > 0 
      ? `<br><span style="font-size: 0.75rem; color: #10b981;">Улучшения на остаток: ${result.upgrades.join('; ')}</span>`
      : '';

    showToast({
      title: `✨ База: ${result.tier.title}`,
      htmlMessage: `${escapeHtml(result.tier.description)}${upgradesText}`,
      type: 'success',
      duration: 6500
    });
}

// Initialize Application

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
  const priceEl = document.getElementById('retailer-modal-price');
  const specsEl = document.getElementById('retailer-modal-specs');
  const countryTabsEl = document.getElementById('retailer-country-tabs');
  const gridEl = document.getElementById('retailer-grid');
  const deckTitleEl = document.querySelector('.deck-frame-title');
  if (!modal || !gridEl) return;

  if (titleEl) titleEl.textContent = part.name;
  if (priceEl) priceEl.textContent = formatPrice(part.price);
  if (specsEl) specsEl.innerHTML = formatSpecsAsSlackCode(part.specs);

  const countries = COUNTRIES || [];
  if (!RETAILERS_BY_COUNTRY[currentStoreCountry]) {
    currentStoreCountry = 'pl';
  }

  function renderCountryStores(countryId) {
    currentStoreCountry = countryId;
    try {
      localStorage.setItem('pc-builder-store-country', countryId);
    } catch (e) {}

    // Update active tab styles
    if (countryTabsEl) {
      countryTabsEl.querySelectorAll('.retailer-country-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.country === countryId);
      });
    }

    const currentCountryObj = countries.find(c => c.id === countryId) || { name: 'МАГАЗИНЫ' };
    if (deckTitleEl) {
      deckTitleEl.textContent = `[ КАТАЛОГ МАГАЗИНОВ: ${currentCountryObj.name.toUpperCase()} ]`;
    }

    const stores = RETAILERS_BY_COUNTRY[countryId] || [];
    const jumpText = t('store.jump') || 'Смотреть цены ↗';

    gridEl.innerHTML = stores.map(store => {
      const buyUrl = store.url ? store.url(part.name) : `https://www.google.com/search?q=${encodeURIComponent(part.name + ' buy')}`;

      return `
        <a href="${buyUrl}" target="_blank" rel="noopener noreferrer" class="retailer-card">
          <div class="retailer-left">
            <div class="retailer-brand-row">
              <span class="retailer-icon">${store.icon}</span>
              <span class="retailer-name">${store.name}</span>
            </div>
            <span class="retailer-desc">${store.desc || ''}</span>
          </div>
          <div class="retailer-right">
            <span class="retailer-badge" style="background: ${store.color}18; color: ${store.color}; border: 1px solid ${store.color}44;">${store.tag || 'Магазин'}</span>
            <span class="retailer-btn-action">${jumpText}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  // Render Country Tabs
  if (countryTabsEl) {
    countryTabsEl.innerHTML = countries.map(c => `
      <button type="button" class="retailer-country-chip ${c.id === currentStoreCountry ? 'active' : ''}" data-country="${c.id}">
        <span class="country-flag">${c.flag}</span>
        <span>${c.name}</span>
      </button>
    `).join('');

    countryTabsEl.querySelectorAll('.retailer-country-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        renderCountryStores(btn.dataset.country);
      });
    });
  }

  renderCountryStores(currentStoreCountry);
  modal.classList.add('active');
}

// Drawer Quick Brand / Platform Filters
let currentDrawerFilter = 'all';
let currentStoreCountry = localStorage.getItem('pc-builder-store-country') || 'pl';

function renderDrawerQuickFilters(category) {
  const container = document.getElementById('drawer-brand-chips');
  if (!container) return;
  container.innerHTML = '';

  const filterConfigs = {
    cpu: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: 'AMD AM5', key: 'AM5' },
      { label: 'AMD AM4', key: 'AM4' },
      { label: 'Intel 1700', key: 'LGA1700' },
      { label: 'Intel 1851', key: 'LGA1851' }
    ],
    gpu: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: 'NVIDIA RTX', key: 'NVIDIA' },
      { label: 'AMD Radeon', key: 'AMD' },
      { label: 'Intel Arc', key: 'Intel' },
      { label: '16GB+ VRAM', key: '16gb' }
    ],
    motherboard: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: 'AM5', key: 'AM5' },
      { label: 'LGA1700', key: 'LGA1700' },
      { label: 'ATX', key: 'ATX' },
      { label: 'Micro-ATX', key: 'Micro-ATX' },
      { label: 'Mini-ITX', key: 'Mini-ITX' }
    ],
    ram: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: 'DDR5', key: 'DDR5' },
      { label: 'DDR4', key: 'DDR4' },
      { label: '32GB', key: '32GB' },
      { label: '64GB', key: '64GB' }
    ],
    cooler: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: 'Воздушные', key: 'air' },
      { label: 'СЖО (AIO)', key: 'aio' }
    ],
    psu: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: '750W+', key: '750' },
      { label: '850W+', key: '850' },
      { label: '1000W+', key: '1000' },
      { label: 'SFX', key: 'SFX' }
    ],
    case: [
      { label: t('drawer.filter.all') || 'Все', key: 'all' },
      { label: 'ATX', key: 'ATX' },
      { label: 'Micro-ATX', key: 'Micro-ATX' },
      { label: 'Mini-ITX', key: 'Mini-ITX' }
    ]
  };

  const chips = filterConfigs[category] || [{ label: t('drawer.filter.all') || 'Все', key: 'all' }];

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

function init() {
  initI18n();
  initTheme();
  initCurrency();
  setupEventListeners();
  initDevCabinet();
  initProChat();
  initAiSynergyCheck();
  initHardwareGuide();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
  const hasUrlBuild = window.location.search.includes('b=');
  if (hasUrlBuild) {
    loadBuildFromUrl();
  } else {
    loadDraftBuild();
  }
  updateUI();
  updateTranslations();
  renderSavedBuildsList();
}

// Initialize Theme
function initTheme() {
  const savedTheme = localStorage.getItem('pc-builder-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  elements.themeToggle.textContent = savedTheme === 'dark' ? '☾' : '☀';
}

// Initialize Currency
function initCurrency() {
  currentCurrency = localStorage.getItem('pc-builder-currency') || 'PLN';
}

// Toggle Theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('pc-builder-theme', newTheme);
  elements.themeToggle.textContent = newTheme === 'dark' ? '☾' : '☀';
}

// Setup Event Listeners
function setupEventListeners() {
  // Scroll to top button in footer
  const btnScrollTop = document.getElementById('btn-scroll-top');
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile Interactive Schematic Toggle Logic
  const btnToggleSchematic = document.getElementById('btn-toggle-mobile-schematic');
  const centerSchematic = document.querySelector('.center-schematic');
  const centerBottleneck = document.getElementById('bottleneck-panel');
  const schematicToggleText = document.getElementById('schematic-toggle-text');
  const schematicToggleArrow = document.getElementById('schematic-toggle-arrow');

  function toggleMobileSchematic(forceState) {
    if (!centerSchematic) return;
    const isCurrentlyOpen = centerSchematic.classList.contains('is-mobile-open');
    const shouldOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;
    centerSchematic.classList.toggle('is-mobile-open', shouldOpen);
    if (centerBottleneck) {
      centerBottleneck.classList.toggle('is-mobile-open', shouldOpen);
    }
    if (btnToggleSchematic) {
      btnToggleSchematic.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      btnToggleSchematic.classList.toggle('active', shouldOpen);
    }
    if (schematicToggleText) {
      schematicToggleText.textContent = shouldOpen ? t('schematic.mobile_hide') : t('schematic.mobile_show');
    }
    if (schematicToggleArrow) {
      schematicToggleArrow.textContent = shouldOpen ? '▴' : '▾';
    }
  }

  if (btnToggleSchematic) {
    btnToggleSchematic.addEventListener('click', () => {
      toggleMobileSchematic();
    });
  }

  const btnMobileViewSchematic = document.getElementById('btn-mobile-view-schematic');
  if (btnMobileViewSchematic) {
    btnMobileViewSchematic.addEventListener('click', () => {
      toggleMobileSchematic(true);
      const target = document.querySelector('.mobile-schematic-toggle-wrap') || centerSchematic;
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Mobile Bottom-Sheet Touch Drag-Down to close
  const drawerDragHandle = document.querySelector('.drawer-drag-handle');
  if (drawerDragHandle) {
    let startY = 0;
    let currentY = 0;
    drawerDragHandle.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      currentY = startY;
    }, { passive: true });

    drawerDragHandle.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
    }, { passive: true });

    drawerDragHandle.addEventListener('touchend', () => {
      if (currentY - startY > 40) {
        closeDrawer();
      }
    });
  }

  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);

  // Language selectors
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setLanguage(btn.dataset.lang);
      updateTranslations();
      updateUI();
      if (activeCategory) renderPartsList();
        if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
    });
  });

  // Currency selectors
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency;
      localStorage.setItem('pc-builder-currency', currentCurrency);
      updateUI();
      if (activeCategory) renderPartsList();
        if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
    });
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      loadPreset(btn.dataset.preset);
    });
  });

  // Toolbar Actions
  elements.btnClear.addEventListener('click', clearBuild);
  elements.btnSave.addEventListener('click', () => openModal(elements.saveModal));
  elements.btnCompare.addEventListener('click', openComparisonModal);
  elements.btnTimelapse.addEventListener('click', runTimelapseAnimation);
  elements.btnExport.addEventListener('click', openExportModal);
  elements.btnShare.addEventListener('click', shareBuild);

  // Checklist slot buttons (ONLY .select-btn opens drawer, not whole card)
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
  });

  // =============================================================
  // INTERACTIVE 2D SCHEMATIC: BIDIRECTIONAL HIGHLIGHTS & TOOLBAR
  // =============================================================
  const SCHEMATIC_CATEGORY_COLORS = {
    cpu: '#3b82f6',
    motherboard: '#6366f1',
    cooler: '#06b6d4',
    ram: '#8b5cf6',
    gpu: '#10b981',
    ssd: '#f59e0b',
    hdd: '#d97706',
    psu: '#f97316',
    case: '#64748b'
  };

  const SCHEMATIC_CATEGORY_ICONS = {
    cpu: '⚙️',
    motherboard: '🎛️',
    cooler: '❄️',
    ram: '⚡',
    gpu: '🎮',
    ssd: '💾',
    hdd: '💿',
    psu: '🔌',
    case: '🖥️'
  };

  function showSchematicHud(category) {
    const hud = document.getElementById('schematic-hud');
    if (!hud) return;

    const iconEl = document.getElementById('hud-cat-icon');
    const nameEl = document.getElementById('hud-cat-name');
    const statusBadge = document.getElementById('hud-status-badge');
    const titleEl = document.getElementById('hud-title');
    const specsEl = document.getElementById('hud-specs');
    const priceEl = document.getElementById('hud-price');
    const hintEl = document.getElementById('hud-hint');

    hud.dataset.category = category;
    const catName = t(`cat.${category}`) || category.toUpperCase();
    const color = SCHEMATIC_CATEGORY_COLORS[category] || '#3b82f6';
    const icon = SCHEMATIC_CATEGORY_ICONS[category] || '⚡';

    if (iconEl) iconEl.textContent = icon;
    if (nameEl) {
      nameEl.textContent = catName;
      nameEl.style.color = color;
    }

    const item = buildState[category];
    if (item) {
      if (statusBadge) {
        statusBadge.textContent = t('schematic.installed') || 'Установлено';
        statusBadge.className = 'hud-status-badge installed';
      }
      if (titleEl) titleEl.textContent = item.name;
      if (specsEl) {
        const specsArr = [
          item.socket ? `Сокет: ${item.socket}` : null,
          item.chipset ? `Чипсет: ${item.chipset}` : null,
          item.vram ? `VRAM: ${item.vram}` : null,
          item.capacity ? `Объем: ${item.capacity}` : null,
          item.wattage ? `Мощность: ${item.wattage}W` : null,
          item.tdp ? `TDP: ${item.tdp}W` : null,
          item.type ? `Тип: ${item.type}` : null,
          item.formFactor ? `Форм-фактор: ${item.formFactor}` : null
        ].filter(Boolean);
        specsEl.textContent = specsArr.slice(0, 3).join(' • ') || (item.brand || '');
      }
      if (priceEl) priceEl.textContent = formatPrice(item.price);
      if (hintEl) hintEl.textContent = 'Кликните, чтобы заменить ↗';
    } else {
      if (statusBadge) {
        statusBadge.textContent = 'Слот свободен';
        statusBadge.className = 'hud-status-badge';
      }
      if (titleEl) titleEl.textContent = `Слот: ${catName}`;
      if (specsEl) specsEl.textContent = t('schematic.emptySlot') || 'Слот свободен — нажмите для выбора';
      if (priceEl) priceEl.textContent = '';
      if (hintEl) hintEl.textContent = 'Выбрать в каталоге ↗';
    }

    hud.classList.add('visible');
  }

  function hideSchematicHud() {
    const hud = document.getElementById('schematic-hud');
    if (hud) hud.classList.remove('visible');
  }

  // 1. Slot Card Hover -> Highlight in Schematic & Ghost Slots
  document.querySelectorAll('.slot-card').forEach(card => {
    const category = card.dataset.category;
    if (!category) return;

    card.addEventListener('mouseenter', () => {
      const color = SCHEMATIC_CATEGORY_COLORS[category] || '#38bdf8';
      const comp = document.getElementById(`vis-${category}`);
      const ghost = document.getElementById(`ghost-${category}`);
      const caseBadge = document.getElementById('vis-case-badge-group');

      if (comp && !comp.classList.contains('hidden')) {
        comp.classList.add('highlight-from-card');
        comp.style.setProperty('--comp-highlight-color', color);
      } else if (ghost) {
        ghost.classList.add('active');
      }

      if (category === 'case' && caseBadge) {
        caseBadge.classList.add('highlight-from-card');
        caseBadge.style.setProperty('--comp-highlight-color', color);
      }

      showSchematicHud(category);
    });

    card.addEventListener('mouseleave', () => {
      const comp = document.getElementById(`vis-${category}`);
      const ghost = document.getElementById(`ghost-${category}`);
      const caseBadge = document.getElementById('vis-case-badge-group');
      if (comp) {
        comp.classList.remove('highlight-from-card');
      }
      if (ghost) {
        ghost.classList.remove('active');
      }
      if (caseBadge) {
        caseBadge.classList.remove('highlight-from-card');
      }
      hideSchematicHud();
    });
  });

  // 2. Schematic SVG Component & Ghost Slot Hover -> Highlight Slot Card (Delegated & Direct)
  const pcSvg = document.getElementById('pc-svg');
  let currentHoveredCategory = null;
  let hudHideTimer = null;

  function scheduleHideHud() {
    if (hudHideTimer) clearTimeout(hudHideTimer);
    hudHideTimer = setTimeout(() => {
      if (currentHoveredCategory) {
        unhighlightSlotCard(currentHoveredCategory);
        currentHoveredCategory = null;
      }
      hideSchematicHud();
    }, 140);
  }

  function cancelHideHud() {
    if (hudHideTimer) {
      clearTimeout(hudHideTimer);
      hudHideTimer = null;
    }
  }

  function highlightSlotCard(category) {
    if (!category) return;
    cancelHideHud();
    const card = document.querySelector(`.slot-card[data-category="${category}"]`);
    const color = SCHEMATIC_CATEGORY_COLORS[category] || '#3b82f6';
    if (card) {
      card.classList.add('highlight-from-schematic');
      card.style.setProperty('--card-highlight-color', color);
    }
    showSchematicHud(category);
  }

  function unhighlightSlotCard(category) {
    if (!category) return;
    const card = document.querySelector(`.slot-card[data-category="${category}"]`);
    if (card) {
      card.classList.remove('highlight-from-schematic');
    }
  }

  if (pcSvg) {
    pcSvg.addEventListener('mouseenter', () => {
      cancelHideHud();
    });

    pcSvg.addEventListener('mouseover', (e) => {
      const target = e.target.closest('.vis-component, .vis-ghost-target');
      if (!target) return;
      const category = target.dataset.category;
      if (!category) return;

      cancelHideHud();
      if (category !== currentHoveredCategory) {
        if (currentHoveredCategory) {
          unhighlightSlotCard(currentHoveredCategory);
        }
        currentHoveredCategory = category;
        highlightSlotCard(category);
      }
    });

    pcSvg.addEventListener('mouseout', (e) => {
      const related = e.relatedTarget ? (e.relatedTarget.closest ? e.relatedTarget.closest('.vis-component, .vis-ghost-target, #schematic-hud') : null) : null;
      const relatedCategory = related ? related.dataset.category : null;

      if (relatedCategory === currentHoveredCategory) {
        return; // Still inside the same component
      }

      scheduleHideHud();
    });

    pcSvg.addEventListener('click', (e) => {
      const target = e.target.closest('.vis-component, .vis-ghost-target');
      if (target && target.dataset.category) {
        e.stopPropagation();
        openDrawer(target.dataset.category);
      }
    });

    pcSvg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('.vis-component, .vis-ghost-target');
        if (target && target.dataset.category) {
          e.preventDefault();
          openDrawer(target.dataset.category);
        }
      }
    });
  }

  // Also bind direct listeners for accessibility and synthetic dispatch
  const allVisTargets = document.querySelectorAll('#pc-svg .vis-component, #pc-svg .vis-ghost-target, #vis-case-badge-group');
  allVisTargets.forEach(target => {
    const category = target.dataset.category;
    if (!category) return;

    target.addEventListener('mouseenter', () => {
      cancelHideHud();
      highlightSlotCard(category);
    });

    target.addEventListener('mouseleave', () => {
      scheduleHideHud();
    });

    target.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer(category);
    });

    target.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDrawer(category);
      }
    });
  });

  // 3. Schematic Toolbar Actions
  const airflowBtn = document.getElementById('tool-schematic-airflow');
  const airflowLayer = document.getElementById('vis-airflow-layer');
  if (airflowBtn && airflowLayer) {
    airflowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = airflowLayer.classList.toggle('hidden');
      airflowBtn.classList.toggle('active', !isHidden);
      showToast(
        !isHidden ? '💨 Симуляция воздушных потоков включена' : '💨 Симуляция воздушных потоков выключена',
        'info'
      );
    });
  }

  const xrayBtn = document.getElementById('tool-schematic-xray');
  const schematicPanel = document.querySelector('.center-schematic');
  if (xrayBtn && schematicPanel) {
    xrayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = schematicPanel.classList.toggle('xray-mode');
      xrayBtn.classList.toggle('active', isActive);
      updateSvgVisualizer();
      showToast(
        isActive ? '⚡ Режим слотов (X-Ray): подсветка всех посадочных мест' : '⚡ Режим X-Ray выключен',
        'info'
      );
    });
  }

  const rgbBtn = document.getElementById('tool-schematic-rgb');
  if (rgbBtn && schematicPanel) {
    rgbBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isRgb = schematicPanel.classList.toggle('rgb-active');
      rgbBtn.classList.toggle('active', isRgb);
      showToast(
        isRgb ? '🌈 Анимированная RGB-подсветка активирована' : '🌈 RGB-подсветка выключена',
        'info'
      );
    });
  }

  const clearanceBtn = document.getElementById('tool-schematic-clearance');
  const clearanceLayer = document.getElementById('vis-clearance-layer');
  const clearanceBar = document.getElementById('schematic-clearance-bar');
  if (clearanceBtn && clearanceLayer) {
    clearanceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = clearanceLayer.classList.toggle('hidden');
      if (clearanceBar) clearanceBar.classList.toggle('hidden', isHidden);
      clearanceBtn.classList.toggle('active', !isHidden);
      if (!isHidden) updateClearanceOverlay();
      showToast(
        !isHidden ? '📏 Режим проверки габаритов и клиренса включен' : '📏 Режим клиренса выключен',
        'info'
      );
    });
  }

  const scaleBtn = document.getElementById('tool-schematic-scale');
  if (scaleBtn && schematicPanel) {
    scaleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = schematicPanel.classList.toggle('is-expanded');
      scaleBtn.classList.toggle('active', isExpanded);
      showToast(
        isExpanded ? '🔍 Масштаб схемы увеличен' : '🔍 Стандартный масштаб схемы',
        'info'
      );
    });
  }

  // 4. Floating HUD Inspector Click & Hover Handlers
  const hudElement = document.getElementById('schematic-hud');
  if (hudElement) {
    hudElement.addEventListener('click', (e) => {
      const cat = hudElement.dataset.category;
      if (cat) {
        e.stopPropagation();
        openDrawer(cat);
      }
    });
    hudElement.addEventListener('mouseenter', () => {
      cancelHideHud();
    });
    hudElement.addEventListener('mouseleave', () => {
      scheduleHideHud();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
      undo();
    }
    if (e.key === 'Escape') {
      // 1. Hardware Guide Modal
      const guideModal = document.getElementById('hardware-guide-modal');
      const guideOverlay = document.getElementById('hardware-guide-overlay');
      if (guideModal && !guideModal.classList.contains('hidden')) {
        guideModal.classList.add('hidden');
        guideModal.classList.remove('active');
        if (guideOverlay) {
          guideOverlay.classList.add('hidden');
          guideOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
        return;
      }

      // 2. Dev Cabinet Modal
      const devModal = document.getElementById('dev-prices-modal');
      if (devModal && devModal.classList.contains('active')) {
        devModal.classList.add('hidden');
        devModal.classList.remove('active');
        if (typeof devPollInterval !== 'undefined' && devPollInterval) {
          clearInterval(devPollInterval);
          devPollInterval = null;
        }
        return;
      }

      // 3. PRO AI Chat Drawer
      const proDrawer = document.getElementById('pro-chat-drawer');
      const proOverlay = document.getElementById('pro-chat-overlay');
      if (proDrawer && !proDrawer.classList.contains('hidden')) {
        proDrawer.classList.add('hidden');
        if (proOverlay) proOverlay.classList.add('hidden');
        return;
      }

      // 4. Retailers Store Modal
      const retModal = document.getElementById('retailers-modal');
      if (retModal && retModal.classList.contains('active')) {
        retModal.classList.remove('active');
        return;
      }

      // 5. Standard Dialog Modals (Save, Export, Comparison)
      if (elements.saveModal && elements.saveModal.classList.contains('active')) {
        closeModal(elements.saveModal);
        return;
      }
      if (elements.exportModal && elements.exportModal.classList.contains('active')) {
        closeModal(elements.exportModal);
        return;
      }
      if (elements.comparisonModal && elements.comparisonModal.classList.contains('active')) {
        closeModal(elements.comparisonModal);
        return;
      }

      // 6. Autobuild Popover
      const autobuildPopover = document.getElementById('autobuild-popover');
      if (autobuildPopover && !autobuildPopover.classList.contains('hidden')) {
        autobuildPopover.classList.add('hidden');
        return;
      }

      // 7. Parts Catalog Drawer
      if (elements.drawer && elements.drawer.classList.contains('active')) {
        closeDrawer();
        return;
      }
    }
  });

  // Drawer events
  if (elements.drawerClose) elements.drawerClose.addEventListener('click', closeDrawer);
  if (elements.drawerOverlay) elements.drawerOverlay.addEventListener('click', closeDrawer);
  if (elements.partsSearch) {
    elements.partsSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPartsList();
    });
  }
  if (elements.toggleCompat) {
    elements.toggleCompat.addEventListener('change', (e) => {
      hideIncompatible = e.target.checked;
      renderPartsList();
    });
  }
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      sortOrder = e.target.value;
      renderPartsList();
    });
  }

  // Modal closes
  if (elements.exportCloseBtn) elements.exportCloseBtn.addEventListener('click', () => closeModal(elements.exportModal));
  if (elements.saveCloseBtn) elements.saveCloseBtn.addEventListener('click', () => closeModal(elements.saveModal));
  if (elements.comparisonClose) elements.comparisonClose.addEventListener('click', () => closeModal(elements.comparisonModal));

  // Save Modal Confirm
  if (elements.saveConfirmBtn) elements.saveConfirmBtn.addEventListener('click', confirmSaveBuild);

  // Copy Specification & Print
  if (elements.btnCopySpec) elements.btnCopySpec.addEventListener('click', copySpecification);
  if (elements.btnPrint) elements.btnPrint.addEventListener('click', () => window.print());

  // FPS Resolution selector change (if present)
  if (elements.fpsResolution) {
    elements.fpsResolution.addEventListener('change', () => {
      updateFpsPanel();
    });
  }
  
  // Close modals clicking outside
  [elements.exportModal, elements.saveModal, elements.comparisonModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

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
}

  // Close Retailers Modal
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

// Translations logic
function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key.startsWith('[placeholder]')) {
      const realKey = key.replace('[placeholder]', '');
      el.placeholder = t(realKey);
    
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
} else {
      el.textContent = t(key);
    }
  });

  // Update store hub button texts
  document.querySelectorAll('.store-hub-text').forEach(el => {
    const text = t('slot.comparePrices');
    el.textContent = (text && !text.includes('.')) ? text : 'Цены в магазинах';
  });

  // Explicitly update schematic title
  const schTitle = document.querySelector('.schematic-title');
  if (schTitle) schTitle.textContent = t('dash.visualizer.title');

  // Explicitly update CPU & GPU analogs titles
  const cpuAnTitle = document.querySelector('#cpu-analogs-box .analogs-title');
  if (cpuAnTitle) cpuAnTitle.textContent = t('slot.cpu.analogs');

  const gpuAnTitle = document.querySelector('#gpu-analogs-box .analogs-title');
  if (gpuAnTitle) gpuAnTitle.textContent = t('slot.gpu.analogs');

  // Sync language buttons active state
  const currentLang = getCurrentLanguage();
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  // Sync currency buttons active state
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === currentCurrency);
  });

  // Update headers and optional badges
  document.querySelectorAll('.slot-card').forEach(card => {
    const cat = card.dataset.category;
    card.querySelector('.slot-category').textContent = t(`cat.${cat}`);
    
    // Update placeholders dynamically
    const placeholder = card.querySelector('.slot-placeholder');
    if (placeholder) {
      placeholder.textContent = t(`slot.${cat}.hint`);
    }

    const selectBtn = card.querySelector('.select-btn');
    if (selectBtn) {
      const hasItem = buildState[cat] !== null;
      selectBtn.textContent = hasItem ? t('slot.selected') : t('slot.select');
    }
  });

  // Re-translate document title and taglines
  const titleEl = document.querySelector('.brand-title, .header h1');
  if (titleEl) titleEl.innerHTML = `${t('app.title')} <span class="brand-badge">2026</span>`;
  const subEl = document.querySelector('.subtitle');
  if (subEl) subEl.textContent = t('app.subtitle');

  // Tooltips for beginners (English / Russian details)
  const tooltipMap = {
    'slot-cpu': 'tip.socket',
    'slot-motherboard': 'tip.ddr',
    'slot-cooler': 'tip.tdp',
    'slot-ram': 'tip.ddr',
    'slot-gpu': 'tip.bottleneck',
    'slot-psu': 'tip.psu',
    'slot-case': 'tip.formfactor',
    'bottleneck-panel': 'tip.bottleneck'
  };

  Object.entries(tooltipMap).forEach(([id, tipKey]) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-tooltip', t(tipKey));
  });
}

// Formatting Price
function formatPrice(usdPrice) {
  const converted = usdPrice * EXCHANGE_RATES[currentCurrency];
  if (currentCurrency === 'PLN') {
    return `${Math.round(converted).toLocaleString(getCurrentLanguage())} zł`;
  } else {
    return `$${Math.round(converted).toLocaleString(getCurrentLanguage())}`;
  }
}

// Load Preset
function loadPreset(presetKey) {
  const preset = PRESETS[presetKey];
  if (!preset) return;

  CATEGORIES.forEach(cat => {
    const partId = preset.parts ? preset.parts[cat] : null;
    if (partId && PARTS_DATABASE[cat]) {
      const found = PARTS_DATABASE[cat].find(p => p.id === partId);
      buildState[cat] = found || null;
      if (!found) {
        console.warn(`[Preset Warning] Part ID "${partId}" not found in database for category "${cat}".`);
      }
    } else {
      buildState[cat] = null;
    }
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === presetKey);
  });

  updateUI();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
}

// Clear Build
function clearBuild() {
  localStorage.removeItem(DRAFT_STORAGE_KEY);
  Object.keys(buildState).forEach(cat => {
    buildState[cat] = null;
  });

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Clean URL parameters
  const url = new URL(window.location);
  url.searchParams.delete('b');
  window.history.pushState({}, '', url);

  updateUI();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
}

// Remove component
function removePart(category) {
  buildState[category] = null;
  updateUI();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
}

// Open Drawer
function openDrawer(category) {
  activeCategory = category;
  elements.drawerTitle.textContent = `${t('slot.select')}: ${t(`cat.${category}`)}`;
  elements.partsSearch.value = '';
  searchQuery = '';
  
  elements.drawerOverlay.classList.add('active');
  elements.drawer.classList.add('active');
  currentDrawerFilter = 'all';
  renderDrawerQuickFilters(category);
  renderPartsList();
}

// Close Drawer
function closeDrawer() {
  elements.drawerOverlay.classList.remove('active');
  elements.drawer.classList.remove('active');
  activeCategory = null;
}

// Render component list in Drawer
function renderPartsList() {
  if (!activeCategory) return;
  elements.partsList.innerHTML = '';

  const parts = PARTS_DATABASE[activeCategory] || [];

  // Calculate compatibility for each item in the context of other selected items
  const evaluated = parts.map(part => {
    const tempBuild = { ...buildState, [activeCategory]: part };
    const warnings = checkCompatibility(tempBuild);
    
    // Find errors that don't exist without this component
    const currentWarnings = checkCompatibility({ ...buildState, [activeCategory]: null });
    const freshErrors = warnings.filter(w => w.type === 'error' && !currentWarnings.some(cw => cw.message === w.message));
    
    return {
      part,
      isCompatible: freshErrors.length === 0,
      errorMsg: freshErrors.length > 0 ? freshErrors[0].message : ''
    };
  });

  let filtered = evaluated;

  // Filter compatibility
  if (hideIncompatible) {
    filtered = filtered.filter(item => item.isCompatible);
  }

  // Filter text search
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
  }

  // Sort
  if (sortOrder === 'price-asc') {
    filtered.sort((a, b) => a.part.price - b.part.price);
  } else if (sortOrder === 'price-desc') {
    filtered.sort((a, b) => b.part.price - a.part.price);
  }

  if (filtered.length === 0) {
    if (hideIncompatible) {
      elements.partsList.innerHTML = `
        <div class="drawer-empty-box">
          <p class="compat-info-item">${t('drawer.empty')}</p>
          <button id="btn-show-all-parts" class="btn btn-sm btn-secondary">${t('drawer.showAll')}</button>
        </div>
      `;
      const btnShowAll = document.getElementById('btn-show-all-parts');
      if (btnShowAll) {
        btnShowAll.addEventListener('click', () => {
          elements.toggleCompat.checked = false;
          hideIncompatible = false;
          renderPartsList();
        });
      }
    } else {
      elements.partsList.innerHTML = `<div class="compat-info-item">${t('drawer.empty')}</div>`;
    }
    // Update count badge
    const badge = document.getElementById('drawer-count-badge');
    if (badge) badge.textContent = '0';
    return;
  }

  // Update count badge
  const badge = document.getElementById('drawer-count-badge');
  if (badge) badge.textContent = filtered.length;

  window.drawerFilteredParts = filtered;
  window.drawerCurrentPage = 1;
  renderPartsPage();
}

function renderPartsPage() {
  const filtered = window.drawerFilteredParts;
  if (!filtered) return;
  const PAGE_SIZE = 30;
  const start = (window.drawerCurrentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const toRender = filtered.slice(start, end);

  toRender.forEach(({ part, isCompatible, errorMsg }) => {
    const card = document.createElement('div');
    const isSelected = buildState[activeCategory]?.id === part.id;
    card.className = `part-card ${isSelected ? 'active' : ''}`;
    
    // Build tier bar HTML if part has a tier
    let tierBarHtml = '';
    if (part.tier) {
      const tierPct = Math.round((part.tier / 10) * 100);
      let tierColor = '#a1a1aa'; // default gray
      if (part.tier >= 9) tierColor = 'var(--success)';
      else if (part.tier >= 7) tierColor = '#2563eb';
      else if (part.tier >= 5) tierColor = 'var(--warning)';
      tierBarHtml = `
        <div class="part-tier-bar" title="Performance tier: ${part.tier}/10">
          <div class="part-tier-fill" style="width:${tierPct}%; background-color:${tierColor}"></div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="part-card-header">
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
      </div>
    `;

    const storeBtn = card.querySelector('.part-store-btn');
    if (storeBtn) {
      storeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRetailersModal(part);
      });
    }

    card.addEventListener('click', () => {
      selectPart(activeCategory, part);
    });

    elements.partsList.appendChild(card);
  });

  if (end < filtered.length) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'btn btn-secondary';
    loadMoreBtn.style.margin = '20px auto';
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.textContent = 'Показать еще (' + (filtered.length - end) + ')';
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.remove();
      window.drawerCurrentPage++;
      renderPartsPage();
    });
    elements.partsList.appendChild(loadMoreBtn);
  }
}

// Select component
function selectPart(category, part) {
  buildState[category] = part;
  saveDraftBuild();
  closeDrawer();
  updateUI();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
}

// Update UI (Checklist, calculations, schematic, performance)

// Calculate 1-Click Interactive Fixes for Compatibility Issues
function getSuggestedFixesForIssue(issueMsg, build) {
  const fixes = [];

  // 1. Power Supply / Wattage Issue
  const lower = issueMsg.toLowerCase();
  if (lower.includes('power') || lower.includes('psu') || lower.includes('wattage') || lower.includes('margin')) {
    let estTdp = 100;
    if (build.cpu) estTdp += (build.cpu.maxTdp || build.cpu.tdp || 65);
    if (build.gpu) estTdp += (build.gpu.tdp || 150);
    const targetWattage = Math.max(750, Math.ceil((estTdp * 1.3) / 50) * 50);

    const candidates = PARTS_DATABASE.psu
      .filter(p => p.wattage >= targetWattage)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (candidates.length > 0) {
      fixes.push({
        title: `⚡ Заменить на БП достаточной мощности (${targetWattage}W+):`,
        category: 'psu',
        parts: candidates
      });
    }
  }

  // 2. CPU / Motherboard Socket Mismatch
  if (issueMsg.includes('Socket Mismatch') && build.cpu && build.motherboard) {
    const mbOptions = PARTS_DATABASE.motherboard
      .filter(m => m.socket === build.cpu.socket)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (mbOptions.length > 0) {
      fixes.push({
        title: `⚡ Совместимые материнские платы под ${build.cpu.name} (${build.cpu.socket}):`,
        category: 'motherboard',
        parts: mbOptions
      });
    }

    const cpuOptions = PARTS_DATABASE.cpu
      .filter(c => c.socket === build.motherboard.socket)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (cpuOptions.length > 0) {
      fixes.push({
        title: `⚡ Либо процессоры под сокет ${build.motherboard.socket}:`,
        category: 'cpu',
        parts: cpuOptions
      });
    }
  }

  // 3. Memory Standard Mismatch (DDR4 vs DDR5)
  if (issueMsg.includes('Memory Standard Mismatch') && build.motherboard) {
    const ramOptions = PARTS_DATABASE.ram
      .filter(r => r.type === build.motherboard.ramType)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (ramOptions.length > 0) {
      fixes.push({
        title: `⚡ Подходящая оперативная память (${build.motherboard.ramType}):`,
        category: 'ram',
        parts: ramOptions
      });
    }
  }

  // 4. GPU Clearance / Case Size
  if (issueMsg.includes('GPU Clearance') && build.gpu) {
    const caseOptions = PARTS_DATABASE.case
      .filter(c => !c.maxGpuLength || c.maxGpuLength >= build.gpu.length)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (caseOptions.length > 0) {
      fixes.push({
        title: `⚡ Просторные корпуса под видеокарту (${build.gpu.length}мм):`,
        category: 'case',
        parts: caseOptions
      });
    }
  }

  // 5. Cooler Socket / TDP Issue
  if (issueMsg.includes('Cooler') && build.cpu) {
    const coolerOptions = PARTS_DATABASE.cooler
      .filter(k => (k.maxTdp || 150) >= (build.cpu.maxTdp || build.cpu.tdp || 65))
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (coolerOptions.length > 0) {
      fixes.push({
        title: `⚡ Эффективное охлаждение под ${build.cpu.name}:`,
        category: 'cooler',
        parts: coolerOptions
      });
    }
  }

  
  // VRM Limit Issue
  if (issueMsg.includes('VRM Limit Warning') && build.cpu) {
    const mbOptions = PARTS_DATABASE.motherboard
      .filter(m => m.socket === build.cpu.socket && !m.name.toLowerCase().includes('h610') && !m.name.toLowerCase().includes('a520') && !m.name.toLowerCase().includes('a620') && !m.name.toLowerCase().includes('b650m-k'))
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);
    if (mbOptions.length > 0) {
      fixes.push({
        title: `⚡ Надежные материнские платы под ${build.cpu.name}:`,
        category: 'motherboard',
        parts: mbOptions
      });
    }
  }

  // ATX 3.0 Standard Issue
  if (issueMsg.includes('ATX 3.0 Standard') && build.gpu) {
    const psuOptions = PARTS_DATABASE.psu
      .filter(p => p.specs && p.specs.includes('ATX 3.0'))
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);
    if (psuOptions.length > 0) {
      fixes.push({
        title: `⚡ Блоки питания ATX 3.0 (прямой кабель 12VHPWR):`,
        category: 'psu',
        parts: psuOptions
      });
    }
  }

  return fixes;
}


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
}

function updateUI() {
  pushHistory();
  let totalPrice = 0;
  let filledCount = 0;

  // 1. Checklist slots
  CATEGORIES.forEach(category => {
    const part = buildState[category];
    const slotCard = document.getElementById(`slot-${category}`);
    if (!slotCard) return;

    const placeholder = slotCard.querySelector('.slot-placeholder');
    const selectedDiv = slotCard.querySelector('.slot-selected');
    const priceEl = slotCard.querySelector('.slot-price');
    const removeBtn = slotCard.querySelector('.remove-btn');
    const selectBtn = slotCard.querySelector('.select-btn');
    const buyLink = slotCard.querySelector('.slot-buy-link');

    if (part) {
      filledCount++;
      totalPrice += part.price;
      slotCard.classList.add('filled');
      placeholder.classList.add('hidden');
      selectedDiv.classList.remove('hidden');
      priceEl.classList.remove('hidden');
      removeBtn.classList.remove('hidden');
      selectBtn.textContent = t('slot.selected');

      selectedDiv.querySelector('.slot-selected-name').textContent = part.name;
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
      }
    } else {
      slotCard.classList.remove('filled');
      placeholder.classList.remove('hidden');
      selectedDiv.classList.add('hidden');
      priceEl.classList.add('hidden');
      removeBtn.classList.add('hidden');
      selectBtn.textContent = t('slot.select');
      if (buyLink) buyLink.classList.add('hidden');
    }
  });

  // Include optional monitor in total price
  if (buildState.monitor) {
    totalPrice += buildState.monitor.price;
  }

  // 2. Summary
  
  // 1.1 GPU Analogs / Alternatives
  const analogsBox = document.getElementById('gpu-analogs-box');
  const analogsList = document.getElementById('gpu-analogs-list');
  if (analogsBox && analogsList) {
    if (buildState.gpu) {
      const currentGpu = buildState.gpu;
      // Search for up to 3 direct alternatives with similar tier (+-1) and similar price
      const alternatives = PARTS_DATABASE.gpu.filter(g => 
        g.id !== currentGpu.id &&
        Math.abs(g.tier - currentGpu.tier) <= 1 &&
        g.price >= currentGpu.price * 0.70 &&
        g.price <= currentGpu.price * 1.35
      ).slice(0, 3);

      if (alternatives.length > 0) {
        analogsList.innerHTML = alternatives.map(alt => {
          const shortName = alt.name
            .replace('NVIDIA GeForce ', '')
            .replace('AMD Radeon ', '')
            .replace('Intel Arc ', '');
          return `<button type="button" class="analog-chip-btn" data-id="${alt.id}">
            <span>${shortName}</span>
            <span class="analog-chip-price">${formatPrice(alt.price)}</span>
          </button>`;
        }).join('');
        
        // Attach click handlers
        analogsList.querySelectorAll('.analog-chip-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const partId = btn.getAttribute('data-id');
            const newPart = PARTS_DATABASE.gpu.find(p => p.id === partId);
            if (newPart) {
              pushHistory();
              buildState.gpu = newPart;
              updateUI();
            }
          });
        });

        analogsBox.classList.remove('hidden');
      } else {
        analogsBox.classList.add('hidden');
      }
    } else {
      analogsBox.classList.add('hidden');
    }
  }

  // 1.2 CPU Analogs / Alternatives
  const cpuAnalogsBox = document.getElementById('cpu-analogs-box');
  const cpuAnalogsList = document.getElementById('cpu-analogs-list');
  if (cpuAnalogsBox && cpuAnalogsList) {
    if (buildState.cpu) {
      const currentCpu = buildState.cpu;
      // Find up to 3 direct CPU alternatives: competitor brand if possible, or same tier +-1 and price +-35%
      const alternatives = PARTS_DATABASE.cpu.filter(c => {
        if (c.id === currentCpu.id) return false;
        const isOtherBrand = c.brand !== currentCpu.brand;
        const tierDiff = Math.abs((c.tier || 5) - (currentCpu.tier || 5));
        const priceRatio = c.price / currentCpu.price;
        return (isOtherBrand && tierDiff <= 1) || (tierDiff === 0 && priceRatio >= 0.70 && priceRatio <= 1.35);
      }).slice(0, 3);

      if (alternatives.length > 0) {
        cpuAnalogsList.innerHTML = alternatives.map(alt => {
          const shortName = alt.name.replace('AMD ', '').replace('Intel ', '');
          return `<button type="button" class="analog-chip-btn" data-id="${alt.id}">
            <span>${shortName}</span>
            <span class="analog-chip-price">${formatPrice(alt.price)}</span>
          </button>`;
        }).join('');

        cpuAnalogsList.querySelectorAll('.analog-chip-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const partId = btn.getAttribute('data-id');
            const newCpu = PARTS_DATABASE.cpu.find(p => p.id === partId);
            if (newCpu) {
              pushHistory();
              buildState.cpu = newCpu;
              if (buildState.motherboard && buildState.motherboard.socket !== newCpu.socket) {
                buildState.motherboard = null;
              }
              updateUI();
            }
          });
        });

        cpuAnalogsBox.classList.remove('hidden');
      } else {
        cpuAnalogsBox.classList.add('hidden');
      }
    } else {
      cpuAnalogsBox.classList.add('hidden');
    }
  }

  elements.totalPrice.textContent = formatPrice(totalPrice);

  // 3. Dual progress counter (8 Essential + 2 Optional)
  const ESSENTIAL_CATS = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'psu', 'case'];
  const OPTIONAL_CATS = ['hdd', 'monitor'];
  const essentialCount = ESSENTIAL_CATS.filter(c => buildState[c] !== null).length;
  const optionalCount = OPTIONAL_CATS.filter(c => buildState[c] !== null).length;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  elements.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  const offset = circumference - (essentialCount / 8) * circumference;
  elements.progressCircle.style.strokeDashoffset = offset;
  elements.progressText.textContent = `${essentialCount} / 8`;

  const progressSub = document.getElementById('progress-sub');
  if (progressSub) {
    progressSub.textContent = `+${optionalCount} opt`;
  }

  // 4. Power calculations
  let estTdp = 100;
  if (buildState.cpu) estTdp += (buildState.cpu.maxTdp || buildState.cpu.tdp);
  if (buildState.gpu) estTdp += buildState.gpu.tdp;

  elements.powerValue.textContent = `${estTdp}W`;

  // Sync mobile sticky summary bar
  const mobileTotalPrice = document.getElementById('mobile-total-price');
  if (mobileTotalPrice) {
    mobileTotalPrice.textContent = formatPrice(totalPrice);
  }
  const mobilePowerVal = document.getElementById('mobile-power-val');
  if (mobilePowerVal) {
    mobilePowerVal.textContent = `${estTdp}W`;
  }
  const mobileProgressVal = document.getElementById('mobile-progress-val');
  if (mobileProgressVal) {
    mobileProgressVal.textContent = `${essentialCount} / 8`;
  }
  if (buildState.psu) {
    const limit = buildState.psu.wattage;
    elements.powerLimitText.textContent = `${t('dash.psu.label')}: ${limit}W`;
    const percentage = Math.min((estTdp / limit) * 100, 100);
    elements.powerBar.style.width = `${percentage}%`;
    elements.powerBar.classList.toggle('overload', estTdp > limit);
  } else {
    elements.powerLimitText.textContent = t('dash.psu.none');
    const percentage = Math.min((estTdp / 600) * 100, 100);
    elements.powerBar.style.width = `${percentage}%`;
    elements.powerBar.classList.remove('overload');
  }

  // 5. Compatibility Panel
  const status = checkCompatibility(buildState);
  elements.compatibilityList.innerHTML = '';

  const errors = status.filter(s => s.type === 'error');
  const warnings = status.filter(s => s.type === 'warning');

  if (filledCount === 0) {
    elements.compatibilityList.innerHTML = `<li class="compat-info-item">${t('dash.compat.empty')}</li>`;
    elements.chassisStatus.textContent = t('status.waiting');
    elements.chassisStatus.style.backgroundColor = 'var(--bg-secondary)';
    elements.chassisStatus.style.color = 'var(--text-secondary)';
    elements.chassisStatus.style.borderColor = 'var(--border)';
  } else {
    if (errors.length > 0) {
      elements.chassisStatus.textContent = t('status.error');
      elements.chassisStatus.style.backgroundColor = 'var(--error-bg)';
      elements.chassisStatus.style.color = 'var(--error)';
      elements.chassisStatus.style.borderColor = 'var(--error-border)';
    } else if (warnings.length > 0) {
      elements.chassisStatus.textContent = t('status.warning');
      elements.chassisStatus.style.backgroundColor = 'var(--warning-bg)';
      elements.chassisStatus.style.color = 'var(--warning)';
      elements.chassisStatus.style.borderColor = 'var(--warning-border)';
    } else {
      elements.chassisStatus.textContent = t('status.ok');
      elements.chassisStatus.style.backgroundColor = 'var(--success-bg)';
      elements.chassisStatus.style.color = 'var(--success)';
      elements.chassisStatus.style.borderColor = 'var(--success-border)';
    }

    if (errors.length === 0 && warnings.length === 0) {
      elements.compatibilityList.innerHTML = `
        <li class="compat-item compat-success">
          <span>✓</span>
          <span>${t('dash.compat.ok')}</span>
        </li>
      `;
    } else {
      const actionableIssues = [...errors, ...warnings];
      actionableIssues.forEach(s => {
        const li = document.createElement('li');
        const icon = s.type === 'error' ? '❌' : '⚠';
        li.className = s.type === 'error' ? 'compat-item compat-error' : 'compat-item compat-warning';
        
        // Calculate 1-click suggested fixes
        const fixes = getSuggestedFixesForIssue(s.message, buildState);
        let solutionsHtml = '';

        if (fixes.length > 0) {
          solutionsHtml = `
            <div class="compat-solutions-wrapper">
              ${fixes.map(f => `
                <div class="compat-fix-group">
                  <span class="compat-fix-title">${f.title}</span>
                  <div class="compat-fix-chips">
                    ${f.parts.map(p => `
                      <button type="button" class="compat-fix-btn" data-category="${f.category}" data-part-id="${p.id}" title="${p.specs}">
                        <span class="compat-fix-name">${p.name}</span>
                        <span class="compat-fix-price">${formatPrice(p.price)}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }

        li.innerHTML = `
          <div class="compat-msg-row">
            <span class="compat-icon">${icon}</span>
            <span class="compat-text">${s.message}</span>
          </div>
          ${solutionsHtml}
        `;
        elements.compatibilityList.appendChild(li);
      });

      // Bind 1-click swap buttons inside compatibility panel
      elements.compatibilityList.querySelectorAll('.compat-fix-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const cat = btn.getAttribute('data-category');
          const partId = btn.getAttribute('data-part-id');
          const newPart = PARTS_DATABASE[cat]?.find(x => x.id === partId);
          if (newPart) {
            pushHistory();
            buildState[cat] = newPart;
            // Clean incompatible paired components if needed
            if (cat === 'cpu' && buildState.motherboard && buildState.motherboard.socket !== newPart.socket) {
              buildState.motherboard = null;
            }
            if (cat === 'motherboard' && buildState.ram && buildState.ram.type !== newPart.ramType) {
              buildState.ram = null;
            }
            updateUI();
          }
        });
      });
    }
  }

  // 6. SVG blueprint toggle states
  CATEGORIES.forEach(cat => updateAnalogs(cat, buildState[cat]));
  updateSvgVisualizer();

  // 7. FPS Panel & Bottleneck
  updateFpsPanel();
  updateBottleneckPanel();
  updateMonitorPanel();

  // 8. Sync preset buttons matching state
  updatePresetButtons();
}

function updatePresetButtons() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    const presetKey = btn.dataset.preset;
    const preset = PRESETS[presetKey];
    if (!preset) return;

    let matches = true;
    for (const cat of CATEGORIES) {
      const presetPartId = preset.parts[cat];
      const selectedPart = buildState[cat];

      if (presetPartId) {
        if (!selectedPart || selectedPart.id !== presetPartId) {
          matches = false;
          break;
        }
      } else {
        if (selectedPart) {
          matches = false;
          break;
        }
      }
    }
    btn.classList.toggle('active', matches);
  });
}

// SVG toggling & Real-Time 2D Schematic Synchronization
function updateSvgVisualizer() {
  const visMap = {
    motherboard: 'vis-motherboard',
    cpu: 'vis-cpu',
    ram: 'vis-ram',
    cooler: 'vis-cooler',
    gpu: 'vis-gpu',
    ssd: 'vis-ssd',
    hdd: 'vis-hdd',
    psu: 'vis-psu'
  };

  Object.entries(visMap).forEach(([category, elementId]) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (buildState[category]) {
      el.classList.remove('hidden');
      el.setAttribute('aria-hidden', 'false');
    } else {
      el.classList.add('hidden');
      el.setAttribute('aria-hidden', 'true');
    }
  });

  // Ghost slot targets synchronization
  const ghostMap = {
    case: 'ghost-case',
    motherboard: 'ghost-motherboard',
    cpu: 'ghost-cpu',
    ram: 'ghost-ram',
    cooler: 'ghost-cooler',
    gpu: 'ghost-gpu',
    ssd: 'ghost-ssd',
    hdd: 'ghost-hdd',
    psu: 'ghost-psu'
  };
  const isXray = document.querySelector('.center-schematic')?.classList.contains('xray-mode');
  Object.entries(ghostMap).forEach(([category, ghostId]) => {
    const ghostEl = document.getElementById(ghostId);
    if (!ghostEl) return;
    if (buildState[category] && !isXray) {
      ghostEl.style.display = 'none';
    } else {
      ghostEl.style.display = '';
    }
  });

  // 1. Dynamic Model Sub-labels in Schematic
  const mbNameEl = document.getElementById('vis-mb-name');
  if (mbNameEl) {
    mbNameEl.textContent = buildState.motherboard ? (buildState.motherboard.formFactor || 'ATX') + ' • ' + (buildState.motherboard.chipset || buildState.motherboard.socket || '') : '';
  }

  const cpuTitleEl = document.getElementById('vis-cpu-title');
  const cpuNameEl = document.getElementById('vis-cpu-name');
  if (buildState.cooler) {
    // When cooler is physically installed on the CPU, hide the CPU socket text to prevent visual clash
    if (cpuTitleEl) cpuTitleEl.style.display = 'none';
    if (cpuNameEl) cpuNameEl.style.display = 'none';
  } else {
    if (cpuTitleEl) cpuTitleEl.style.display = '';
    if (cpuNameEl) {
      cpuNameEl.style.display = '';
      if (buildState.cpu) {
        const shortCpu = buildState.cpu.name.replace('AMD Ryzen ', 'R').replace('Intel Core ', 'i').replace('Intel Core Ultra ', 'U');
        cpuNameEl.textContent = shortCpu;
      } else {
        cpuNameEl.textContent = '';
      }
    }
  }

  // AIO Pump Display
  const aioTemp = document.getElementById('vis-aio-temp');
  if (aioTemp) {
    if (buildState.cpu) {
      const shortCpu = buildState.cpu.name.replace('AMD Ryzen ', 'R').replace('Intel Core ', 'i').replace('Intel Core Ultra ', 'U');
      aioTemp.textContent = shortCpu;
    } else {
      aioTemp.textContent = 'AIO';
    }
  }

  const gpuNameEl = document.getElementById('vis-gpu-name');
  if (gpuNameEl) {
    if (buildState.gpu) {
      const shortGpu = buildState.gpu.name.replace('NVIDIA GeForce ', '').replace('AMD Radeon ', '');
      gpuNameEl.textContent = shortGpu;
    } else {
      gpuNameEl.textContent = '';
    }
  }

  const psuNameEl = document.getElementById('vis-psu-name');
  if (psuNameEl) {
    psuNameEl.textContent = buildState.psu ? `${buildState.psu.wattage}W` : '';
  }

  const caseBadgeEl = document.getElementById('vis-case-badge');
  const caseNameEl = document.getElementById('vis-case-name');
  if (caseBadgeEl) {
    if (buildState.case) {
      caseBadgeEl.textContent = t('schematic.case') || 'КОРПУС';
      if (caseNameEl) caseNameEl.textContent = buildState.case.name.slice(0, 24);
    } else {
      caseBadgeEl.textContent = '+ ' + (t('schematic.case') || 'КОРПУС');
      if (caseNameEl) caseNameEl.textContent = '';
    }
  }

  // 2. Case chassis outline interactive stroke (fill is ALWAYS 'none' to avoid blocking interior clicks)
  const caseFrame = document.getElementById('vis-case-frame');
  if (caseFrame) {
    caseFrame.style.fill = 'none';
    if (buildState.case) {
      caseFrame.style.stroke = 'var(--accent)';
      caseFrame.style.strokeWidth = '2.4px';
      caseFrame.style.strokeDasharray = 'none';
    } else {
      caseFrame.style.stroke = 'var(--border)';
      caseFrame.style.strokeWidth = '1.8px';
      caseFrame.style.strokeDasharray = '6,4';
    }
  }

  // 3. Cooler sub-components toggle (Air vs AIO - case-insensitive)
  if (buildState.cooler) {
    const isAio = String(buildState.cooler.type).toLowerCase() === 'aio';
    const airEl = document.getElementById('vis-cooler-air');
    const aioEl = document.getElementById('vis-cooler-aio');
    if (airEl) airEl.classList.toggle('hidden', isAio);
    if (aioEl) aioEl.classList.toggle('hidden', !isAio);
  }

  // 4. Update Clearance Overlay if active
  updateClearanceOverlay();

  // 5. Refresh HUD if open
  const hud = document.getElementById('schematic-hud');
  if (hud && hud.classList.contains('visible') && hud.dataset.category) {
    showSchematicHud(hud.dataset.category);
  }
}

function updateClearanceOverlay() {
  const layer = document.getElementById('vis-clearance-layer');
  if (!layer || layer.classList.contains('hidden')) return;

  const gpu = buildState.gpu;
  const pcCase = buildState.case;
  const cooler = buildState.cooler;

  const mmUnit = t('schematic.clearance.mm') || 'мм';
  const marginLabel = t('schematic.clearance.margin') || 'Запас';
  const exceedLabel = t('schematic.clearance.exceed') || 'Превышение';
  const maxWord = t('schematic.clearance.max') || 'макс';
  const coolerWord = t('schematic.clearance.cooler') || 'Кулер';
  const aioWord = t('schematic.clearance.aio') || 'СЖО';
  const maxGpuWord = t('schematic.clearance.max_gpu') || 'Макс GPU';

  // 1. GPU clearance
  const dimGpuText = document.getElementById('dim-gpu-text');
  const dimGpuLine = document.getElementById('dim-gpu-line');
  if (dimGpuText) {
    const gpuLen = (gpu && gpu.length) ? gpu.length : 304;
    const maxLen = (pcCase && pcCase.maxGpuLength) ? pcCase.maxGpuLength : 360;
    const diff = maxLen - gpuLen;
    if (diff >= 0) {
      dimGpuText.textContent = `GPU: ${gpuLen} ${mmUnit} • ${marginLabel} +${diff} ${mmUnit} ✓`;
      dimGpuText.setAttribute('fill', '#10b981');
      if (dimGpuLine) dimGpuLine.setAttribute('stroke', '#10b981');
    } else {
      dimGpuText.textContent = `GPU: ${gpuLen} ${mmUnit} ⚠️ ${exceedLabel} ${Math.abs(diff)} ${mmUnit}!`;
      dimGpuText.setAttribute('fill', '#ef4444');
      if (dimGpuLine) dimGpuLine.setAttribute('stroke', '#ef4444');
    }
  }

  // 2. Cooler clearance
  const dimCoolerText = document.getElementById('dim-cooler-text');
  if (dimCoolerText) {
    if (cooler) {
      const isAio = String(cooler.type).toLowerCase() === 'aio';
      if (isAio) {
        const rad = cooler.radiatorSize || 240;
        const maxRad = (pcCase && pcCase.maxRadiatorSize !== undefined) ? pcCase.maxRadiatorSize : 360;
        dimCoolerText.textContent = `${aioWord}: ${rad} ${mmUnit} (${maxWord} ${maxRad} ${mmUnit}) ${rad <= maxRad ? '✓' : '⚠️'}`;
      } else {
        const h = cooler.height || 157;
        const maxH = (pcCase && pcCase.maxCoolerHeight) ? pcCase.maxCoolerHeight : 170;
        dimCoolerText.textContent = `${coolerWord}: ${h} ${mmUnit} (${maxWord} ${maxH} ${mmUnit}) ${h <= maxH ? '✓' : '⚠️'}`;
      }
    } else {
      dimCoolerText.textContent = pcCase ? `${coolerWord}: ${maxWord} ${pcCase.maxCoolerHeight || 170} ${mmUnit} • ${aioWord}: ${pcCase.maxRadiatorSize || 360} ${mmUnit}` : `${coolerWord}: ${maxWord} 170 ${mmUnit}`;
    }
  }

  // 3. Case description
  const dimCaseText = document.getElementById('dim-case-text');
  if (dimCaseText) {
    if (pcCase) {
      dimCaseText.textContent = `${pcCase.name.slice(0, 24)} • ${maxGpuWord}: ${pcCase.maxGpuLength || 360} ${mmUnit}`;
    } else {
      dimCaseText.textContent = `Mid-Tower ATX • ${maxGpuWord}: 360 ${mmUnit}`;
    }
  }

  // 4. Clearance summary bar
  const summaryEl = document.getElementById('clearance-summary-text');
  if (summaryEl) {
    const gpuLen = (gpu && gpu.length) ? gpu.length : 304;
    const maxLen = (pcCase && pcCase.maxGpuLength) ? pcCase.maxGpuLength : 360;
    if (gpuLen > maxLen) {
      summaryEl.textContent = `⚠️ Длина видеокарты (${gpuLen} мм) превышает лимит корпуса (${maxLen} мм)!`;
      summaryEl.style.color = '#ef4444';
    } else {
      summaryEl.textContent = t('schematic.fit_all') || 'Все комплектующие идеально помещаются в корпус с запасом';
      summaryEl.style.color = '';
    }
  }
}

// Update FPS Panel (All 3 Resolutions Simultaneously)

function getFpsColorClass(fps) {
  if (fps >= 144) return 'fps-tag-ultra'; // Green
  if (fps >= 60) return 'fps-tag-high'; // Blue
  if (fps >= 30) return 'fps-tag-medium'; // Yellow
  return 'fps-tag-low'; // Red
}

function getGameIcon(gameName) {
  const map = {
    'Cyberpunk 2077': '🏙️',
    'Black Myth: Wukong': '🐒',
    'Counter-Strike 2': '🎯',
    'Baldur\'s Gate 3': '🎲',
    'Alan Wake 2': '🔦',
    'Red Dead Redemption 2': '🐎',
    'Fortnite': '🪂'
  };
  for (const [key, icon] of Object.entries(map)) {
    if (gameName.includes(key)) return icon;
  }
  return '🎮';
}

function updateFpsPanel() {
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
}

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
      title: 'Рекомендация: 27\" 1440p 165Hz+ Fast IPS',
      desc: `Видеокарта ${gpu.name} — идеальный выбор для 1440p Quad HD. 27-дюймовый Fast IPS 165-180Hz обеспечит высокую плотность пикселей и плавный фреймрейт 100+ FPS.`,
      quickIds: ['mon-27gp850', 'mon-vg27aq', 'mon-g272qpf', 'mon-g27q']
    };
  }
  // 3. Budget / eSports: RX 6600, RTX 3060, RTX 4060, Arc A580 (gpuScore < 50)
  else {
    return {
      badge: '🎯 Киберспорт: 1080p Full HD (165-180Hz)',
      badgeClass: 'rec-badge-budget',
      title: 'Рекомендация: 24\" 1080p 165-180Hz Fast IPS',
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

function updateBottleneckPanel() {
  const resultDiv = document.getElementById('bottleneck-result');
  const placeholder = document.getElementById('bottleneck-placeholder');
  
  if (!buildState.cpu || !buildState.gpu) {
    resultDiv.classList.add('hidden');
    placeholder.classList.remove('hidden');
    return;
  }
  
  placeholder.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  
  const resVal = (typeof selectedTargetRes !== 'undefined') ? selectedTargetRes : '1440p';
  const scoreBadge = document.getElementById('bottleneck-score-badge');
  const textEl = document.getElementById('bottleneck-text');
  const adviceEl = document.getElementById('bottleneck-advice');
  const cpuBar = document.getElementById('bottleneck-bar-cpu');
  const gpuBar = document.getElementById('bottleneck-bar-gpu');

  // 1. Instant Formula Preview (0ms latency so UI feels ultra-responsive)
  const instantBottleneck = analyzeBottleneck(buildState.cpu, buildState.gpu, resVal);
  if (instantBottleneck) {
    scoreBadge.textContent = instantBottleneck.score + '%';
    textEl.textContent = instantBottleneck.text;
    adviceEl.textContent = instantBottleneck.advice;
    applyBottleneckStyles(instantBottleneck.score, instantBottleneck.isCpuBound);
  }

  function applyBottleneckStyles(score, isCpuBound) {
    if (score >= 90) {
      cpuBar.style.width = '50%';
      gpuBar.style.width = '50%';
      scoreBadge.style.color = '#10b981';
      scoreBadge.style.background = 'rgba(16, 185, 129, 0.15)';
    } else if (isCpuBound) {
      const gpuUsage = Math.max(10, (score / 100) * 50);
      cpuBar.style.width = '50%';
      gpuBar.style.width = gpuUsage + '%';
      scoreBadge.style.color = '#f43f5e';
      scoreBadge.style.background = 'rgba(244, 63, 94, 0.15)';
    } else {
      const cpuUsage = Math.max(10, (score / 100) * 50);
      cpuBar.style.width = cpuUsage + '%';
      gpuBar.style.width = '50%';
      scoreBadge.style.color = '#f59e0b';
      scoreBadge.style.background = 'rgba(245, 158, 11, 0.15)';
    }
  }

  // Reset AI Verdict Card and Button on component change (On-Demand AI model)
  const aiCard = document.getElementById('ai-synergy-verdict-card');
  const btnCheckAi = document.getElementById('btn-check-ai-synergy');
  const btnText = document.getElementById('btn-check-ai-text');
  if (aiCard) aiCard.classList.add('hidden');
  if (btnCheckAi) {
    btnCheckAi.disabled = false;
    if (btnText) btnText.innerHTML = 'Проверить сборку с AI';
  }
}



function runTimelapseAnimation() {
  // Clear layout temporary and sequentially fade in
  const visComponents = ['vis-motherboard', 'vis-cpu', 'vis-cooler', 'vis-ram', 'vis-ssd', 'vis-gpu', 'vis-psu', 'vis-hdd'];
  
  // Hide all components that are filled
  visComponents.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  let delay = 0;
  visComponents.forEach(id => {
    const cat = id.replace('vis-', '');
    if (buildState[cat]) {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
      }, delay);
      delay += 400;
    }
  });

  // Re-sync UI after animation
  setTimeout(updateSvgVisualizer, delay + 200);
}

// Generate base64 sharing URL
function shareBuild() {
  const ids = CATEGORIES.map(c => buildState[c] ? buildState[c].id : '');
  if (ids.every(id => id === '')) {
    alert('Configure some components first before sharing!');
    return;
  }

  const code = btoa(ids.join(','));
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('b', code);

  navigator.clipboard.writeText(url.toString())
    .then(() => {
      window.history.pushState({}, '', url);
      const originalText = elements.btnShare.textContent;
      elements.btnShare.textContent = t('action.copied');
      setTimeout(() => {
        elements.btnShare.textContent = originalText;
      }, 1500);
    })
    .catch(err => {
      alert(`Manual share URL:\n${url.toString()}`);
    });
}

// Load configurations from share b parameter
function loadBuildFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('b');
  if (!code) return;

  try {
    const decoded = atob(code);
    const split = decoded.split(',');
    split.forEach((partId, idx) => {
      if (!partId) return;
      const cat = CATEGORIES[idx];
      const part = PARTS_DATABASE[cat]?.find(p => p.id === partId);
      if (part) buildState[cat] = part;
    });
  } catch (err) {
    console.error('Decoding URL sharing code failed', err);
  }
}

// Specifications Export Modal
function openExportModal() {
  let spec = `=== ${t('modal.export.title').toUpperCase()} ===\n\n`;
  let total = 0;
  let count = 0;

  CATEGORIES.forEach(cat => {
    const p = buildState[cat];
    spec += `${t(`cat.${cat}`)}:\n`;
    if (p) {
      count++;
      total += p.price;
      spec += `  ${p.brand} ${p.name}\n  ${p.specs}\n  ${formatPrice(p.price)}\n\n`;
    } else {
      spec += `  Not selected\n\n`;
    }
  });

  spec += `===================================\n`;
  spec += `Items: ${count} ${t('misc.of')} 10\n`;
  spec += `${t('dash.total')}: ${formatPrice(total)}\n\n`;

  // Append compatibility status
  const list = checkCompatibility(buildState);
  spec += `COMPATIBILITY STATUS:\n`;
  if (count === 0) {
    spec += `  - No parts configured\n`;
  } else if (list.length === 0 || !list.some(s => s.type === 'error' || s.type === 'warning')) {
    spec += `  ✓ All components compatible\n`;
  } else {
    list.forEach(s => {
      if (s.type === 'error') spec += `  ❌ [ERROR] ${s.message}\n`;
      if (s.type === 'warning') spec += `  ⚠ [WARNING] ${s.message}\n`;
    });
  }

  elements.exportTextarea.value = spec;
  openModal(elements.exportModal);
}

function copySpecification() {
  const text = elements.exportTextarea.value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      const oldText = elements.btnCopySpec.textContent;
      elements.btnCopySpec.textContent = t('action.copied');
      setTimeout(() => {
        elements.btnCopySpec.textContent = oldText;
      }, 1500);
    }).catch(() => {
      elements.exportTextarea.select();
      document.execCommand('copy');
    });
  } else {
    elements.exportTextarea.select();
    document.execCommand('copy');
    const oldText = elements.btnCopySpec.textContent;
    elements.btnCopySpec.textContent = t('action.copied');
    setTimeout(() => {
      elements.btnCopySpec.textContent = oldText;
    }, 1500);
  }
}

// Named Saved Builds inside localStorage
function renderSavedBuildsList() {
  const builds = loadBuilds();
  elements.savedBuildsList.innerHTML = '';

  if (builds.length === 0) {
    elements.savedBuildsList.innerHTML = `<div class="compat-info-item">${t('dash.saved.empty')}</div>`;
    return;
  }

  builds.forEach(b => {
    const card = document.createElement('div');
    card.className = 'saved-build-card';
    
    // Calculate total price of saved build
    let buildTotal = 0;
    CATEGORIES.forEach(cat => {
      const partId = b.parts[cat];
      if (partId) {
        const p = PARTS_DATABASE[cat]?.find(part => part.id === partId);
        if (p) buildTotal += p.price;
      }
    });

    const dateFormatted = new Date(b.date).toLocaleDateString(getCurrentLanguage(), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    card.innerHTML = `
      <div class="saved-build-info">
        <span class="saved-build-name">${b.name} (${formatPrice(buildTotal)})</span>
        <span class="saved-build-date">${dateFormatted}</span>
      </div>
      <div class="saved-build-actions">
        <button class="btn btn-sm btn-secondary load-build-btn">${t('action.load')}</button>
        <button class="btn btn-sm btn-remove delete-build-btn">×</button>
      </div>
    `;

    card.querySelector('.load-build-btn').addEventListener('click', () => {
      loadSavedBuild(b);
    });

    card.querySelector('.delete-build-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete build "${b.name}"?`)) {
        deleteBuild(b.name);
        renderSavedBuildsList();
      }
    });

    elements.savedBuildsList.appendChild(card);
  });
}

function loadSavedBuild(b) {
  CATEGORIES.forEach(cat => {
    const partId = b.parts[cat];
    if (partId) {
      buildState[cat] = PARTS_DATABASE[cat].find(p => p.id === partId) || null;
    } else {
      buildState[cat] = null;
    }
  });
  updateUI();
  if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();
}

function confirmSaveBuild() {
  const name = elements.saveNameInput.value.trim();
  if (!name) {
    alert('Please enter a build name!');
    return;
  }
  saveBuild(name, buildState);
  closeModal(elements.saveModal);
  elements.saveNameInput.value = '';
  renderSavedBuildsList();
}

// Side-by-side comparison modal
function openComparisonModal() {
  const builds = loadBuilds();
  if (builds.length === 0) {
    alert(t('dash.saved.empty'));
    return;
  }

  elements.comparisonContent.innerHTML = '';
  
  const table = document.createElement('table');
  table.className = 'compare-table';

  // Table header
  let thead = `<thead><tr><th>${t('compare.properties')}</th>`;
  builds.forEach(b => {
    thead += `<th>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
        <span>${b.name}</span>
        <div style="display: flex; gap: 0.25rem; align-items: center;">
          <button class="btn btn-sm btn-secondary compare-load-btn" data-name="${b.name}" title="${t('action.load')}" style="padding: 0.15rem 0.35rem; font-size: 0.7rem;">↑</button>
          <button class="compare-delete-btn" data-name="${b.name}">×</button>
        </div>
      </div>
    </th>`;
  });
  thead += '</tr></thead>';
  table.innerHTML = thead;

  // Table body
  const tbody = document.createElement('tbody');

  // Compute prices & find lowest
  const buildPrices = builds.map(b => {
    let price = 0;
    CATEGORIES.forEach(cat => {
      const partId = b.parts[cat];
      const p = PARTS_DATABASE[cat]?.find(pt => pt.id === partId);
      if (p) price += p.price;
    });
    return price;
  });

  const validPrices = buildPrices.filter(p => p > 0);
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;

  // Row for total price
  let priceRow = `<tr><td class="compare-cat-title">${t('dash.total')}</td>`;
  builds.forEach((b, idx) => {
    const price = buildPrices[idx];
    const isLowest = price > 0 && price === minPrice && builds.length > 1;
    const highlightClass = isLowest ? 'class="compare-best-price"' : '';
    priceRow += `<td ${highlightClass}><strong>${formatPrice(price)}</strong></td>`;
  });
  priceRow += '</tr>';
  tbody.innerHTML += priceRow;

  // Component categories
  CATEGORIES.forEach(cat => {
    let row = `<tr><td class="compare-cat-title">${t(`cat.${cat}`)}</td>`;
    builds.forEach(b => {
      const partId = b.parts[cat];
      const p = PARTS_DATABASE[cat]?.find(pt => pt.id === partId);
      row += p ? `<td>${p.brand} ${p.name} (${formatPrice(p.price)})</td>` : `<td>—</td>`;
    });
    row += '</tr>';
    tbody.innerHTML += row;
  });

  table.appendChild(tbody);
  elements.comparisonContent.appendChild(table);

  // Setup load buttons inside comparison table
  elements.comparisonContent.querySelectorAll('.compare-load-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const b = builds.find(x => x.name === name);
      if (b) {
        loadSavedBuild(b);
        closeModal(elements.comparisonModal);
      }
    });
  });

  // Setup delete buttons inside comparison table
  elements.comparisonContent.querySelectorAll('.compare-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      if (confirm(`Delete build "${name}"?`)) {
        deleteBuild(name);
        openComparisonModal(); // refresh comparison modal
        renderSavedBuildsList(); // refresh dashboard list
      }
    });
  });

  openModal(elements.comparisonModal);
}

// Modal open/close utilities
function openModal(modal) {
  modal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');



}

// Boot

// =============================================================
// DEV CABINET & LIVE PRICE PARSER INTEGRATION
// =============================================================

let devPollInterval = null;


// =============================================================
// TOAST NOTIFICATIONS
// =============================================================

function showToast(options = {}, maybeType) {
  let title = 'Уведомление';
  let message = '';
  let htmlMessage = '';
  let type = 'success';
  let duration = 4500;

  if (typeof options === 'string') {
    message = options;
    type = maybeType || 'info';
    title = '';
  } else if (typeof options === 'object' && options !== null) {
    title = options.title !== undefined ? options.title : 'Уведомление';
    message = options.message || '';
    htmlMessage = options.htmlMessage || '';
    type = options.type || 'success';
    duration = options.duration !== undefined ? options.duration : 4500;
  }

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  const msgContent = htmlMessage || escapeHtml(message || '');

  toast.innerHTML = `
    <div class="toast-icon-box">${icons[type] || icons.info}</div>
    <div class="toast-body">
      ${title ? `<div class="toast-title">${escapeHtml(title)}</div>` : ''}
      <div class="toast-message">${msgContent}</div>
    </div>
    <button type="button" class="toast-close app-close-btn" aria-label="Close" title="Закрыть"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  const removeToast = () => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 350);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}

let devSyncActive = false;
let devSyncCancelled = false;

function initDevCabinet() {
  const devModal = document.getElementById('dev-prices-modal');
  const devBtn = document.getElementById('dev-modal-btn');
  const devClose = document.getElementById('dev-modal-close');
  const btnStart = document.getElementById('btn-start-sync');
  const btnStop = document.getElementById('btn-stop-sync');
  const btnApply = document.getElementById('btn-apply-prices');
  const btnClearLogs = document.getElementById('btn-clear-logs');

  if (!devModal) return;

  function openDevModal() {
    devModal.classList.remove('hidden');
    devModal.classList.add('active');
    if (!devSyncActive) {
      checkDevSyncStatus();
    }
  }

  function closeDevModal() {
    devModal.classList.add('hidden');
    devModal.classList.remove('active');
    if (devPollInterval) {
      clearInterval(devPollInterval);
      devPollInterval = null;
    }
  }

  if (devBtn) devBtn.addEventListener('click', openDevModal);
  if (devClose) devClose.addEventListener('click', closeDevModal);

  // Modal backdrop click
  devModal.addEventListener('click', (e) => {
    if (e.target === devModal || e.target.classList.contains('modal-backdrop')) closeDevModal();
  });

  // Global hotkey: Ctrl + Shift + D
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd' || e.key === 'В' || e.key === 'в')) {
      e.preventDefault();
      if (devModal.classList.contains('active')) closeDevModal();
      else openDevModal();
    }
  });

  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      const term = document.getElementById('dev-terminal-logs');
      if (term) term.innerHTML = '<div class="log-line text-muted">[Лог очищен]</div>';
    });
  }

  if (btnStart) {
    btnStart.addEventListener('click', async () => {
      if (devSyncActive) return;

      const catSelect = document.getElementById('dev-category-select');
      const category = catSelect ? catSelect.value : 'all';
      const srcSelect = document.getElementById('dev-source-select');
      const source = srcSelect ? srcSelect.value : 'hybrid';

      const statusEl = document.getElementById('dev-progress-status');
      const countEl = document.getElementById('dev-progress-count');
      const fillEl = document.getElementById('dev-progress-bar-fill');
      const statUpdated = document.getElementById('dev-stat-updated');
      const termLogs = document.getElementById('dev-terminal-logs');
      const tbody = document.getElementById('dev-diff-tbody');

      devSyncActive = true;
      devSyncCancelled = false;

      // Toggle buttons
      btnStart.classList.add('hidden');
      if (btnStop) btnStop.classList.remove('hidden');

      // Reset progress & counters
      if (fillEl) fillEl.style.width = '0%';
      if (countEl) countEl.textContent = '0 / 0';
      if (statusEl) statusEl.textContent = 'Инициализация парсера цен...';
      if (statUpdated) statUpdated.textContent = '0';

      // Live terminal initial logs
      const startT = new Date().toLocaleTimeString('pl-PL');
      if (termLogs) {
        termLogs.innerHTML = `
          <div class="log-line text-muted">[${startT}] 🚀 Запуск синхронизации (${source.toUpperCase()})...</div>
          <div class="log-line text-muted">[${startT}] 📡 Подключение к базам Morele.net и Ceneo.pl...</div>
          <div class="log-line text-muted">[${startT}] ⏳ Загрузка позиций для категории «${category.toUpperCase()}»...</div>
        `;
        termLogs.scrollTop = termLogs.scrollHeight;
      }

      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding: 1.5rem;">⏳ Синхронизация цен в процессе...</td></tr>';
      }

      try {
        const res = await fetch('/api/sync-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, source })
        });
        const data = await res.json();

        if (!data.ok) {
          const errT = new Date().toLocaleTimeString('pl-PL');
          if (termLogs) {
            termLogs.insertAdjacentHTML('beforeend', `<div class="log-line text-danger">[${errT}] ❌ Ошибка запуска: ${escapeHtml(data.error || 'Неизвестная ошибка')}</div>`);
            termLogs.scrollTop = termLogs.scrollHeight;
          }
          if (statusEl) statusEl.textContent = 'Ошибка синхронизации';
          btnStart.classList.remove('hidden');
          if (btnStop) btnStop.classList.add('hidden');
          devSyncActive = false;
          return;
        }

        // Local mode with background scraper
        if (data.mode === 'local') {
          startDevPolling();
          return;
        }

        // Fast Serverless Synchronization with live streaming to terminal and diff table
        const items = data.syncResults || data.liveResults || [];
        const total = items.length;
        let updated = 0;
        const ratePLN = EXCHANGE_RATES['PLN'] || 4.05;

        const catTitles = {
          cpu: 'Процессоры (CPU)',
          cooler: 'Охлаждение',
          motherboard: 'Материнские платы',
          ram: 'Оперативная память (RAM)',
          gpu: 'Видеокарты (GPU)',
          ssd: 'SSD накопители',
          hdd: 'Жесткие диски (HDD)',
          psu: 'Блоки питания (PSU)',
          case: 'Корпуса',
          monitor: 'Мониторы',
          all: 'Полная база (все категории)'
        };

        let currentCatSection = '';
        const delayMs = total > 100 ? 55 : (total > 40 ? 80 : 120);

        if (tbody) tbody.innerHTML = '';

        for (let i = 0; i < total; i++) {
          if (devSyncCancelled) {
            const stopT = new Date().toLocaleTimeString('pl-PL');
            if (termLogs) {
              termLogs.insertAdjacentHTML('beforeend', `<div class="log-line text-muted">[${stopT}] ⏹️ Синхронизация остановлена пользователем.</div>`);
              termLogs.scrollTop = termLogs.scrollHeight;
            }
            break;
          }

          const item = items[i];
          const itemCat = item.category || category;
          const pct = Math.round(((i + 1) / total) * 100);
          if (fillEl) fillEl.style.width = `${pct}%`;
          if (countEl) countEl.textContent = `${i + 1} / ${total}`;
          if (statusEl) statusEl.textContent = `Парсинг [${(catTitles[itemCat] || itemCat).split(' ')[0]}]: ${item.name}`;

          // Section transition banner in terminal
          if (category === 'all' && itemCat !== currentCatSection) {
            currentCatSection = itemCat;
            const secName = catTitles[itemCat] || itemCat.toUpperCase();
            if (termLogs) {
              termLogs.insertAdjacentHTML('beforeend', `
                <div class="log-line" style="color: #60a5fa; font-weight: 700; margin: 4px 0 2px; padding: 2px 0; border-top: 1px dashed rgba(96, 165, 250, 0.25);">
                  📂 [РАЗДЕЛ: ${secName}]
                </div>
              `);
              termLogs.scrollTop = termLogs.scrollHeight;
            }
          }

          const itemT = new Date().toLocaleTimeString('pl-PL');
          const diffSign = item.diff > 0 ? `+${item.diff}` : `${item.diff}`;
          const diffClass = item.diff < 0 ? 'diff-negative' : (item.diff > 0 ? 'diff-positive' : 'diff-neutral');
          const diffText = item.diff < 0 ? `${item.diff} zł ↓` : (item.diff > 0 ? `+${item.diff} zł ↑` : '0 zł');

          if (termLogs) {
            termLogs.insertAdjacentHTML('beforeend', `
              <div class="log-line">
                [${itemT}] ✅ [${i + 1}/${total}] <strong>${escapeHtml(item.name)}</strong>: <span style="color: #10b981;">${item.newPrice} zł</span> (${diffSign} zł) [${escapeHtml(item.source)}]
              </div>
            `);
            termLogs.scrollTop = termLogs.scrollHeight;
          }

          if (tbody) {
            const catBadge = (catTitles[itemCat] || itemCat).split(' ')[0];
            tbody.insertAdjacentHTML('beforeend', `
              <tr>
                <td><strong>${escapeHtml(item.name)}</strong></td>
                <td><span class="slack-code-tag">${escapeHtml(catBadge)}</span></td>
                <td>${item.oldPrice} zł</td>
                <td><strong>${item.newPrice} zł</strong></td>
                <td class="${diffClass}">${diffText}</td>
                <td><span class="slack-code-tag" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">${escapeHtml(item.source || 'Morele')}</span></td>
                <td><a href="${item.url}" target="_blank" rel="noopener noreferrer" class="dev-table-link">${escapeHtml(item.source || 'Магазин')} ↗</a></td>
              </tr>
            `);
          }

          // Apply to PARTS_DATABASE
          const catKey = item.category || category;
          const list = PARTS_DATABASE[catKey] || [];
          const part = list.find(p => p.id === item.id);
          if (part) {
            part.pricePLN = item.newPrice;
            part.price = Math.round(item.newPrice / ratePLN);
            if (item.url) {
              if (!part.buyLinks) part.buyLinks = {};
              part.buyLinks.ceneo = item.url;
            }
            updated++;
            if (statUpdated) statUpdated.textContent = updated;
          }

          // Pacing delay for authentic, readable streaming
          if (i < total - 1) {
            await new Promise(r => setTimeout(r, delayMs));
          }
        }

        const endT = new Date().toLocaleTimeString('pl-PL');
        if (!devSyncCancelled) {
          if (termLogs) {
            termLogs.insertAdjacentHTML('beforeend', `
              <div class="log-line" style="color: #3b82f6; font-weight: 600;">[${endT}] 🏁 Синхронизация успешно завершена! Обновлено позиций: ${updated} из ${total}.</div>
              <div class="log-line text-muted">[${endT}] 💾 Актуальные польские цены применены к конфигуратору.</div>
            `);
            termLogs.scrollTop = termLogs.scrollHeight;
          }
          if (statusEl) statusEl.textContent = 'Синхронизация завершена';
          if (fillEl) fillEl.style.width = '100%';
          showToast({
            title: '⚡ Цены синхронизированы',
            message: `Обновлено ${updated} позиций (${catTitles[category] || category.toUpperCase()}).`,
            type: 'success',
            duration: 5000
          });
        } else {
          if (statusEl) statusEl.textContent = 'Остановлено пользователем';
        }

        updateUI();
        devSyncActive = false;
        btnStart.classList.remove('hidden');
        if (btnStop) btnStop.classList.add('hidden');
      } catch (err) {
        console.error('Failed to start sync:', err);
        devSyncActive = false;
        btnStart.classList.remove('hidden');
        if (btnStop) btnStop.classList.add('hidden');
        if (statusEl) statusEl.textContent = 'Ошибка сети';
      }
    });
  }

  if (btnStop) {
    btnStop.addEventListener('click', async () => {
      devSyncCancelled = true;
      try {
        await fetch('/api/stop-sync', { method: 'POST' });
      } catch (e) {}
      btnStart.classList.remove('hidden');
      btnStop.classList.add('hidden');
      const statusEl = document.getElementById('dev-progress-status');
      if (statusEl) statusEl.textContent = 'Остановлено пользователем';
    });
  }

  if (btnApply) {
    btnApply.addEventListener('click', async () => {
      await loadAndApplyCachedPrices(true);
    });
  }

  // Auto-load cached prices on startup
  loadAndApplyCachedPrices(false);
}

function startDevPolling() {
  if (devPollInterval) clearInterval(devPollInterval);
  checkDevSyncStatus();
  devPollInterval = setInterval(checkDevSyncStatus, 1200);
}

async function checkDevSyncStatus() {
  if (devSyncActive) return;
  try {
    const res = await fetch('/api/sync-status');
    if (!res.ok) return;
    const { status, cachedInfo } = await res.json();

    const statusEl = document.getElementById('dev-progress-status');
    const countEl = document.getElementById('dev-progress-count');
    const fillEl = document.getElementById('dev-progress-bar-fill');
    const statUpdated = document.getElementById('dev-stat-updated');
    const statNotFound = document.getElementById('dev-stat-notfound');
    const statCached = document.getElementById('dev-stat-cached');
    const statDate = document.getElementById('dev-stat-date');
    const termLogs = document.getElementById('dev-terminal-logs');
    const tbody = document.getElementById('dev-diff-tbody');
    const btnStart = document.getElementById('btn-start-sync');
    const btnStop = document.getElementById('btn-stop-sync');

    if (statCached) statCached.textContent = cachedInfo.count || 0;
    if (statDate) {
      statDate.textContent = cachedInfo.lastUpdated 
        ? new Date(cachedInfo.lastUpdated).toLocaleDateString('pl-PL') + ' ' + new Date(cachedInfo.lastUpdated).toLocaleTimeString('pl-PL')
        : '—';
    }

    if (status.isRunning) {
      if (btnStart) btnStart.classList.add('hidden');
      if (btnStop) btnStop.classList.remove('hidden');
      if (statusEl) statusEl.textContent = `Парсинг: ${status.currentItem || 'Запрос к Ceneo...'}`;
    } else {
      if (btnStart) btnStart.classList.remove('hidden');
      if (btnStop) btnStop.classList.add('hidden');
      if (statusEl) {
        statusEl.textContent = status.total > 0 ? 'Парсинг завершён' : 'Готов к запуску';
      }
      if (devPollInterval && !status.isRunning && status.total > 0) {
        clearInterval(devPollInterval);
        devPollInterval = null;
      }
    }

    if (countEl) countEl.textContent = `${status.current} / ${status.total}`;
    if (fillEl) {
      const pct = status.total > 0 ? Math.round((status.current / status.total) * 100) : 0;
      fillEl.style.width = `${pct}%`;
    }

    if (statUpdated) statUpdated.textContent = status.updatedCount;
    if (statNotFound) statNotFound.textContent = status.notFoundCount;

    // Render terminal logs
    if (termLogs && status.logs && status.logs.length > 0) {
      termLogs.innerHTML = status.logs.map(l => `<div class="log-line">${escapeHtml(l)}</div>`).join('');
      termLogs.scrollTop = termLogs.scrollHeight;
    }

    // Render diff table
    if (tbody && status.results && status.results.length > 0) {
      tbody.innerHTML = status.results.map(r => {
        let diffClass = 'diff-neutral';
        let diffText = '0 zł';
        if (r.diff < 0) {
          diffClass = 'diff-negative';
          diffText = `${r.diff} zł ↓`;
        } else if (r.diff > 0) {
          diffClass = 'diff-positive';
          diffText = `+${r.diff} zł ↑`;
        }

        return `
          <tr>
            <td><strong>${escapeHtml(r.name)}</strong></td>
            <td><span class="slack-code-tag">${r.category}</span></td>
            <td>${r.oldPrice} zł</td>
            <td><strong>${r.newPrice} zł</strong></td>
            <td class="${diffClass}">${diffText}</td>
            <td><span class="slack-code-tag" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">${r.source || 'Auto'}</span></td>
            <td><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="dev-table-link">${r.source || 'Магазин'} ↗</a></td>
          </tr>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Error polling sync status:', err);
  }
}

async function loadAndApplyCachedPrices(showNotification = false) {
  try {
    let data = null;
    try {
      const res = await fetch('/api/cached-prices');
      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {}

    // Fallback: load static /data/prices_pl.json directly
    if (!data || !data.prices) {
      try {
        const staticRes = await fetch('/data/prices_pl.json');
        if (staticRes.ok) {
          data = await staticRes.json();
        }
      } catch (e) {}
    }

    if (!data || !data.prices) return;

    let appliedCount = 0;
    const ratePLN = EXCHANGE_RATES['PLN'] || 4.05;

    // Apply to PARTS_DATABASE
    CATEGORIES.forEach(cat => {
      const list = PARTS_DATABASE[cat] || [];
      list.forEach(part => {
        const cached = data.prices[part.id];
        if (cached && cached.pricePLN) {
          // Convert PLN back to base USD price so multi-currency works
          part.price = Math.round(cached.pricePLN / ratePLN);
          part.pricePLN = cached.pricePLN;
          if (cached.ceneoUrl || cached.url) {
            if (!part.buyLinks) part.buyLinks = {};
            part.buyLinks.ceneo = cached.ceneoUrl || cached.url;
          }
          appliedCount++;
        }
      });
    });

    if (appliedCount > 0) {
      console.log(`[Price Engine] Применено ${appliedCount} актуальных цен Morele и Ceneo.`);
      updateUI();
      if (showNotification) {
        showToast({
          title: 'Цены обновлены ✨',
          message: `Успешно актуализировано ${appliedCount} цен с Morele и Ceneo. Конфигуратор и альтернативы пересчитаны.`,
          type: 'success',
          duration: 4500
        });
      }
    }
  } catch (e) {
    console.warn('Could not load cached prices:', e.message);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


window.selectAltGPU = function(id) {
  const part = PARTS_DATABASE.gpu.find(p => p.id === id);
  if (part) {
    pushHistory();
    buildState.gpu = part;
    updateUI();
  }
};

window.selectPart = selectPart;

window.PARTS_DATABASE = PARTS_DATABASE;


// =============================================================
// PRO AI CHAT CONSULTANT CONTROLLER
// =============================================================

function initProChat() {
  const btnProChat = document.getElementById('btn-pro-chat');
  const proDrawer = document.getElementById('pro-chat-drawer');
  const proOverlay = document.getElementById('pro-chat-overlay');
  const proClose = document.getElementById('pro-chat-close');
  const proInput = document.getElementById('pro-chat-input');
  const proSendBtn = document.getElementById('pro-chat-send-btn');
  const proMessages = document.getElementById('pro-chat-messages');
  const quickPrompts = document.querySelectorAll('.pro-prompt-chip');

  if (!btnProChat || !proDrawer) return;

  const chatHistory = [];

  function openProChat() {
    proDrawer.classList.remove('hidden');
    proOverlay.classList.remove('hidden');
    if (proInput) proInput.focus();
  }

  function closeProChat() {
    proDrawer.classList.add('hidden');
    proOverlay.classList.add('hidden');
  }

  btnProChat.addEventListener('click', openProChat);
  if (proClose) proClose.addEventListener('click', closeProChat);
  if (proOverlay) proOverlay.addEventListener('click', closeProChat);

  // Quick Prompt Chips
  quickPrompts.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      if (proInput && promptText) {
        proInput.value = promptText;
        sendProMessage();
      }
    });
  });

  // Send message handler
  async function sendProMessage() {
    const text = proInput.value.trim();
    if (!text) return;

    // Append user message to UI
    appendMessage('user', text);
    proInput.value = '';
    proSendBtn.disabled = true;

    // Loading indicator
    const loadingId = appendLoadingBubble();

    try {
      chatHistory.push({ role: 'user', content: text });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.slice(-8), // send last 8 turns
          currentBuild: buildState,
          userPrompt: text
        })
      });

      const res = await response.json();
      removeLoadingBubble(loadingId);

      if (res.ok && res.data) {
        const aiData = res.data;
        chatHistory.push({ role: 'model', content: aiData.reply });

        // If AI recommended parts, apply them to buildState!
        let appliedSummary = [];
        if (aiData.selectedParts && typeof aiData.selectedParts === 'object') {
          const findP = (cat, id) => (PARTS_DATABASE[cat] || []).find(p => p.id === id);
          for (const cat in aiData.selectedParts) {
            const partId = aiData.selectedParts[cat];
            if (partId && PARTS_DATABASE[cat]) {
              const partObj = findP(cat, partId);
              if (partObj) {
                buildState[cat] = partObj;
                appliedSummary.push(partObj.name);
              }
            }
          }
          if (appliedSummary.length > 0) {
            updateUI();
          }
        }

        appendMessage('ai', aiData.reply, appliedSummary);
      } else {
        appendMessage('ai', res.error?.includes('GEMINI_API_KEY') 
          ? 'Для работы PRO-консультанта настройте переменную окружения `GEMINI_API_KEY` в панели Vercel (Project Settings -> Environment Variables) или в файле `gemini_config.json` локально.'
          : `Ошибка связи с Gemini Pro: ${res.error || 'Не удалось получить ответ'}`);
      }
    } catch (err) {
      removeLoadingBubble(loadingId);
      appendMessage('ai', 'Ошибка сети при обращении к AI-консультанту.');
    } finally {
      proSendBtn.disabled = false;
    }
  }

  if (proSendBtn) proSendBtn.addEventListener('click', sendProMessage);
  if (proInput) {
    proInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendProMessage();
      }
    });
  }

  function appendMessage(role, text, appliedParts = []) {
    const bubble = document.createElement('div');
    bubble.className = `pro-chat-bubble ${role}`;

    const avatar = role === 'ai' ? '🧠' : '👤';
    let partsBadge = '';
    if (appliedParts && appliedParts.length > 0) {
      partsBadge = `<div class="pro-build-applied-badge">⚡ Обновлено на схеме: ${appliedParts.length} комплектующих</div>`;
    }

    // Use our rich structured card formatter
    const formattedHtml = role === 'ai' 
      ? formatProChatMessage(text)
      : `<p class="pro-chat-paragraph">${escapeHtml(text)}</p>`;

    bubble.innerHTML = `
      <div class="pro-bubble-avatar">${avatar}</div>
      <div class="pro-bubble-content">
        ${formattedHtml}
        ${partsBadge}
      </div>
    `;

    proMessages.appendChild(bubble);
    proMessages.scrollTop = proMessages.scrollHeight;
  }

  function appendLoadingBubble() {
    const id = 'loading-' + Date.now();
    const bubble = document.createElement('div');
    bubble.id = id;
    bubble.className = 'pro-chat-bubble ai';
    bubble.innerHTML = `
      <div class="pro-bubble-avatar">🧠</div>
      <div class="pro-bubble-content">
        <p style="color: var(--text-muted); font-style: italic;">Gemini Pro думает и подбирает компоненты...</p>
      </div>
    `;
    proMessages.appendChild(bubble);
    proMessages.scrollTop = proMessages.scrollHeight;
    return id;
  }

  function removeLoadingBubble(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}

// PRO Chat & AI Synergy initialized in init()


// =============================================================
// RICH MARKDOWN & COMPONENT SPEC-CARD FORMATTER FOR PRO CHAT
// =============================================================

function formatProChatMessage(text) {
  if (!text) return '';
  
  // 1. Normalize line breaks (handle both actual newlines and literal \n sequences)
  let raw = text.replace(/\r\n/g, '\n').replace(/\\n/g, '\n');

  // 2. Category mapping for component spec cards
  const categoryIcons = [
    { regex: /^(?:\d+\.\s*)?\*\*(?:Процессор|CPU):?\*\*/i, icon: '💻', cat: 'CPU' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Материнская плата|Плата|Motherboard):?\*\*/i, icon: '🖲️', cat: 'MB' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Кулер|Охлаждение|Cooler):?\*\*/i, icon: '❄️', cat: 'COOLER' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Оперативная память|ОЗУ|RAM):?\*\*/i, icon: '⚡', cat: 'RAM' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Видеокарта|GPU):?\*\*/i, icon: '🎮', cat: 'GPU' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:SSD|Накопитель|SSD накопитель):?\*\*/i, icon: '🚀', cat: 'SSD' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:HDD|Жесткий диск):?\*\*/i, icon: '💾', cat: 'HDD' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Блок питания|БП|PSU):?\*\*/i, icon: '🔌', cat: 'PSU' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Корпус|Case):?\*\*/i, icon: '📦', cat: 'CASE' }
  ];

  function formatInline(str) {
    return escapeHtml(str)
      .replace(/\*\*(.*?)\*\*/g, '<strong class="pro-strong">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(\d+[\s\u00A0]?(?:–|-)\s?\d+[\s\u00A0]?(?:PLN|zł))|(\b\d+[\s\u00A0]?(?:PLN|zł)\b)/gi, '<span class="pro-price-tag">$1$2</span>');
  }

  const lines = raw.split('\n');
  const htmlParts = [];
  let inSpecList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inSpecList) {
        htmlParts.push('</div>');
        inSpecList = false;
      }
      continue;
    }

    // Headers (### Title or ## Title)
    const headerMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headerMatch) {
      if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
      htmlParts.push(`<h4 class="pro-chat-heading">${formatInline(headerMatch[1])}</h4>`);
      continue;
    }

    // Component spec item (1. **Процессор:** ...)
    let matchedCat = null;
    for (const c of categoryIcons) {
      if (c.regex.test(line)) {
        matchedCat = c;
        break;
      }
    }

    if (matchedCat) {
      if (!inSpecList) {
        htmlParts.push('<div class="pro-spec-grid">');
        inSpecList = true;
      }
      const cleanLine = line.replace(/^\d+\.\s*/, '');
      htmlParts.push(`
        <div class="pro-spec-card">
          <div class="pro-spec-icon-badge" title="${matchedCat.cat}">${matchedCat.icon}</div>
          <div class="pro-spec-body">${formatInline(cleanLine)}</div>
        </div>
      `);
      continue;
    }

    // Regular bullet list
    const bulletMatch = line.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
      htmlParts.push(`
        <div class="pro-bullet-item">
          <span class="pro-bullet-dot">•</span>
          <span class="pro-bullet-text">${formatInline(bulletMatch[1])}</span>
        </div>
      `);
      continue;
    }

    // Regular Paragraph
    if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
    htmlParts.push(`<p class="pro-chat-paragraph">${formatInline(line)}</p>`);
  }

  if (inSpecList) {
    htmlParts.push('</div>');
  }

  return htmlParts.join('\n');
}

// Initializer for the "Проверить сборку с AI" button
function initAiSynergyCheck() {
  const btnCheck = document.getElementById('btn-check-ai-synergy');
  if (!btnCheck) return;

  btnCheck.addEventListener('click', async () => {
    if (!buildState.cpu || !buildState.gpu) {
      showToast({
        title: 'Комплектующие не выбраны',
        message: 'Для проверки связки выберите процессор и видеокарту.',
        type: 'warning'
      });
      return;
    }

    const btnText = document.getElementById('btn-check-ai-text');
    const aiCard = document.getElementById('ai-synergy-verdict-card');
    const scoreBadge = document.getElementById('bottleneck-score-badge');
    const cpuBar = document.getElementById('bottleneck-bar-cpu');
    const gpuBar = document.getElementById('bottleneck-bar-gpu');
    const statusTag = document.getElementById('ai-verdict-status-tag');
    const commentaryEl = document.getElementById('ai-verdict-commentary');
    const fpsEl = document.getElementById('ai-verdict-fps');
    const resVal = (typeof selectedTargetRes !== 'undefined') ? selectedTargetRes : '1440p';

    btnCheck.disabled = true;
    if (btnText) btnText.innerHTML = '<span class="ai-spark-icon">⏳</span> Gemini анализирует баланс связки...';

    try {
      const response = await fetch('/api/ai-synergy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpu: buildState.cpu,
          gpu: buildState.gpu,
          motherboard: buildState.motherboard,
          ram: buildState.ram,
          resolution: resVal
        })
      });

      const res = await response.json();
      if (res.ok && res.data) {
        const ai = res.data;
        if (scoreBadge) scoreBadge.textContent = ai.score + '%';

        // Apply visual bars
        if (ai.score >= 90) {
          if (cpuBar) cpuBar.style.width = '50%';
          if (gpuBar) gpuBar.style.width = '50%';
          if (scoreBadge) {
            scoreBadge.style.color = '#10b981';
            scoreBadge.style.background = 'rgba(16, 185, 129, 0.15)';
          }
        } else if (ai.bottleneckType === 'cpu') {
          const gpuUsage = Math.max(10, (ai.score / 100) * 50);
          if (cpuBar) cpuBar.style.width = '50%';
          if (gpuBar) gpuBar.style.width = gpuUsage + '%';
          if (scoreBadge) {
            scoreBadge.style.color = '#f43f5e';
            scoreBadge.style.background = 'rgba(244, 63, 94, 0.15)';
          }
        } else {
          const cpuUsage = Math.max(10, (ai.score / 100) * 50);
          if (cpuBar) cpuBar.style.width = cpuUsage + '%';
          if (gpuBar) gpuBar.style.width = '50%';
          if (scoreBadge) {
            scoreBadge.style.color = '#f59e0b';
            scoreBadge.style.background = 'rgba(245, 158, 11, 0.15)';
          }
        }

        if (statusTag) statusTag.textContent = ai.status || 'Оптимально';
        if (commentaryEl) commentaryEl.textContent = ai.commentary || '';
        if (fpsEl) fpsEl.textContent = ai.fpsPotential || 'Высокая стабильность фреймрейта';
        if (aiCard) aiCard.classList.remove('hidden');

        if (btnText) btnText.innerHTML = '✓ Сборка проверена с AI';
        btnCheck.disabled = false;
      } else {
        showToast({
          title: 'Ошибка AI проверки',
          message: res.error || 'Не удалось получить вердикт от нейросети.',
          type: 'error'
        });
        if (btnText) btnText.textContent = 'Попробовать снова';
        btnCheck.disabled = false;
      }
    } catch (e) {
      showToast({
        title: 'Сетевая ошибка',
        message: 'Не удалось связаться с локальным сервером AI.',
        type: 'error'
      });
      if (btnText) btnText.textContent = 'Проверить сборку с AI';
      btnCheck.disabled = false;
    }
  });
}


// =============================================================
// HARDWARE ENCYCLOPEDIA & GUIDE MODAL
// =============================================================

function initHardwareGuide() {
  const btnGuide = document.getElementById('btn-hardware-guide');
  const footerBtnGuide = document.getElementById('footer-btn-guide');
  const modal = document.getElementById('hardware-guide-modal');
  const overlay = document.getElementById('hardware-guide-overlay');
  const closeBtn = document.getElementById('hardware-guide-close');

  if (!modal || !overlay) return;

  function openGuide() {
    modal.classList.remove('hidden');
    modal.classList.add('active');
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGuide() {
    modal.classList.add('hidden');
    modal.classList.remove('active');
    overlay.classList.add('hidden');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnGuide) btnGuide.addEventListener('click', openGuide);
  if (footerBtnGuide) footerBtnGuide.addEventListener('click', openGuide);
  if (closeBtn) closeBtn.addEventListener('click', closeGuide);
  overlay.addEventListener('click', closeGuide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeGuide();
    }
  });

  // Handle "Выбрать в каталоге →" buttons inside guide cards
  modal.querySelectorAll('.guide-quick-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-guide-cat');
      closeGuide();
      if (cat && typeof openDrawer === 'function') {
        setTimeout(() => openDrawer(cat), 150);
      }
    });
  });
}
