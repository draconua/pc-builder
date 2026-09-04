with open("js/data.js", "r", encoding="utf-8") as f:
    code = f.read()

old_ek = "ekatalog: `https://e-katalog.pl/katalog.php?search_=${enc}`,"
new_ek = "ekatalog: `https://e-katalog.pl/ek-list.php?search_=${enc}`,"

code = code.replace(old_ek, new_ek)

old_info = """export const RETAILER_INFO = [
  { id: 'ekatalog', name: 'E-Katalog', badge: 'Цены', color: '#0284c7', icon: '📊' },
  { id: 'morele', name: 'Morele.net', badge: 'Польша', color: '#ff6200', icon: '🛒' },
  { id: 'xkom', name: 'x-kom', badge: 'Польша', color: '#107c41', icon: '💻' },
  { id: 'rozetka_pl', name: 'Rozetka PL', badge: 'Польша', color: '#00a046', icon: '📦' },
  { id: 'rozetka_ua', name: 'Rozetka UA', badge: 'Украина', color: '#00a046', icon: '🇺🇦' },
  { id: 'mediaexpert', name: 'MediaExpert', badge: 'Сеть', color: '#facc15', icon: '⚡' },
  { id: 'mediamarkt', name: 'MediaMarkt', badge: 'Европа', color: '#ef4444', icon: '🔴' },
  { id: 'amazon', name: 'Amazon', badge: 'Глобал', color: '#f97316', icon: '🌐' }
];"""

new_info = """export const RETAILER_INFO = [
  { id: 'ekatalog', name: 'E-Katalog', badge: 'Сравнить цены', region: 'EU / PL / UA', color: '#0284c7', icon: '📊', desc: 'Агрегатор цен и характеристик по всем магазинам' },
  { id: 'morele', name: 'Morele.net', badge: 'Польша • Склад', region: 'PL', color: '#ff6200', icon: '🛒', desc: 'Крупнейший магазин комплектующих в Польше' },
  { id: 'xkom', name: 'x-kom', badge: 'Польша • Экспресс', region: 'PL', color: '#107c41', icon: '💻', desc: 'Официальный ритейлер электроники с гарантией' },
  { id: 'mediaexpert', name: 'MediaExpert', badge: 'Сеть маркетов', region: 'PL', color: '#eab308', icon: '⚡', desc: 'Большой выбор и самовывоз по всей Польше' },
  { id: 'rozetka_pl', name: 'Rozetka PL', badge: 'Польша', region: 'PL', color: '#00a046', icon: '📦', desc: 'Маркетплейс Rozetka с быстрой доставкой по ЕС' },
  { id: 'rozetka_ua', name: 'Rozetka UA', badge: 'Украина', region: 'UA', color: '#00a046', icon: '🇺🇦', desc: 'Главный ритейлер и доставка по Украине' },
  { id: 'mediamarkt', name: 'MediaMarkt', badge: 'Европа', region: 'EU', color: '#ef4444', icon: '🔴', desc: 'Европейская сеть электроники' },
  { id: 'amazon', name: 'Amazon', badge: 'Глобал', region: 'Global', color: '#f97316', icon: '🌐', desc: 'Международная доставка и гарантия Amazon' }
];"""

code = code.replace(old_info, new_info)

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated data.js with ek-list.php and detailed RETAILER_INFO!")
