const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pl-PL'
  });
  const page = await context.newPage();

  console.log('Testing Morele search...');
  try {
    const res = await page.goto('https://www.morele.net/wyszukiwarka/?q=Ryzen+7+7800X3D', { timeout: 20000, waitUntil: 'domcontentloaded' });
    console.log('Status:', res.status());
    console.log('Title:', await page.title());

    // Extract products
    const products = await page.$$eval('.cat-product-inside, [data-product-id]', els => {
      return els.slice(0, 5).map(e => ({
        name: e.querySelector('.cat-product-name, [title]')?.innerText?.trim(),
        price: e.querySelector('.price-new, .cat-product-price')?.innerText?.trim()
      }));
    });
    console.log('Morele products:', JSON.stringify(products, null, 2));
  } catch (e) {
    console.log('Morele search error:', e.message);
  }

  await browser.close();
})();
