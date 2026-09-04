import re
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

categories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor']

for cat in categories:
    # If the analogs box doesn't exist for this category
    if f'id="{cat}-analogs-box"' not in html:
        # Find the end of the slot-selected div
        regex = rf'(<div class="slot-card" data-category="{cat}" id="slot-{cat}">[\s\S]*?<div class="slot-selected hidden">[\s\S]*?<\/div>)'
        match = re.search(regex, html)
        if match:
            original = match.group(1)
            box = f"""
            <!-- {cat.upper()} Analogs Box -->
            <div class="analogs-box hidden" id="{cat}-analogs-box">
              <span class="analogs-title" data-i18n="slot.{cat}.analogs">Альтернативы:</span>
              <div class="analogs-list" id="{cat}-analogs-list"></div>
            </div>"""
            html = html.replace(original, original + box)

# Wait, cpu and gpu already have them, we should just make sure their data-i18n keys are uniform.
html = re.sub(r'data-i18n="slot\.cpu\.analogs">[^<]+<', 'data-i18n="slot.cpu.analogs">Альтернативы:<', html)
html = re.sub(r'data-i18n="slot\.gpu\.analogs">[^<]+<', 'data-i18n="slot.gpu.analogs">Альтернативы:<', html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Injected analogs boxes into all slots.")
