const http = require('http');

function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }, res => {
      let resp = '';
      res.on('data', chunk => resp += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(resp) }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  console.log('1. Testing /api/ai-status:');
  const status = await testEndpoint('/api/ai-status');
  console.log('Status Response:', status);

  console.log('\n2. Testing /api/ai-autobuild (without key -> graceful fallback):');
  const autobuild = await testEndpoint('/api/ai-autobuild', 'POST', { budgetPLN: 5000, targetRes: '1440p' });
  console.log('Autobuild Response:', autobuild);

  console.log('\n3. Testing /api/ai-synergy (without key -> graceful fallback):');
  const synergy = await testEndpoint('/api/ai-synergy', 'POST', { cpu: { name: 'Ryzen 5 7600' }, gpu: { name: 'RTX 4060 Ti' } });
  console.log('Synergy Response:', synergy);
})();
