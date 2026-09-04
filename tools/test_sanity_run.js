const { runScraper, getStatus } = require('./price_scraper.js');

(async () => {
  const testParts = [
    { id: 'cpu-r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', category: 'cpu', price: 360, pricePLN: 1450 },
    { id: 'cpu-r5-5500', name: 'AMD Ryzen 5 5500', category: 'cpu', price: 90, pricePLN: 360 }
  ];

  console.log('Running test with hybrid (Morele + Ceneo) scraper...');
  await runScraper(testParts, { category: 'test_sanity', source: 'hybrid' });

  const status = getStatus();
  console.log('\n--- FINAL RESULTS ---');
  status.results.forEach(r => {
    console.log(`${r.name}: ${r.newPrice} zł (${r.diff > 0 ? '+' : ''}${r.diff} zł) via ${r.source}`);
  });
})();
