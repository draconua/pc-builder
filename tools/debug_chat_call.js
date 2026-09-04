// tools/debug_chat_call.js
const { processAiChat } = require('./gemini_engine.js');

(async () => {
  try {
    console.log('Sending message to processAiChat directly:');
    const res = await processAiChat({
      messages: [{ role: 'user', content: 'Привет! Назови 2 процессора' }],
      userPrompt: 'Привет! Назови 2 процессора'
    });
    console.log('Success!', res);
  } catch (err) {
    console.error('Error occurred in processAiChat:', err);
  }
})();
