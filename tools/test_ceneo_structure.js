const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  await page.goto('https://www.ceneo.pl/;szukaj-RTX+4070+SUPER', { timeout: 15000, waitUntil: 'domcontentloaded' });
  
  const items = await page.$$eval('.category-item, .category-list-item, .cat-prod-row, .grid-row .grid-item', nodes => {
    return nodes.slice(0, 5).map(n => ({
      class: n.className,
      text: n.innerText.split('\n').filter(Boolean).slice(0, 4)
    }));
  });
  console.log('Items matched:', JSON.stringify(items, null, 2));

  await browser.close();
})();
