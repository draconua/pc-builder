import re

with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

categories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor']
icons = {}
for cat in categories:
    m = re.search(rf'data-category="{cat}"[^>]*>.*?<span class="slot-category-icon">\s*(<svg.*?</svg>)\s*</span>', text, re.DOTALL)
    if m:
        icons[cat] = m.group(1)
    else:
        icons[cat] = ""
    print(cat, "icon found:", bool(icons[cat]))

import json
with open("icons.json", "w", encoding="utf-8") as f:
    json.dump(icons, f)
