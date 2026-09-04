const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  await page.goto('https://www.ceneo.pl/;szukaj-ryzen+7+7800x3d', { timeout: 15000, waitUntil: 'domcontentloaded' });
  const bodyText = await page.$eval('body', el => el.innerText);
  console.log('Body text:\n', bodyText.slice(0, 1000));

  await browser.close();
})();
