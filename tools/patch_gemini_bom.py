with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Fix getApiKey to strip BOM
old_get_key = """function getApiKey() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      if (cfg && cfg.GEMINI_API_KEY && cfg.GEMINI_API_KEY.trim() && !cfg.GEMINI_API_KEY.includes('ТВОЙ_КЛЮЧ')) {
        return cfg.GEMINI_API_KEY.trim();
      }
    } catch (e) {}
  }
  return process.env.GEMINI_API_KEY || null;
}"""

new_get_key = """function getApiKey() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      let raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
      // Strip UTF-8 BOM if present
      raw = raw.replace(/^\\uFEFF/, '').trim();
      const cfg = JSON.parse(raw);
      if (cfg && cfg.GEMINI_API_KEY && cfg.GEMINI_API_KEY.trim() && !cfg.GEMINI_API_KEY.includes('ТВОЙ_КЛЮЧ')) {
        return cfg.GEMINI_API_KEY.trim();
      }
    } catch (e) {
      console.error('[Gemini Engine] Error reading config:', e.message);
    }
  }
  return process.env.GEMINI_API_KEY || null;
}"""

if old_get_key in js:
    js = js.replace(old_get_key, new_get_key, 1)
    print("Fixed getApiKey with BOM stripping.")
else:
    print("Warning: old_get_key not found.")

# 2. Update default model to gemini-3.6-flash
js = js.replace("model = 'gemini-1.5-flash'", "model = 'gemini-3.6-flash'")
print("Updated model to gemini-3.6-flash.")

with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
    f.write(js)
