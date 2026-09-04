const { runScraper, getStatus } = require('./price_scraper.js');

(async () => {
  const sampleParts = [
    { id: 'cpu-r5-7600', name: 'AMD Ryzen 5 7600', category: 'cpu', price: 189 },
    { id: 'cool-ak400', name: 'Deepcool AK400', category: 'cooler', price: 35 }
  ];

  console.log('Starting test scraper...');
  await runScraper(sampleParts, { category: 'test' });
  const status = getStatus();
  console.log('Results summary:');
  console.log('Updated:', status.updatedCount);
  console.log('Not found:', status.notFoundCount);
  console.log('Items:', JSON.stringify(status.results, null, 2));
})();
