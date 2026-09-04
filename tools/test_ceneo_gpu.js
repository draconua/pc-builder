const { chromium } = require('playwright');

(async () => {
  console.log('Testing Ceneo scrape for RTX 4070 SUPER...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  try {
    await page.goto('https://www.ceneo.pl/;szukaj-RTX+4070+SUPER', { timeout: 15000, waitUntil: 'domcontentloaded' });
    
    // Extract first 3 products with their titles and prices
    const products = await page.$$eval('.cat-prod-row, .grid-item, .category-list-body .cat-prod-row-desc', rows => {
      return rows.slice(0, 3).map(r => {
        const titleEl = r.querySelector('.cat-prod-row-name, .grid-item__title, a.js_search-link');
        const priceEl = r.querySelector('.price-format, .price, .value');
        const pennyEl = r.querySelector('.penny');
        return {
          title: titleEl ? titleEl.innerText.trim() : 'N/A',
          price: priceEl ? priceEl.innerText.trim() + (pennyEl ? pennyEl.innerText.trim() : '') : 'N/A'
        };
      });
    });
    console.log('Products found:', JSON.stringify(products, null, 2));
  } catch (e) {
    console.log('Scrape error:', e.message);
  } finally {
    await browser.close();
  }
})();
