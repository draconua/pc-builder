const { processAiChat } = require('./gemini_engine.js');

(async () => {
  const t0 = Date.now();
  console.log('Testing optimized processAiChat...');
  const res = await processAiChat({
    messages: [{ role: 'user', content: 'Собери тихий белый ПК для CS2 за 5500 zł' }],
    userPrompt: 'Собери тихий белый ПК для CS2 за 5500 zł'
  });
  console.log(`Finished in ${Date.now() - t0}ms!`);
  console.log('Reply preview:', res.reply.substring(0, 250));
  console.log('Selected parts:', res.selectedParts);
})();
