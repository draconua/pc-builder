const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. Test PLN Auto-Build for 5 000 zł
  console.log('--- TEST 1: PLN Auto-Build (Target: 5 000 zł) ---');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);

  // Check chips text
  const chip5000 = page.locator('.quick-budget-btn[data-val="5000"]');
  console.log('Chip 5000 text:', await chip5000.innerText());
  await chip5000.click();
  await page.waitForTimeout(200);

  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(500);

  const totalPln = await page.locator('#total-price').innerText();
  console.log('Resulting Total Price (Target: 5 000 zł):', totalPln);

  // 2. Test USD Auto-Build for $1800
  console.log('--- TEST 2: USD Auto-Build (Target: $1800) ---');
  await page.click('.currency-btn[data-currency="USD"]');
  await page.waitForTimeout(400);

  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);

  const chip1800 = page.locator('.quick-budget-btn[data-val="1800"]');
  console.log('Chip 1800 text:', await chip1800.innerText());
  await chip1800.click();
  await page.waitForTimeout(200);

  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(500);

  const totalUsd = await page.locator('#total-price').innerText();
  console.log('Resulting Total Price (Target: $1800):', totalUsd);

  // 3. Test USD Auto-Build for $800
  console.log('--- TEST 3: USD Auto-Build (Target: $800) ---');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);
  await page.click('.quick-budget-btn[data-val="800"]');
  await page.waitForTimeout(200);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(500);
  const totalUsd800 = await page.locator('#total-price').innerText();
  console.log('Resulting Total Price (Target: $800):', totalUsd800);

  await browser.close();
})();
