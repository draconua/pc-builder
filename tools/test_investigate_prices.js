const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  console.log('--- Testing Ceneo for Ryzen 7 7800X3D ---');
  await page.goto('https://www.ceneo.pl/;szukaj-Ryzen+7+7800X3D', { timeout: 15000, waitUntil: 'domcontentloaded' });
  const ceneoItems = await page.$$eval('.cat-prod-row, .product-row', rows => rows.slice(0, 5).map(r => ({
    title: r.querySelector('.cat-prod-row__name, a.js_search-link, strong')?.innerText?.trim(),
    price: r.querySelector('.price-format .value')?.innerText?.trim()
  })));
  console.log('Ceneo 7800X3D items:', JSON.stringify(ceneoItems, null, 2));

  console.log('--- Testing Morele for Ryzen 7 7800X3D ---');
  await page.goto('https://www.morele.net/wyszukiwarka/?q=Ryzen+7+7800X3D', { timeout: 15000, waitUntil: 'domcontentloaded' });
  const moreleTitle = await page.title();
  console.log('Morele page title:', moreleTitle);
  const moreleItems = await page.$$eval('.cat-product, .product-box, [data-product-id]', rows => rows.slice(0, 5).map(r => ({
    name: r.querySelector('.product-name, .cat-product-name, [title]')?.innerText?.trim(),
    price: r.querySelector('.price-new, .product-price, .cat-product-price')?.innerText?.trim()
  })));
  console.log('Morele 7800X3D items:', JSON.stringify(moreleItems, null, 2));

  await browser.close();
})();
