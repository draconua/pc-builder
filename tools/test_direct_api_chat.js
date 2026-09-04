const http = require('http');

const payload = JSON.stringify({
  messages: [{ role: 'user', content: 'Собери белый тихий ПК для CS2 и стримов за 5500 zł' }],
  currentBuild: {},
  userPrompt: 'Собери белый тихий ПК для CS2 и стримов за 5500 zł'
});

console.log('Sending request to /api/ai-chat...');
const t0 = Date.now();
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai-chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode} (took ${Date.now() - t0}ms)`);
    console.log('Body:', body.substring(0, 500));
  });
});

req.on('error', err => console.error('Request error:', err));
req.write(payload);
req.end();
