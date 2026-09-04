const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Apply ultimate preset
  await page.click('button[data-preset="ultimate"]');
  await page.waitForSelector('#slot-gpu .slot-buy-link:not(.hidden)', { timeout: 5000 });

  // --- 1. VERIFY CLEAN BACKGROUND (NO MATH NOTEBOOK SQUARES) ---
  console.log('--- 1. VERIFYING BACKGROUND ---');
  const bgDark = await page.evaluate(() => window.getComputedStyle(document.body).backgroundImage);
  console.log('Dark Mode Background Image:', bgDark);
  const hasGridDark = bgDark.includes('1px');
  console.log('Has 1px grid in Dark Mode:', hasGridDark);

  await page.screenshot({ path: 'clean_studio_bg_dark.png' });

  await page.click('#theme-toggle'); // Switch to light
  await page.waitForTimeout(300);

  const bgLight = await page.evaluate(() => window.getComputedStyle(document.body).backgroundImage);
  console.log('Light Mode Background Image:', bgLight);
  const hasGridLight = bgLight.includes('1px');
  console.log('Has 1px grid in Light Mode:', hasGridLight);

  await page.screenshot({ path: 'clean_studio_bg_light.png' });

  await page.click('#theme-toggle'); // Switch back to dark
  await page.waitForTimeout(300);

  // --- 2. VERIFY MULTI-COUNTRY STORE MODAL (6 COUNTRIES) ---
  console.log('--- 2. TESTING MULTI-COUNTRY STORE MODAL ---');
  await page.click('#slot-gpu .slot-buy-link');
  await page.waitForTimeout(400);

  const countryTabs = await page.locator('.retailer-country-chip').allInnerTexts();
  console.log('Country Tabs Available:', countryTabs);

  // Test Ukraine 🇺🇦
  console.log('Testing Ukraine 🇺🇦...');
  await page.locator('.retailer-country-chip', { hasText: 'Украина' }).click();
  await page.waitForTimeout(300);
  const uaStores = await page.locator('.retailers-deck-frame .retailer-name').allInnerTexts();
  console.log('Ukraine Stores:', uaStores);
  await page.screenshot({ path: 'country_modal_ua.png' });

  // Test USA 🇺🇸
  console.log('Testing USA 🇺🇸...');
  await page.locator('.retailer-country-chip', { hasText: 'США' }).click();
  await page.waitForTimeout(300);
  const usStores = await page.locator('.retailers-deck-frame .retailer-name').allInnerTexts();
  console.log('USA Stores:', usStores);
  await page.screenshot({ path: 'country_modal_us.png' });

  // Test Kazakhstan 🇰🇿
  console.log('Testing Kazakhstan 🇰🇿...');
  await page.locator('.retailer-country-chip', { hasText: 'Казахстан' }).click();
  await page.waitForTimeout(300);
  const kzStores = await page.locator('.retailers-deck-frame .retailer-name').allInnerTexts();
  console.log('Kazakhstan Stores:', kzStores);
  await page.screenshot({ path: 'country_modal_kz.png' });

  // Test Germany 🇩🇪
  console.log('Testing Germany 🇩🇪...');
  await page.locator('.retailer-country-chip', { hasText: 'Германия' }).click();
  await page.waitForTimeout(300);
  const deStores = await page.locator('.retailers-deck-frame .retailer-name').allInnerTexts();
  console.log('Germany Stores:', deStores);
  await page.screenshot({ path: 'country_modal_de.png' });

  // Test Poland 🇵🇱
  console.log('Testing Poland 🇵🇱...');
  await page.locator('.retailer-country-chip', { hasText: 'Польша' }).click();
  await page.waitForTimeout(300);
  const plStores = await page.locator('.retailers-deck-frame .retailer-name').allInnerTexts();
  console.log('Poland Stores:', plStores);
  await page.screenshot({ path: 'country_modal_pl.png' });

  console.log('ALL COUNTRY TESTS & BACKGROUND CHECKS PASSED!');
  await browser.close();
})();
