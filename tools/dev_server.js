// tools/dev_server.js — Integrated Static + Scraper API + Gemini AI Dev Server on port 3000
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { runScraper, getStatus, stopScraper } = require('./price_scraper.js');
const { getApiKey, generateAiAutoBuild, analyzeAiSynergy, processAiChat } = require('./gemini_engine.js');

const PORT = 3000;
const ROOT_DIR = path.join(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function parsePartsDatabase() {
  const dataJsPath = path.join(ROOT_DIR, 'js', 'data.js');
  if (!fs.existsSync(dataJsPath)) return {};
  const content = fs.readFileSync(dataJsPath, 'utf-8');

  const partsByCategory = {};
  const categories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor'];

  categories.forEach(cat => {
    partsByCategory[cat] = [];
    const catRegex = new RegExp(`${cat}:\\s*\\[([\\s\\S]*?)\\]\\s*,`, 'i');
    const catMatch = content.match(catRegex);
    if (catMatch) {
      const block = catMatch[1];
      const itemRegex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:[^}]+price:\s*([0-9.]+))?/g;
      let m;
      while ((m = itemRegex.exec(block)) !== null) {
        partsByCategory[cat].push({
          id: m[1],
          name: m[2],
          price: m[3] ? parseFloat(m[3]) : 100,
          category: cat
        });
      }
    }
  });

  return partsByCategory;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // GEMINI AI ENDPOINTS
  // -------------------------------------------------------------

  // Status check for Gemini API key
  if (pathname === '/api/ai-status' && req.method === 'GET') {
    const key = getApiKey();
    const hasKey = !!key;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      available: hasKey,
      model: 'gemini-1.5-flash',
      maskedKey: hasKey ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : null,
      message: hasKey ? 'Gemini AI подключен' : 'Ключ не настроен в gemini_config.json'
    }));
    return;
  }

  // 1. AI Smart Auto-Build (Free tier background generation)
  if (pathname === '/api/ai-autobuild' && req.method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const result = await generateAiAutoBuild(payload);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, data: result }));
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: err.message, fallback: true }));
    }
    return;
  }

  // 2. AI Synergy & Bottleneck analysis (Live hardware analysis)
  if (pathname === '/api/ai-synergy' && req.method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const result = await analyzeAiSynergy(payload);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, data: result }));
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: err.message, fallback: true }));
    }
    return;
  }

  // 3. AI Interactive Chat Assistant (Pro tier conversational builder)
  if ((pathname === '/api/chat' || pathname === '/api/ai-chat') && req.method === 'POST') {
    try {
      const payload = await parseJsonBody(req);
      const result = await processAiChat(payload);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, data: result }));
    } catch (err) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  if (pathname === '/api/chat' && req.method === 'GET') {
    const key = getApiKey();
    const hasKey = !!key;
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: true,
      service: 'PC Builder AI Consultant',
      endpoint: '/api/chat',
      configured: hasKey,
      message: hasKey ? 'Gemini AI подключен' : 'Ключ не настроен'
    }));
    return;
  }

  // -------------------------------------------------------------
  // SCRAPER API ENDPOINTS
  // -------------------------------------------------------------

  if (pathname === '/api/sync-status') {
    const status = getStatus();
    const pricesPath = path.join(ROOT_DIR, 'data', 'prices_pl.json');
    let cachedInfo = { count: 0, lastUpdated: null };
    if (fs.existsSync(pricesPath)) {
      try {
        const cached = JSON.parse(fs.readFileSync(pricesPath, 'utf-8'));
        cachedInfo.count = Object.keys(cached.prices || {}).length;
        cachedInfo.lastUpdated = cached.lastUpdated;
      } catch (e) {}
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status, cachedInfo }));
    return;
  }

  if (pathname === '/api/cached-prices') {
    const pricesPath = path.join(ROOT_DIR, 'data', 'prices_pl.json');
    if (fs.existsSync(pricesPath)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      fs.createReadStream(pricesPath).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ lastUpdated: null, prices: {} }));
    }
    return;
  }

  if (pathname === '/api/stop-sync' && req.method === 'POST') {
    stopScraper();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, message: 'Парсер остановлен' }));
    return;
  }

  if (pathname === '/api/sync-prices' && req.method === 'POST') {
    try {
      const params = await parseJsonBody(req);
      const category = params.category || 'all';
      const source = params.source || 'hybrid';

      const db = parsePartsDatabase();
      let partsToScrape = [];

      if (category === 'all') {
        Object.keys(db).forEach(cat => {
          partsToScrape = partsToScrape.concat(db[cat]);
        });
      } else if (db[category]) {
        partsToScrape = db[category];
      }

      if (partsToScrape.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Комплектующие для парсинга не найдены' }));
        return;
      }

      runScraper(partsToScrape, { category, source }).catch(err => {
        console.error('Async scraper error:', err);
      });

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        message: `Парсинг запущен для ${partsToScrape.length} товаров`,
        total: partsToScrape.length,
        category
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------

  let filePath = path.join(ROOT_DIR, pathname === '/' ? 'index.html' : pathname);
  
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 PC Builder Dev Server running at http://localhost:${PORT}`);
  console.log(`📡 Endpoints: /api/sync-prices, /api/sync-status, /api/cached-prices`);
  console.log(`🧠 Gemini AI Endpoints: /api/ai-status, /api/ai-autobuild, /api/ai-synergy, /api/ai-chat`);
});
