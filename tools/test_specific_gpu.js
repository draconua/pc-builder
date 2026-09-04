const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const query = 'Gigabyte GeForce RTX 4070 SUPER WINDFORCE OC 12GB';
  await page.goto('https://www.ceneo.pl/;szukaj-' + encodeURIComponent(query), { timeout: 15000, waitUntil: 'domcontentloaded' });
  
  const items = await page.$$eval('.cat-prod-row', rows => {
    return rows.slice(0, 3).map(r => {
      const title = r.querySelector('.cat-prod-row__name, a.js_search-link, strong')?.innerText?.trim();
      const priceVal = r.querySelector('.price-format .value')?.innerText?.trim();
      const pricePenny = r.querySelector('.price-format .penny')?.innerText?.trim();
      return { title, price: priceVal ? `${priceVal}${pricePenny || ''} zł` : null };
    });
  });
  console.log('Specific GPU result:', JSON.stringify(items, null, 2));

  await browser.close();
})();
