with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    js = f.read()

# Fix default preferredModel
js = js.replace("preferredModel = 'gemini-flash-latest'", "preferredModel = 'gemini-3.5-flash'")

# Fix conversation alternating roles
old_contents = """  // Convert incoming chat history into Gemini contents format
  const contents = [];
  messages.forEach(m => {
    contents.push({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    });
  });

  // Current build context
  const currentBuildSummary = Object.keys(currentBuild)
    .filter(k => currentBuild[k])
    .map(k => `${k}: ${currentBuild[k].name} (${currentBuild[k].id})`)
    .join(', ');

  const promptWithContext = `Текущая сборка на экране: [${currentBuildSummary || 'Пусто'}].
Запрос пользователя: "${userPrompt}"`;

  contents.push({
    role: 'user',
    parts: [{ text: promptWithContext }]
  });"""

new_contents = """  // Current build context
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
  });"""

if old_contents in js:
    js = js.replace(old_contents, new_contents, 1)
    print("Fixed alternating conversation history.")
else:
    print("Warning: old_contents not found.")

with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated gemini_engine.js.")
