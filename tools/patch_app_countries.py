with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

import re

# 1. Update imports
js = re.sub(
    r"import \{ PARTS_DATABASE, PRESETS as _RAW_PRESETS, CATEGORIES.*\} from '\./data\.js\?v=[^']+';",
    "import { PARTS_DATABASE, PRESETS as _RAW_PRESETS, CATEGORIES, COUNTRIES, RETAILERS_BY_COUNTRY } from './data.js?v=20260903_v6';",
    js
)
js = re.sub(r"from '\./compatibility\.js\?v=[^']+'", "from './compatibility.js?v=20260903_v6'", js)
js = re.sub(r"from '\./i18n\.js\?v=[^']+'", "from './i18n.js?v=20260903_v6'", js)
js = re.sub(r"from '\./storage\.js\?v=[^']+'", "from './storage.js?v=20260903_v6'", js)
js = re.sub(r"from '\./performance\.js\?v=[^']+'", "from './performance.js?v=20260903_v6'", js)

# 2. State for active country
js = js.replace(
    "let currentDrawerFilter = 'all';",
    "let currentDrawerFilter = 'all';\nlet currentStoreCountry = localStorage.getItem('pc-builder-store-country') || 'pl';"
)

# 3. Complete rewrite of openRetailersModal with country switching
old_modal_func_pattern = r'function openRetailersModal\(part\) \{.*?modal\.classList\.add\(\'active\'\);\s*\}'

new_modal_func = """function openRetailersModal(part) {
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
}"""

js = re.sub(old_modal_func_pattern, new_modal_func, js, flags=re.DOTALL)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated app.js with dynamic multi-country switcher (6 countries) and country persistence!")
