import re

with open("js/app.js", "r", encoding="utf-8") as f:
    appjs = f.read()

# Find updateTranslations
match = re.search(r'function updateTranslations\(\) \{([\s\S]*?)\}', appjs)
if match:
    func_body = match.group(1)
    if 'data-i18n-placeholder' not in func_body:
        new_logic = """
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key);
  });
"""
        new_func_body = func_body + new_logic
        appjs = appjs.replace(match.group(0), f'function updateTranslations() {{{new_func_body}}}')
        with open("js/app.js", "w", encoding="utf-8") as f:
            f.write(appjs)
        print("Patched updateTranslations in app.js for placeholders.")
    else:
        print("Already has placeholder logic.")
else:
    print("Could not find updateTranslations in app.js")
