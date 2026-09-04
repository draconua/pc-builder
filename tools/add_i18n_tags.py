import json
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

replacements = [
    (r'<title>.*?<\/title>', r'<title data-i18n="meta.title">PC Builder 2026 — Профессиональный конфигуратор ПК</title>'),
    (r'id="btn-auto-builder"[^>]*>(\s*)<span class="auto-builder-pill"[^>]*>✨ Умный авто-подбор<\/span>', r'id="btn-auto-builder" title="Умный авто-подбор">\1<span class="auto-builder-pill" data-i18n="autobuild.title">✨ Умный авто-подбор</span>'),
    (r'<span class="field-title">Желаемый бюджет:<\/span>', r'<span class="field-title" data-i18n="autobuild.budget">Желаемый бюджет:</span>'),
    (r'<span class="budget-buffer-badge">допуск \+5%<\/span>', r'<span class="budget-buffer-badge" data-i18n="autobuild.buffer">допуск +5%</span>'),
    (r'<span class="field-title">Платформа процессора:<\/span>', r'<span class="field-title" data-i18n="autobuild.cpuPlatform">Платформа процессора:</span>'),
    (r'<button type="button" class="choice-chip active" data-cpu="all">Все<\/button>', r'<button type="button" class="choice-chip active" data-cpu="all" data-i18n="drawer.filter.all">Все</button>'),
    (r'<span class="field-title">Платформа видеокарты:<\/span>', r'<span class="field-title" data-i18n="autobuild.gpuPlatform">Платформа видеокарты:</span>'),
    (r'<button type="button" class="choice-chip active" data-gpu="all">Все<\/button>', r'<button type="button" class="choice-chip active" data-gpu="all" data-i18n="drawer.filter.all">Все</button>'),
    (r'<span class="field-title">Целевой гейминг:<\/span>', r'<span class="field-title" data-i18n="autobuild.purpose">Целевой гейминг:</span>'),
    (r'<button type="button" class="popover-action-btn" id="auto-build-confirm-btn">Собрать конфигурацию ✨<\/button>', r'<button type="button" class="popover-action-btn" id="auto-build-confirm-btn" data-i18n="autobuild.submit">Собрать конфигурацию ✨</button>'),
    (r'<button type="button" class="preset-btn" data-preset="budget">Бюджетная<\/button>', r'<button type="button" class="preset-btn" data-preset="budget" data-i18n="preset.budget">Бюджетная</button>'),
    (r'<button type="button" class="preset-btn" data-preset="balanced">Оптимальная<\/button>', r'<button type="button" class="preset-btn" data-preset="balanced" data-i18n="preset.balanced">Оптимальная</button>'),
    (r'<button type="button" class="preset-btn" data-preset="ultimate">Топовая<\/button>', r'<button type="button" class="preset-btn" data-preset="ultimate" data-i18n="preset.ultimate">Топовая</button>'),
    (r'<div class="progress-sub" id="progress-sub">компонентов<\/div>', r'<div class="progress-sub" id="progress-sub" data-i18n="dash.progress.components">компонентов</div>'),
    (r'<div class="power-sub" id="power-limit-text">БП не выбран<\/div>', r'<div class="power-sub" id="power-limit-text" data-i18n="dash.psu.none">БП не выбран</div>'),
    (r'<span class="schematic-title">СХЕМА СБОРКИ \(ИНТЕРАКТИВНАЯ\)<\/span>', r'<span class="schematic-title" data-i18n="dash.visualizer.title">СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)</span>'),
    (r'<span class="bottleneck-side-label">Баланс и синергия системы<\/span>', r'<span class="bottleneck-side-label" data-i18n="dash.bottleneck">Баланс и синергия системы</span>'),
    (r'<h2>Детальная аналитика системы<\/h2>', r'<h2 data-i18n="dash.analytics.title">Детальная аналитика системы</h2>'),
    (r'<p>Игровой потенциал во всех разрешениях, совместимость стандартов и сохранённые сборки<\/p>', r'<p data-i18n="dash.analytics.desc">Игровой потенциал во всех разрешениях, совместимость стандартов и сохранённые сборки</p>'),
    (r'<span class="fps-benchmark-note">Ультра настройки • Без генерации кадров<\/span>', r'<span class="fps-benchmark-note" data-i18n="dash.benchmarks.subtitle">Ультра настройки • Без генерации кадров</span>'),
    (r'<th class="col-game">Игра \/ Жанр<\/th>', r'<th class="col-game" data-i18n="dash.fps.game">Игра / Жанр</th>'),
    (r'<div class="drawer-parts-count" id="drawer-parts-count">0 доступно<\/div>', r'<div class="drawer-parts-count" id="drawer-parts-count">0 <span data-i18n="drawer.available">доступно</span></div>'),
    (r'placeholder="Поиск по названию, сокету, характеристикам\.\.\."', r'placeholder="Поиск по названию, сокету, характеристикам..." data-i18n-placeholder="drawer.search"'),
    (r'<button type="button" class="geek-sort-chip active" data-sort="default">⚡ Топ продаж<\/button>', r'<button type="button" class="geek-sort-chip active" data-sort="default" data-i18n="drawer.sort.popular">⚡ Топ продаж</button>'),
    (r'<button type="button" class="geek-sort-chip" data-sort="price-asc">💰 Дешевле<\/button>', r'<button type="button" class="geek-sort-chip" data-sort="price-asc" data-i18n="drawer.sort.priceAsc">💰 Дешевле</button>'),
    (r'<button type="button" class="geek-sort-chip" data-sort="price-desc">💎 Мощнее<\/button>', r'<button type="button" class="geek-sort-chip" data-sort="price-desc" data-i18n="drawer.sort.priceDesc">💎 Мощнее</button>'),
    (r'<span id="compat-toggle-label">Совместимые: ВКЛ<\/span>', r'<span id="compat-toggle-label" data-i18n="drawer.compat.on">Совместимые: ВКЛ</span>'),
    (r'<h3 id="retailer-modal-part-name">Где купить деталь<\/h3>', r'<h3 id="retailer-modal-part-name" data-i18n="store.modal.title">Где купить деталь</h3>'),
    (r'<span class="deck-frame-title">\[ КАТАЛОГ МАГАЗИНОВ С ПРЯМЫМ ПОИСКОМ \]<\/span>', r'<span class="deck-frame-title" data-i18n="store.modal.catalog">\[ КАТАЛОГ МАГАЗИНОВ С ПРЯМЫМ ПОИСКОМ \]</span>'),
    (r'placeholder="Мой игровой ПК 2026"', r'placeholder="Мой игровой ПК 2026" data-i18n-placeholder="modal.save.placeholder"'),
    (r'<button id="export-modal-ok">Закрыть<\/button>', r'<button id="export-modal-ok" data-i18n="action.cancel">Закрыть</button>'),
]

for old, new in replacements:
    html = re.sub(old, new, html)

# Fix action buttons with spans
action_btns = {
    'btn-clear': 'action.clear',
    'btn-save': 'action.save',
    'btn-compare': 'action.compare',
    'btn-timelapse': 'action.timelapse',
    'btn-export': 'action.export',
    'btn-share': 'action.share'
}
for btn_id, key in action_btns.items():
    html = re.sub(rf'<button[^>]*id="{btn_id}"[^>]*>([\s\S]*?)<span>(.*?)<\/span>([\s\S]*?)<\/button>', 
                  rf'<button type="button" class="btn-tool" id="{btn_id}">\1<span data-i18n="{key}">\2</span>\3</button>', 
                  html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html with new data-i18n tags.")
