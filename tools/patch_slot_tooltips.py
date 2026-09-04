with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add id="main-stage" to <main class="stage-builder">
html = html.replace('<main class="stage-builder">', '<main class="stage-builder" id="main-stage">', 1)

# 2. Add question mark (?) tooltips to all slot cards
slot_hints = {
    'cat.cpu">Processor</span>': 'cat.cpu">Processor</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Вычислительный центр: обрабатывает команды, игровую логику, физику и сетевой код. Отвечает за стабильность 1% Low FPS.">?</span>',
    'cat.motherboard">Motherboard</span>': 'cat.motherboard">Motherboard</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Коммутационный хаб: связывает компоненты через шины PCIe/DMI, распределяет электропитание через фазы VRM и задает интерфейсы.">?</span>',
    'cat.cooler">Cooling</span>': 'cat.cooler">Cooling</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Отвод тепла: рассеивает тепло от кристалла CPU через теплотрубки или хладагент СЖО, предотвращая температурный троттлинг.">?</span>',
    'cat.ram">Memory</span>': 'cat.ram">Memory</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Оперативная память: хранит исполняемый машинный код и буферы активных сцен. Двухканальный режим (2 планки) удваивает ширину шины.">?</span>',
    'cat.gpu">Graphics Card</span>': 'cat.gpu">Graphics Card</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Графический процессор: выполняет шейдерные расчеты, полигональную геометрию, трассировку лучей и аппаратный апскейлинг (DLSS/FSR).">?</span>',
    'cat.ssd">SSD Drive</span>': 'cat.ssd">SSD Drive</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Скоростной NVMe накопитель: считывает данные до 7500 МБ/с по PCIe 4.0/5.0, исключая микрофризы и долгие загрузки локаций.">?</span>',
    'cat.hdd">Hard Drive</span>': 'cat.hdd">Hard Drive</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Электромеханический диск: энергонезависимый архив для длительного хранения медиафайлов и бэкапов с низкой ценой за 1 ТБ.">?</span>',
    'cat.psu">Power Supply</span>': 'cat.psu">Power Supply</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Импульсный источник питания: преобразует сетевые 220V в стабилизированные линии +12V, +5V и +3.3V. Сертификат 80+ Gold гарантирует надежность.">?</span>',
    'cat.case">Case</span>': 'cat.case">Case</span>\n              <span class="slot-info-hint" tabindex="0" data-tooltip="Шасси и аэродинамический контур: формирует сквозной воздушный поток через Mesh-панели, защищает от пыли и экранирует помехи.">?</span>',
}

for k, v in slot_hints.items():
    if k in html:
        html = html.replace(k, v, 1)
        print(f"Added tooltip to slot: {k[:15]}")
    else:
        print(f"Warning: {k[:15]} not found.")

# Add tooltip to Monitor panel header
old_mon = '<h3 data-i18n="dash.monitor.title">РЕКОМЕНДУЕМЫЙ МОНИТОР</h3>'
new_mon = '<h3 data-i18n="dash.monitor.title">РЕКОМЕНДУЕМЫЙ МОНИТОР</h3>\n            <span class="slot-info-hint" tabindex="0" data-tooltip="Устройство визуализации: частота развертки (Гц) определяет плавность движений, а матрица (IPS/OLED) — контраст и отклик пикселя.">?</span>'
if old_mon in html:
    html = html.replace(old_mon, new_mon, 1)
    print("Added tooltip to Monitor header.")

# 3. Update footer button to use id="btn-scroll-top"
old_scroll = '<a href="#main-stage" class="footer-link-action">↑ Наверх к сборке</a>'
new_scroll = '<button type="button" class="footer-link-action" id="btn-scroll-top">↑ Наверх к сборке</button>'
if old_scroll in html:
    html = html.replace(old_scroll, new_scroll, 1)
    print("Updated scroll top button in footer.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html tooltips and scroll-top successfully.")
