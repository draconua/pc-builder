import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# find Cyrillic strings in index.html without data-i18n
cyrillic_lines = []
for idx, line in enumerate(html.splitlines(), 1):
    if re.search(r'[\u0400-\u04FF]', line) and 'data-i18n' not in line:
        cyrillic_lines.append((idx, line.strip()))

print(f"Found {len(cyrillic_lines)} Cyrillic lines without data-i18n in index.html:")
for idx, l in cyrillic_lines[:25]:
    print(f"L{idx}: {l}")
