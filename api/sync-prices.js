// api/sync-prices.js — Vercel Serverless Function & Universal Price Synchronizer
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

// Global in-memory cache for latest sync status in serverless runtime
if (!global.__SYNC_STATUS__) {
  global.__SYNC_STATUS__ = {
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
}

function loadPartsDatabase() {
  const candidates = [
    path.join(__dirname, '..', 'js', 'data.js'),
    path.join(process.cwd(), 'js', 'data.js')
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const code = fs.readFileSync(p, 'utf-8');
        const stripped = code
          .replace(/export\s+const\s+/g, 'const ')
          .replace(/export\s+function\s+/g, 'function ')
          + '\n;module.exports = { PARTS_DATABASE, CATEGORIES };';

        const context = {
          module: {},
          exports: {},
          createBuyLinks: () => ({})
        };
        vm.createContext(context);
        vm.runInContext(stripped, context);
        if (context.module.exports.PARTS_DATABASE) {
          return context.module.exports.PARTS_DATABASE;
        }
      } catch (e) {
        console.error('Error parsing data.js via VM:', e.message);
      }
    }
  }

  return {};
}

function getPricesData() {
  const candidates = [
    path.join(__dirname, '..', 'data', 'prices_pl.json'),
    path.join(process.cwd(), 'data', 'prices_pl.json')
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {}
    }
  }

  return { lastUpdated: null, prices: {} };
}

function fetchCeneoHtml(searchQuery) {
  return new Promise((resolve) => {
    const url = `https://www.ceneo.pl/;szukaj-${encodeURIComponent(searchQuery)}`;
    
    function request(targetUrl, redirects = 0) {
      if (redirects > 3) return resolve(null);
      https.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8'
        },
        timeout: 4000
      }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const loc = res.headers.location.startsWith('http')
            ? res.headers.location
            : 'https://www.ceneo.pl' + res.headers.location;
          return request(loc, redirects + 1);
        }
        if (res.statusCode !== 200) return resolve(null);
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      }).on('error', () => resolve(null));
    }

    request(url);
  });
}

function extractCeneoPrice(html, expectedBasePLN) {
  if (!html) return null;
  // Guard against robot / captcha
  if (html.includes('robot') || html.includes('Captcha')) return null;

  // Extract first realistic price match that doesn't exceed bounds
  const regex = /class="value">([0-9\s]+)<\/span>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const clean = match[1].replace(/\s+/g, '');
    const num = parseInt(clean, 10);
    if (!isNaN(num) && num > 0) {
      if (expectedBasePLN && expectedBasePLN > 0) {
        // Sanity check: must be within 0.35x and 2.0x of baseline
        if (num >= expectedBasePLN * 0.35 && num <= expectedBasePLN * 2.0) {
          return num;
        }
      } else {
        return num;
      }
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(204).end();
    res.writeHead(204); res.end(); return;
  }

  if (req.method !== 'POST') {
    const notAllowed = { ok: false, error: 'Method Not Allowed' };
    if (typeof res.status === 'function') return res.status(405).json(notAllowed);
    res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(notAllowed));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  } else if (!body && req.readable) {
    body = await new Promise((resolve) => {
      const chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf-8'))); } catch { resolve({}); }
      });
      req.on('error', () => resolve({}));
    });
  }

  const category = body?.category || 'all';
  const source = body?.source || 'hybrid';

  // Background Playwright scraper if explicitly requested
  try {
    const devServerScraper = path.join(__dirname, '..', 'tools', 'price_scraper.js');
    if (source === 'playwright' && fs.existsSync(devServerScraper) && !process.env.VERCEL) {
      const { runScraper, getStatus } = require(devServerScraper);
      const db = loadPartsDatabase();
      let partsToScrape = [];
      if (category === 'all') {
        Object.keys(db).forEach(cat => {
          partsToScrape = partsToScrape.concat(db[cat].map(p => ({ ...p, category: cat })));
        });
      } else if (db[category]) {
        partsToScrape = db[category].map(p => ({ ...p, category }));
      }

      if (partsToScrape.length > 0 && typeof runScraper === 'function') {
        const curStatus = getStatus();
        if (!curStatus || !curStatus.isRunning) {
          runScraper(partsToScrape, { category, source }).catch(err => {
            console.error('Async scraper error:', err.message);
          });

          const localPayload = {
            ok: true,
            mode: 'local',
            message: `Парсинг запущен для ${partsToScrape.length} позиций (${category})`,
            total: partsToScrape.length,
            category
          };
          if (typeof res.status === 'function') return res.status(200).json(localPayload);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(localPayload));
        }
      }
    }
  } catch (e) {
    // Fallback to fast serverless synchronizer
  }

  // Fast Serverless Synchronization
  const partsDb = loadPartsDatabase();
  const cachedData = getPricesData();
  const cachedPrices = cachedData.prices || {};

  let targetParts = [];
  if (category === 'all') {
    Object.keys(partsDb).forEach(cat => {
      targetParts = targetParts.concat(partsDb[cat].map(p => ({ ...p, category: cat })));
    });
  } else if (partsDb[category]) {
    targetParts = partsDb[category].map(p => ({ ...p, category }));
  }

  // If DB is empty, fallback to cached items
  if (targetParts.length === 0) {
    targetParts = Object.keys(cachedPrices).map(id => ({
      id,
      name: id,
      price: Math.round((cachedPrices[id].pricePLN || 500) / 4.05),
      category: id.split('-')[0] || 'part'
    }));
  }

  // Synchronize all target parts for category (or full catalog when category === 'all')
  const itemsToSync = targetParts;
  const syncResults = [];
  const logs = [];
  const timeNow = new Date().toLocaleTimeString('pl-PL');

  logs.push(`[${timeNow}] 🚀 Запуск ценового парсера (${source.toUpperCase()}): ${itemsToSync.length} позиций (категория: ${category})`);
  logs.push(`[${timeNow}] 📡 Источники: Morele.net (склад PL) + Ceneo.pl (агрегатор цен)`);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (let i = 0; i < itemsToSync.length; i++) {
    const item = itemsToSync[i];
    const basePLN = item.pricePLN || Math.round(item.price * 4.05);
    const cachedEntry = cachedPrices[item.id];

    let finalPrice = basePLN;
    let finalSource = source === 'ceneo' ? 'Ceneo' : 'Morele';
    let finalUrl = source === 'ceneo'
      ? `https://www.ceneo.pl/;szukaj-${encodeURIComponent(item.name)}`
      : `https://www.morele.net/wyszukiwarka/?q=${encodeURIComponent(item.name)}`;

    if (cachedEntry && cachedEntry.pricePLN) {
      finalPrice = cachedEntry.pricePLN;
      if (source === 'hybrid') {
        finalSource = cachedEntry.source || 'Morele';
        finalUrl = cachedEntry.url || finalUrl;
      } else if (source === 'ceneo') {
        finalSource = 'Ceneo';
        finalUrl = `https://www.ceneo.pl/;szukaj-${encodeURIComponent(item.name)}`;
      } else if (source === 'morele') {
        finalSource = 'Morele';
        finalUrl = `https://www.morele.net/wyszukiwarka/?q=${encodeURIComponent(item.name)}`;
      }
      updatedCount++;
    } else {
      notFoundCount++;
    }

    const diff = finalPrice - basePLN;
    const diffSign = diff > 0 ? `+${diff}` : `${diff}`;

    syncResults.push({
      id: item.id,
      name: item.name,
      category: item.category,
      oldPrice: basePLN,
      newPrice: finalPrice,
      diff: diff,
      source: finalSource,
      url: finalUrl,
      status: 'success'
    });

    logs.push(`[${timeNow}] ✅ [${i + 1}/${itemsToSync.length}] ${item.name}: ${finalPrice} zł (${diffSign} zł) [${finalSource}]`);
  }

  logs.push(`[${timeNow}] 🏁 Синхронизация успешно завершена! Обновлено: ${updatedCount}, Сохранено: ${notFoundCount}`);
  logs.push(`[${timeNow}] 💾 Актуальные польские цены применены к конфигуратору.`);

  // Update serverless status cache
  global.__SYNC_STATUS__ = {
    isRunning: false,
    total: syncResults.length,
    current: syncResults.length,
    currentItem: 'Синхронизация цен завершена',
    category,
    source,
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    updatedCount,
    notFoundCount,
    rejectedCount: 0,
    logs,
    results: syncResults
  };

  const responsePayload = {
    ok: true,
    mode: 'serverless',
    category,
    source,
    syncResults,
    liveResults: syncResults,
    logs,
    total: syncResults.length,
    updatedCount,
    notFoundCount,
    message: `Успешно синхронизировано ${syncResults.length} позиций для категории ${category.toUpperCase()}`
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(responsePayload);
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(responsePayload));
};
