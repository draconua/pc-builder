import json

new_keys = {
  'ru': {
    'slot.cpu.analogs': 'Альтернативы процессора:',
    'slot.gpu.analogs': 'Аналоги по мощности:',
    'slot.comparePrices': 'Цены в магазинах',
    'store.modal.title': 'Где купить деталь',
    'store.modal.hint': 'Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:',
    'store.jump': 'Смотреть цены ↗',
    'autobuild.title': 'Умный авто-подбор ПК',
    'autobuild.budget': 'Бюджет',
    'autobuild.cpuPlatform': 'Платформа CPU:',
    'autobuild.gpuPlatform': 'Платформа GPU:',
    'autobuild.purpose': 'Цель сборки:',
    'autobuild.purpose.gaming': '🎮 Гейминг',
    'autobuild.purpose.work': '💼 Работа',
    'autobuild.submit': 'Собрать конфигурацию',
    'autobuild.buffer': 'Гибкий буфер +5%',
    'drawer.filter.all': 'Все',
    'drawer.sort.popular': '⚡ Топ продаж',
    'drawer.compat.on': 'Совместимые: ВКЛ',
    'drawer.compat.off': 'Все детали: ВКЛ',
    'dash.visualizer.title': 'СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)',
    'dash.benchmarks.subtitle': 'Ультра настройки • Без генерации кадров'
  },
  'en': {
    'slot.cpu.analogs': 'CPU Alternatives:',
    'slot.gpu.analogs': 'Equivalent GPUs:',
    'slot.comparePrices': 'Compare Prices',
    'store.modal.title': 'Where to Buy Component',
    'store.modal.hint': 'Direct search links to top electronics retailers in Poland, Ukraine and Europe:',
    'store.jump': 'Check prices ↗',
    'autobuild.title': 'Smart PC Auto-Builder',
    'autobuild.budget': 'Budget',
    'autobuild.cpuPlatform': 'CPU Platform:',
    'autobuild.gpuPlatform': 'GPU Platform:',
    'autobuild.purpose': 'Build Target:',
    'autobuild.purpose.gaming': '🎮 Gaming',
    'autobuild.purpose.work': '💼 Workstation',
    'autobuild.submit': 'Assemble Configuration',
    'autobuild.buffer': 'Flexible buffer +5%',
    'drawer.filter.all': 'All',
    'drawer.sort.popular': '⚡ Popular',
    'drawer.compat.on': 'Compatible: ON',
    'drawer.compat.off': 'All parts: ON',
    'dash.visualizer.title': 'BUILD SCHEMATIC (INTERACTIVE)',
    'dash.benchmarks.subtitle': 'Ultra Settings • No Frame Generation'
  },
  'pl': {
    'slot.cpu.analogs': 'Alternatywy procesora:',
    'slot.gpu.analogs': 'Odpowiedniki wydajności:',
    'slot.comparePrices': 'Porównaj ceny',
    'store.modal.title': 'Gdzie kupić komponent',
    'store.modal.hint': 'Bezpośrednie linki do wyszukiwania cen w czołowych sklepach Polski, Ukrainy i Europy:',
    'store.jump': 'Sprawdź ceny ↗',
    'autobuild.title': 'Inteligentny auto-dobór PC',
    'autobuild.budget': 'Budżet',
    'autobuild.cpuPlatform': 'Platforma CPU:',
    'autobuild.gpuPlatform': 'Platforma GPU:',
    'autobuild.purpose': 'Cel zestawu:',
    'autobuild.purpose.gaming': '🎮 Gaming',
    'autobuild.purpose.work': '💼 Praca',
    'autobuild.submit': 'Złóż konfigurację',
    'autobuild.buffer': 'Elastyczny bufor +5%',
    'drawer.filter.all': 'Wszystkie',
    'drawer.sort.popular': '⚡ Bestsellery',
    'drawer.compat.on': 'Kompatybilne: WŁ',
    'drawer.compat.off': 'Wszystkie: WŁ',
    'dash.visualizer.title': 'SCHEMAT ZESTAWU (INTERAKTYWNY)',
    'dash.benchmarks.subtitle': 'Ustawienia Ultra • Bez generatora klatek'
  },
  'ua': {
    'slot.cpu.analogs': 'Альтернативи процесора:',
    'slot.gpu.analogs': 'Аналоги за потужністю:',
    'slot.comparePrices': 'Ціни в магазинах',
    'store.modal.title': 'Де купити компонент',
    'store.modal.hint': 'Прямі посилання для пошуку цін і покупки у провідних магазинах Польщі, України та Європи:',
    'store.jump': 'Дивитися ціни ↗',
    'autobuild.title': 'Розумний авто-підбір ПК',
    'autobuild.budget': 'Бюджет',
    'autobuild.cpuPlatform': 'Платформа CPU:',
    'autobuild.gpuPlatform': 'Платформа GPU:',
    'autobuild.purpose': 'Ціль збірки:',
    'autobuild.purpose.gaming': '🎮 Геймінг',
    'autobuild.purpose.work': '💼 Робота',
    'autobuild.submit': 'Зібрати конфігурацію',
    'autobuild.buffer': 'Гнучкий буфер +5%',
    'drawer.filter.all': 'Усі',
    'drawer.sort.popular': '⚡ Топ продажів',
    'drawer.compat.on': 'Сумісні: УВІМК',
    'drawer.compat.off': 'Усі деталі: УВІМК',
    'dash.visualizer.title': 'СХЕМА ЗБІРКИ (ІНТЕРАКТИВНА)',
    'dash.benchmarks.subtitle': 'Ультра налаштування • Без генерації кадрів'
  }
}

with open("js/i18n.js", "r", encoding="utf-8") as f:
    content = f.read()

import re

for lang, keys_dict in new_keys.items():
    # find where this language object ends
    # match `lang: { ... \n  }`
    pattern = rf'({lang}:\s*\{{.*?)(\n  \}})'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        body = match.group(1)
        # append new keys
        additions = []
        for k, v in keys_dict.items():
            if f"'{k}':" not in body:
                # escape single quotes in v if any
                escaped_v = v.replace("'", "\\'")
                additions.append(f"    '{k}': '{escaped_v}',")
        if additions:
            new_body = body.rstrip() + ",\n" + "\n".join(additions)
            content = content[:match.start()] + new_body + match.group(2) + content[match.end():]
            print(f"Added {len(additions)} keys to {lang}")

with open("js/i18n.js", "w", encoding="utf-8") as f:
    f.write(content)

print("i18n.js successfully updated with full translation coverage!")
