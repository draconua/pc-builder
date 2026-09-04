with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('data-i18n="dash.fps.title"', 'data-i18n="dash.fps"')
html = html.replace('data-i18n="dash.compat.title"', 'data-i18n="dash.compat"')
html = html.replace('data-i18n="dash.saved.title"', 'data-i18n="dash.saved"')
html = html.replace('data-i18n="badge.optional"', 'data-i18n="dash.progress.optional"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Fixed translation keys in index.html!")
