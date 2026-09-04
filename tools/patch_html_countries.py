with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

target = '<p class="retailer-sub-hint" data-i18n="store.modal.hint">Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:</p>'

replacement = """<p class="retailer-sub-hint" data-i18n="store.modal.hint">Выберите страну и магазин для перехода к актуальным ценам:</p>
          
          <!-- Country Selector Tabs -->
          <div class="retailer-country-tabs" id="retailer-country-tabs"></div>"""

html = html.replace(target, replacement)

# Bump version to v6
import re
html = re.sub(r'src="js/app\.js\?v=[^"]+"', 'src="js/app.js?v=20260903_v6"', html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with country tabs container and bumped script to v6!")
