import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

cyrillic_lines = []
for idx, line in enumerate(html.splitlines(), 1):
    if re.search(r'[\u0400-\u04FF]', line) and 'data-i18n' not in line:
        cyrillic_lines.append((idx, line.strip()))

with open("untranslated_html.txt", "w", encoding="utf-8") as out:
    for idx, l in cyrillic_lines:
        out.write(f"L{idx}: {l}\n")

print(f"Written {len(cyrillic_lines)} lines to untranslated_html.txt")

with open("js/app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

app_cyrillic = []
for idx, line in enumerate(app_js.splitlines(), 1):
    if re.search(r'[\u0400-\u04FF]', line) and 't(' not in line and '//' not in line:
        app_cyrillic.append((idx, line.strip()))

with open("untranslated_app.txt", "w", encoding="utf-8") as out:
    for idx, l in app_cyrillic:
        out.write(f"L{idx}: {l}\n")

print(f"Written {len(app_cyrillic)} lines to untranslated_app.txt")
