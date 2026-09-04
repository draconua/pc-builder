with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace getCompactCatalog with ultra-fast compact text string
old_compact = """// Helper to get compact catalog with live PLN prices
function getCompactCatalog() {
  const prices = fs.existsSync(PRICES_PATH) ? JSON.parse(fs.readFileSync(PRICES_PATH, 'utf-8')).prices || {} : {};
  const content = fs.existsSync(DATA_JS_PATH) ? fs.readFileSync(DATA_JS_PATH, 'utf-8') : '';

  const categories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'psu', 'case'];
  const catalog = {};

  categories.forEach(cat => {
    catalog[cat] = [];
    const catRegex = new RegExp(`${cat}:\\\\s*\\\\[([\\\\s\\\\S]*?)\\\\]\\\\s*,`, 'i');
    const match = content.match(catRegex);
    if (match) {
      const block = match[1];
      const itemRegex = /{\\\\s*id:\\\\s*'([^']+)',\\\\s*name:\\\\s*'([^']+)'(?:[^}]+price:\\\\s*([0-9.]+))?([^}]*)}/g;
      let m;
      while ((m = itemRegex.exec(block)) !== null) {
        const id = m[1];
        const name = m[2];
        const baseUSD = parseFloat(m[3] || 100);
        const pricePLN = prices[id]?.pricePLN || Math.round(baseUSD * 4.05);
        const extra = m[4] || '';

        // Extract key technical specs
        const socket = extra.match(/socket:\\\\s*'([^']+)'/)?.[1];
        const ramType = extra.match(/ramType:\\\\s*'([^']+)'/)?.[1];
        const tdp = parseInt(extra.match(/tdp:\\\\s*([0-9]+)/)?.[1] || 0, 10);
        const wattage = parseInt(extra.match(/wattage:\\\\s*([0-9]+)/)?.[1] || 0, 10);
        const vram = parseInt(extra.match(/vram:\\\\s*([0-9]+)/)?.[1] || 0, 10);
        const capacity = extra.match(/capacity:\\\\s*'([^']+)'/)?.[1];
        const type = extra.match(/type:\\\\s*'([^']+)'/)?.[1];

        const item = { id, name, pricePLN };
        if (socket) item.socket = socket;
        if (ramType) item.ramType = ramType;
        if (tdp) item.tdp = tdp;
        if (wattage) item.wattage = wattage;
        if (vram) item.vram = vram;
        if (capacity) item.capacity = capacity;
        if (type) item.type = type;

        catalog[cat].push(item);
      }
    }
  });

  return catalog;
}"""

new_compact = """// Helper to get compact text catalog (10x faster for Gemini to read)
function getCompactCatalog() {
  const prices = fs.existsSync(PRICES_PATH) ? JSON.parse(fs.readFileSync(PRICES_PATH, 'utf-8')).prices || {} : {};
  const content = fs.existsSync(DATA_JS_PATH) ? fs.readFileSync(DATA_JS_PATH, 'utf-8') : '';

  const categories = ['cpu', 'gpu', 'motherboard', 'ram', 'cooler', 'ssd', 'psu', 'case'];
  const lines = [];

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
      lines.push(`[${cat.toUpperCase()}]:\\n` + items.join('\\n'));
    }
  });

  return lines.join('\\n\\n');
}"""

if old_compact in js:
    js = js.replace(old_compact, new_compact, 1)
    print("Replaced with ultra-fast string catalog.")
else:
    print("Warning: old_compact not found.")

# In processAiChat and generateAiAutoBuild replace JSON.stringify(catalog) with catalog
js = js.replace("${JSON.stringify(catalog)}", "${catalog}")

with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated gemini_engine.js successfully.")
