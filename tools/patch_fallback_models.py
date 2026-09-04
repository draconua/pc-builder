with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    js = f.read()

# Update callGemini to try candidate models
old_call_func = """async function callGemini(contents, systemInstruction = '', responseSchema = null, model = 'gemini-3.6-flash') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const endpoint = `/v1beta/models/${model}:generateContent?key=${apiKey}`;"""

new_call_func = """async function callGemini(contents, systemInstruction = '', responseSchema = null, preferredModel = 'gemini-flash-latest') {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const candidateModels = [preferredModel, 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-lite-latest'];
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
  const endpoint = `/v1beta/models/${model}:generateContent?key=${apiKey}`;"""

if old_call_func in js:
    js = js.replace(old_call_func, new_call_func, 1)
    # Also adjust the return new Promise block closure
    old_end = "    req.write(postData);\n    req.end();\n  });\n}"
    new_end = "    req.write(postData);\n    req.end();\n  });\n}"
    print("Added multi-model fallback cascade to gemini_engine.js.")
else:
    print("Warning: old_call_func not found.")

with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
    f.write(js)
