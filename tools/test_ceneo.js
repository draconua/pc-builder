const { chromium } = require('playwright');

(async () => {
  console.log('Testing Ceneo scrape for Ryzen 5 7600...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  try {
    await page.goto('https://www.ceneo.pl/;szukaj-Ryzen+5+7600', { timeout: 15000, waitUntil: 'domcontentloaded' });
    const title = await page.title();
    console.log('Page title:', title);

    // Try finding price
    const prices = await page.$$eval('.price .value, .product-price .value, span.price', els => els.map(e => e.innerText.trim()).filter(Boolean));
    console.log('Found prices:', prices.slice(0, 5));
  } catch (e) {
    console.log('Scrape error:', e.message);
  } finally {
    await browser.close();
  }
})();
