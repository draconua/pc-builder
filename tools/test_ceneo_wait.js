const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  await page.goto('https://www.ceneo.pl/;szukaj-Ryzen+7+7800X3D', { timeout: 15000 });
  console.log('Initial URL:', page.url());
  
  // Wait for meta refresh (2-3 seconds)
  await page.waitForTimeout(3500);
  console.log('After 3.5s URL:', page.url());
  console.log('After 3.5s Title:', await page.title());

  const items = await page.$$eval('.cat-prod-row, .grid-item, .category-list-body .cat-prod-row', rows => {
    return rows.slice(0, 5).map(r => ({
      title: r.querySelector('.cat-prod-row__name, a.js_search-link, strong')?.innerText?.trim(),
      price: r.querySelector('.price-format .value')?.innerText?.trim()
    }));
  });
  console.log('Items found:', JSON.stringify(items, null, 2));

  await browser.close();
})();
