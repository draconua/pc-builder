import json

with open("js/i18n.js", "r", encoding="utf-8") as f:
    js = f.read()

# Add new keys to translations object.
# We'll inject them at the beginning of the 'ru', 'en', 'pl', 'ua' objects.
new_ru = """
    'meta.title': 'PC Builder 2026 — Профессиональный конфигуратор ПК',
    'autobuild.title': '✨ Умный авто-подбор',
    'autobuild.budget': 'Желаемый бюджет:',
    'autobuild.buffer': 'допуск +5%',
    'autobuild.cpuPlatform': 'Платформа процессора:',
    'drawer.filter.all': 'Все',
    'autobuild.gpuPlatform': 'Платформа видеокарты:',
    'autobuild.purpose': 'Целевой гейминг:',
    'autobuild.submit': 'Собрать конфигурацию ✨',
    'dash.progress.components': 'компонентов',
    'dash.psu.none': 'БП не выбран',
    'dash.visualizer.title': 'СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)',
    'dash.bottleneck': 'Баланс и синергия системы',
    'dash.bottleneck.balanced': 'Идеальный баланс (Золотой стандарт)',
    'dash.analytics.title': 'Детальная аналитика системы',
    'dash.analytics.desc': 'Игровой потенциал во всех разрешениях, совместимость стандартов и сохранённые сборки',
    'dash.benchmarks.subtitle': 'Ультра настройки • Без генерации кадров',
    'dash.fps.game': 'Игра / Жанр',
    'drawer.available': 'доступно',
    'drawer.search': 'Поиск по названию, сокету, характеристикам...',
    'drawer.sort.popular': '⚡ Топ продаж',
    'drawer.sort.priceAsc': '💰 Дешевле',
    'drawer.sort.priceDesc': '💎 Мощнее',
    'drawer.compat.on': 'Совместимые: ВКЛ',
    'store.modal.title': 'Где купить деталь',
    'store.modal.catalog': '[ КАТАЛОГ МАГАЗИНОВ С ПРЯМЫМ ПОИСКОМ ]',
    'modal.save.placeholder': 'Мой игровой ПК 2026',
"""

new_en = """
    'meta.title': 'PC Builder 2026 — Professional PC Configurator',
    'autobuild.title': '✨ Smart Auto-Build',
    'autobuild.budget': 'Target Budget:',
    'autobuild.buffer': '+5% buffer',
    'autobuild.cpuPlatform': 'CPU Platform:',
    'drawer.filter.all': 'All',
    'autobuild.gpuPlatform': 'GPU Platform:',
    'autobuild.purpose': 'Target Gaming:',
    'autobuild.submit': 'Build Configuration ✨',
    'dash.progress.components': 'components',
    'dash.psu.none': 'No PSU Selected',
    'dash.visualizer.title': 'ASSEMBLY SCHEMATIC (INTERACTIVE)',
    'dash.bottleneck': 'System Balance & Synergy',
    'dash.bottleneck.balanced': 'Perfect Balance (Gold Standard)',
    'dash.analytics.title': 'Detailed System Analytics',
    'dash.analytics.desc': 'Gaming potential across all resolutions, standard compatibility, and saved builds',
    'dash.benchmarks.subtitle': 'Ultra Settings • No Frame Generation',
    'dash.fps.game': 'Game / Genre',
    'drawer.available': 'available',
    'drawer.search': 'Search by name, socket, specs...',
    'drawer.sort.popular': '⚡ Top Sellers',
    'drawer.sort.priceAsc': '💰 Cheapest',
    'drawer.sort.priceDesc': '💎 Most Powerful',
    'drawer.compat.on': 'Compatible: ON',
    'store.modal.title': 'Where to buy',
    'store.modal.catalog': '[ STORE CATALOG WITH DIRECT SEARCH ]',
    'modal.save.placeholder': 'My Gaming PC 2026',
"""

new_pl = """
    'meta.title': 'PC Builder 2026 — Profesjonalny Konfigurator PC',
    'autobuild.title': '✨ Inteligentny Auto-Wybór',
    'autobuild.budget': 'Docelowy budżet:',
    'autobuild.buffer': '+5% rezerwy',
    'autobuild.cpuPlatform': 'Platforma CPU:',
    'drawer.filter.all': 'Wszystko',
    'autobuild.gpuPlatform': 'Platforma GPU:',
    'autobuild.purpose': 'Cel Gamingu:',
    'autobuild.submit': 'Zbuduj Konfigurację ✨',
    'dash.progress.components': 'komponentów',
    'dash.psu.none': 'Brak zasilacza',
    'dash.visualizer.title': 'SCHEMAT MONTAŻU (INTERAKTYWNY)',
    'dash.bottleneck': 'Balans i Synergia Systemu',
    'dash.bottleneck.balanced': 'Idealny balans (Złoty standard)',
    'dash.analytics.title': 'Szczegółowa analityka systemu',
    'dash.analytics.desc': 'Potencjał gier we wszystkich rozdzielczościach, kompatybilność i zapisane zestawy',
    'dash.benchmarks.subtitle': 'Ustawienia Ultra • Bez generowania klatek',
    'dash.fps.game': 'Gra / Gatunek',
    'drawer.available': 'dostępne',
    'drawer.search': 'Szukaj po nazwie, gnieździe, specyfikacji...',
    'drawer.sort.popular': '⚡ Popularne',
    'drawer.sort.priceAsc': '💰 Najtańsze',
    'drawer.sort.priceDesc': '💎 Najpotężniejsze',
    'drawer.compat.on': 'Kompatybilne: WŁ',
    'store.modal.title': 'Gdzie kupić część',
    'store.modal.catalog': '[ KATALOG SKLEPÓW Z BEZPOŚREDNIM WYSZUKIWANIEM ]',
    'modal.save.placeholder': 'Mój Gaming PC 2026',
"""

new_ua = """
    'meta.title': 'PC Builder 2026 — Професійний конфігуратор ПК',
    'autobuild.title': '✨ Розумний авто-підбір',
    'autobuild.budget': 'Бажаний бюджет:',
    'autobuild.buffer': 'допуск +5%',
    'autobuild.cpuPlatform': 'Платформа процесора:',
    'drawer.filter.all': 'Всі',
    'autobuild.gpuPlatform': 'Платформа відеокарти:',
    'autobuild.purpose': 'Цільовий геймінг:',
    'autobuild.submit': 'Зібрати конфігурацію ✨',
    'dash.progress.components': 'компонентів',
    'dash.psu.none': 'БЖ не вибрано',
    'dash.visualizer.title': 'СХЕМА ЗБІРКИ (ІНТЕРАКТИВНА)',
    'dash.bottleneck': 'Баланс і синергія системи',
    'dash.bottleneck.balanced': 'Ідеальний баланс (Золотий стандарт)',
    'dash.analytics.title': 'Детальна аналітика системи',
    'dash.analytics.desc': 'Ігровий потенціал у всіх розширеннях, сумісність стандартів та збережені збірки',
    'dash.benchmarks.subtitle': 'Ультра налаштування • Без генерації кадрів',
    'dash.fps.game': 'Гра / Жанр',
    'drawer.available': 'доступно',
    'drawer.search': 'Пошук за назвою, сокетом, характеристиками...',
    'drawer.sort.popular': '⚡ Топ продажів',
    'drawer.sort.priceAsc': '💰 Дешевше',
    'drawer.sort.priceDesc': '💎 Потужніше',
    'drawer.compat.on': 'Сумісні: УВІМК',
    'store.modal.title': 'Де купити деталь',
    'store.modal.catalog': '[ КАТАЛОГ МАГАЗИНІВ З ПРЯМИМ ПОШУКОМ ]',
    'modal.save.placeholder': 'Мій ігровий ПК 2026',
"""

js = js.replace("ru: {", "ru: {\n" + new_ru)
js = js.replace("en: {", "en: {\n" + new_en)
js = js.replace("pl: {", "pl: {\n" + new_pl)
js = js.replace("ua: {", "ua: {\n" + new_ua)

with open("js/i18n.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated i18n.js with translations.")
