import re
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

hints = {
    'cpu': 'Для гейминга отлично подойдут <b>Ryzen 5 9600X</b> или <b>Core i5-14600K</b>.',
    'motherboard': 'Убедитесь, что чипсет подходит под задачи (B650/Z790 — оптимальны).',
    'cooler': 'Воздушный для бюджеток, жидкостный (AIO) для мощных процессоров.',
    'ram': 'Рекомендуется <b>32GB DDR5</b> с частотой 6000MHz.',
    'gpu': 'Для 1440p отличным выбором станет <b>RTX 4070 SUPER</b>.',
    'ssd': 'Под систему берите быстрый NVMe M.2 накопитель от 1TB.',
    'hdd': 'Жесткий диск полезен только для архивов и медиа (файлопомойка).',
    'psu': 'Берем с запасом 20-30% от мощности системы. <b>ATX 3.0</b> для новых RTX.',
    'case': 'Обращайте внимание на продуваемость (Mesh-панели).',
    'monitor': 'Высокая герцовка (144Hz+) обязательна для гейминга.'
}

for cat, hint in hints.items():
    # Find the slot-placeholder
    regex = rf'<p class="slot-placeholder" data-i18n="slot\.{cat}\.hint">([^<]+)<\/p>'
    html = re.sub(regex, rf'<p class="slot-placeholder" data-i18n="slot.{cat}.hint">\1</p><p class="slot-hint-text hidden">{hint}</p>', html)

# CSS for slot-hint-text
css = """
.slot-hint-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
  line-height: 1.4;
  border-left: 2px solid var(--border);
  padding-left: 0.5rem;
}
.slot-card:not(.filled) .slot-hint-text {
  display: block !important;
}
.slot-card.filled .slot-hint-text {
  display: none !important;
}
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open("css/style.css", "a", encoding="utf-8") as f:
    f.write("\n" + css)
    
print("Added mini-hints to empty slots.")
