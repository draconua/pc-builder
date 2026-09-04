// api/ai-status.js — Vercel Serverless Function for AI Connection Status Check
const { getApiKey } = require('../tools/gemini_engine.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(204).end();
    res.writeHead(204); res.end(); return;
  }

  const key = getApiKey();
  const hasKey = !!key;
  const maskedKey = hasKey ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : null;

  const data = {
    available: hasKey,
    model: 'gemini-3.5-flash',
    maskedKey,
    message: hasKey ? 'Gemini AI подключен и готов к работе' : 'Переменная GEMINI_API_KEY не найдена в окружении'
  };

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(200).json(data);
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};
