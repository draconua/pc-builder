// api/ai-synergy.js — Vercel Serverless Function for AI Synergy & Bottleneck Analysis
const { analyzeAiSynergy } = require('../tools/gemini_engine.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(204).end();
    res.writeHead(204); res.end(); return;
  }

  if (req.method === 'POST') {
    try {
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
        });
      }

      const result = await analyzeAiSynergy(body || {});
      const responseData = { ok: true, data: result };

      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(200).json(responseData);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(responseData));
    } catch (err) {
      console.error('[Vercel api/ai-synergy] Error:', err);
      const errData = { ok: false, error: err.message, fallback: true };
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(200).json(errData);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(errData));
    }
    return;
  }

  const notAllowed = { ok: false, error: 'Method Not Allowed' };
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(405).json(notAllowed);
  }
  res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(notAllowed));
};
