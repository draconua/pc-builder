const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pl-PL'
  });
  const page = await context.newPage();

  console.log('Testing Morele for Ryzen 5 5500...');
  await page.goto('https://www.morele.net/wyszukiwarka/?q=Ryzen+5+5500', { timeout: 20000, waitUntil: 'domcontentloaded' });
  
  const items = await page.$$eval('.cat-product, .cat-product-inside', els => {
    return els.slice(0, 3).map(e => ({
      title: e.querySelector('a.product-link, a.cat-product-link, [title]')?.getAttribute('title') || e.querySelector('a')?.innerText,
      price: e.querySelector('.price-new')?.innerText?.trim()
    }));
  });
  console.log('Morele 5500 items:', JSON.stringify(items, null, 2));

  await browser.close();
})();
