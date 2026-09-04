const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  console.log('Testing Ceneo for Ryzen 7 7800X3D...');
  await page.goto('https://www.ceneo.pl/;szukaj-Ryzen+7+7800X3D', { timeout: 15000, waitUntil: 'domcontentloaded' });
  console.log('Final URL:', page.url());
  console.log('Page Title:', await page.title());

  // Check what selector has products or if it is a single product page
  const htmlSample = await page.content();
  console.log('HTML length:', htmlSample.length);

  // Look for prices in page
  const pricesFound = await page.$$eval('*', els => {
    return els
      .filter(e => e.innerText && e.innerText.includes('zł') && e.innerText.length < 30)
      .slice(0, 10)
      .map(e => ({ tag: e.tagName, text: e.innerText.trim(), class: e.className }));
  });
  console.log('Sample price elements:', pricesFound);

  await browser.close();
})();
