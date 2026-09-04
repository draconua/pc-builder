with open("js/data.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace createBuyLinks
old_buylinks = """function createBuyLinks(name) {
  const enc = encodeURIComponent(name);
  return {
    amazon: `https://www.amazon.com/s?k=${enc}`,
    xkom: `https://www.x-kom.pl/szukaj?q=${enc}`,
    morele: `https://www.morele.net/wyszukiwarka/?q=${enc}`
  };
}"""

new_buylinks = """export const RETAILER_INFO = [
  { id: 'ekatalog', name: 'E-Katalog', badge: 'Цены', color: '#0284c7', icon: '📊' },
  { id: 'morele', name: 'Morele.net', badge: 'Польша', color: '#ff6200', icon: '🛒' },
  { id: 'xkom', name: 'x-kom', badge: 'Польша', color: '#107c41', icon: '💻' },
  { id: 'rozetka_pl', name: 'Rozetka PL', badge: 'Польша', color: '#00a046', icon: '📦' },
  { id: 'rozetka_ua', name: 'Rozetka UA', badge: 'Украина', color: '#00a046', icon: '🇺🇦' },
  { id: 'mediaexpert', name: 'MediaExpert', badge: 'Сеть', color: '#facc15', icon: '⚡' },
  { id: 'mediamarkt', name: 'MediaMarkt', badge: 'Европа', color: '#ef4444', icon: '🔴' },
  { id: 'amazon', name: 'Amazon', badge: 'Глобал', color: '#f97316', icon: '🌐' }
];

function createBuyLinks(name) {
  const enc = encodeURIComponent(name);
  return {
    ekatalog: `https://e-katalog.pl/katalog.php?search_=${enc}`,
    morele: `https://www.morele.net/wyszukiwarka/?q=${enc}`,
    xkom: `https://www.x-kom.pl/szukaj?q=${enc}`,
    rozetka_pl: `https://rozetka.pl/search/?text=${enc}`,
    rozetka_ua: `https://rozetka.com.ua/search/?text=${enc}`,
    mediaexpert: `https://www.mediaexpert.pl/szukaj?spark=${enc}`,
    mediamarkt: `https://mediamarkt.pl/pl/search.html?query=${enc}`,
    amazon: `https://www.amazon.pl/s?k=${enc}`
  };
}"""

code = code.replace(old_buylinks, new_buylinks)

# Update Presets
old_balanced_gpu = "gpu: 'gpu-rtx4070s',"
new_balanced_gpu = "gpu: 'gpu-rtx5070',"

old_ultimate_cpu = "cpu: 'cpu-r7-7800x3d',"
new_ultimate_cpu = "cpu: 'cpu-r7-9800x3d',"

code = code.replace(old_balanced_gpu, new_balanced_gpu)
code = code.replace(old_ultimate_cpu, new_ultimate_cpu)

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated data.js with multi-retailer support and 2026 presets (RTX 5070, 9800X3D)!")
