// api/cached-prices.js — Vercel Serverless Function to serve cached Polish component prices
const fs = require('fs');
const path = require('path');

function getPrices() {
  const candidates = [
    path.join(__dirname, '..', 'data', 'prices_pl.json'),
    path.join(process.cwd(), 'data', 'prices_pl.json')
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('[API /api/cached-prices] Error reading file:', err);
      }
    }
  }

  return { lastUpdated: null, prices: {} };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(204).end();
    res.writeHead(204); res.end(); return;
  }

  const data = getPrices();

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(data);
  }

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};
