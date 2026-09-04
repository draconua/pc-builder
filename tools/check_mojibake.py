with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
corrupted = re.findall(r'[^\x00-\x7F\u0400-\u04FF\s<>=/"\'\-.:;,!?_()#%*+0-9[\]{}~`&]+', html)
print("Non-standard / corrupted characters in index.html:", len(corrupted), set(corrupted)[:10] if corrupted else "NONE")

# Check lines with question marks like ??" or ?
mojibake_lines = []
for idx, line in enumerate(html.splitlines(), 1):
    if '' in line or '?' in line and any(c in line for c in ['class', 'data-i18n', 'button', 'span', 'h1', 'h2', 'h3']):
        mojibake_lines.append((idx, line.strip()))

print(f"Lines with possible mojibake: {len(mojibake_lines)}")
for idx, l in mojibake_lines[:15]:
    print(f"L{idx}: {l}")
