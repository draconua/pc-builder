import re
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the plain text with data-i18n
html = re.sub(
    r'<button id="btn-auto-builder" class="auto-builder-pill" type="button">\s*✨ Умный авто-подбор\s*<\/button>',
    '<button id="btn-auto-builder" class="auto-builder-pill" type="button" data-i18n="autobuild.title">✨ Умный авто-подбор</button>',
    html
)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Added data-i18n to btn-auto-builder")
