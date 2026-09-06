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

export let PARTS_DATABASE = {};

async function loadDatabase() {
  if (typeof window === 'undefined' && typeof process !== 'undefined') {
    try {
      const nodeFs = 'node:fs';
      const nodePath = 'node:path';
      const fs = await import(/* @vite-ignore */ nodeFs);
      const path = await import(/* @vite-ignore */ nodePath);
      const candidates = [
        path.resolve(process.cwd(), 'data/hardware.json'),
        path.resolve(process.cwd(), '../data/hardware.json')
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          return JSON.parse(fs.readFileSync(p, 'utf8'));
        }
      }
    } catch (e) {
      console.error('[Database] Node load error:', e.message);
    }
  } else {
    const urls = [];
    try {
      urls.push(new URL('../data/hardware.json', import.meta.url).href);
    } catch (e) {}
    urls.push('data/hardware.json', '/data/hardware.json');

    for (const u of urls) {
      try {
        const res = await fetch(u);
        if (res.ok) {
          const json = await res.json();
          if (json && Object.keys(json).length > 0) return json;
        }
      } catch (e) {}
    }
  }
  return {};
}

PARTS_DATABASE = await loadDatabase();

// Guarantee that every category array exists to prevent runtime errors
CATEGORIES.forEach(cat => {
  if (!Array.isArray(PARTS_DATABASE[cat])) {
    PARTS_DATABASE[cat] = [];
  }
});

export const PRESETS = {
  budget: {
    id: 'budget',
    name: 'Budget 1080p Gaming',
    desc: 'Cost-efficient setup for great Full HD gaming and daily tasks.',
    parts: {
      cpu: 'cpu-i3-13100f',
      motherboard: 'mb-b760m-ds3h-d4',
      cooler: 'clr-se214xt',
      ram: 'ram-cv16g-3200',
      gpu: 'gpu-rtx4060',
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
      gpu: 'gpu-rtx4070s',
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
      cpu: 'cpu-u9-285k',
      motherboard: 'mb-z890-rog-strix-f',
      cooler: 'clr-kraken-360',
      ram: 'ram-gtzrgb64g-6400',
      gpu: 'gpu-rtx5090',
      ssd: 'ssd-990pro-2tb',
      hdd: null,
      psu: 'psu-rm1000e',
      case: 'case-o11devo',
      monitor: 'mon-pg27aqdm'
    }
  }
};

