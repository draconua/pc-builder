with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace any corrupted text in btn-store-hub
import re
pattern = r'<button type="button" class="btn-store-hub slot-buy-link hidden"[^>]*>.*?</button>'
replacement = '<button type="button" class="btn-store-hub slot-buy-link hidden" title="Сравнить цены в магазинах"><span class="store-hub-icon">🏪</span><span class="store-hub-text" data-i18n="slot.comparePrices">Цены в магазинах</span><span class="store-hub-arrow">↗</span></button>'

html = re.sub(pattern, replacement, html, flags=re.DOTALL)

# Ensure clean analogs titles
html = re.sub(
    r'<span class="analogs-title"[^>]*>.*?</span>',
    '<span class="analogs-title" data-i18n="slot.gpu.analogs">Аналоги по мощности:</span>',
    html, count=1
)
html = html.replace(
    '<!-- GPU Analogs Box -->\n            <div class="analogs-box hidden" id="gpu-analogs-box">\n              <span class="analogs-title" data-i18n="slot.gpu.analogs">Аналоги по мощности:</span>',
    '<!-- GPU Analogs Box -->\n            <div class="analogs-box hidden" id="gpu-analogs-box">\n              <span class="analogs-title" data-i18n="slot.gpu.analogs">Аналоги по мощности:</span>'
)
html = html.replace(
    '<!-- CPU Analogs Box -->\n            <div class="analogs-box hidden" id="cpu-analogs-box">\n              <span class="analogs-title" data-i18n="slot.cpu.analogs">Альтернативы процессора:</span>',
    '<!-- CPU Analogs Box -->\n            <div class="analogs-box hidden" id="cpu-analogs-box">\n              <span class="analogs-title" data-i18n="slot.cpu.analogs">Альтернативы процессора:</span>'
)

# Replace retailers-modal with new framed panel structure and big close button
old_modal_pattern = r'<!-- MODAL: MULTI-RETAILER STORE AGGREGATOR -->.*?<!-- MODAL: SAVE BUILD -->'
new_modal_code = """<!-- MODAL: MULTI-RETAILER STORE AGGREGATOR -->
    <div id="retailers-modal" class="modal-overlay">
      <div class="modal-dialog modal-md geek-panel retailer-dialog">
        <div class="modal-header retailer-modal-header">
          <div class="retailer-modal-top">
            <div class="retailer-badge-row">
              <span class="slack-code-tag retailer-modal-badge">[ 🏪 MULTI_STORE_AGGREGATOR_v2026 ]</span>
              <span class="retailer-status-pill">● 8 МАГАЗИНОВ ОНЛАЙН</span>
            </div>
            <h3 id="retailer-modal-part-name" class="retailer-modal-product-title">Где купить деталь</h3>
            <div class="retailer-modal-meta">
              <span id="retailer-modal-price" class="retailer-est-price">-- zł</span>
              <div id="retailer-modal-specs"></div>
            </div>
          </div>
          <button type="button" class="retailer-modal-close-btn" id="retailers-modal-close" title="Закрыть">✕</button>
        </div>
        <div class="modal-body retailer-modal-body">
          <p class="retailer-sub-hint" data-i18n="store.modal.hint">Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:</p>
          
          <!-- Framed Deck Panel -->
          <div class="retailers-deck-frame">
            <div class="deck-frame-header">
              <span class="deck-frame-title">[ КАТАЛОГ МАГАЗИНОВ С ПРЯМЫМ ПОИСКОМ ]</span>
              <span class="deck-frame-badge">1-CLICK JUMP ↗</span>
            </div>
            <div class="retailer-grid" id="retailer-grid">
              <!-- 8 store cards -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- MODAL: SAVE BUILD -->"""

html = re.sub(old_modal_pattern, new_modal_code, html, flags=re.DOTALL)

# Bump script cache-buster to v5
html = re.sub(r'src="js/app\.js\?v=[^"]+"', 'src="js/app.js?v=20260903_v5"', html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with clean Russian text, new retailer deck frame, and cache-buster v5!")
