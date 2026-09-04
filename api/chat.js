// api/chat.js — Vercel Serverless Function for PC Builder AI Consultant
// Proxies requests to Google Gemini API securely using process.env.GEMINI_API_KEY
// Without exposing any secrets to the client side.

const { processAiChat, getApiKey } = require('../tools/gemini_engine.js');

module.exports = async function handler(req, res) {
  // 1. CORS Headers for cross-origin or local dev compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(204).end();
    }
    res.writeHead(204);
    res.end();
    return;
  }

  // 3. Health & Status check via GET
  if (req.method === 'GET') {
    const apiKey = getApiKey();
    const hasKey = !!apiKey;
    const info = {
      ok: true,
      service: 'PC Builder AI Consultant Serverless API',
      endpoint: '/api/chat',
      configured: hasKey,
      model: 'gemini-3.5-flash / gemini-1.5-flash',
      status: hasKey ? 'ready' : 'missing_api_key',
      message: hasKey 
        ? 'Gemini AI API подключен и готов к обработке запросов.' 
        : 'Переменная окружения GEMINI_API_KEY не настроена на Vercel.'
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(info);
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(info));
    return;
  }

  // 4. Main Chat Handler via POST
  if (req.method === 'POST') {
    try {
      // Validate that GEMINI_API_KEY is configured
      const apiKey = getApiKey();
      if (!apiKey) {
        const errPayload = {
          ok: false,
          error: 'GEMINI_API_KEY_NOT_CONFIGURED',
          message: 'API-ключ Google Gemini не настроен. Добавьте переменную окружения GEMINI_API_KEY в панели Vercel (Project Settings -> Environment Variables).'
        };
        if (typeof res.status === 'function' && typeof res.json === 'function') {
          return res.status(400).json(errPayload);
        }
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(errPayload));
        return;
      }

      // Parse request body (supports pre-parsed Vercel body, string body, or stream)
      let payload = req.body;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          payload = {};
        }
      } else if (!payload && req.readable) {
        payload = await new Promise((resolve) => {
          const chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => {
            try {
              const raw = Buffer.concat(chunks).toString('utf-8');
              resolve(raw ? JSON.parse(raw) : {});
            } catch {
              resolve({});
            }
          });
          req.on('error', () => resolve({}));
        });
      }

      const { messages = [], currentBuild = {}, userPrompt = '' } = payload || {};

      if (!userPrompt && (!messages || messages.length === 0)) {
        const emptyErr = { ok: false, error: 'Empty prompt provided.' };
        if (typeof res.status === 'function' && typeof res.json === 'function') {
          return res.status(400).json(emptyErr);
        }
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(emptyErr));
        return;
      }

      // Process chat through Gemini engine
      const result = await processAiChat({
        messages,
        currentBuild,
        userPrompt: userPrompt || (messages[messages.length - 1]?.content || '')
      });

      const responsePayload = { ok: true, data: result };
      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(200).json(responsePayload);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(responsePayload));
    } catch (err) {
      console.error('[Vercel API /api/chat] Error:', err);
      const statusCode = err.message === 'GEMINI_API_KEY_NOT_CONFIGURED' ? 400 : 500;
      const errorPayload = {
        ok: false,
        error: err.message || 'Ошибка сервера при обращении к Google Gemini API'
      };

      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(statusCode).json(errorPayload);
      }
      res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(errorPayload));
    }
    return;
  }

  // Method not supported
  const notAllowed = { ok: false, error: `Method ${req.method} not allowed` };
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(405).json(notAllowed);
  }
  res.writeHead(405, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(notAllowed));
};
