with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

import re
# 1. Update imports to v5
js = re.sub(r"from '\./data\.js\?v=[^']+'", "from './data.js?v=20260903_v5'", js)
js = re.sub(r"from '\./compatibility\.js\?v=[^']+'", "from './compatibility.js?v=20260903_v5'", js)
js = re.sub(r"from '\./i18n\.js\?v=[^']+'", "from './i18n.js?v=20260903_v5'", js)
js = re.sub(r"from '\./storage\.js\?v=[^']+'", "from './storage.js?v=20260903_v5'", js)
js = re.sub(r"from '\./performance\.js\?v=[^']+'", "from './performance.js?v=20260903_v5'", js)

# 2. In updateTranslations, ensure safe fallbacks
old_up_trans = """  // Update store hub button texts
  document.querySelectorAll('.store-hub-text').forEach(el => {
    el.textContent = t('slot.comparePrices') || 'Цены в магазинах';
  });"""

new_up_trans = """  // Update store hub button texts
  document.querySelectorAll('.store-hub-text').forEach(el => {
    const text = t('slot.comparePrices');
    el.textContent = (text && !text.includes('.')) ? text : 'Цены в магазинах';
  });"""

js = js.replace(old_up_trans, new_up_trans)

# 3. Ensure close button event listener for #retailers-modal-close
js = js.replace(
    "const retClose = document.getElementById('retailers-modal-close');",
    "const retClose = document.getElementById('retailers-modal-close');"
)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated app.js with v5 cache-busters and robust translation text setting!")
