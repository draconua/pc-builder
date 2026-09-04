with open("js/i18n.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace the export function t(key) with intelligent fallbacks
old_t_func = """export function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) ||
         (translations['en'] && translations['en'][key]) ||
         key;
}"""

new_t_func = """const HARD_FALLBACKS = {
  'slot.cpu.analogs': { ru: 'Альтернативы процессора:', en: 'CPU Alternatives:', pl: 'Alternatywy procesora:', ua: 'Альтернативи процесора:' },
  'slot.gpu.analogs': { ru: 'Аналоги по мощности:', en: 'Equivalent GPUs:', pl: 'Odpowiedniki wydajności:', ua: 'Аналоги за потужністю:' },
  'slot.comparePrices': { ru: 'Цены в магазинах', en: 'Compare Prices', pl: 'Porównaj ceny', ua: 'Ціни в магазинах' },
  'dash.visualizer.title': { ru: 'СХЕМА СБОРКИ (ИНТЕРАКТИВНАЯ)', en: 'BUILD SCHEMATIC (INTERACTIVE)', pl: 'SCHEMAT ZESTAWU (INTERAKTYWNY)', ua: 'СХЕМА ЗБІРКИ (ІНТЕРАКТИВНА)' },
  'store.modal.title': { ru: 'Где купить деталь', en: 'Where to Buy Component', pl: 'Gdzie kupić komponent', ua: 'Де купити компонент' },
  'store.modal.hint': { ru: 'Прямые ссылки для поиска цен и покупки в ведущих магазинах:', en: 'Direct search links to top electronics retailers:', pl: 'Bezpośrednie linki do wyszukiwania cen w czołowych sklepach:', ua: 'Прямі посилання для пошуку цін у провідних магазинах:' },
  'store.jump': { ru: 'Смотреть цены ↗', en: 'Check prices ↗', pl: 'Sprawdź ceny ↗', ua: 'Дивитися ціни ↗' },
  'drawer.filter.all': { ru: 'Все', en: 'All', pl: 'Wszystkie', ua: 'Усі' },
  'drawer.sort.popular': { ru: '⚡ Топ продаж', en: '⚡ Popular', pl: '⚡ Bestsellery', ua: '⚡ Топ продажів' }
};

export function t(key) {
  if (translations[currentLang] && translations[currentLang][key]) {
    return translations[currentLang][key];
  }
  if (HARD_FALLBACKS[key]) {
    return HARD_FALLBACKS[key][currentLang] || HARD_FALLBACKS[key]['ru'] || HARD_FALLBACKS[key]['en'];
  }
  if (translations['ru'] && translations['ru'][key]) {
    return translations['ru'][key];
  }
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  return key;
}"""

code = code.replace(old_t_func, new_t_func)

with open("js/i18n.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated i18n.js with bulletproof fallback dictionary for key safety!")
