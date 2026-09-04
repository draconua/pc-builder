with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Replace old slot-buy-link
old_buy_link = """<a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>"""
new_buy_link = """<button type="button" class="btn-store-hub slot-buy-link hidden" title="Сравнить цены в магазинах"><span class="store-hub-icon">🏪</span><span class="store-hub-text" data-i18n="slot.comparePrices">Цены в магазинах</span><span class="store-hub-arrow">↗</span></button>"""

html = html.replace(old_buy_link, new_buy_link)

# 2. Add data-i18n to CPU and GPU Analogs titles
html = html.replace(
    '<span class="analogs-title">Альтернативы процессора:</span>',
    '<span class="analogs-title" data-i18n="slot.cpu.analogs">Альтернативы процессора:</span>'
)
html = html.replace(
    '<span class="analogs-title">Аналоги по мощности:</span>',
    '<span class="analogs-title" data-i18n="slot.gpu.analogs">Аналоги по мощности:</span>'
)

# 3. Add data-i18n to schematic title
html = html.replace(
    '<span class="schematic-title">СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)</span>',
    '<span class="schematic-title" data-i18n="dash.visualizer.title">СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)</span>'
)

# 4. Redesign Retailers Modal structure
old_modal = """    <!-- MODAL: MULTI-RETAILER STORE AGGREGATOR -->
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
    </div>"""

new_modal = """    <!-- MODAL: MULTI-RETAILER STORE AGGREGATOR -->
    <div id="retailers-modal" class="modal-overlay">
      <div class="modal-dialog modal-md geek-panel">
        <div class="modal-header">
          <div class="retailer-modal-top">
            <span class="slack-code-tag retailer-modal-badge">[ 🏪 MULTI_STORE_AGGREGATOR_v2026 ]</span>
            <h3 id="retailer-modal-part-name" class="retailer-modal-product-title">Где купить деталь</h3>
            <div class="retailer-modal-meta">
              <span id="retailer-modal-price" class="retailer-est-price">-- zł</span>
              <div id="retailer-modal-specs"></div>
            </div>
          </div>
          <button class="modal-close" id="retailers-modal-close">×</button>
        </div>
        <div class="modal-body">
          <p class="retailer-sub-hint" data-i18n="store.modal.hint">Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:</p>
          <div class="retailer-grid" id="retailer-grid">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    </div>"""

html = html.replace(old_modal, new_modal)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with new store hub buttons and redesigned retailer modal!")
