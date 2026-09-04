with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Fix executeGeminiRequest Buffer decoding (Fixes Cyrillic corruption )
old_req = """    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);"""

new_req = """    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const rawBuffer = Buffer.concat(chunks);
          const data = rawBuffer.toString('utf-8');
          const parsed = JSON.parse(data);"""

if old_req in code:
    code = code.replace(old_req, new_req, 1)
    print("Fixed UTF-8 chunk buffering in executeGeminiRequest.")
else:
    print("Warning: old_req not found.")

# 2. Fix getCompactCatalog to dynamically load PARTS_DATABASE without regex issues
old_catalog = """// Helper to get compact text catalog (10x faster for Gemini to read)
function getCompactCatalog() {
  const prices = fs.existsSync(PRICES_PATH) ? JSON.parse(fs.readFileSync(PRICES_PATH, 'utf-8')).prices || {} : {};
  const content = fs.existsSync(DATA_JS_PATH) ? fs.readFileSync(DATA_JS_PATH, 'utf-8') : '';

  const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'cooler', 'ssd', 'psu', 'case'];
  const sections = [];

  categories.forEach(cat => {
    const catRegex = new RegExp(`${cat}:\\\\s*\\\\[([\\\\s\\\\S]*?)\\\\]\\\\s*,`, 'i');
    const match = content.match(catRegex);
    if (match) {
      const block = match[1];
      const itemRegex = /{\\\\s*id:\\\\s*'([^']+)',\\\\s*name:\\\\s*'([^']+)'(?:[^}]+price:\\\\s*([0-9.]+))?([^}]*)}/g;
      let m;
      const items = [];
      while ((m = itemRegex.exec(block)) !== null) {
        const id = m[1];
        const name = m[2];
        const baseUSD = parseFloat(m[3] || 100);
        const pricePLN = prices[id]?.pricePLN || Math.round(baseUSD * 4.05);
        const extra = m[4] || '';

        const socket = extra.match(/socket:\\\\s*'([^']+)'/)?.[1];
        const ramType = extra.match(/ramType:\\\\s*'([^']+)'/)?.[1];
        const vram = extra.match(/vram:\\\\s*([0-9]+)/)?.[1];
        const cap = extra.match(/capacity:\\\\s*'([^']+)'/)?.[1];
        const wat = extra.match(/wattage:\\\\s*([0-9]+)/)?.[1];

        let tag = '';
        if (socket) tag += `${socket}, `;
        if (ramType) tag += `${ramType}, `;
        if (vram) tag += `${vram}GB, `;
        if (cap) tag += `${cap}, `;
        if (wat) tag += `${wat}W, `;

        items.push(`${id}: ${name} (${tag}${pricePLN} zł)`);
      }
      sections.push(`[${cat.toUpperCase()}]:\\\\n` + items.join('\\\\n'));
    }
  });

  return sections.join('\\\\n\\\\n');
}"""

new_catalog_code = """// In-memory cached parts database from js/data.js
let cachedDb = null;
async function loadPartsDatabase() {
  if (cachedDb) return cachedDb;
  try {
    const url = require('url');
    const fileUrl = url.pathToFileURL(DATA_JS_PATH).href;
    const mod = await import(fileUrl);
    cachedDb = mod.PARTS_DATABASE || {};
    return cachedDb;
  } catch (e) {
    console.error('[Gemini Engine] Failed to load PARTS_DATABASE:', e);
    return {};
  }
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
      sections.push(`[${cat.toUpperCase()}]:\\n` + items.join('\\n'));
    }
  });

  return sections.join('\\n\\n');
}"""

# Replace catalog code
start_cat = code.find("// Helper to get compact")
end_cat = code.find("// -------------------------------------------------------------", start_cat)
if start_cat != -1 and end_cat != -1:
    code = code[:start_cat] + new_catalog_code + "\n\n" + code[end_cat:]
    print("Replaced getCompactCatalog with async loader from data.js.")
else:
    print("Warning: could not locate catalog code boundaries.")

# 3. Update calls to getCompactCatalog to be awaited
code = code.replace("const catalog = getCompactCatalog();", "const catalog = await getCompactCatalog();")

# 4. Enhance system instructions for PRO Chat to enforce clean structured formatting
old_sys = """  const systemInstruction = `Ты — элитный персональный AI-консультант по подбору ПК сервиса PC Builder PRO.
Ты общаешься с пользователем дружелюбно, профессионально, живо и с глубоким знанием железа на сентябрь 2026 года.

ТВОИ ВОЗМОЖНОСТИ:
1. Ты можешь отвечать на любые вопросы пользователя по железу, играм, софту, стримингу и апгрейду.
2. Ты можешь НАПРЯМУЮ собирать или модифицировать ПК пользователя, возвращая в поле "selectedParts" нужные id из переданного каталога деталей!
3. Если пользователь просит изменить деталь (например: "поставь белый корпус", "сделай 32 гигабайта", "замени на Intel", "хочу сборку за 6000 злотых"), ты ОБЯЗАН обновить "selectedParts".
4. Всегда проверяй совместимость (сокет CPU = сокет MB, тип RAM DDR4/DDR5 = MB).

КАТАЛОГ ДЕТАЛЕЙ (выбирай ТОЛЬКО из него):
${catalog}`;"""

new_sys = """  const systemInstruction = `Ты — элитный персональный AI-консультант по подбору ПК сервиса PC Builder PRO.
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
${catalog}`;"""

if old_sys in code:
    code = code.replace(old_sys, new_sys, 1)
    print("Updated systemInstruction for PRO Chat formatting.")
else:
    print("Warning: old_sys not found.")

with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
    f.write(code)
print("Updated tools/gemini_engine.js successfully.")
