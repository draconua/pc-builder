// =============================================================
// data.js — Expanded PC parts database (prices in USD)
// Updated for 2026 hardware landscape — 200+ components
// =============================================================

export const CATEGORIES = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor'];

export const COUNTRIES = [
  { id: 'pl', name: 'Польша', flag: '🇵🇱', currency: 'PLN' },
  { id: 'ua', name: 'Украина', flag: '🇺🇦', currency: 'UAH' },
  { id: 'us', name: 'США', flag: '🇺🇸', currency: 'USD' },
  { id: 'de', name: 'Германия', flag: '🇩🇪', currency: 'EUR' },
  { id: 'gb', name: 'Великобритания', flag: '🇬🇧', currency: 'GBP' },
  { id: 'kz', name: 'Казахстан', flag: '🇰🇿', currency: 'KZT' }
];

export const RETAILERS_BY_COUNTRY = {
  pl: [
    { id: 'morele', name: 'Morele.net', desc: 'Крупнейший склад электроники и деталей в Польше', icon: '🛒', color: '#ff6200', tag: 'Склад PL', url: (n) => `https://www.morele.net/wyszukiwarka/?q=${encodeURIComponent(n)}` },
    { id: 'xkom', name: 'x-kom', desc: 'Официальный ритейлер электроники с гарантией', icon: '💻', color: '#107c41', tag: 'Официал PL', url: (n) => `https://www.x-kom.pl/szukaj?q=${encodeURIComponent(n)}` },
    { id: 'mediaexpert', name: 'MediaExpert', desc: 'Сеть гипермаркетов и самовывоз по всей Польше', icon: '⚡', color: '#eab308', tag: 'Сеть PL', url: (n) => `https://www.mediaexpert.pl/szukaj?spark=${encodeURIComponent(n)}` },
    { id: 'ceneo', name: 'Ceneo.pl', desc: 'Крупнейший агрегатор цен и скидок в Польше', icon: '📊', color: '#0284c7', tag: 'Агрегатор', url: (n) => `https://www.ceneo.pl/;szukaj-${encodeURIComponent(n)}` },
    { id: 'rozetka_pl', name: 'Rozetka PL', desc: 'Маркетплейс Rozetka с быстрой доставкой по ЕС', icon: '📦', color: '#00a046', tag: 'Доставка PL', url: (n) => `https://rozetka.pl/search/?text=${encodeURIComponent(n)}` },
    { id: 'mediamarkt_pl', name: 'MediaMarkt PL', desc: 'Европейская сеть супермаркетов техники', icon: '🔴', color: '#ef4444', tag: 'Европа', url: (n) => `https://mediamarkt.pl/pl/search.html?query=${encodeURIComponent(n)}` }
  ],
  ua: [
    { id: 'rozetka_ua', name: 'Rozetka.ua', desc: 'Крупнейший онлайн-ритейлер Украины', icon: '📦', color: '#00a046', tag: 'Лидер UA', url: (n) => `https://rozetka.com.ua/search/?text=${encodeURIComponent(n)}` },
    { id: 'telemart', name: 'Telemart.ua', desc: 'Специализированный магазин компьютерного железа', icon: '🎮', color: '#2563eb', tag: 'ПК Железо', url: (n) => `https://telemart.ua/search/?search=${encodeURIComponent(n)}` },
    { id: 'hotline', name: 'Hotline.ua', desc: 'Главный сервис сравнения цен в магазинах Украины', icon: '📊', color: '#f59e0b', tag: 'Агрегатор UA', url: (n) => `https://hotline.ua/sr/?q=${encodeURIComponent(n)}` },
    { id: 'ek_ua', name: 'E-Katalog UA', desc: 'Сравнение цен и подробных характеристик техники', icon: '📈', color: '#0284c7', tag: 'Цены UA', url: (n) => `https://ek.ua/ek-list.php?search_=${encodeURIComponent(n)}` },
    { id: 'f_ua', name: 'F.ua', desc: 'Популярный гипермаркет электроники и ПК деталей', icon: '🛒', color: '#8b5cf6', tag: 'Ритейлер UA', url: (n) => `https://f.ua/search/?q=${encodeURIComponent(n)}` },
    { id: 'allo', name: 'Allo.ua', desc: 'Национальная сеть магазинов техники и электроники', icon: '⚡', color: '#ef4444', tag: 'Сеть UA', url: (n) => `https://allo.ua/ua/catalogsearch/result/?q=${encodeURIComponent(n)}` }
  ],
  us: [
    { id: 'amazon_us', name: 'Amazon US', desc: 'Крупнейший глобальный маркетплейс', icon: '🌐', color: '#f97316', tag: 'Global / US', url: (n) => `https://www.amazon.com/s?k=${encodeURIComponent(n)}` },
    { id: 'newegg', name: 'Newegg', desc: 'Ведущий онлайн-ритейлер ПК комплектующих в США', icon: '🥚', color: '#f59e0b', tag: 'Спец PC US', url: (n) => `https://www.newegg.com/p/pl?d=${encodeURIComponent(n)}` },
    { id: 'bestbuy', name: 'Best Buy', desc: 'Крупнейшая сеть магазинов электроники в США', icon: '🏷️', color: '#0284c7', tag: 'Сеть US', url: (n) => `https://www.bestbuy.com/site/searchpage.jsp?st=${encodeURIComponent(n)}` },
    { id: 'bhphoto', name: 'B&H Photo Video', desc: 'Авторитетный ритейлер техники и электроники в США', icon: '📷', color: '#107c41', tag: 'Официал US', url: (n) => `https://www.bhphotovideo.com/c/search?Ntt=${encodeURIComponent(n)}` },
    { id: 'microcenter', name: 'Micro Center', desc: 'Культовый розничный гипермаркет для ПК энтузиастов', icon: '💻', color: '#ef4444', tag: 'Энтузиаст', url: (n) => `https://www.microcenter.com/search/search_results.aspx?Ntt=${encodeURIComponent(n)}` }
  ],
  de: [
    { id: 'mindfactory', name: 'Mindfactory.de', desc: '#1 онлайн-ритейлер ПК комплектующих в Германии', icon: '🔧', color: '#0284c7', tag: 'Лидер DE', url: (n) => `https://www.mindfactory.de/search_result.php?search_query=${encodeURIComponent(n)}` },
    { id: 'caseking', name: 'Caseking.de', desc: 'Премиум магазин моддинга, кастомных ПК и деталей', icon: '👑', color: '#f59e0b', tag: 'Премиум DE', url: (n) => `https://www.caseking.de/search?sSearch=${encodeURIComponent(n)}` },
    { id: 'alternate', name: 'Alternate.de', desc: 'Один из старейших и надежных магазинов техники в ФРГ', icon: '📦', color: '#107c41', tag: 'Официал DE', url: (n) => `https://www.alternate.de/listing.xhtml?q=${encodeURIComponent(n)}` },
    { id: 'geizhals', name: 'Geizhals.de', desc: 'Главный сервис сравнения цен в Германии и Австрии', icon: '📊', color: '#8b5cf6', tag: 'Агрегатор DE', url: (n) => `https://geizhals.de/?fs=${encodeURIComponent(n)}` },
    { id: 'amazon_de', name: 'Amazon.de', desc: 'Немецкое подразделение Amazon с быстрой доставкой по ЕС', icon: '🌐', color: '#f97316', tag: 'Amazon DE', url: (n) => `https://www.amazon.de/s?k=${encodeURIComponent(n)}` }
  ],
  gb: [
    { id: 'overclockers', name: 'Overclockers UK', desc: 'Легендарный британский магазин для оверклокеров и геймеров', icon: '⚡', color: '#ef4444', tag: 'Overclock UK', url: (n) => `https://www.overclockers.co.uk/search?sSearch=${encodeURIComponent(n)}` },
    { id: 'scan_uk', name: 'Scan UK', desc: 'Ведущий британский поставщик компьютерного железа', icon: '💻', color: '#2563eb', tag: 'Scan UK', url: (n) => `https://www.scan.co.uk/search?q=${encodeURIComponent(n)}` },
    { id: 'ebuyer', name: 'Ebuyer', desc: 'Один из крупнейших интернет-дискаунтеров техники в Британии', icon: '🛒', color: '#f59e0b', tag: 'Дискаунтер UK', url: (n) => `https://www.ebuyer.com/search?q=${encodeURIComponent(n)}` },
    { id: 'currys', name: 'Currys', desc: 'Крупнейшая сеть ритейла электроники в Великобритании', icon: '🟣', color: '#7c3aed', tag: 'Сеть UK', url: (n) => `https://www.currys.co.uk/search?q=${encodeURIComponent(n)}` },
    { id: 'amazon_uk', name: 'Amazon.co.uk', desc: 'Британский филиал Amazon с Prime-доставкой', icon: '🌐', color: '#f97316', tag: 'Amazon UK', url: (n) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(n)}` }
  ],
  kz: [
    { id: 'kaspi', name: 'Kaspi.kz', desc: 'Главный маркетплейс Казахстана с рассрочкой и доставкой', icon: '🔴', color: '#ef4444', tag: '#1 в Казахстане', url: (n) => `https://kaspi.kz/shop/search/?text=${encodeURIComponent(n)}` },
    { id: 'bely_veter', name: 'Белый Ветер (Shop.kz)', desc: 'Главный специализированный магазин ПК комплектующих в РК', icon: '🌬️', color: '#0284c7', tag: 'Спец ПК РК', url: (n) => `https://shop.kz/search/?q=${encodeURIComponent(n)}` },
    { id: 'technodom', name: 'Technodom', desc: 'Национальная сеть магазинов электроники в Казахстане', icon: '⚡', color: '#f97316', tag: 'Сеть РК', url: (n) => `https://www.technodom.kz/search?r=${encodeURIComponent(n)}` },
    { id: 'sulpak', name: 'Sulpak', desc: 'Широкая сеть гипермаркетов техники по всему Казахстану', icon: '🛒', color: '#10b981', tag: 'Сеть РК', url: (n) => `https://www.sulpak.kz/Search?q=${encodeURIComponent(n)}` },
    { id: 'alser', name: 'Alser', desc: 'Популярная сеть магазинов компьютеров и цифровой техники', icon: '💻', color: '#6366f1', tag: 'Ритейлер РК', url: (n) => `https://alser.kz/search?q=${encodeURIComponent(n)}` }
  ]
};

// Legacy compatibility export
export const RETAILER_INFO = RETAILERS_BY_COUNTRY.pl;

function createBuyLinks(name) {
  const enc = encodeURIComponent(name);
  return {
    morele: `https://www.morele.net/wyszukiwarka/?q=${enc}`,
    xkom: `https://www.x-kom.pl/szukaj?q=${enc}`,
    mediaexpert: `https://www.mediaexpert.pl/szukaj?spark=${enc}`,
    ceneo: `https://www.ceneo.pl/;szukaj-${enc}`,
    rozetka_pl: `https://rozetka.pl/search/?text=${enc}`,
    rozetka_ua: `https://rozetka.com.ua/search/?text=${enc}`,
    telemart: `https://telemart.ua/search/?search=${enc}`,
    hotline: `https://hotline.ua/sr/?q=${enc}`,
    amazon: `https://www.amazon.pl/s?k=${enc}`
  };
}

export const PARTS_DATABASE = {
  cpu: [
    // Popular Value CPUs & 2026 Refresh
    { id: 'cpu-i5-12600kf', name: 'Intel Core i5-12600KF', brand: 'Intel', price: 155, socket: 'LGA1700', tdp: 125, maxTdp: 150, ramType: 'DDR4', cores: 10, freq: '3.7 GHz', tier: 6, cpuScore: 84, specs: '10 Cores (6P+4E) / 16 Threads, 3.7 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-12600KF') },
    { id: 'cpu-i5-13600kf', name: 'Intel Core i5-13600KF', brand: 'Intel', price: 239, socket: 'LGA1700', tdp: 125, maxTdp: 181, ramType: 'DDR5', cores: 14, freq: '3.5 GHz', tier: 7, cpuScore: 88, specs: '14 Cores (6P+8E) / 20 Threads, 3.5 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-13600KF') },
    { id: 'cpu-i5-14600kf', name: 'Intel Core i5-14600KF', brand: 'Intel', price: 259, socket: 'LGA1700', tdp: 125, maxTdp: 181, ramType: 'DDR5', cores: 14, freq: '3.5 GHz', tier: 7, cpuScore: 89, specs: '14 Cores (6P+8E) / 20 Threads, 3.5 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-14600KF') },
    { id: 'cpu-u5-225f', name: 'Intel Core Ultra 5 225F', brand: 'Intel', price: 209, socket: 'LGA1851', tdp: 65, maxTdp: 125, ramType: 'DDR5', cores: 10, freq: '3.3 GHz', tier: 6, cpuScore: 81, specs: '10 Cores (6P+4E) / 10 Threads, 3.3 GHz, 65W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 5 225F') },
    { id: 'cpu-u5-235', name: 'Intel Core Ultra 5 235', brand: 'Intel', price: 249, socket: 'LGA1851', tdp: 65, maxTdp: 125, ramType: 'DDR5', cores: 14, freq: '3.4 GHz', tier: 7, cpuScore: 84, specs: '14 Cores (6P+8E) / 14 Threads, 3.4 GHz, 65W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 5 235') },
    { id: 'cpu-r5-8400f', name: 'AMD Ryzen 5 8400F', brand: 'AMD', price: 135, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '4.2 GHz', tier: 4, cpuScore: 78, specs: '6 Cores / 12 Threads, 4.2 GHz, 65W, Zen 4, AM5', buyLinks: createBuyLinks('AMD Ryzen 5 8400F') },
    { id: 'cpu-r9-9900x3d', name: 'AMD Ryzen 9 9900X3D', brand: 'AMD', price: 549, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 12, freq: '4.4 GHz', tier: 10, cpuScore: 102, specs: '12 Cores / 24 Threads, 4.4 GHz, 3D V-Cache, Zen 5, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 9900X3D') },

    { id: 'cpu-r7-9800x3d', name: 'AMD Ryzen 7 9800X3D', brand: 'AMD', price: 449, socket: 'AM5', tdp: 120, maxTdp: 162, ramType: 'DDR5', cores: 8, freq: '4.7 GHz', tier: 10, cpuScore: 108, specs: '8 Cores / 16 Threads, 4.7 GHz, 3D V-Cache, Zen 5, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 7 9800X3D') },
    // AM4 (9)
    { id: 'cpu-r3-4100', name: 'AMD Ryzen 3 4100', brand: 'AMD', price: 65, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 4, freq: '3.8 GHz', tier: 1, cpuScore: 45, specs: '4 Cores / 8 Threads, 3.8 GHz, 65W, AM4', buyLinks: createBuyLinks('AMD Ryzen 3 4100') },
    { id: 'cpu-r5-5500', name: 'AMD Ryzen 5 5500', brand: 'AMD', price: 89, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.6 GHz', tier: 2, cpuScore: 61, specs: '6 Cores / 12 Threads, 3.6 GHz, 65W, AM4', buyLinks: createBuyLinks('AMD Ryzen 5 5500') },
    { id: 'cpu-r5-5600', name: 'AMD Ryzen 5 5600', brand: 'AMD', price: 119, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.5 GHz', tier: 5, cpuScore: 71, specs: '6 Cores / 12 Threads, 3.5 GHz, 65W, AM4', buyLinks: createBuyLinks('AMD Ryzen 5 5600') },
    { id: 'cpu-r5-5600x', name: 'AMD Ryzen 5 5600X', brand: 'AMD', price: 129, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.7 GHz', tier: 5, cpuScore: 72, specs: '6 Cores / 12 Threads, 3.7 GHz, 65W, AM4', buyLinks: createBuyLinks('AMD Ryzen 5 5600X') },
    { id: 'cpu-r7-5700x', name: 'AMD Ryzen 7 5700X', brand: 'AMD', price: 165, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 8, freq: '3.4 GHz', tier: 4, cpuScore: 74, specs: '8 Cores / 16 Threads, 3.4 GHz, 65W, AM4', buyLinks: createBuyLinks('AMD Ryzen 7 5700X') },
    { id: 'cpu-r7-5700x3d', name: 'AMD Ryzen 7 5700X3D', brand: 'AMD', price: 199, socket: 'AM4', tdp: 105, ramType: 'DDR4', cores: 8, freq: '3.0 GHz', tier: 5, cpuScore: 84, specs: '8 Cores / 16 Threads, 3.0 GHz, 3D V-Cache, 105W, AM4', buyLinks: createBuyLinks('AMD Ryzen 7 5700X3D') },
    { id: 'cpu-r7-5800x3d', name: 'AMD Ryzen 7 5800X3D', brand: 'AMD', price: 320, socket: 'AM4', tdp: 105, ramType: 'DDR4', cores: 8, freq: '3.4 GHz', tier: 6, cpuScore: 86, specs: '8 Cores / 16 Threads, 3.4 GHz, 3D V-Cache, 105W, AM4', buyLinks: createBuyLinks('AMD Ryzen 7 5800X3D') },
    { id: 'cpu-r9-5900x', name: 'AMD Ryzen 9 5900X', brand: 'AMD', price: 275, socket: 'AM4', tdp: 105, ramType: 'DDR4', cores: 12, freq: '3.7 GHz', tier: 6, cpuScore: 76, specs: '12 Cores / 24 Threads, 3.7 GHz, 105W, AM4', buyLinks: createBuyLinks('AMD Ryzen 9 5900X') },
    { id: 'cpu-r9-5950x', name: 'AMD Ryzen 9 5950X', brand: 'AMD', price: 380, socket: 'AM4', tdp: 105, ramType: 'DDR4', cores: 16, freq: '3.4 GHz', tier: 7, cpuScore: 78, specs: '16 Cores / 32 Threads, 3.4 GHz, 105W, AM4', buyLinks: createBuyLinks('AMD Ryzen 9 5950X') },
    
    // AM5 (15)
    { id: 'cpu-r5-7500f', name: 'AMD Ryzen 5 7500F', brand: 'AMD', price: 150, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '3.7 GHz', tier: 4, cpuScore: 82, specs: '6 Cores / 12 Threads, 3.7 GHz, 65W, AM5', buyLinks: createBuyLinks('AMD Ryzen 5 7500F') },
    { id: 'cpu-r5-7600', name: 'AMD Ryzen 5 7600', brand: 'AMD', price: 189, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '3.8 GHz', tier: 7, cpuScore: 84, specs: '6 Cores / 12 Threads, 3.8 GHz, 65W, AM5', buyLinks: createBuyLinks('AMD Ryzen 5 7600') },
    { id: 'cpu-r5-7600x', name: 'AMD Ryzen 5 7600X', brand: 'AMD', price: 199, socket: 'AM5', tdp: 105, ramType: 'DDR5', cores: 6, freq: '4.7 GHz', tier: 5, cpuScore: 85, specs: '6 Cores / 12 Threads, 4.7 GHz, 105W, AM5', buyLinks: createBuyLinks('AMD Ryzen 5 7600X') },
    { id: 'cpu-r7-7700', name: 'AMD Ryzen 7 7700', brand: 'AMD', price: 260, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 8, freq: '3.8 GHz', tier: 6, cpuScore: 84, specs: '8 Cores / 16 Threads, 3.8 GHz, 65W, AM5', buyLinks: createBuyLinks('AMD Ryzen 7 7700') },
    { id: 'cpu-r7-7700x', name: 'AMD Ryzen 7 7700X', brand: 'AMD', price: 269, socket: 'AM5', tdp: 105, ramType: 'DDR5', cores: 8, freq: '4.5 GHz', tier: 6, cpuScore: 86, specs: '8 Cores / 16 Threads, 4.5 GHz, 105W, AM5', buyLinks: createBuyLinks('AMD Ryzen 7 7700X') },
    { id: 'cpu-r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', price: 359, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 8, freq: '4.2 GHz', tier: 10, cpuScore: 100, specs: '8 Cores / 16 Threads, 4.2 GHz, 3D V-Cache, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 7 7800X3D') },
    { id: 'cpu-r9-7900x', name: 'AMD Ryzen 9 7900X', brand: 'AMD', price: 349, socket: 'AM5', tdp: 170, ramType: 'DDR5', cores: 12, freq: '4.7 GHz', tier: 8, cpuScore: 88, specs: '12 Cores / 24 Threads, 4.7 GHz, 170W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 7900X') },
    { id: 'cpu-r9-7900x3d', name: 'AMD Ryzen 9 7900X3D', brand: 'AMD', price: 440, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 12, freq: '4.4 GHz', tier: 8, cpuScore: 94, specs: '12 Cores / 24 Threads, 4.4 GHz, 3D V-Cache, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 7900X3D') },
    { id: 'cpu-r9-7950x', name: 'AMD Ryzen 9 7950X', brand: 'AMD', price: 549, socket: 'AM5', tdp: 170, ramType: 'DDR5', cores: 16, freq: '4.5 GHz', tier: 9, cpuScore: 90, specs: '16 Cores / 32 Threads, 4.5 GHz, 170W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 7950X') },
    { id: 'cpu-r9-7950x3d', name: 'AMD Ryzen 9 7950X3D', brand: 'AMD', price: 529, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 16, freq: '4.2 GHz', tier: 10, cpuScore: 98, specs: '16 Cores / 32 Threads, 4.2 GHz, 3D V-Cache, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 7950X3D') },
    { id: 'cpu-r5-9600x', name: 'AMD Ryzen 5 9600X', brand: 'AMD', price: 249, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '3.9 GHz', tier: 6, cpuScore: 86, specs: '6 Cores / 12 Threads, 3.9 GHz, Zen 5, 65W, AM5', buyLinks: createBuyLinks('AMD Ryzen 5 9600X') },
    { id: 'cpu-r7-9700x', name: 'AMD Ryzen 7 9700X', brand: 'AMD', price: 329, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 8, freq: '3.8 GHz', tier: 7, cpuScore: 88, specs: '8 Cores / 16 Threads, 3.8 GHz, Zen 5, 65W, AM5', buyLinks: createBuyLinks('AMD Ryzen 7 9700X') },
    { id: 'cpu-r9-9900x', name: 'AMD Ryzen 9 9900X', brand: 'AMD', price: 429, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 12, freq: '4.4 GHz', tier: 9, cpuScore: 90, specs: '12 Cores / 24 Threads, 4.4 GHz, Zen 5, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 9900X') },
    { id: 'cpu-r9-9950x', name: 'AMD Ryzen 9 9950X', brand: 'AMD', price: 599, socket: 'AM5', tdp: 170, ramType: 'DDR5', cores: 16, freq: '4.3 GHz', tier: 10, cpuScore: 92, specs: '16 Cores / 32 Threads, 4.3 GHz, Zen 5, 170W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 9950X') },
    { id: 'cpu-r9-9950x3d', name: 'AMD Ryzen 9 9950X3D', brand: 'AMD', price: 699, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 16, freq: '4.2 GHz', tier: 10, cpuScore: 104, specs: '16 Cores / 32 Threads, 4.2 GHz, 3D V-Cache, Zen 5, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 9 9950X3D') },
    
    // LGA1700 (12)
    { id: 'cpu-i3-12100f', name: 'Intel Core i3-12100F', brand: 'Intel', price: 85, socket: 'LGA1700', tdp: 58, maxTdp: 89, ramType: 'DDR4', cores: 4, freq: '3.3 GHz', tier: 4, cpuScore: 68, specs: '4 Cores (4P+0E) / 8 Threads, 3.3 GHz, 58W, LGA1700', buyLinks: createBuyLinks('Intel Core i3-12100F') },
    { id: 'cpu-i5-12400f', name: 'Intel Core i5-12400F', brand: 'Intel', price: 129, socket: 'LGA1700', tdp: 65, maxTdp: 117, ramType: 'DDR4', cores: 6, freq: '2.5 GHz', tier: 5, cpuScore: 72, specs: '6 Cores (6P+0E) / 12 Threads, 2.5 GHz, 65W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-12400F') },
    { id: 'cpu-i5-13400f', name: 'Intel Core i5-13400F', brand: 'Intel', price: 179, socket: 'LGA1700', tdp: 65, maxTdp: 148, ramType: 'DDR4', cores: 10, freq: '2.5 GHz', tier: 5, cpuScore: 77, specs: '10 Cores (6P+4E) / 16 Threads, 2.5 GHz, 65W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-13400F') },
    { id: 'cpu-i5-13500', name: 'Intel Core i5-13500', brand: 'Intel', price: 220, socket: 'LGA1700', tdp: 65, maxTdp: 154, ramType: 'DDR4', cores: 14, freq: '2.5 GHz', tier: 6, cpuScore: 80, specs: '14 Cores (6P+8E) / 20 Threads, 2.5 GHz, 65W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-13500') },
    { id: 'cpu-i5-13600k', name: 'Intel Core i5-13600K', brand: 'Intel', price: 249, socket: 'LGA1700', tdp: 125, maxTdp: 181, ramType: 'DDR5', cores: 14, freq: '3.5 GHz', tier: 7, cpuScore: 88, specs: '14 Cores (6P+8E) / 20 Threads, 3.5 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-13600K') },
    { id: 'cpu-i5-14400f', name: 'Intel Core i5-14400F', brand: 'Intel', price: 189, socket: 'LGA1700', tdp: 65, maxTdp: 148, ramType: 'DDR5', cores: 10, freq: '2.5 GHz', tier: 5, cpuScore: 78, specs: '10 Cores (6P+4E) / 16 Threads, 2.5 GHz, 65W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-14400F') },
    { id: 'cpu-i5-14600k', name: 'Intel Core i5-14600K', brand: 'Intel', price: 279, socket: 'LGA1700', tdp: 125, maxTdp: 181, ramType: 'DDR5', cores: 14, freq: '3.5 GHz', tier: 7, cpuScore: 89, specs: '14 Cores (6P+8E) / 20 Threads, 3.5 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i5-14600K') },
    { id: 'cpu-i7-13700k', name: 'Intel Core i7-13700K', brand: 'Intel', price: 345, socket: 'LGA1700', tdp: 125, maxTdp: 253, ramType: 'DDR5', cores: 16, freq: '3.4 GHz', tier: 8, cpuScore: 90, specs: '16 Cores (8P+8E) / 24 Threads, 3.4 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i7-13700K') },
    { id: 'cpu-i7-14700k', name: 'Intel Core i7-14700K', brand: 'Intel', price: 369, socket: 'LGA1700', tdp: 125, maxTdp: 253, ramType: 'DDR5', cores: 20, freq: '3.4 GHz', tier: 8, cpuScore: 92, specs: '20 Cores (8P+12E) / 28 Threads, 3.4 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i7-14700K') },
    { id: 'cpu-i9-13900k', name: 'Intel Core i9-13900K', brand: 'Intel', price: 475, socket: 'LGA1700', tdp: 125, maxTdp: 253, ramType: 'DDR5', cores: 24, freq: '3.0 GHz', tier: 9, cpuScore: 93, specs: '24 Cores (8P+16E) / 32 Threads, 3.0 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i9-13900K') },
    { id: 'cpu-i9-14900k', name: 'Intel Core i9-14900K', brand: 'Intel', price: 499, socket: 'LGA1700', tdp: 125, maxTdp: 253, ramType: 'DDR5', cores: 24, freq: '3.2 GHz', tier: 10, cpuScore: 94, specs: '24 Cores (8P+16E) / 32 Threads, 3.2 GHz, 125W, LGA1700', buyLinks: createBuyLinks('Intel Core i9-14900K') },
    { id: 'cpu-i9-14900ks', name: 'Intel Core i9-14900KS', brand: 'Intel', price: 689, socket: 'LGA1700', tdp: 150, maxTdp: 320, ramType: 'DDR5', cores: 24, freq: '3.2 GHz', tier: 10, cpuScore: 96, specs: '24 Cores (8P+16E) / 32 Threads, 3.2 GHz, 150W, LGA1700', buyLinks: createBuyLinks('Intel Core i9-14900KS') },
    
    // LGA1851 (5)
    { id: 'cpu-u5-245k', name: 'Intel Core Ultra 5 245K', brand: 'Intel', price: 289, socket: 'LGA1851', tdp: 125, maxTdp: 159, ramType: 'DDR5', cores: 14, freq: '4.2 GHz', tier: 7, cpuScore: 85, specs: '14 Cores (6P+8E) / 14 Threads, 4.2 GHz, 125W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 5 245K') },
    { id: 'cpu-u5-245kf', name: 'Intel Core Ultra 5 245KF', brand: 'Intel', price: 294, socket: 'LGA1851', tdp: 125, maxTdp: 159, ramType: 'DDR5', cores: 14, freq: '4.2 GHz', tier: 7, cpuScore: 85, specs: '14 Cores (6P+8E) / 14 Threads, 4.2 GHz, 125W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 5 245KF') },
    { id: 'cpu-u7-265k', name: 'Intel Core Ultra 7 265K', brand: 'Intel', price: 379, socket: 'LGA1851', tdp: 125, maxTdp: 250, ramType: 'DDR5', cores: 20, freq: '3.9 GHz', tier: 9, cpuScore: 89, specs: '20 Cores (8P+12E) / 20 Threads, 3.9 GHz, 125W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 7 265K') },
    { id: 'cpu-u7-265kf', name: 'Intel Core Ultra 7 265KF', brand: 'Intel', price: 379, socket: 'LGA1851', tdp: 125, maxTdp: 250, ramType: 'DDR5', cores: 20, freq: '3.9 GHz', tier: 9, cpuScore: 89, specs: '20 Cores (8P+12E) / 20 Threads, 3.9 GHz, 125W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 7 265KF') },
    { id: 'cpu-u9-285k', name: 'Intel Core Ultra 9 285K', brand: 'Intel', price: 569, socket: 'LGA1851', tdp: 125, maxTdp: 250, ramType: 'DDR5', cores: 24, freq: '3.7 GHz', tier: 10, cpuScore: 91, specs: '24 Cores (8P+16E) / 24 Threads, 3.7 GHz, 125W, LGA1851', buyLinks: createBuyLinks('Intel Core Ultra 9 285K') },
    
    // Additional budget/mid options
    { id: 'cpu-r5-4500', name: 'AMD Ryzen 5 4500', brand: 'AMD', price: 75, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.6 GHz', tier: 2, cpuScore: 52, specs: '6 Cores / 12 Threads, 3.6 GHz, 65W, AM4', buyLinks: createBuyLinks('AMD Ryzen 5 4500') },
    { id: 'cpu-i3-13100f', name: 'Intel Core i3-13100F', brand: 'Intel', price: 109, socket: 'LGA1700', tdp: 58, maxTdp: 89, ramType: 'DDR4', cores: 4, freq: '3.4 GHz', tier: 4, cpuScore: 69, specs: '4 Cores (4P+0E) / 8 Threads, 3.4 GHz, 58W, LGA1700', buyLinks: createBuyLinks('Intel Core i3-13100F') },
  ],
  motherboard: [
    // B850 & B840 (AM5)
    { id: 'mb-b850m-ds3h', name: 'Gigabyte B850M DS3H', brand: 'Gigabyte', price: 129, socket: 'AM5', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'B850, Micro-ATX, 4xDDR5, PCIe 5.0 M.2, 2.5GbE', buyLinks: createBuyLinks('Gigabyte B850M DS3H') },
    { id: 'mb-b850-gaming-wifi', name: 'MSI B850 GAMING PLUS WIFI', brand: 'MSI', price: 179, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'B850, ATX, 4xDDR5, PCIe 5.0 M.2, Wi-Fi 7', buyLinks: createBuyLinks('MSI B850 GAMING PLUS WIFI') },
    { id: 'mb-b850-aorus-elite', name: 'Gigabyte B850 AORUS ELITE AX', brand: 'Gigabyte', price: 219, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'B850, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('Gigabyte B850 AORUS ELITE AX') },
    // B860 (LGA1851)
    { id: 'mb-b860-pro-rs', name: 'ASRock B860 Pro RS WiFi', brand: 'ASRock', price: 159, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX', specs: 'B860, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('ASRock B860 Pro RS WiFi') },

    { id: 'mb-x870e-hero', name: 'ASUS ROG Crosshair X870E Hero', brand: 'ASUS', price: 699, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'Flagship X870E, WiFi 7, 18+2+2 Power Stages', buyLinks: createBuyLinks('ASUS ROG Crosshair X870E Hero') },
    // AM4 (5)
    { id: 'mb-a520m-k', name: 'ASUS Prime A520M-K', brand: 'ASUS', price: 65, socket: 'AM4', ramType: 'DDR4', formFactor: 'Micro-ATX', specs: 'A520, Micro-ATX, 2xDDR4, PCIe 3.0', buyLinks: createBuyLinks('ASUS Prime A520M-K') },
    { id: 'mb-b550m-ds3h', name: 'Gigabyte B550M DS3H', brand: 'Gigabyte', price: 95, socket: 'AM4', ramType: 'DDR4', formFactor: 'Micro-ATX', specs: 'B550, Micro-ATX, 4xDDR4, PCIe 4.0', buyLinks: createBuyLinks('Gigabyte B550M DS3H') },
    { id: 'mb-b550-tomahawk', name: 'MSI MAG B550 TOMAHAWK', brand: 'MSI', price: 145, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX', specs: 'B550, ATX, 4xDDR4, PCIe 4.0, 2.5GbE', buyLinks: createBuyLinks('MSI MAG B550 TOMAHAWK') },
    { id: 'mb-b550i-aorus', name: 'Gigabyte B550I AORUS PRO AX', brand: 'Gigabyte', price: 180, socket: 'AM4', ramType: 'DDR4', formFactor: 'Mini-ITX', specs: 'B550, Mini-ITX, 2xDDR4, Wi-Fi 6', buyLinks: createBuyLinks('Gigabyte B550I AORUS PRO AX') },
    { id: 'mb-x570s-aorus', name: 'Gigabyte X570S AORUS ELITE AX', brand: 'Gigabyte', price: 210, socket: 'AM4', ramType: 'DDR4', formFactor: 'ATX', specs: 'X570S, ATX, 4xDDR4, Wi-Fi 6', buyLinks: createBuyLinks('Gigabyte X570S AORUS ELITE AX') },

    // AM5 (11)
    { id: 'mb-a620m-e', name: 'MSI PRO A620M-E', brand: 'MSI', price: 85, socket: 'AM5', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'A620, Micro-ATX, 2xDDR5, PCIe 4.0', buyLinks: createBuyLinks('MSI PRO A620M-E') },
    { id: 'mb-b650m-k', name: 'Gigabyte B650M K', brand: 'Gigabyte', price: 119, socket: 'AM5', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'B650, Micro-ATX, 4xDDR5, PCIe 4.0', buyLinks: createBuyLinks('Gigabyte B650M K') },
    { id: 'mb-b650m-aorus-elite-ax', name: 'Gigabyte B650M AORUS ELITE AX', brand: 'Gigabyte', price: 169, socket: 'AM5', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'B650, Micro-ATX, 4xDDR5, Wi-Fi 6E', buyLinks: createBuyLinks('Gigabyte B650M AORUS ELITE AX') },
    { id: 'mb-b650-tomahawk', name: 'MSI MAG B650 TOMAHAWK WIFI', brand: 'MSI', price: 199, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'B650, ATX, 4xDDR5, Wi-Fi 6E', buyLinks: createBuyLinks('MSI MAG B650 TOMAHAWK WIFI') },
    { id: 'mb-b650e-f-rog', name: 'ASUS ROG STRIX B650E-F GAMING WIFI', brand: 'ASUS', price: 259, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'B650E, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 6E', buyLinks: createBuyLinks('ASUS ROG STRIX B650E-F GAMING WIFI') },
    { id: 'mb-b650i-edge', name: 'MSI MPG B650I EDGE WIFI', brand: 'MSI', price: 239, socket: 'AM5', ramType: 'DDR5', formFactor: 'Mini-ITX', specs: 'B650, Mini-ITX, 2xDDR5, Wi-Fi 6E', buyLinks: createBuyLinks('MSI MPG B650I EDGE WIFI') },
    { id: 'mb-x670e-tuf', name: 'ASUS TUF GAMING X670E-PLUS WIFI', brand: 'ASUS', price: 299, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'X670E, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 6E', buyLinks: createBuyLinks('ASUS TUF GAMING X670E-PLUS WIFI') },
    { id: 'mb-x670e-aorus-master', name: 'Gigabyte X670E AORUS MASTER', brand: 'Gigabyte', price: 399, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'X670E, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 6E', buyLinks: createBuyLinks('Gigabyte X670E AORUS MASTER') },
    { id: 'mb-x870-tomahawk', name: 'MSI MAG X870 TOMAHAWK WIFI', brand: 'MSI', price: 279, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'X870, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('MSI MAG X870 TOMAHAWK WIFI') },
    { id: 'mb-x870e-aorus-pro', name: 'Gigabyte X870E AORUS PRO', brand: 'Gigabyte', price: 359, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'X870E, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('Gigabyte X870E AORUS PRO') },
    { id: 'mb-x870e-crosshair', name: 'ASUS ROG CROSSHAIR X870E HERO', brand: 'ASUS', price: 699, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'X870E, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7, 2x USB4', buyLinks: createBuyLinks('ASUS ROG CROSSHAIR X870E HERO') },

    // LGA1700 (7)
    { id: 'mb-h610m-k', name: 'ASUS Prime H610M-K D4', brand: 'ASUS', price: 79, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'Micro-ATX', specs: 'H610, Micro-ATX, 2xDDR4, PCIe 4.0', buyLinks: createBuyLinks('ASUS Prime H610M-K D4') },
    { id: 'mb-b760m-ds3h-d4', name: 'Gigabyte B760M DS3H DDR4', brand: 'Gigabyte', price: 109, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'Micro-ATX', specs: 'B760, Micro-ATX, 4xDDR4, PCIe 4.0', buyLinks: createBuyLinks('Gigabyte B760M DS3H DDR4') },
    { id: 'mb-b760m-aorus-elite-ax', name: 'Gigabyte B760M AORUS ELITE AX', brand: 'Gigabyte', price: 159, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'B760, Micro-ATX, 4xDDR5, Wi-Fi 6E', buyLinks: createBuyLinks('Gigabyte B760M AORUS ELITE AX') },
    { id: 'mb-b760-tomahawk', name: 'MSI MAG B760 TOMAHAWK WIFI', brand: 'MSI', price: 189, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', specs: 'B760, ATX, 4xDDR5, Wi-Fi 6E', buyLinks: createBuyLinks('MSI MAG B760 TOMAHAWK WIFI') },
    { id: 'mb-z790-p-wifi', name: 'ASUS PRIME Z790-P WIFI', brand: 'ASUS', price: 219, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', specs: 'Z790, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 6', buyLinks: createBuyLinks('ASUS PRIME Z790-P WIFI') },
    { id: 'mb-z790-tomahawk', name: 'MSI MAG Z790 TOMAHAWK MAX WIFI', brand: 'MSI', price: 259, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'ATX', specs: 'Z790, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('MSI MAG Z790 TOMAHAWK MAX WIFI') },
    { id: 'mb-z790i-edge', name: 'MSI MPG Z790I EDGE WIFI', brand: 'MSI', price: 329, socket: 'LGA1700', ramType: 'DDR5', formFactor: 'Mini-ITX', specs: 'Z790, Mini-ITX, 2xDDR5, PCIe 5.0, Wi-Fi 6E', buyLinks: createBuyLinks('MSI MPG Z790I EDGE WIFI') },
    { id: 'mb-z690-a-pro', name: 'MSI PRO Z690-A DDR4', brand: 'MSI', price: 139, socket: 'LGA1700', ramType: 'DDR4', formFactor: 'ATX', specs: 'Z690, ATX, 4xDDR4, PCIe 5.0', buyLinks: createBuyLinks('MSI PRO Z690-A DDR4') },

    // LGA1851 (4)
    { id: 'mb-z890-pro-rs', name: 'ASRock Z890 Pro RS WiFi', brand: 'ASRock', price: 219, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX', specs: 'Z890, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('ASRock Z890 Pro RS WiFi') },
    { id: 'mb-z890-tomahawk', name: 'MSI MAG Z890 TOMAHAWK WIFI', brand: 'MSI', price: 279, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX', specs: 'Z890, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('MSI MAG Z890 TOMAHAWK WIFI') },
    { id: 'mb-z890-aorus-elite', name: 'Gigabyte Z890 AORUS ELITE WIFI7', brand: 'Gigabyte', price: 289, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX', specs: 'Z890, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('Gigabyte Z890 AORUS ELITE WIFI7') },
    { id: 'mb-z890-rog-strix-f', name: 'ASUS ROG STRIX Z890-F GAMING WIFI', brand: 'ASUS', price: 379, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'ATX', specs: 'Z890, ATX, 4xDDR5, PCIe 5.0, Wi-Fi 7', buyLinks: createBuyLinks('ASUS ROG STRIX Z890-F GAMING WIFI') },
    { id: 'mb-b860m-aorus-elite', name: 'Gigabyte B860M AORUS ELITE AX', brand: 'Gigabyte', price: 169, socket: 'LGA1851', ramType: 'DDR5', formFactor: 'Micro-ATX', specs: 'B860, Micro-ATX, 4xDDR5, Wi-Fi 7', buyLinks: createBuyLinks('Gigabyte B860M AORUS ELITE AX') }
  ],
  cooler: [
    // Air (13)
    { id: 'clr-ak400', name: 'Deepcool AK400', brand: 'Deepcool', price: 35, type: 'air', maxTdp: 220, height: 155, specs: 'Air Cooler, 120mm Fan, 155mm Height, 220W TDP', buyLinks: createBuyLinks('Deepcool AK400') },
    { id: 'clr-ak620', name: 'Deepcool AK620', brand: 'Deepcool', price: 65, type: 'air', maxTdp: 260, height: 160, specs: 'Dual Tower Air Cooler, 2x120mm Fans, 160mm Height, 260W TDP', buyLinks: createBuyLinks('Deepcool AK620') },
    { id: 'clr-ak620-digital', name: 'Deepcool AK620 DIGITAL', brand: 'Deepcool', price: 80, type: 'air', maxTdp: 260, height: 162, specs: 'Dual Tower Air Cooler with Status Display, 162mm Height', buyLinks: createBuyLinks('Deepcool AK620 DIGITAL') },
    { id: 'clr-pa120-se', name: 'Thermalright Peerless Assassin 120 SE', brand: 'Thermalright', price: 35, type: 'air', maxTdp: 260, height: 155, specs: 'Dual Tower Air Cooler, 155mm Height, Extreme Value', buyLinks: createBuyLinks('Thermalright Peerless Assassin 120 SE') },
    { id: 'clr-ps120', name: 'Thermalright Phantom Spirit 120', brand: 'Thermalright', price: 42, type: 'air', maxTdp: 280, height: 154, specs: 'Dual Tower Air Cooler, 7 Heatpipes, 154mm Height', buyLinks: createBuyLinks('Thermalright Phantom Spirit 120') },
    { id: 'clr-u12a', name: 'Noctua NH-U12A', brand: 'Noctua', price: 120, type: 'air', maxTdp: 200, height: 158, specs: 'Premium Single Tower, 2xNF-A12x25 Fans, 158mm Height', buyLinks: createBuyLinks('Noctua NH-U12A') },
    { id: 'clr-d15-g2', name: 'Noctua NH-D15 G2', brand: 'Noctua', price: 150, type: 'air', maxTdp: 300, height: 168, specs: 'Flagship Dual Tower, 2xNF-A14x25r G2 Fans, 168mm Height', buyLinks: createBuyLinks('Noctua NH-D15 G2') },
    { id: 'clr-dr4', name: 'be quiet! Dark Rock 4', brand: 'be quiet!', price: 75, type: 'air', maxTdp: 200, height: 159, specs: 'Single Tower, 135mm Fan, 159mm Height, 200W TDP', buyLinks: createBuyLinks('be quiet! Dark Rock 4') },
    { id: 'clr-drp5', name: 'be quiet! Dark Rock Pro 5', brand: 'be quiet!', price: 100, type: 'air', maxTdp: 270, height: 168, specs: 'Dual Tower, 135/120mm Fans, 168mm Height, 270W TDP', buyLinks: createBuyLinks('be quiet! Dark Rock Pro 5') },
    { id: 'clr-fuma3', name: 'Scythe Fuma 3', brand: 'Scythe', price: 50, type: 'air', maxTdp: 250, height: 154, specs: 'Dual Tower, Asymmetrical Design, 154mm Height', buyLinks: createBuyLinks('Scythe Fuma 3') },
    { id: 'clr-se214xt', name: 'ID-Cooling SE-214-XT', brand: 'ID-Cooling', price: 20, type: 'air', maxTdp: 180, height: 150, specs: 'Budget Air Cooler, ARGB 120mm Fan, 150mm Height', buyLinks: createBuyLinks('ID-Cooling SE-214-XT') },
    { id: 'clr-hyper212-v2', name: 'Cooler Master Hyper 212 Evo V2', brand: 'Cooler Master', price: 40, type: 'air', maxTdp: 180, height: 155, specs: 'Classic Single Tower, 155mm Height', buyLinks: createBuyLinks('Cooler Master Hyper 212 Evo V2') },
    { id: 'clr-ak500', name: 'Deepcool AK500', brand: 'Deepcool', price: 55, type: 'air', maxTdp: 240, height: 158, specs: 'Thick Single Tower, 158mm Height', buyLinks: createBuyLinks('Deepcool AK500') },

    // Low Profile (3)
    { id: 'clr-l9i-17xx', name: 'Noctua NH-L9i-17xx', brand: 'Noctua', price: 45, type: 'air', maxTdp: 65, height: 37, specs: 'Ultra-Low Profile for LGA1700/1851, 37mm Height', buyLinks: createBuyLinks('Noctua NH-L9i-17xx') },
    { id: 'clr-l9a-am5', name: 'Noctua NH-L9a-AM5', brand: 'Noctua', price: 45, type: 'air', maxTdp: 65, height: 37, specs: 'Ultra-Low Profile for AM5, 37mm Height', buyLinks: createBuyLinks('Noctua NH-L9a-AM5') },
    { id: 'clr-axp90-x47', name: 'Thermalright AXP90-X47', brand: 'Thermalright', price: 30, type: 'air', maxTdp: 125, height: 47, specs: 'Low Profile, Full Copper, 47mm Height', buyLinks: createBuyLinks('Thermalright AXP90-X47') },

    // AIO (9)
    { id: 'clr-lf3-240', name: 'Arctic Liquid Freezer III 240', brand: 'Arctic', price: 95, type: 'aio', maxTdp: 250, radiatorSize: 240, specs: '240mm AIO, 38mm Thick Radiator, VRM Fan', buyLinks: createBuyLinks('Arctic Liquid Freezer III 240') },
    { id: 'clr-lf3-360', name: 'Arctic Liquid Freezer III 360', brand: 'Arctic', price: 115, type: 'aio', maxTdp: 300, radiatorSize: 360, specs: '360mm AIO, 38mm Thick Radiator, VRM Fan', buyLinks: createBuyLinks('Arctic Liquid Freezer III 360') },
    { id: 'clr-ls520', name: 'Deepcool LS520', brand: 'Deepcool', price: 90, type: 'aio', maxTdp: 280, radiatorSize: 240, specs: '240mm ARGB AIO Liquid Cooler', buyLinks: createBuyLinks('Deepcool LS520') },
    { id: 'clr-ls720', name: 'Deepcool LS720', brand: 'Deepcool', price: 120, type: 'aio', maxTdp: 320, radiatorSize: 360, specs: '360mm ARGB AIO Liquid Cooler', buyLinks: createBuyLinks('Deepcool LS720') },
    { id: 'clr-kraken-240', name: 'NZXT Kraken 240', brand: 'NZXT', price: 140, type: 'aio', maxTdp: 250, radiatorSize: 240, specs: '240mm AIO, LCD Display on Pump', buyLinks: createBuyLinks('NZXT Kraken 240') },
    { id: 'clr-kraken-360', name: 'NZXT Kraken 360', brand: 'NZXT', price: 180, type: 'aio', maxTdp: 300, radiatorSize: 360, specs: '360mm AIO, LCD Display on Pump', buyLinks: createBuyLinks('NZXT Kraken 360') },
    { id: 'clr-h100i', name: 'Corsair iCUE H100i RGB ELITE', brand: 'Corsair', price: 130, type: 'aio', maxTdp: 250, radiatorSize: 240, specs: '240mm AIO, AF ELITE Series Fans', buyLinks: createBuyLinks('Corsair iCUE H100i RGB ELITE') },
    { id: 'clr-h150i', name: 'Corsair iCUE H150i RGB ELITE', brand: 'Corsair', price: 170, type: 'aio', maxTdp: 300, radiatorSize: 360, specs: '360mm AIO, AF ELITE Series Fans', buyLinks: createBuyLinks('Corsair iCUE H150i RGB ELITE') },
    { id: 'clr-silent-loop2-360', name: 'be quiet! Silent Loop 2 360', brand: 'be quiet!', price: 160, type: 'aio', maxTdp: 300, radiatorSize: 360, specs: 'Premium 360mm AIO, Refill Port', buyLinks: createBuyLinks('be quiet! Silent Loop 2 360') }
  ],
  ram: [
    // DDR4 (7)
    { id: 'ram-k8g-3200', name: 'Kingston FURY Beast 8GB 3200MHz', brand: 'Kingston', price: 25, type: 'DDR4', ramType: 'DDR4', capacity: '8GB', speed: 3200, kit: '1x8GB', specs: '8GB (1x8GB) DDR4-3200 CL16', buyLinks: createBuyLinks('Kingston FURY Beast 8GB 3200MHz') },
    { id: 'ram-k16g-3200', name: 'Kingston FURY Beast 16GB (2x8GB) 3200MHz', brand: 'Kingston', price: 40, type: 'DDR4', ramType: 'DDR4', capacity: '16GB', speed: 3200, kit: '2x8GB', specs: '16GB (2x8GB) DDR4-3200 CL16', buyLinks: createBuyLinks('Kingston FURY Beast 16GB 3200MHz') },
    { id: 'ram-cv16g-3200', name: 'Corsair Vengeance LPX 16GB (2x8GB) 3200MHz', brand: 'Corsair', price: 38, type: 'DDR4', ramType: 'DDR4', capacity: '16GB', speed: 3200, kit: '2x8GB', specs: '16GB (2x8GB) DDR4-3200 CL16, Low Profile', buyLinks: createBuyLinks('Corsair Vengeance LPX 16GB 3200MHz') },
    { id: 'ram-gv32g-3200', name: 'G.Skill Ripjaws V 32GB (2x16GB) 3200MHz', brand: 'G.Skill', price: 65, type: 'DDR4', ramType: 'DDR4', capacity: '32GB', speed: 3200, kit: '2x16GB', specs: '32GB (2x16GB) DDR4-3200 CL16', buyLinks: createBuyLinks('G.Skill Ripjaws V 32GB 3200MHz') },
    { id: 'ram-k32g-3600', name: 'Kingston FURY Beast 32GB (2x16GB) 3600MHz', brand: 'Kingston', price: 75, type: 'DDR4', ramType: 'DDR4', capacity: '32GB', speed: 3600, kit: '2x16GB', specs: '32GB (2x16GB) DDR4-3600 CL18', buyLinks: createBuyLinks('Kingston FURY Beast 32GB 3600MHz') },
    { id: 'ram-gtz64g-3600', name: 'G.Skill Trident Z Neo 64GB (2x32GB) 3600MHz', brand: 'G.Skill', price: 150, type: 'DDR4', ramType: 'DDR4', capacity: '64GB', speed: 3600, kit: '2x32GB', specs: '64GB (2x32GB) DDR4-3600 CL18 RGB', buyLinks: createBuyLinks('G.Skill Trident Z Neo 64GB 3600MHz') },
    { id: 'ram-cv32g-3600', name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) 3600MHz', brand: 'Corsair', price: 85, type: 'DDR4', ramType: 'DDR4', capacity: '32GB', speed: 3600, kit: '2x16GB', specs: '32GB (2x16GB) DDR4-3600 CL18 RGB', buyLinks: createBuyLinks('Corsair Vengeance RGB Pro 32GB 3600MHz') },

    // DDR5 (10)
    { id: 'ram-kfb16g-5200', name: 'Kingston FURY Beast 16GB (2x8GB) 5200MHz', brand: 'Kingston', price: 65, type: 'DDR5', ramType: 'DDR5', capacity: '16GB', speed: 5200, kit: '2x8GB', specs: '16GB (2x8GB) DDR5-5200 CL40', buyLinks: createBuyLinks('Kingston FURY Beast 16GB 5200MHz') },
    { id: 'ram-cv16g-5600', name: 'Corsair Vengeance 16GB (2x8GB) 5600MHz', brand: 'Corsair', price: 70, type: 'DDR5', ramType: 'DDR5', capacity: '16GB', speed: 5600, kit: '2x8GB', specs: '16GB (2x8GB) DDR5-5600 CL40', buyLinks: createBuyLinks('Corsair Vengeance 16GB 5600MHz') },
    { id: 'ram-grs32g-6000', name: 'G.Skill Ripjaws S5 32GB (2x16GB) 6000MHz', brand: 'G.Skill', price: 99, type: 'DDR5', ramType: 'DDR5', capacity: '32GB', speed: 6000, kit: '2x16GB', specs: '32GB (2x16GB) DDR5-6000 CL30, Low Profile', buyLinks: createBuyLinks('G.Skill Ripjaws S5 32GB 6000MHz') },
    { id: 'ram-gtz32g-6400', name: 'G.Skill Trident Z5 32GB (2x16GB) 6400MHz', brand: 'G.Skill', price: 119, type: 'DDR5', ramType: 'DDR5', capacity: '32GB', speed: 6400, kit: '2x16GB', specs: '32GB (2x16GB) DDR5-6400 CL32', buyLinks: createBuyLinks('G.Skill Trident Z5 32GB 6400MHz') },
    { id: 'ram-cd32g-6000', name: 'Corsair Dominator Titanium 32GB (2x16GB) 6000MHz', brand: 'Corsair', price: 145, type: 'DDR5', ramType: 'DDR5', capacity: '32GB', speed: 6000, kit: '2x16GB', specs: '32GB (2x16GB) DDR5-6000 CL30 RGB Premium', buyLinks: createBuyLinks('Corsair Dominator Titanium 32GB 6000MHz') },
    { id: 'ram-kfr32g-6400', name: 'Kingston FURY Renegade 32GB (2x16GB) 6400MHz', brand: 'Kingston', price: 120, type: 'DDR5', ramType: 'DDR5', capacity: '32GB', speed: 6400, kit: '2x16GB', specs: '32GB (2x16GB) DDR5-6400 CL32', buyLinks: createBuyLinks('Kingston FURY Renegade 32GB 6400MHz') },
    { id: 'ram-gtzrgb64g-6400', name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) 6400MHz', brand: 'G.Skill', price: 215, type: 'DDR5', ramType: 'DDR5', capacity: '64GB', speed: 6400, kit: '2x32GB', specs: '64GB (2x32GB) DDR5-6400 CL32 RGB', buyLinks: createBuyLinks('G.Skill Trident Z5 RGB 64GB 6400MHz') },
    { id: 'ram-kfb96g-5600', name: 'Kingston FURY Beast 96GB (2x48GB) 5600MHz', brand: 'Kingston', price: 285, type: 'DDR5', ramType: 'DDR5', capacity: '96GB', speed: 5600, kit: '2x48GB', specs: '96GB (2x48GB) DDR5-5600 CL40', buyLinks: createBuyLinks('Kingston FURY Beast 96GB 5600MHz') },
    { id: 'ram-cv64g-6000', name: 'Corsair Vengeance RGB 64GB (2x32GB) 6000MHz', brand: 'Corsair', price: 205, type: 'DDR5', ramType: 'DDR5', capacity: '64GB', speed: 6000, kit: '2x32GB', specs: '64GB (2x32GB) DDR5-6000 CL30 RGB', buyLinks: createBuyLinks('Corsair Vengeance RGB 64GB 6000MHz') },
    { id: 'ram-gf32g-6000', name: 'G.Skill Flare X5 32GB (2x16GB) 6000MHz', brand: 'G.Skill', price: 95, type: 'DDR5', ramType: 'DDR5', capacity: '32GB', speed: 6000, kit: '2x16GB', specs: '32GB (2x16GB) DDR5-6000 CL30 EXPO', buyLinks: createBuyLinks('G.Skill Flare X5 32GB 6000MHz') }
  ],
  gpu: [
    // 2025-2026 Volume Sellers & Next-Gen Mainstream
    { id: 'gpu-rtx5070ti', name: 'NVIDIA GeForce RTX 5070 Ti', brand: 'NVIDIA', price: 799, tdp: 300, vram: 16, tier: 9, gpuScore: 84, length: 300, specs: '16GB GDDR7, Next Gen 1440p / 4K Ultra, DLSS 4', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5070 Ti') },
    { id: 'gpu-rtx5060ti', name: 'NVIDIA GeForce RTX 5060 Ti 16GB', brand: 'NVIDIA', price: 479, tdp: 180, vram: 16, tier: 6, gpuScore: 56, length: 260, specs: '16GB GDDR7, 1440p Sweet Spot, DLSS 4', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5060 Ti') },
    { id: 'gpu-rtx5060', name: 'NVIDIA GeForce RTX 5060', brand: 'NVIDIA', price: 349, tdp: 130, vram: 12, tier: 5, gpuScore: 45, length: 240, specs: '12GB GDDR7, 1080p Ultra / 1440p Entry, DLSS 4', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5060') },
    { id: 'gpu-rx9060xt', name: 'AMD Radeon RX 9060 XT', brand: 'AMD', price: 399, tdp: 200, vram: 16, tier: 6, gpuScore: 54, length: 260, specs: '16GB GDDR6, RDNA 4, 1440p High Performance', buyLinks: createBuyLinks('AMD Radeon RX 9060 XT') },
    { id: 'gpu-rx9060', name: 'AMD Radeon RX 9060', brand: 'AMD', price: 299, tdp: 160, vram: 12, tier: 5, gpuScore: 44, length: 240, specs: '12GB GDDR6, RDNA 4, 1080p Ultra', buyLinks: createBuyLinks('AMD Radeon RX 9060') },
    { id: 'gpu-b570', name: 'Intel Arc B570', brand: 'Intel', price: 219, tdp: 150, vram: 10, tier: 3, gpuScore: 29, length: 240, specs: '10GB GDDR6, Battlemage, 1080p Esports & Creator', buyLinks: createBuyLinks('Intel Arc B570') },

    // RX 9000 (RDNA 4)
    { id: 'gpu-rx9070', name: 'AMD Radeon RX 9070', brand: 'AMD', price: 549, tdp: 250, vram: 16, tier: 8, gpuScore: 73, length: 280, specs: '16GB GDDR6, 1440p High-End / 4K Entry', buyLinks: createBuyLinks('AMD Radeon RX 9070') },
    { id: 'gpu-rx9070xt', name: 'AMD Radeon RX 9070 XT', brand: 'AMD', price: 649, tdp: 275, vram: 16, tier: 9, gpuScore: 82, length: 300, specs: '16GB GDDR6, 4K High / Ray Tracing', buyLinks: createBuyLinks('AMD Radeon RX 9070 XT') },

    { id: 'gpu-rtx5070', name: 'NVIDIA GeForce RTX 5070', brand: 'NVIDIA', price: 649, tdp: 250, vram: 12, tier: 8, gpuScore: 68, length: 280, specs: '12GB GDDR7, Next Gen 1440p', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5070') },
    { id: 'gpu-rx6500xt', name: 'AMD Radeon RX 6500 XT', brand: 'AMD', price: 139, tdp: 107, vram: 4, tier: 1, gpuScore: 12, length: 220, specs: '4GB GDDR6, PCIe 4.0 x4, 1080p Entry', buyLinks: createBuyLinks('AMD Radeon RX 6500 XT') },
    { id: 'gpu-rx6600', name: 'AMD Radeon RX 6600', brand: 'AMD', price: 189, tdp: 132, vram: 8, tier: 3, gpuScore: 26, length: 220, specs: '8GB GDDR6, 1080p Gaming', buyLinks: createBuyLinks('AMD Radeon RX 6600') },
    { id: 'gpu-rx6600xt', name: 'AMD Radeon RX 6600 XT', brand: 'AMD', price: 219, tdp: 160, vram: 8, tier: 4, gpuScore: 31, length: 220, specs: '8GB GDDR6, 1080p High Refresh', buyLinks: createBuyLinks('AMD Radeon RX 6600 XT') },
    { id: 'gpu-a580', name: 'Intel Arc A580', brand: 'Intel', price: 160, tdp: 185, vram: 8, tier: 2, gpuScore: 23, length: 220, specs: '8GB GDDR6, 1080p Value', buyLinks: createBuyLinks('Intel Arc A580') },
    { id: 'gpu-rtx3060-12g', name: 'NVIDIA GeForce RTX 3060 12GB', brand: 'NVIDIA', price: 279, tdp: 170, vram: 12, tier: 3, gpuScore: 29, length: 220, specs: '12GB GDDR6, 1080p Ultra / Content Creation', buyLinks: createBuyLinks('NVIDIA GeForce RTX 3060 12GB') },
    { id: 'gpu-rtx3060ti', name: 'NVIDIA GeForce RTX 3060 Ti', brand: 'NVIDIA', price: 330, tdp: 200, vram: 8, tier: 4, gpuScore: 38, length: 260, specs: '8GB GDDR6, 1440p Entry', buyLinks: createBuyLinks('NVIDIA GeForce RTX 3060 Ti') },
    { id: 'gpu-b580', name: 'Intel Arc B580', brand: 'Intel', price: 249, tdp: 190, vram: 12, tier: 4, gpuScore: 33, length: 260, specs: '12GB GDDR6, Battlemage, 1440p Value', buyLinks: createBuyLinks('Intel Arc B580') },
    { id: 'gpu-rx7600', name: 'AMD Radeon RX 7600', brand: 'AMD', price: 249, tdp: 165, vram: 8, tier: 4, gpuScore: 34, length: 260, specs: '8GB GDDR6, 1080p Ultra', buyLinks: createBuyLinks('AMD Radeon RX 7600') },
    { id: 'gpu-rx7600xt', name: 'AMD Radeon RX 7600 XT', brand: 'AMD', price: 299, tdp: 190, vram: 16, tier: 4, gpuScore: 36, length: 260, specs: '16GB GDDR6, 1080p Ultra High VRAM', buyLinks: createBuyLinks('AMD Radeon RX 7600 XT') },
    { id: 'gpu-rtx4060', name: 'NVIDIA GeForce RTX 4060', brand: 'NVIDIA', price: 289, tdp: 115, vram: 8, tier: 4, gpuScore: 34, length: 260, specs: '8GB GDDR6, DLSS 3, 1080p Ultra', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4060') },
    { id: 'gpu-rtx4060ti-8g', name: 'NVIDIA GeForce RTX 4060 Ti 8GB', brand: 'NVIDIA', price: 389, tdp: 160, vram: 8, tier: 5, gpuScore: 43, length: 260, specs: '8GB GDDR6, DLSS 3, 1080p/1440p', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4060 Ti 8GB') },
    { id: 'gpu-rtx4060ti-16g', name: 'NVIDIA GeForce RTX 4060 Ti 16GB', brand: 'NVIDIA', price: 449, tdp: 165, vram: 16, tier: 5, gpuScore: 44, length: 260, specs: '16GB GDDR6, DLSS 3, 1440p / Creator', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4060 Ti 16GB') },
    { id: 'gpu-rx6750xt', name: 'AMD Radeon RX 6750 XT', brand: 'AMD', price: 319, tdp: 250, vram: 12, tier: 5, gpuScore: 41, length: 260, specs: '12GB GDDR6, 1440p Gaming Value', buyLinks: createBuyLinks('AMD Radeon RX 6750 XT') },
    { id: 'gpu-rx7700xt', name: 'AMD Radeon RX 7700 XT', brand: 'AMD', price: 399, tdp: 245, vram: 12, tier: 6, gpuScore: 50, length: 260, specs: '12GB GDDR6, 1440p High', buyLinks: createBuyLinks('AMD Radeon RX 7700 XT') },
    { id: 'gpu-rx7800xt', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', price: 479, tdp: 263, vram: 16, tier: 7, gpuScore: 60, length: 310, specs: '16GB GDDR6, 1440p Ultra', buyLinks: createBuyLinks('AMD Radeon RX 7800 XT') },
    { id: 'gpu-rx7900gre', name: 'AMD Radeon RX 7900 GRE', brand: 'AMD', price: 529, tdp: 260, vram: 16, tier: 7, gpuScore: 62, length: 310, specs: '16GB GDDR6, 1440p Ultra / 4K Entry', buyLinks: createBuyLinks('AMD Radeon RX 7900 GRE') },
    { id: 'gpu-rtx4070', name: 'NVIDIA GeForce RTX 4070', brand: 'NVIDIA', price: 519, tdp: 200, vram: 12, tier: 7, gpuScore: 55, length: 310, specs: '12GB GDDR6X, DLSS 3, 1440p Ultra', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4070') },
    { id: 'gpu-rtx4070s', name: 'NVIDIA GeForce RTX 4070 SUPER', brand: 'NVIDIA', price: 589, tdp: 220, vram: 12, tier: 8, gpuScore: 64, length: 310, specs: '12GB GDDR6X, DLSS 3, 1440p Premium', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4070 SUPER') },
    { id: 'gpu-rtx4070tis', name: 'NVIDIA GeForce RTX 4070 Ti SUPER', brand: 'NVIDIA', price: 749, tdp: 285, vram: 16, tier: 8, gpuScore: 72, length: 310, specs: '16GB GDDR6X, DLSS 3, 4K Gaming', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4070 Ti SUPER') },
    { id: 'gpu-rx7900xt', name: 'AMD Radeon RX 7900 XT', brand: 'AMD', price: 679, tdp: 315, vram: 20, tier: 8, gpuScore: 74, length: 310, specs: '20GB GDDR6, 4K Gaming Value', buyLinks: createBuyLinks('AMD Radeon RX 7900 XT') },
    { id: 'gpu-rx7900xtx', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', price: 849, tdp: 355, vram: 24, tier: 9, gpuScore: 80, length: 340, specs: '24GB GDDR6, 4K Ultra Flagship', buyLinks: createBuyLinks('AMD Radeon RX 7900 XTX') },
    { id: 'gpu-rtx4080s', name: 'NVIDIA GeForce RTX 4080 SUPER', brand: 'NVIDIA', price: 899, tdp: 320, vram: 16, tier: 9, gpuScore: 82, length: 340, specs: '16GB GDDR6X, DLSS 3, 4K Ultra', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4080 SUPER') },
    { id: 'gpu-rtx4090', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', price: 1699, tdp: 450, vram: 24, tier: 10, gpuScore: 100, length: 340, specs: '24GB GDDR6X, The Ultimate GPU', buyLinks: createBuyLinks('NVIDIA GeForce RTX 4090') },
    { id: 'gpu-rtx5080', name: 'NVIDIA GeForce RTX 5080', brand: 'NVIDIA', price: 1249, tdp: 350, vram: 16, tier: 10, gpuScore: 95, length: 340, specs: '16GB GDDR7, Next Gen 4K Ultra', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5080') },
    { id: 'gpu-rtx5090', name: 'NVIDIA GeForce RTX 5090', brand: 'NVIDIA', price: 1999, tdp: 500, vram: 32, tier: 11, gpuScore: 135, length: 340, specs: '32GB GDDR7, Next Gen Flagship', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5090') },
    { id: 'gpu-rtx3050', name: 'NVIDIA GeForce RTX 3050 6GB', brand: 'NVIDIA', price: 169, tdp: 70, vram: 6, tier: 1, gpuScore: 18, length: 220, specs: '6GB GDDR6, 1080p Entry, No PCIe power', buyLinks: createBuyLinks('NVIDIA GeForce RTX 3050 6GB') }
  ],
  ssd: [
    // SATA (4)
    { id: 'ssd-wdblue-500', name: 'WD Blue 3D NAND 500GB', brand: 'Western Digital', price: 35, capacity: '500GB', interface: 'SATA', readSpeed: 560, specs: '500GB SATA 2.5", 560MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('WD Blue 3D SATA 500GB') },
    { id: 'ssd-a400-1tb', name: 'Kingston A400 1TB', brand: 'Kingston', price: 50, capacity: '1TB', interface: 'SATA', readSpeed: 500, specs: '1TB SATA 2.5", 500MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Kingston A400 1TB') },
    { id: 'ssd-mx500-1tb', name: 'Crucial MX500 1TB', brand: 'Crucial', price: 65, capacity: '1TB', interface: 'SATA', readSpeed: 560, specs: '1TB SATA 2.5" with DRAM, 560MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Crucial MX500 1TB') },
    { id: 'ssd-870evo-2tb', name: 'Samsung 870 EVO 2TB', brand: 'Samsung', price: 135, capacity: '2TB', interface: 'SATA', readSpeed: 560, specs: '2TB Premium SATA 2.5", 560MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Samsung 870 EVO 2TB') },

    // NVMe Gen3 (2)
    { id: 'ssd-p3-1tb', name: 'Crucial P3 1TB', brand: 'Crucial', price: 55, capacity: '1TB', interface: 'M.2 Gen3', readSpeed: 3500, specs: '1TB NVMe PCIe 3.0, 3500MB/s Read, QLC', nandType: 'QLC', buyLinks: createBuyLinks('Crucial P3 1TB') },
    { id: 'ssd-nv2-1tb', name: 'Kingston NV2 1TB', brand: 'Kingston', price: 55, capacity: '1TB', interface: 'M.2 Gen4', readSpeed: 3500, specs: '1TB NVMe PCIe 4.0 Value, 3500MB/s Read, QLC', nandType: 'QLC', buyLinks: createBuyLinks('Kingston NV2 1TB') },

    // NVMe Gen4 (11)
    { id: 'ssd-sn580-1tb', name: 'WD Blue SN580 1TB', brand: 'Western Digital', price: 65, capacity: '1TB', interface: 'M.2 Gen4', readSpeed: 4150, specs: '1TB NVMe PCIe 4.0, 4150MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('WD Blue SN580 1TB') },
    { id: 'ssd-sn580-2tb', name: 'WD Blue SN580 2TB', brand: 'Western Digital', price: 119, capacity: '2TB', interface: 'M.2 Gen4', readSpeed: 4150, specs: '2TB NVMe PCIe 4.0, 4150MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('WD Blue SN580 2TB') },
    { id: 'ssd-kc3000-1tb', name: 'Kingston KC3000 1TB', brand: 'Kingston', price: 85, capacity: '1TB', interface: 'M.2 Gen4', readSpeed: 7000, specs: '1TB NVMe PCIe 4.0 High-End, 7000MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Kingston KC3000 1TB') },
    { id: 'ssd-kc3000-2tb', name: 'Kingston KC3000 2TB', brand: 'Kingston', price: 145, capacity: '2TB', interface: 'M.2 Gen4', readSpeed: 7000, specs: '2TB NVMe PCIe 4.0 High-End, 7000MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Kingston KC3000 2TB') },
    { id: 'ssd-fc530-2tb', name: 'Seagate FireCuda 530 2TB', brand: 'Seagate', price: 160, capacity: '2TB', interface: 'M.2 Gen4', readSpeed: 7300, specs: '2TB NVMe PCIe 4.0 Premium, High TBW, 7300MB/s, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Seagate FireCuda 530 2TB') },
    { id: 'ssd-sn850x-1tb', name: 'WD Black SN850X 1TB', brand: 'Western Digital', price: 89, capacity: '1TB', interface: 'M.2 Gen4', readSpeed: 7300, specs: '1TB NVMe PCIe 4.0 Gaming, 7300MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('WD Black SN850X 1TB') },
    { id: 'ssd-sn850x-2tb', name: 'WD Black SN850X 2TB', brand: 'Western Digital', price: 149, capacity: '2TB', interface: 'M.2 Gen4', readSpeed: 7300, specs: '2TB NVMe PCIe 4.0 Gaming, 7300MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('WD Black SN850X 2TB') },
    { id: 'ssd-990pro-1tb', name: 'Samsung 990 Pro 1TB', brand: 'Samsung', price: 99, capacity: '1TB', interface: 'M.2 Gen4', readSpeed: 7450, specs: '1TB NVMe PCIe 4.0 Flagship, 7450MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Samsung 990 Pro 1TB') },
    { id: 'ssd-990pro-2tb', name: 'Samsung 990 Pro 2TB', brand: 'Samsung', price: 169, capacity: '2TB', interface: 'M.2 Gen4', readSpeed: 7450, specs: '2TB NVMe PCIe 4.0 Flagship, 7450MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Samsung 990 Pro 2TB') },
    { id: 'ssd-990pro-4tb', name: 'Samsung 990 Pro 4TB', brand: 'Samsung', price: 299, capacity: '4TB', interface: 'M.2 Gen4', readSpeed: 7450, specs: '4TB NVMe PCIe 4.0 Flagship, 7450MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Samsung 990 Pro 4TB') },
    { id: 'ssd-p3plus-4tb', name: 'Crucial P3 Plus 4TB', brand: 'Crucial', price: 230, capacity: '4TB', interface: 'M.2 Gen4', readSpeed: 4800, specs: '4TB NVMe PCIe 4.0 Value, 4800MB/s Read, QLC', nandType: 'QLC', buyLinks: createBuyLinks('Crucial P3 Plus 4TB') },

    // NVMe Gen5 (2)
    { id: 'ssd-t700-1tb', name: 'Crucial T700 1TB', brand: 'Crucial', price: 155, capacity: '1TB', interface: 'M.2 Gen5', readSpeed: 11700, specs: '1TB NVMe PCIe 5.0, 11700MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Crucial T700 1TB') },
    { id: 'ssd-t700-2tb', name: 'Crucial T700 2TB', brand: 'Crucial', price: 260, capacity: '2TB', interface: 'M.2 Gen5', readSpeed: 12400, specs: '2TB NVMe PCIe 5.0, 12400MB/s Read, TLC', nandType: 'TLC', buyLinks: createBuyLinks('Crucial T700 2TB') }
  ],
  hdd: [
    { id: 'hdd-wdblue-1tb', name: 'WD Blue 1TB', brand: 'Western Digital', price: 40, capacity: '1TB', speed: 7200, specs: '1TB 7200RPM 3.5" Desktop HDD', buyLinks: createBuyLinks('WD Blue 1TB HDD') },
    { id: 'hdd-wdblue-2tb', name: 'WD Blue 2TB', brand: 'Western Digital', price: 55, capacity: '2TB', speed: 7200, specs: '2TB 7200RPM 3.5" Desktop HDD', buyLinks: createBuyLinks('WD Blue 2TB HDD') },
    { id: 'hdd-wdblue-4tb', name: 'WD Blue 4TB', brand: 'Western Digital', price: 80, capacity: '4TB', speed: 5400, specs: '4TB 5400RPM 3.5" Desktop HDD', buyLinks: createBuyLinks('WD Blue 4TB HDD') },
    { id: 'hdd-barracuda-1tb', name: 'Seagate BarraCuda 1TB', brand: 'Seagate', price: 40, capacity: '1TB', speed: 7200, specs: '1TB 7200RPM 3.5" Desktop HDD', buyLinks: createBuyLinks('Seagate BarraCuda 1TB') },
    { id: 'hdd-barracuda-2tb', name: 'Seagate BarraCuda 2TB', brand: 'Seagate', price: 55, capacity: '2TB', speed: 7200, specs: '2TB 7200RPM 3.5" Desktop HDD', buyLinks: createBuyLinks('Seagate BarraCuda 2TB') },
    { id: 'hdd-barracuda-4tb', name: 'Seagate BarraCuda 4TB', brand: 'Seagate', price: 80, capacity: '4TB', speed: 5400, specs: '4TB 5400RPM 3.5" Desktop HDD', buyLinks: createBuyLinks('Seagate BarraCuda 4TB') },
    { id: 'hdd-wdred-4tb', name: 'WD Red Plus 4TB NAS', brand: 'Western Digital', price: 100, capacity: '4TB', speed: 5400, specs: '4TB 5400RPM 3.5" NAS HDD (CMR)', buyLinks: createBuyLinks('WD Red Plus 4TB') },
    { id: 'hdd-wdred-6tb', name: 'WD Red Plus 6TB NAS', brand: 'Western Digital', price: 130, capacity: '6TB', speed: 5400, specs: '6TB 5400RPM 3.5" NAS HDD (CMR)', buyLinks: createBuyLinks('WD Red Plus 6TB') },
    { id: 'hdd-wdred-8tb', name: 'WD Red Plus 8TB NAS', brand: 'Western Digital', price: 170, capacity: '8TB', speed: 5640, specs: '8TB 5640RPM 3.5" NAS HDD (CMR)', buyLinks: createBuyLinks('WD Red Plus 8TB') },
    { id: 'hdd-ironwolf-8tb', name: 'Seagate IronWolf 8TB NAS', brand: 'Seagate', price: 165, capacity: '8TB', speed: 7200, specs: '8TB 7200RPM 3.5" NAS HDD', buyLinks: createBuyLinks('Seagate IronWolf 8TB') },
    { id: 'hdd-ironwolf-12tb', name: 'Seagate IronWolf 12TB NAS', brand: 'Seagate', price: 220, capacity: '12TB', speed: 7200, specs: '12TB 7200RPM 3.5" NAS HDD', buyLinks: createBuyLinks('Seagate IronWolf 12TB') },
    { id: 'hdd-wdgold-18tb', name: 'WD Gold 18TB Enterprise', brand: 'Western Digital', price: 380, capacity: '18TB', speed: 7200, specs: '18TB 7200RPM 3.5" Enterprise HDD', buyLinks: createBuyLinks('WD Gold 18TB') }
  ],
  psu: [
    // ATX (15)
    { id: 'psu-cv550', name: 'Corsair CV550', brand: 'Corsair', price: 52, wattage: 550, efficiency: '80+ Bronze', modular: false, formFactor: 'ATX', specs: '550W 80+ Bronze, Non-Modular, ATX', buyLinks: createBuyLinks('Corsair CV550') },
    { id: 'psu-evga-650g6', name: 'EVGA SuperNOVA 650 G6', brand: 'EVGA', price: 95, wattage: 650, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '650W 80+ Gold, Fully Modular, ATX', buyLinks: createBuyLinks('EVGA SuperNOVA 650 G6') },
    { id: 'psu-rm750e', name: 'Corsair RM750e', brand: 'Corsair', price: 99, wattage: 750, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '750W 80+ Gold, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('Corsair RM750e') },
    { id: 'psu-focus-gx750', name: 'Seasonic Focus GX-750', brand: 'Seasonic', price: 110, wattage: 750, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '750W 80+ Gold, Fully Modular, ATX 3.0', buyLinks: createBuyLinks('Seasonic Focus GX-750') },
    { id: 'psu-maga750gl', name: 'MSI MAG A750GL PCIE5', brand: 'MSI', price: 95, wattage: 750, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '750W 80+ Gold, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('MSI MAG A750GL') },
    { id: 'psu-pp12m-850', name: 'be quiet! Pure Power 12 M 850W', brand: 'be quiet!', price: 129, wattage: 850, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '850W 80+ Gold, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('be quiet! Pure Power 12 M 850W') },
    { id: 'psu-rm850x', name: 'Corsair RM850x (2021)', brand: 'Corsair', price: 135, wattage: 850, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '850W 80+ Gold, Fully Modular, ATX', buyLinks: createBuyLinks('Corsair RM850x') },
    { id: 'psu-rog-850', name: 'ASUS ROG Strix 850W Gold Aura Edition', brand: 'ASUS', price: 170, wattage: 850, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '850W 80+ Gold, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('ASUS ROG Strix 850W Aura') },
    { id: 'psu-rm1000e', name: 'Corsair RM1000e', brand: 'Corsair', price: 159, wattage: 1000, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '1000W 80+ Gold, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('Corsair RM1000e') },
    { id: 'psu-hx1000i', name: 'Corsair HX1000i', brand: 'Corsair', price: 220, wattage: 1000, efficiency: '80+ Platinum', modular: true, formFactor: 'ATX', specs: '1000W 80+ Platinum, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('Corsair HX1000i') },
    { id: 'psu-dpp13-1000', name: 'be quiet! Dark Power Pro 13 1000W', brand: 'be quiet!', price: 290, wattage: 1000, efficiency: '80+ Titanium', modular: true, formFactor: 'ATX', specs: '1000W 80+ Titanium, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('be quiet! Dark Power Pro 13 1000W') },
    { id: 'psu-prime-tx1000', name: 'Seasonic Prime TX-1000', brand: 'Seasonic', price: 310, wattage: 1000, efficiency: '80+ Titanium', modular: true, formFactor: 'ATX', specs: '1000W 80+ Titanium, Fully Modular, ATX', buyLinks: createBuyLinks('Seasonic Prime TX-1000') },
    { id: 'psu-vertex-gx1200', name: 'Seasonic Vertex GX-1200', brand: 'Seasonic', price: 250, wattage: 1200, efficiency: '80+ Gold', modular: true, formFactor: 'ATX', specs: '1200W 80+ Gold, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('Seasonic Vertex GX-1200') },
    { id: 'psu-rog-thor-1200', name: 'ASUS ROG Thor 1200W Platinum II', brand: 'ASUS', price: 350, wattage: 1200, efficiency: '80+ Platinum', modular: true, formFactor: 'ATX', specs: '1200W 80+ Platinum, OLED Display, ATX', buyLinks: createBuyLinks('ASUS ROG Thor 1200W') },
    { id: 'psu-hx1500i', name: 'Corsair HX1500i', brand: 'Corsair', price: 320, wattage: 1500, efficiency: '80+ Platinum', modular: true, formFactor: 'ATX', specs: '1500W 80+ Platinum, Fully Modular, ATX 3.0, PCIe 5.0', buyLinks: createBuyLinks('Corsair HX1500i') },

    // SFX (4)
    { id: 'psu-sp750', name: 'Lian Li SP750', brand: 'Lian Li', price: 120, wattage: 750, efficiency: '80+ Gold', modular: true, formFactor: 'SFX', specs: '750W 80+ Gold, Fully Modular, SFX', buyLinks: createBuyLinks('Lian Li SP750') },
    { id: 'psu-sp850', name: 'Lian Li SP850 SFX', brand: 'Lian Li', price: 140, wattage: 850, efficiency: '80+ Gold', modular: true, formFactor: 'SFX', specs: '850W 80+ Gold, Fully Modular, SFX, PCIe 5.0', buyLinks: createBuyLinks('Lian Li SP850 SFX') },
    { id: 'psu-sf850', name: 'Corsair SF850 SFX Platinum', brand: 'Corsair', price: 180, wattage: 850, efficiency: '80+ Platinum', modular: true, formFactor: 'SFX', specs: '850W 80+ Platinum, Fully Modular, SFX, ATX 3.0', buyLinks: createBuyLinks('Corsair SF850 SFX Platinum') },
    { id: 'psu-sf1000', name: 'Corsair SF1000 SFX', brand: 'Corsair', price: 230, wattage: 1000, efficiency: '80+ Platinum', modular: true, formFactor: 'SFX', specs: '1000W 80+ Platinum, Fully Modular, SFX-L, ATX 3.0', buyLinks: createBuyLinks('Corsair SF1000 SFX') }
  ],
  case: [
    // ATX Mid/Full Tower (12)
    { id: 'case-cc560', name: 'Deepcool CC560 V2', brand: 'Deepcool', price: 55, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, 4x Pre-installed Fans, 360mm Rad Support', buyLinks: createBuyLinks('Deepcool CC560') },
    { id: 'case-air903max', name: 'Montech AIR 903 MAX', brand: 'Montech', price: 75, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, Mesh Front, 4x ARGB 140mm Fans', buyLinks: createBuyLinks('Montech AIR 903 MAX') },
    { id: 'case-4000d', name: 'Corsair 4000D Airflow', brand: 'Corsair', price: 89, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, High Airflow Front Panel', buyLinks: createBuyLinks('Corsair 4000D Airflow') },
    { id: 'case-h5flow', name: 'NZXT H5 Flow', brand: 'NZXT', price: 95, formFactor: 'ATX', maxRadiatorSize: 280, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Compact Mid-Tower ATX, Dedicated GPU Fan', buyLinks: createBuyLinks('NZXT H5 Flow') },
    { id: 'case-h7flow', name: 'NZXT H7 Flow', brand: 'NZXT', price: 130, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, Perforated Front/Top Panels', buyLinks: createBuyLinks('NZXT H7 Flow') },
    { id: 'case-h9flow', name: 'NZXT H9 Flow', brand: 'NZXT', price: 159, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Dual-Chamber Mid-Tower ATX, Panoramic Glass', buyLinks: createBuyLinks('NZXT H9 Flow') },
    { id: 'case-north', name: 'Fractal Design North', brand: 'Fractal Design', price: 139, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, Real Wood Front Panel', buyLinks: createBuyLinks('Fractal Design North') },
    { id: 'case-meshify2', name: 'Fractal Design Meshify 2', brand: 'Fractal Design', price: 160, formFactor: 'ATX', maxRadiatorSize: 420, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, Stealth Angular Mesh, Great Layout', buyLinks: createBuyLinks('Fractal Design Meshify 2') },
    { id: 'case-define7', name: 'Fractal Design Define 7', brand: 'Fractal Design', price: 180, formFactor: 'ATX', maxRadiatorSize: 420, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, Sound Damped, Highly Modular', buyLinks: createBuyLinks('Fractal Design Define 7') },
    { id: 'case-torrent', name: 'Fractal Design Torrent', brand: 'Fractal Design', price: 190, formFactor: 'ATX', maxRadiatorSize: 420, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 400, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'High-Airflow ATX, 2x180mm Front Fans', buyLinks: createBuyLinks('Fractal Design Torrent') },
    { id: 'case-lancool3', name: 'Lian Li Lancool III', brand: 'Lian Li', price: 150, formFactor: 'ATX', maxRadiatorSize: 420, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 400, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Mid-Tower ATX, Excellent Airflow, 4x140mm Fans', buyLinks: createBuyLinks('Lian Li Lancool III') },
    { id: 'case-o11devo', name: 'Lian Li O11 Dynamic EVO', brand: 'Lian Li', price: 159, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 400, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Dual-Chamber ATX, Reversible Layout, Showcase', buyLinks: createBuyLinks('Lian Li O11 Dynamic EVO') },
    { id: 'case-y60', name: 'Hyte Y60', brand: 'Hyte', price: 180, formFactor: 'ATX', maxRadiatorSize: 360, mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX'], specs: 'Panoramic ATX, Vertical GPU Mount Included', buyLinks: createBuyLinks('Hyte Y60') },

    // Micro-ATX (2)
    { id: 'case-ap201', name: 'ASUS Prime AP201', brand: 'ASUS', price: 80, formFactor: 'Micro-ATX', maxRadiatorSize: 360, mbSizes: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 360, maxCoolerHeight: 165, psuTypes: ['ATX', 'SFX'], specs: 'Micro-ATX Mesh Case, 33L Volume, 360mm Rad Support', buyLinks: createBuyLinks('ASUS Prime AP201') },
    { id: 'case-o11airmini', name: 'Lian Li O11 Air Mini', brand: 'Lian Li', price: 110, formFactor: 'Micro-ATX', maxRadiatorSize: 280, mbSizes: ['Micro-ATX', 'Mini-ITX'], maxGpuLength: 400, maxCoolerHeight: 165, psuTypes: ['ATX', 'SFX'], specs: 'Compact Dual-Chamber (Supports ATX MB), Great Airflow', buyLinks: createBuyLinks('Lian Li O11 Air Mini') },

    // Mini-ITX (4)
    { id: 'case-terra', name: 'Fractal Design Terra', brand: 'Fractal Design', price: 179, formFactor: 'Mini-ITX', maxRadiatorSize: 120, mbSizes: ['Mini-ITX'], maxGpuLength: 320, maxCoolerHeight: 70, psuTypes: ['SFX'], specs: 'SFF 10.4L, Real Wood, Adjustable Motherboard Spine', buyLinks: createBuyLinks('Fractal Design Terra') },
    { id: 'case-a4h2o', name: 'Lian Li Dan A4-H2O', brand: 'Lian Li', price: 155, formFactor: 'Mini-ITX', maxRadiatorSize: 240, mbSizes: ['Mini-ITX'], maxGpuLength: 320, maxCoolerHeight: 55, psuTypes: ['SFX'], specs: 'SFF 11L, Sandwich Layout, 240mm AIO Support', buyLinks: createBuyLinks('Lian Li Dan A4-H2O') },
    { id: 'case-nr200p', name: 'Cooler Master NR200P', brand: 'Cooler Master', price: 90, formFactor: 'Mini-ITX', maxRadiatorSize: 280, mbSizes: ['Mini-ITX'], maxGpuLength: 320, maxCoolerHeight: 145, psuTypes: ['SFX', 'SFX-L'], specs: 'SFF 18L, TG and Vented Panels Included', buyLinks: createBuyLinks('Cooler Master NR200P') },
    { id: 'case-nr200pmax', name: 'Cooler Master NR200P MAX', brand: 'Cooler Master', price: 380, formFactor: 'Mini-ITX', maxRadiatorSize: 280, mbSizes: ['Mini-ITX'], maxGpuLength: 320, maxCoolerHeight: 145, psuTypes: ['SFX', 'SFX-L'], specs: 'SFF 18L, Includes 280mm AIO and 850W Gold SFX PSU', buyLinks: createBuyLinks('Cooler Master NR200P MAX') }
  ],
  monitor: [
    // 1080p (3)
    { id: 'mon-24g2', name: 'AOC 24G2 / 24G2SP', brand: 'AOC', price: 120, specs: '24" 1080p 165Hz IPS, 1ms, FreeSync', buyLinks: createBuyLinks('AOC 24G2') },
    { id: 'mon-g24f2', name: 'Gigabyte G24F 2', brand: 'Gigabyte', price: 130, specs: '24" 1080p 180Hz IPS, 1ms, FreeSync Premium', buyLinks: createBuyLinks('Gigabyte G24F 2') },
    { id: 'mon-xl2546k', name: 'BenQ ZOWIE XL2546K', brand: 'BenQ', price: 430, specs: '24.5" 1080p 240Hz TN, DyAc+, eSports Focus', buyLinks: createBuyLinks('BenQ ZOWIE XL2546K') },

    // 1440p (7)
    { id: 'mon-g27q', name: 'Gigabyte G27Q', brand: 'Gigabyte', price: 230, specs: '27" 1440p 144Hz IPS, 1ms, FreeSync Premium', buyLinks: createBuyLinks('Gigabyte G27Q') },
    { id: 'mon-vg27aq', name: 'ASUS TUF Gaming VG27AQ', brand: 'ASUS', price: 270, specs: '27" 1440p 165Hz IPS, G-Sync Compatible, ELMB Sync', buyLinks: createBuyLinks('ASUS VG27AQ') },
    { id: 'mon-g272qpf', name: 'MSI G272QPF', brand: 'MSI', price: 240, specs: '27" 1440p 170Hz Rapid IPS, 1ms GtG', buyLinks: createBuyLinks('MSI G272QPF') },
    { id: 'mon-q27g2s', name: 'AOC Q27G2S', brand: 'AOC', price: 250, specs: '27" 1440p 165Hz IPS, 1ms, G-Sync Compatible', buyLinks: createBuyLinks('AOC Q27G2S') },
    { id: 'mon-ex2710q', name: 'BenQ Mobiuz EX2710Q', brand: 'BenQ', price: 300, specs: '27" 1440p 165Hz IPS, 1ms, HDRi, built-in 2.1 speakers', buyLinks: createBuyLinks('BenQ Mobiuz EX2710Q') },
    { id: 'mon-27gp850', name: 'LG 27GP850-B', brand: 'LG', price: 320, specs: '27" 1440p 165Hz (180Hz OC) Nano IPS, 1ms GtG', buyLinks: createBuyLinks('LG 27GP850') },
    { id: 'mon-g7-32', name: 'Samsung Odyssey G7 32"', brand: 'Samsung', price: 550, specs: '32" 1440p 240Hz VA (1000R Curve), HDR600', buyLinks: createBuyLinks('Samsung Odyssey G7 32') },

    // 4K (4)
    { id: 'mon-m28u', name: 'Gigabyte M28U', brand: 'Gigabyte', price: 450, specs: '28" 4K 144Hz IPS, HDMI 2.1, KVM switch', buyLinks: createBuyLinks('Gigabyte M28U') },
    { id: 'mon-27gp95r', name: 'LG 27GP95R-B', brand: 'LG', price: 550, specs: '27" 4K 144Hz (160Hz OC) Nano IPS, HDMI 2.1', buyLinks: createBuyLinks('LG 27GP95R') },
    { id: 'mon-neo-g7', name: 'Samsung Odyssey Neo G7 32"', brand: 'Samsung', price: 900, specs: '32" 4K 165Hz Mini-LED VA (1000R Curve), HDR2000', buyLinks: createBuyLinks('Samsung Odyssey Neo G7') },
    { id: 'mon-pg32uqx', name: 'ASUS ROG Swift PG32UQX', brand: 'ASUS', price: 2500, specs: '32" 4K 144Hz Mini-LED IPS, G-Sync Ultimate, HDR1400', buyLinks: createBuyLinks('ASUS ROG Swift PG32UQX') },

    // OLED & Ultrawide (4)
    { id: 'mon-aw3423dwf', name: 'Alienware AW3423DWF', brand: 'Dell', price: 800, specs: '34" 3440x1440p 165Hz QD-OLED, HDR True Black 400', buyLinks: createBuyLinks('Alienware AW3423DWF') },
    { id: 'mon-pg27aqdm', name: 'ASUS ROG Swift OLED PG27AQDM', brand: 'ASUS', price: 900, specs: '27" 1440p 240Hz OLED, 0.03ms, Custom Heatsink', buyLinks: createBuyLinks('ASUS ROG Swift PG27AQDM') },
    { id: 'mon-lgc3-48', name: 'LG 48" Class C3 Series OLED TV', brand: 'LG', price: 1000, specs: '48" 4K 120Hz OLED, HDMI 2.1, Great as a massive monitor', buyLinks: createBuyLinks('LG C3 48 OLED') },
    { id: 'mon-g9-57', name: 'Samsung Odyssey Neo G9 57"', brand: 'Samsung', price: 2000, specs: '57" Dual-UHD (7680x2160) 240Hz Mini-LED, 1000R, DP 2.1', buyLinks: createBuyLinks('Samsung Odyssey G9 57') },

    // Productivity / Creative (2)
    { id: 'mon-u2723qe', name: 'Dell U2723QE / U2723D', brand: 'Dell', price: 550, specs: '27" 4K 60Hz IPS Black, USB-C Hub, 98% DCI-P3', buyLinks: createBuyLinks('Dell U2723D') },
    { id: 'mon-pd3220u', name: 'BenQ PD3220U', brand: 'BenQ', price: 1000, specs: '31.5" 4K 60Hz IPS, Thunderbolt 3, AQCOLOR for Mac', buyLinks: createBuyLinks('BenQ PD3220U') }
  ]
};

export const PRESETS = {
  budget: {
    id: 'budget',
    name: 'Budget 1080p Gaming',
    desc: 'Cost-efficient setup for great Full HD gaming and daily tasks.',
    parts: {
      cpu: 'cpu-i3-12100f',
      motherboard: 'mb-h610m-k',
      cooler: 'clr-se214xt',
      ram: 'ram-cv16g-3200',
      gpu: 'gpu-rx6600',
      ssd: 'ssd-nv2-1tb',
      hdd: 'hdd-wdblue-2tb',
      psu: 'psu-cv550',
      case: 'case-cc560',
      monitor: 'mon-24g2'
    }
  },
  balanced: {
    id: 'balanced',
    name: 'Balanced 1440p Sweet Spot',
    desc: 'Sweet spot of modern AM5 architecture and power for 2K gaming.',
    parts: {
      cpu: 'cpu-r5-7600',
      motherboard: 'mb-b650m-k',
      cooler: 'clr-ls520',
      ram: 'ram-grs32g-6000',
      gpu: 'gpu-rtx5070',
      ssd: 'ssd-sn850x-2tb',
      hdd: null,
      psu: 'psu-rm750e',
      case: 'case-4000d',
      monitor: 'mon-27gp850'
    }
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate 4K Dream PC',
    desc: 'Uncompromised top-tier performance for 4K ultra gaming and work.',
    parts: {
      cpu: 'cpu-r7-9800x3d',
      motherboard: 'mb-x870e-aorus-pro',
      cooler: 'clr-kraken-360',
      ram: 'ram-gtz32g-6400',
      gpu: 'gpu-rtx4090',
      ssd: 'ssd-990pro-2tb',
      hdd: null,
      psu: 'psu-rm1000e',
      case: 'case-o11devo',
      monitor: 'mon-pg27aqdm'
    }
  }
};

