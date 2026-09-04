const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const response = await page.goto('https://www.ceneo.pl/;szukaj-ryzen+7+7800x3d', { timeout: 15000 });
  console.log('HTTP Status:', response.status());
  const content = await page.content();
  console.log('HTML snippet:\n', content.slice(0, 1500));

  await browser.close();
})();
