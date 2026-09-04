with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update Drawer controls to Geek design
old_drawer_controls = """      <div class="drawer-controls">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="parts-search" placeholder="Поиск по названию или бренду...">
        </div>
        <div class="drawer-filters">
          <select id="sort-select" class="control-select">
            <option value="price-asc" data-i18n="sort.priceAsc">Сначала дешевле</option>
            <option value="price-desc" data-i18n="sort.priceDesc">Сначала дороже</option>
            <option value="name" data-i18n="sort.name">По имени</option>
          </select>
          <label class="filter-checkbox-label">
            <input type="checkbox" id="filter-compat" checked>
            <span data-i18n="filter.compatOnly">Только совместимые</span>
          </label>
        </div>
      </div>"""

new_drawer_controls = """      <div class="drawer-controls geek-drawer-controls">
        <div class="search-input-wrapper geek-search-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="parts-search" placeholder="Поиск по названию, сокету, характеристикам...">
          <kbd class="geek-kbd">Ctrl+K</kbd>
          <button id="search-clear-btn" class="search-clear-btn hidden" title="Очистить">×</button>
        </div>

        <!-- Dynamic Brand & Platform Filter Chips -->
        <div class="drawer-brand-chips" id="drawer-brand-chips">
          <!-- Populated dynamically per category -->
        </div>

        <div class="drawer-filters geek-filters-bar">
          <div class="geek-sort-group" id="drawer-sort-group">
            <button type="button" class="geek-sort-chip active" data-sort="default">⚡ Топ продаж</button>
            <button type="button" class="geek-sort-chip" data-sort="price-asc">💰 Дешевле</button>
            <button type="button" class="geek-sort-chip" data-sort="price-desc">💎 Мощнее</button>
          </div>
          
          <button type="button" class="geek-compat-toggle active" id="btn-toggle-compat">
            <span class="led-dot"></span>
            <span id="compat-toggle-label">Совместимые: ВКЛ</span>
          </button>
          <input type="checkbox" id="filter-compat" checked style="display: none;">
          <select id="sort-select" style="display: none;"><option value="price-asc">asc</option></select>
        </div>
      </div>"""

html = html.replace(old_drawer_controls, new_drawer_controls)

# 2. Add Retailers Popover Modal right before script tag
retailers_modal = """
    <!-- MODAL: MULTI-RETAILER STORE AGGREGATOR -->
    <div id="retailers-modal" class="modal-overlay">
      <div class="modal-dialog modal-md geek-panel">
        <div class="modal-header">
          <div class="retailer-modal-header-info">
            <span class="slack-code-tag">[ STORE_AGGREGATOR_v2026 ]</span>
            <h3 id="retailer-modal-part-name">Где купить компонент</h3>
          </div>
          <button class="modal-close" id="retailers-modal-close">×</button>
        </div>
        <div class="modal-body">
          <p class="retailer-sub-hint">Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:</p>
          <div class="retailer-grid" id="retailer-grid">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    </div>
"""

html = html.replace('<!-- MODAL: SAVE BUILD -->', retailers_modal + '\n    <!-- MODAL: SAVE BUILD -->')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with Geek Drawer Controls and Retailers Modal!")
