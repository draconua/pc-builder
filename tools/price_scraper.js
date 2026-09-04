// tools/price_scraper.js — Intelligent Dual-Source (Ceneo + Morele) PC Price Scraper
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const syncStatus = {
  isRunning: false,
  total: 0,
  current: 0,
  currentItem: '',
  category: 'all',
  source: 'hybrid',
  startTime: null,
  endTime: null,
  updatedCount: 0,
  notFoundCount: 0,
  rejectedCount: 0,
  logs: [],
  results: []
};

const NEGATIVE_KEYWORDS = {
  cpu: ['komputer', 'actina', 'g4m3r', 'mad dog', 'zestaw', 'desktop', 'laptop', 'notebook', 'chłodzenie', 'cooler', 'pasta', 'stacjonarny'],
  gpu: ['komputer', 'actina', 'g4m3r', 'mad dog', 'zestaw', 'desktop', 'laptop', 'stacjonarny', 'kabel', 'uchwyt', 'wspornik', 'riser', 'obudowa na'],
  motherboard: ['komputer', 'actina', 'zestaw', 'laptop', 'stacjonarny'],
  ram: ['komputer', 'laptop', 'dysk'],
  ssd: ['obudowa na dysk', 'kieszeń', 'adapter', 'komputer'],
  psu: ['komputer', 'przedłużka', 'kabel'],
  cooler: ['komputer', 'laptop'],
  case: ['zasilacz do obudowy', 'wentylator'],
  monitor: ['ramię', 'uchwyt', 'uchwyt do monitora', 'osłona']
};

function addLog(msg) {
  const time = new Date().toLocaleTimeString('pl-PL');
  const entry = `[${time}] ${msg}`;
  syncStatus.logs.push(entry);
  if (syncStatus.logs.length > 350) syncStatus.logs.shift();
  console.log(entry);
}

function parsePriceString(priceStr) {
  if (!priceStr) return null;
  const clean = priceStr.replace(/[^0-9,.]/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? null : Math.round(num);
}

function isSanityValid(title, pricePLN, basePLN, category) {
  if (!pricePLN || pricePLN <= 0) return { valid: false, reason: 'Некорректная цена (0 zł)' };
  const titleLower = (title || '').toLowerCase();

  // 1. Check negative keywords (pre-builts, cables, accessories)
  const negs = NEGATIVE_KEYWORDS[category] || [];
  for (const word of negs) {
    if (titleLower.includes(word)) {
      return { valid: false, reason: `Обнаружен готовый ПК / аксессуар ("${word}")` };
    }
  }

  // 2. Deviation threshold: cannot exceed 2.0x of expected baseline, or fall below 0.35x
  if (basePLN && basePLN > 0) {
    if (pricePLN > basePLN * 2.0) {
      return { valid: false, reason: `Аномально высокая цена (${pricePLN} zł при базе ${basePLN} zł)` };
    }
    if (pricePLN < basePLN * 0.35) {
      return { valid: false, reason: `Аномально низкая цена (${pricePLN} zł при базе ${basePLN} zł)` };
    }
  }

  return { valid: true };
}

// -------------------------------------------------------------
// 1. CENEO SCRAPING
// -------------------------------------------------------------
async function scrapeCeneo(page, part, category, basePLN) {
  let query = part.name;
  if (category === 'gpu') {
    query = query.replace('GDDR6X', '').replace('GDDR6', '').replace('DLSS 3', '').trim();
  } else if (category === 'cpu') {
    query = query.replace('Box', '').replace('Tray', '').trim();
  }

  const searchUrl = `https://www.ceneo.pl/;szukaj-${encodeURIComponent(query)}`;

  try {
    await page.goto(searchUrl, { timeout: 12000, waitUntil: 'domcontentloaded' });
    // Ceneo often has a 2-second meta refresh protection
    await page.waitForTimeout(2500);

    const items = await page.$$eval('.cat-prod-row, .category-list-body .cat-prod-row, .product-row, .grid-item', rows => {
      return rows.slice(0, 8).map(r => {
        const titleEl = r.querySelector('.cat-prod-row__name, a.js_search-link, strong');
        const priceVal = r.querySelector('.price-format .value, .price .value')?.innerText?.trim();
        const pricePenny = r.querySelector('.price-format .penny, .price .penny')?.innerText?.trim() || '';
        const linkEl = r.querySelector('a.js_search-link, .cat-prod-row__name a, a.go-to-shop');
        return {
          title: titleEl ? titleEl.innerText.trim() : '',
          price: priceVal ? `${priceVal},${pricePenny}` : null,
          href: linkEl ? linkEl.getAttribute('href') : null
        };
      });
    });

    if (!items || items.length === 0) return null;

    // Iterate through candidates until one passes the sanity check
    for (const item of items) {
      const p = parsePriceString(item.price);
      const sanity = isSanityValid(item.title, p, basePLN, category);
      if (sanity.valid) {
        return {
          source: 'Ceneo',
          price: p,
          title: item.title,
          url: item.href ? (item.href.startsWith('http') ? item.href : `https://www.ceneo.pl${item.href}`) : searchUrl
        };
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

// -------------------------------------------------------------
// 2. MORELE.NET SCRAPING
// -------------------------------------------------------------
async function scrapeMorele(page, part, category, basePLN) {
  let query = part.name;
  if (category === 'gpu') {
    query = query.replace('GDDR6X', '').replace('GDDR6', '').replace('DLSS 3', '').trim();
  }
  const searchUrl = `https://www.morele.net/wyszukiwarka/?q=${encodeURIComponent(query)}`;

  try {
    await page.goto(searchUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });

    const items = await page.$$eval('.cat-product, .cat-product-inside', rows => {
      return rows.slice(0, 5).map(r => {
        const title = r.querySelector('a.product-link, a.cat-product-link, [title]')?.getAttribute('title') || r.querySelector('a')?.innerText?.trim();
        const price = r.querySelector('.price-new, .cat-product-price')?.innerText?.trim();
        const link = r.querySelector('a.product-link, a.cat-product-link')?.getAttribute('href');
        return { title, price, link };
      });
    });

    if (!items || items.length === 0) return null;

    for (const item of items) {
      const p = parsePriceString(item.price);
      const sanity = isSanityValid(item.title, p, basePLN, category);
      if (sanity.valid) {
        return {
          source: 'Morele',
          price: p,
          title: item.title,
          url: item.link ? (item.link.startsWith('http') ? item.link : `https://www.morele.net${item.link}`) : searchUrl
        };
      }
    }

    return null;
  } catch (err) {
    return null;
  }
}

// -------------------------------------------------------------
// MAIN BATCH ENGINE WITH AUTO RETRY & SANITY ENGINE
// -------------------------------------------------------------
async function runScraper(partsToScrape, options = {}) {
  if (syncStatus.isRunning) {
    throw new Error('Парсинг уже запущен');
  }

  const sourceMode = options.source || 'hybrid'; // 'hybrid' | 'morele' | 'ceneo'

  syncStatus.isRunning = true;
  syncStatus.total = partsToScrape.length;
  syncStatus.current = 0;
  syncStatus.category = options.category || 'all';
  syncStatus.source = sourceMode;
  syncStatus.startTime = new Date().toISOString();
  syncStatus.endTime = null;
  syncStatus.updatedCount = 0;
  syncStatus.notFoundCount = 0;
  syncStatus.rejectedCount = 0;
  syncStatus.logs = [];
  syncStatus.results = [];

  addLog(`🚀 Запуск парсера (${sourceMode.toUpperCase()}): ${partsToScrape.length} товаров (категория: ${syncStatus.category})`);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      locale: 'pl-PL',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();

    for (let i = 0; i < partsToScrape.length; i++) {
      if (!syncStatus.isRunning) {
        addLog('⏹️ Парсинг остановлен пользователем.');
        break;
      }

      const item = partsToScrape[i];
      syncStatus.current = i + 1;
      syncStatus.currentItem = item.name;

      const basePLN = item.pricePLN || Math.round(item.price * 4.05);
      let found = null;

      // 1. Try primary source
      if (sourceMode === 'morele') {
        found = await scrapeMorele(page, item, item.category, basePLN);
      } else if (sourceMode === 'ceneo') {
        found = await scrapeCeneo(page, item, item.category, basePLN);
      } else {
        // HYBRID: Try Morele first for pristine accuracy, fallback to Ceneo
        found = await scrapeMorele(page, item, item.category, basePLN);
        if (!found) {
          found = await scrapeCeneo(page, item, item.category, basePLN);
        }
      }

      if (found && found.price) {
        const diff = found.price - basePLN;
        const diffSign = diff > 0 ? `+${diff}` : `${diff}`;
        syncStatus.updatedCount++;
        syncStatus.results.push({
          id: item.id,
          name: item.name,
          category: item.category,
          oldPrice: basePLN,
          newPrice: found.price,
          diff: diff,
          source: found.source,
          url: found.url,
          status: 'success'
        });
        addLog(`✅ [${i+1}/${partsToScrape.length}] ${item.name}: ${found.price} zł (${diffSign} zł) [${found.source}]`);
      } else {
        // Sanity Protection: Preserve base price, NEVER corrupt with absurd values
        syncStatus.notFoundCount++;
        syncStatus.results.push({
          id: item.id,
          name: item.name,
          category: item.category,
          oldPrice: basePLN,
          newPrice: basePLN,
          diff: 0,
          source: 'Базовая',
          url: `https://www.morele.net/wyszukiwarka/?q=${encodeURIComponent(item.name)}`,
          status: 'preserved'
        });
        addLog(`🛡️ [${i+1}/${partsToScrape.length}] ${item.name}: не найдено или отклонено Sanity-фильтром (сохранена цена: ${basePLN} zł)`);
      }

      // Safe delay between requests (1s - 1.4s)
      if (i < partsToScrape.length - 1) {
        const delay = Math.floor(Math.random() * 400) + 1000;
        await new Promise(r => setTimeout(r, delay));
      }
    }

    syncStatus.endTime = new Date().toISOString();
    addLog(`🏁 Парсинг завершен! Обновлено: ${syncStatus.updatedCount}, Сохранено базовых: ${syncStatus.notFoundCount}`);

    savePricesFile();
  } catch (err) {
    addLog(`❌ Критическая ошибка парсинга: ${err.message}`);
  } finally {
    if (browser) await browser.close();
    syncStatus.isRunning = false;
  }
}

function savePricesFile() {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const pricesFilePath = path.join(dataDir, 'prices_pl.json');
    let existingData = { lastUpdated: null, prices: {} };
    if (fs.existsSync(pricesFilePath)) {
      try { existingData = JSON.parse(fs.readFileSync(pricesFilePath, 'utf-8')); } catch (e) {}
    }

    existingData.lastUpdated = new Date().toISOString();
    syncStatus.results.forEach(r => {
      if (r.status === 'success') {
        existingData.prices[r.id] = {
          pricePLN: r.newPrice,
          source: r.source,
          url: r.url,
          updatedAt: existingData.lastUpdated
        };
      }
    });

    fs.writeFileSync(pricesFilePath, JSON.stringify(existingData, null, 2), 'utf-8');
    addLog(`💾 Цены сохранены в data/prices_pl.json (всего записей: ${Object.keys(existingData.prices).length})`);
  } catch (err) {
    addLog(`⚠️ Не удалось сохранить файл цен: ${err.message}`);
  }
}

function getStatus() {
  return syncStatus;
}

function stopScraper() {
  if (syncStatus.isRunning) {
    syncStatus.isRunning = false;
    addLog('⏹️ Запрос на остановку парсера...');
  }
}

module.exports = {
  runScraper,
  getStatus,
  stopScraper
};
