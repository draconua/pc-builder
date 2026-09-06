// tools/gemini_engine.js — Core Google Gemini AI Engine
// Handles:
// 1. AI Smart Auto-Build (Free tier background generation)
// 2. AI Hardware Synergy & Bottleneck analysis (Live hardware analysis)
// 3. AI Interactive Chat Assistant (Pro tier conversational builder)

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = fs.existsSync(path.join(__dirname, '..', 'js', 'data.js'))
  ? path.join(__dirname, '..')
  : (fs.existsSync(path.join(process.cwd(), 'js', 'data.js')) ? process.cwd() : path.join(__dirname, '..'));

const CONFIG_PATH = path.join(ROOT_DIR, 'gemini_config.json');
const PRICES_PATH = path.join(ROOT_DIR, 'data', 'prices_pl.json');
const DATA_JS_PATH = path.join(ROOT_DIR, 'js', 'data.js');

// In-memory cache for synergy verdicts to ensure instant 0ms responses for repeated combos
const synergyCache = new Map();

// Lightweight zero-dependency .env reader
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const k = trimmed.slice(0, eqIdx).trim();
          let v = trimmed.slice(eqIdx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    } catch (e) {
      // Ignore .env read errors
    }
  }
}
loadEnv();

function isPlaceholder(val) {
  if (!val || typeof val !== 'string') return true;
  const upper = val.toUpperCase();
  return upper.includes('YOUR_') || upper.includes('ТВОЙ_') || upper.includes('PLACEHOLDER') || upper.includes('DUMMY') || val.length < 15;
}

// Secure multi-tier API key loader:
// 1. process.env.GEMINI_API_KEY (from environment or .env file)
// 2. gemini_config.json (local untracked configuration file)
// 3. config.local.json (alternative local config)
function getApiKey() {
  // 1. Process environment (or loaded from .env)
  if (process.env.GEMINI_API_KEY && !isPlaceholder(process.env.GEMINI_API_KEY)) {
    return process.env.GEMINI_API_KEY.trim();
  }

  // 2. Local uncommitted gemini_config.json
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      let raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
      raw = raw.replace(/^\uFEFF/, '').trim();
      const cfg = JSON.parse(raw);
      if (cfg && cfg.GEMINI_API_KEY && !isPlaceholder(cfg.GEMINI_API_KEY)) {
        return cfg.GEMINI_API_KEY.trim();
      }
    } catch (e) {
      console.error('[Gemini Engine] Error reading gemini_config.json:', e.message);
    }
  }

  // 3. Local uncommitted config.local.json
  const altPath = path.join(ROOT_DIR, 'config.local.json');
  if (fs.existsSync(altPath)) {
    try {
      let raw = fs.readFileSync(altPath, 'utf-8');
      raw = raw.replace(/^\uFEFF/, '').trim();
      const cfg = JSON.parse(raw);
      if (cfg && cfg.GEMINI_API_KEY && !isPlaceholder(cfg.GEMINI_API_KEY)) {
        return cfg.GEMINI_API_KEY.trim();
      }
    } catch (e) {
      console.error('[Gemini Engine] Error reading config.local.json:', e.message);
    }
  }

  return null;
}

// Low-level HTTPS request to Google Generative AI REST API
async function callGemini(contents, systemInstruction = '', responseSchema = null, preferredModel = 'gemini-3.5-flash') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const candidateModels = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      return await executeGeminiRequest(contents, systemInstruction, responseSchema, model, apiKey);
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Engine] Model ${model} failed (${err.message.substring(0, 60)}), trying fallback model...`);
    }
  }
  throw lastError;
}

function executeGeminiRequest(contents, systemInstruction, responseSchema, model, apiKey) {
  const endpoint = `/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.2,
      topP: 0.95
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (responseSchema) {
    payload.generationConfig.responseMimeType = 'application/json';
    payload.generationConfig.responseSchema = responseSchema;
  }

  const postData = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const rawBuffer = Buffer.concat(chunks);
          const data = rawBuffer.toString('utf-8');
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400 || parsed.error) {
            return reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}: ${data}`));
          }
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) {
            return reject(new Error('Empty response from Gemini API'));
          }
          resolve(text);
        } catch (e) {
          reject(new Error(`Failed to parse Gemini response: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

// In-memory cached parts database from js/data.js
let cachedDb = null;

function parsePartsFromText(content) {
  const partsByCategory = {};
  const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'cooler', 'ssd', 'hdd', 'psu', 'case', 'monitor'];
  categories.forEach(cat => {
    partsByCategory[cat] = [];
    const catRegex = new RegExp(`${cat}:\\s*\\[([\\s\\S]*?)\\]\\s*,`, 'i');
    const catMatch = content.match(catRegex);
    if (catMatch) {
      const block = catMatch[1];
      const itemRegex = /{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(?:[^}]*?price:\s*([0-9.]+))?(?:[^}]*?socket:\s*'([^']+)')?(?:[^}]*?ramType:\s*'([^']+)')?(?:[^}]*?vram:\s*([0-9]+))?(?:[^}]*?capacity:\s*'([^']+)')?(?:[^}]*?wattage:\s*([0-9]+))?(?:[^}]*?type:\s*'([^']+)')?/g;
      let m;
      while ((m = itemRegex.exec(block)) !== null) {
        partsByCategory[cat].push({
          id: m[1],
          name: m[2],
          price: m[3] ? parseFloat(m[3]) : 100,
          socket: m[4] || '',
          ramType: m[5] || '',
          vram: m[6] ? parseInt(m[6], 10) : undefined,
          capacity: m[7] || '',
          wattage: m[8] ? parseInt(m[8], 10) : undefined,
          type: m[9] || '',
          category: cat
        });
      }
    }
  });
  return partsByCategory;
}

async function loadPartsDatabase() {
  if (cachedDb) return cachedDb;
  
  const hwCandidates = [
    path.join(ROOT_DIR, 'data', 'hardware.json'),
    path.join(process.cwd(), 'data', 'hardware.json')
  ];
  for (const p of hwCandidates) {
    if (fs.existsSync(p)) {
      try {
        cachedDb = JSON.parse(fs.readFileSync(p, 'utf-8'));
        return cachedDb;
      } catch (e) {}
    }
  }

  try {
    const url = require('url');
    const fileUrl = url.pathToFileURL(DATA_JS_PATH).href;
    const mod = await import(fileUrl);
    if (mod && mod.PARTS_DATABASE && Object.keys(mod.PARTS_DATABASE).length > 0) {
      cachedDb = mod.PARTS_DATABASE;
      return cachedDb;
    }
  } catch (e) {
    // Dynamic import fallback
  }

  try {
    if (fs.existsSync(DATA_JS_PATH)) {
      const content = fs.readFileSync(DATA_JS_PATH, 'utf-8');
      cachedDb = parsePartsFromText(content);
      return cachedDb;
    }
  } catch (err) {
    console.warn('[Gemini Engine] Failed to parse data.js via fallback:', err.message);
  }

  return {};
}

async function getCompactCatalog() {
  const prices = fs.existsSync(PRICES_PATH) ? JSON.parse(fs.readFileSync(PRICES_PATH, 'utf-8')).prices || {} : {};
  const db = await loadPartsDatabase();

  const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'cooler', 'ssd', 'psu', 'case'];
  const sections = [];

  categories.forEach(cat => {
    const list = db[cat] || [];
    const items = list.map(p => {
      const pricePLN = prices[p.id]?.pricePLN || Math.round((p.price || 100) * 4.05);
      let specs = [];
      if (p.socket) specs.push(p.socket);
      if (p.ramType) specs.push(p.ramType);
      if (p.vram) specs.push(p.vram + 'GB');
      if (p.capacity) specs.push(p.capacity);
      if (p.wattage) specs.push(p.wattage + 'W');
      if (p.type) specs.push(p.type);
      const specTag = specs.length > 0 ? `${specs.join(', ')}, ` : '';
      return `${p.id}: ${p.name} (${specTag}${pricePLN} zł)`;
    });
    if (items.length > 0) {
      sections.push(`[${cat.toUpperCase()}]:\n` + items.join('\n'));
    }
  });

  return sections.join('\n\n');
}

// -------------------------------------------------------------
// 1. AI SMART AUTO-BUILD (FREE TIER BACKGROUND GENERATION)
// -------------------------------------------------------------
async function generateAiAutoBuild({ budgetPLN = 5000, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all' }) {
  const catalog = await getCompactCatalog();

  const systemInstruction = `Ты — ведущий инженер-архитектор игровых ПК и эксперт по железу.
Твоя задача — составить максимально сбалансированную, мощную и надежную игровую сборку ПК строго под бюджет клиента в злотых (PLN).
Перед тобой каталог доступных комплектующих с реальными ценами в PLN.

ПРАВИЛА ПОДБОРА:
1. Выбирай детали ТОЛЬКО из предоставленного каталога, используя их точные "id".
2. Суммарная стоимость всех 8 компонентов (cpu, motherboard, cooler, ram, gpu, ssd, psu, case) ОБЯЗАНА быть <= ${Math.round(budgetPLN * 1.03)} zł.
3. Совместимость:
   - Сокет процессора и материнской платы должны строго совпадать (AM4 к AM4, AM5 к AM5, LGA1700 к LGA1700, LGA1851 к LGA1851).
   - Тип памяти (DDR4 или DDR5) должен строго соответствовать материнской плате и процессору.
   - Блок питания должен иметь запас минимум 20% по мощности от суммарного TDP системы.
   - Никаких абсурдных связок (не ставь дешевый 4-ядерный CPU к RTX 4070/4080!).
4. Целевое разрешение гейминга: ${targetRes}.
${cpuBrand !== 'all' ? `5. Предпочтение по процессору: строго ${cpuBrand}.` : ''}
${gpuBrand !== 'all' ? `6. Предпочтение по видеокарте: строго ${gpuBrand}.` : ''}`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      cpu: { type: "STRING" },
      gpu: { type: "STRING" },
      motherboard: { type: "STRING" },
      ram: { type: "STRING" },
      cooler: { type: "STRING" },
      ssd: { type: "STRING" },
      psu: { type: "STRING" },
      case: { type: "STRING" },
      verdictTitle: { type: "STRING", description: "Краткий емкий заголовок базы, например 'AM5 1440p Sweet Spot'" },
      reasoning: { type: "STRING", description: "Объяснение на русском языке, почему эта связка идеальна под бюджет" }
    },
    required: ["cpu", "gpu", "motherboard", "ram", "cooler", "ssd", "psu", "case", "verdictTitle", "reasoning"]
  };

  const prompt = `Каталог деталей:
${catalog}

Бюджет пользователя: ${budgetPLN} zł.
Целевое разрешение: ${targetRes}.
Собери идеальный сбалансированный ПК.`;

  const rawJson = await callGemini([{ parts: [{ text: prompt }] }], systemInstruction, responseSchema);
  return JSON.parse(rawJson);
}

// -------------------------------------------------------------
// 2. AI SYNERGY & BOTTLENECK ENGINE (LIVE EXPERT ANALYSIS)
// -------------------------------------------------------------
async function analyzeAiSynergy({ cpu, gpu, motherboard, ram, resolution = '1440p' }) {
  if (!cpu || !gpu) {
    return { score: 100, status: 'Ждем выбор CPU и GPU', bottleneckType: 'none', commentary: '' };
  }

  const cacheKey = `${cpu.id}_${gpu.id}_${motherboard?.id || 'none'}_${ram?.id || 'none'}_${resolution}`;
  if (synergyCache.has(cacheKey)) {
    return synergyCache.get(cacheKey);
  }

  const systemInstruction = `Ты — ведущий мировой технический эксперт по аппаратной синергии ПК, шине PCI-Express, линиям питания VRM и узким местам (bottleneck) в играх.
Оцени связку железа пользователя. Не используй примитивные формулы — думай как оверклокер и технический рецензент:
- Учитывай архитектуру CPU (Zen 4, Zen 5 с 3D V-Cache, Raptor Lake, Arrow Lake).
- Учитывай видеопамять VRAM, шину PCIe (PCIe 4.0 x4, x8, x16) и пропускную способность.
- Учитывай целевое разрешение (${resolution}). В 1080p нагрузка на CPU выше, в 4K упор почти всегда в GPU.
- Учитывай баланс подсистемы памяти и возможности VRM платы.`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      score: { type: "INTEGER", description: "Оценка синергии связки от 1 до 100" },
      status: { type: "STRING", description: "Короткий статус, например 'Идеальный баланс', 'Легкий упор в GPU', 'Слабый CPU'" },
      bottleneckType: { type: "STRING", enum: ["none", "cpu", "gpu", "ram", "vrm"] },
      commentary: { type: "STRING", description: "Ёмкий экспертный вердикт на русском языке (2-3 предложения)" },
      fpsPotential: { type: "STRING", description: "Оценка стабильности фреймрейта и 1% Low" }
    },
    required: ["score", "status", "bottleneckType", "commentary", "fpsPotential"]
  };

  const prompt = `Комплектующие связки:
- Процессор: ${cpu.name} (${cpu.specs || ''}, TDP: ${cpu.tdp}W)
- Видеокарта: ${gpu.name} (${gpu.specs || ''}, VRAM: ${gpu.vram}GB)
${motherboard ? `- Материнская плата: ${motherboard.name} (${motherboard.specs || ''})` : ''}
${ram ? `- Оперативная память: ${ram.name} (${ram.specs || ''})` : ''}
- Разрешение экрана: ${resolution}

Дай экспертную оценку синергии связки.`;

  const rawJson = await callGemini([{ parts: [{ text: prompt }] }], systemInstruction, responseSchema);
  const result = JSON.parse(rawJson);

  synergyCache.set(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 3. AI INTERACTIVE CHAT ASSISTANT (PRO TIER DIALOGUE)
// -------------------------------------------------------------
async function processAiChat({ messages = [], currentBuild = {}, userPrompt = '' }) {
  const catalog = await getCompactCatalog();

  const systemInstruction = `Ты — элитный персональный AI-консультант по подбору ПК сервиса PC Builder PRO.
Ты общаешься с пользователем дружелюбно, профессионально, авторитетно и с глубоким знанием компьютерного железа на сентябрь 2026 года.

КАТЕГОРИЧЕСКИ ВАЖНЫЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:
1. НЕ ПИШИ сплошную стену текста! Твой ответ должен быть идеально структурирован и легко читаем.
2. Разделяй текст на логические абзацы пустой строкой.
3. Когда ты предлагаешь или модифицируешь сборку, ВСЕГДА используй четкий список компонентов, где КАЖДЫЙ компонент идет С НОВОЙ СТРОКИ:
   ### Рекомендуемая конфигурация:
   - **Процессор:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **Материнская плата:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **Кулер:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **Оперативная память:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **Видеокарта:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **SSD:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **Блок питания:** [Название] — [краткий комментарий] (~[цена] PLN)
   - **Корпус:** [Название] — [краткий комментарий] (~[цена] PLN)
4. В конце укажи итоговую стоимость и краткий вердикт по запасу мощности или апгрейду.

ИНТЕРАКТИВНОЕ УПРАВЛЕНИЕ СХЕМОЙ:
- В объекте "selectedParts" возвращай точные id деталей из предоставленного каталога, чтобы они автоматически установились на схеме пользователя!
- Всегда соблюдай совместимость сокетов и памяти (AM4 к DDR4, AM5 к DDR5, LGA1700/1851 к соответствующей плате).

ДОСТУПНЫЙ КАТАЛОГ КОМПЛЕКТУЮЩИХ:
${catalog}`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      reply: { type: "STRING", description: "Твой вежливый и аргументированный ответ пользователю в формате Markdown" },
      selectedParts: {
        type: "OBJECT",
        properties: {
          cpu: { type: "STRING" },
          gpu: { type: "STRING" },
          motherboard: { type: "STRING" },
          ram: { type: "STRING" },
          cooler: { type: "STRING" },
          ssd: { type: "STRING" },
          psu: { type: "STRING" },
          case: { type: "STRING" }
        },
        description: "Обновленные ID комплектующих для установки в конфигуратор (если применимо)"
      }
    },
    required: ["reply"]
  };

  // Current build context
  const currentBuildSummary = Object.keys(currentBuild || {})
    .filter(k => currentBuild[k])
    .map(k => `${k}: ${currentBuild[k].name} (${currentBuild[k].id})`)
    .join(', ');

  const promptWithContext = `Текущая сборка на экране: [${currentBuildSummary || 'Пусто'}].
Запрос пользователя: "${userPrompt}"`;

  // Build clean alternating history (excluding the current user prompt if it was already appended)
  const contents = [];
  const priorMessages = messages.filter(m => m.content !== userPrompt);
  priorMessages.forEach(m => {
    contents.push({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    });
  });

  // Append current user prompt as the final turn
  contents.push({
    role: 'user',
    parts: [{ text: promptWithContext }]
  });

  const rawJson = await callGemini(contents, systemInstruction, responseSchema);
  return JSON.parse(rawJson);
}

module.exports = {
  getApiKey,
  generateAiAutoBuild,
  analyzeAiSynergy,
  processAiChat
};
