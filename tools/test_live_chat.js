const http = require('http');

const data = JSON.stringify({
  messages: [{ role: 'user', content: 'Привет! Собери мне тихий ПК для CS2 за 5000 злотых' }],
  currentBuild: {},
  userPrompt: 'Собери мне тихий ПК для CS2 за 5000 злотых'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai-chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  let resp = '';
  res.on('data', chunk => resp += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const result = JSON.parse(resp);
    console.log('AI Chat Result:');
    console.log('OK:', result.ok);
    if (result.data) {
      console.log('Reply preview:', result.data.reply.substring(0, 300));
      console.log('Selected parts:', result.data.selectedParts);
    } else {
      console.log('Error:', result.error);
    }
  });
});

req.write(data);
req.end();
