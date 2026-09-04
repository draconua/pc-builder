const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pl-PL'
  });
  const page = await context.newPage();

  console.log('Testing Morele fetch...');
  try {
    const res = await page.goto('https://www.morele.net/', { timeout: 15000, waitUntil: 'load' });
    console.log('Morele Home Status:', res.status());
    console.log('Title:', await page.title());
  } catch (e) {
    console.log('Morele error:', e.message);
  }

  await browser.close();
})();
