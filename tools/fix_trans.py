with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

old_trans = """  // Re-translate document title and taglines
  document.querySelector('.header h1').textContent = t('app.title');
  document.querySelector('.subtitle').textContent = t('app.subtitle');"""

new_trans = """  // Re-translate document title and taglines
  const titleEl = document.querySelector('.brand-title, .header h1');
  if (titleEl) titleEl.innerHTML = `${t('app.title')} <span class="brand-badge">2026</span>`;
  const subEl = document.querySelector('.subtitle');
  if (subEl) subEl.textContent = t('app.subtitle');"""

js = js.replace(old_trans, new_trans)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Fixed updateTranslations to support new modern header!")
