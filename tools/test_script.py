with open("js/i18n.js", "r", encoding="utf-8") as f:
    code = f.read()

# Clean replacements using exact Unicode
replacements = {
    # RU
    "'slot.cpu.analogs': 'Альтернативы процессора:',": "'slot.cpu.analogs': 'Альтернативы процессора:',",
    "'slot.gpu.analogs': 'Аналоги по мощности:',": "'slot.gpu.analogs': 'Аналоги по мощности:',",
    "'slot.comparePrices': 'Цены в магазинах',": "'slot.comparePrices': 'Цены в магазинах',",
    "'store.modal.title': 'Где купить деталь',": "'store.modal.title': 'Где купить деталь',",
    "'store.modal.hint': 'Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:',": "'store.modal.hint': 'Прямые ссылки для поиска цен и покупки в ведущих магазинах Польши, Украины и Европы:',",
    "'store.jump': 'Смотреть цены ↗',": "'store.jump': 'Смотреть цены ↗',",
    "'autobuild.title': 'Умный авто-подбор ПК',": "'autobuild.title': 'Умный авто-подбор ПК',",
    "'autobuild.budget': 'Бюджет',": "'autobuild.budget': 'Бюджет',",
    "'autobuild.cpuPlatform': 'Платформа CPU:',": "'autobuild.cpuPlatform': 'Платформа CPU:',",
    "'autobuild.gpuPlatform': 'Платформа GPU:',": "'autobuild.gpuPlatform': 'Платформа GPU:',",
    "'autobuild.purpose': 'Цель сборки:',": "'autobuild.purpose': 'Цель сборки:',",
    "'autobuild.purpose.gaming': '🎮 Гейминг',": "'autobuild.purpose.gaming': '🎮 Гейминг',",
    "'autobuild.purpose.work': '💼 Работа',": "'autobuild.purpose.work': '💼 Работа',",
    "'autobuild.submit': 'Собрать конфигурацию',": "'autobuild.submit': 'Собрать конфигурацию',",
    "'autobuild.buffer': 'Гибкий буфер +5%',": "'autobuild.buffer': 'Гибкий буфер +5%',",
    "'drawer.filter.all': 'Все',": "'drawer.filter.all': 'Все',",
    "'drawer.sort.popular': '⚡ Топ продаж',": "'drawer.sort.popular': '⚡ Топ продаж',",
    "'drawer.compat.on': 'Совместимые: ВКЛ',": "'drawer.compat.on': 'Совместимые: ВКЛ',",
    "'drawer.compat.off': 'Все детали: ВКЛ',": "'drawer.compat.off': 'Все детали: ВКЛ',",
    "'dash.visualizer.title': 'СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)',": "'dash.visualizer.title': 'СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)',",
    "'dash.benchmarks.subtitle': 'Ультра настройки • Без генерации кадров',": "'dash.benchmarks.subtitle': 'Ультра настройки • Без генерации кадров',"
}

# Also for UA:
ua_replacements = {
    "'slot.cpu.analogs': 'Альтернативи процесора:',": "'slot.cpu.analogs': 'Альтернативи процесора:',",
    "'slot.gpu.analogs': 'Аналоги за потужністю:',": "'slot.gpu.analogs': 'Аналоги за потужністю:',",
    "'slot.comparePrices': 'Ціни в магазинах',": "'slot.comparePrices': 'Ціни в магазинах',",
    "'store.modal.title': 'Де купити компонент',": "'store.modal.title': 'Де купити компонент',",
    "'store.modal.hint': 'Прямі посилання для пошуку цін і покупки у провідних магазинах Польщі, України та Європи:',": "'store.modal.hint': 'Прямі посилання для пошуку цін і покупки у провідних магазинах Польщі, України та Європи:',",
    "'store.jump': 'Дивитися ціни ↗',": "'store.jump': 'Дивитися ціни ↗',",
    "'autobuild.title': 'Розумний авто-підбір ПК',": "'autobuild.title': 'Розумний авто-підбір ПК',",
    "'autobuild.budget': 'Бюджет',": "'autobuild.budget': 'Бюджет',",
    "'autobuild.cpuPlatform': 'Платформа CPU:',": "'autobuild.cpuPlatform': 'Платформа CPU:',",
    "'autobuild.gpuPlatform': 'Платформа GPU:',": "'autobuild.gpuPlatform': 'Платформа GPU:',",
    "'autobuild.purpose': 'Ціль збірки:',": "'autobuild.purpose': 'Ціль збірки:',",
    "'autobuild.purpose.gaming': '🎮 Геймінг',": "'autobuild.purpose.gaming': '🎮 Геймінг',",
    "'autobuild.purpose.work': '💼 Робота',": "'autobuild.purpose.work': '💼 Робота',",
    "'autobuild.submit': 'Зібрати конфігурацію',": "'autobuild.submit': 'Зібрати конфігурацію',",
    "'autobuild.buffer': 'Гнучкий буфер +5%',": "'autobuild.buffer': 'Гнучкий буфер +5%',",
    "'drawer.filter.all': 'Усі',": "'drawer.filter.all': 'Усі',",
    "'drawer.sort.popular': '⚡ Топ продажів',": "'drawer.sort.popular': '⚡ Топ продажів',",
    "'drawer.compat.on': 'Сумісні: УВІМК',": "'drawer.compat.on': 'Сумісні: УВІМК',",
    "'drawer.compat.off': 'Усі деталі: УВІМК',": "'drawer.compat.off': 'Усі деталі: УВІМК',",
    "'dash.visualizer.title': 'СХЕМА ЗБІРКИ (ІНТЕРАКТИВНА)',": "'dash.visualizer.title': 'СХЕМА ЗБІРКИ (ІНТЕРАКТИВНА)',",
    "'dash.benchmarks.subtitle': 'Ультра налаштування • Без генерації кадрів',": "'dash.benchmarks.subtitle': 'Ультра налаштування • Без генерації кадрів',"
}
