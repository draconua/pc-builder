const { processAiChat } = require('./gemini_engine.js');

(async () => {
  console.log('Testing processAiChat after alternating fix:');
  const t0 = Date.now();
  const res = await processAiChat({
    messages: [{ role: 'user', content: 'Привет! Собери мне белый тихий ПК для CS2 за 5500 злотых' }],
    userPrompt: 'Привет! Собери мне белый тихий ПК для CS2 за 5500 злотых'
  });
  console.log(`Success in ${Date.now() - t0}ms!`);
  console.log('Reply preview:', res.reply.substring(0, 200));
  console.log('Selected parts:', res.selectedParts);
})();
