with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find start and end of getCompactCatalog
start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if "function getCompactCatalog()" in l:
        start_idx = i
    if start_idx != -1 and i > start_idx and l.strip() == "return catalog;":
        end_idx = i + 1
        break

new_func = """function getCompactCatalog() {
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
      sections.push(`[${cat.toUpperCase()}]:\\n` + items.join('\\n'));
    }
  });

  return sections.join('\\n\\n');
}
"""

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + [new_func] + lines[end_idx+1:]
    with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Replaced getCompactCatalog successfully.")
else:
    print(f"Error finding indices: start={start_idx}, end={end_idx}")
