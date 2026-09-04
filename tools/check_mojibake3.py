with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

mojibake_lines = []
for idx, line in enumerate(html.splitlines(), 1):
    if '?' in line and any(c in line for c in ['class', 'data-i18n', 'button', 'span', 'h1', 'h2', 'h3']):
        mojibake_lines.append((idx, line.strip()))

with open("mojibake_report.txt", "w", encoding="utf-8") as out:
    out.write(f"Lines with question mark: {len(mojibake_lines)}\n")
    for idx, l in mojibake_lines:
        out.write(f"L{idx}: {l}\n")

print("Report written successfully!")
