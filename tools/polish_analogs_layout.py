# 1. Update i18n.js
with open("js/i18n.js", "r", encoding="utf-8") as f:
    js = f.read()

categories = ['motherboard', 'cooler', 'ram', 'ssd', 'hdd', 'psu', 'case']

ru_additions = "\n".join([f"    'slot.{cat}.analogs': 'Альтернативы:'," for cat in categories])
en_additions = "\n".join([f"    'slot.{cat}.analogs': 'Alternatives:'," for cat in categories])
pl_additions = "\n".join([f"    'slot.{cat}.analogs': 'Alternatywy:'," for cat in categories])
ua_additions = "\n".join([f"    'slot.{cat}.analogs': 'Альтернативи:'," for cat in categories])

js = js.replace("ru: {", "ru: {\n" + ru_additions)
js = js.replace("en: {", "en: {\n" + en_additions)
js = js.replace("pl: {", "pl: {\n" + pl_additions)
js = js.replace("ua: {", "ua: {\n" + ua_additions)

with open("js/i18n.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Added all slot.*.analogs i18n keys.")

# 2. Update index.html: move analogs-box to be direct child of slot-card (after slot-actions)
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

all_cats = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case']
for cat in all_cats:
    # Find analogs box inside this slot-card
    box_pattern = rf'(<!--\s*[A-Z0-9_\.\s]+\s*Analogs Box\s*-->\s*<div class="analogs-box hidden" id="{cat}-analogs-box">[\s\S]*?<\/div>\s*<\/div>)'
    # Note: the inner div is analogs-list, then closing analogs-box
    match = re.search(box_pattern, html)
    if match:
        box_code = match.group(1)
        # Remove from inside slot-body
        html = html[:match.start()] + html[match.end():]
        
        # Now find the end of slot-actions for this card
        card_start = html.find(f'id="slot-{cat}"')
        actions_pos = html.find('<div class="slot-actions">', card_start)
        actions_end = html.find('</div>', actions_pos) + len('</div>')
        
        # Insert box_code right after slot-actions
        html = html[:actions_end] + "\n          " + box_code + html[actions_end:]

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Moved analogs boxes to bottom of slot cards in index.html.")

# 3. Update style.css for full-width horizontal analog chip layout
with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

analogs_polish_css = """
/* Full-width Horizontal Analogs Row */
.slot-card {
  flex-wrap: wrap !important;
}

.slot-body {
  flex: 1 1 200px !important;
  min-width: 0 !important;
}

.slot-actions {
  flex-shrink: 0 !important;
}

.analogs-box {
  width: 100% !important;
  margin-top: 0.6rem !important;
  padding: 0.45rem 0.75rem !important;
  background: var(--bg-subtle) !important;
  border-radius: 8px !important;
  border: 1px dashed var(--border) !important;
  box-sizing: border-box !important;
}

.analogs-list {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
  gap: 0.4rem !important;
}

.analog-chip-btn {
  white-space: nowrap !important;
  font-family: var(--font-sans) !important;
  font-size: 0.74rem !important;
  font-weight: 600 !important;
  padding: 0.26rem 0.6rem !important;
  border-radius: 6px !important;
  border: 1px solid var(--border) !important;
  background: var(--surface) !important;
  color: var(--text-primary) !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.45rem !important;
  transition: all 0.15s var(--ease) !important;
}

.analog-chip-btn:hover {
  background: #3b82f6 !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 8px rgba(59, 130, 246, 0.25) !important;
}

.analog-chip-btn:hover strong,
.analog-chip-btn:hover span {
  color: #ffffff !important;
}

.analog-chip-price {
  font-family: var(--font-mono) !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  color: #10b981 !important;
}
"""

css = css + "\n" + analogs_polish_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with full-width horizontal analog layout.")
