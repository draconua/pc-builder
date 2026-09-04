// tools/dev_server.js — Integrated Static + Scraper API + Gemini AI Dev Server on port 3000
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { runScraper, getStatus, stopScraper } = require('./price_scraper.js');
const { getApiKey, generateAiAutoBuild, analyzeAiSynergy, processAiChat } = require('./gemini_engine.js');
const syncPricesHandler = require('../api/sync-prices.js');
const syncStatusHandler = require('../api/sync-status.js');

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

const vm = require('vm');

function parsePartsDatabase() {
  const dataJsPath = path.join(ROOT_DIR, 'js', 'data.js');
  if (!fs.existsSync(dataJsPath)) return {};
  try {
    const code = fs.readFileSync(dataJsPath, 'utf-8');
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
    return context.module.exports.PARTS_DATABASE || {};
  } catch (e) {
    console.error('Error parsing data.js in dev_server:', e.message);
    return {};
  }
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

  // -------------------------------------------------------------
  // SCRAPER API ENDPOINTS (Unified with api/)
  // -------------------------------------------------------------

  if (pathname === '/api/sync-status') {
    return syncStatusHandler(req, res);
  }

  if (pathname === '/api/sync-prices') {
    return syncPricesHandler(req, res);
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
