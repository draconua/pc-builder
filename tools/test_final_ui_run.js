const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. Loading app...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  console.log('2. Opening Auto-Builder Popover...');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);

  console.log('3. Selecting 5000 zł budget button...');
  await page.click('button.quick-budget-btn[data-val="5000"]');
  await page.waitForTimeout(300);

  console.log('4. Clicking "Собрать конфигурацию ✨"...');
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1200);

  const cpuName = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpuName = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const mbName = await page.locator('#slot-motherboard .slot-selected-name').innerText();
  const ramName = await page.locator('#slot-ram .slot-selected-name').innerText();
  const ssdName = await page.locator('#slot-ssd .slot-selected-name').innerText();
  const psuName = await page.locator('#slot-psu .slot-selected-name').innerText();
  const total5000 = await page.locator('#total-price').innerText();

  console.log('\n=======================================');
  console.log('--- 5000 zł AUTO-BUILD IN BROWSER ---');
  console.log('CPU:        ', cpuName);
  console.log('GPU:        ', gpuName);
  console.log('Motherboard:', mbName);
  console.log('RAM:        ', ramName);
  console.log('SSD:        ', ssdName);
  console.log('PSU:        ', psuName);
  console.log('TOTAL:      ', total5000);
  console.log('=======================================\n');

  // Take screenshot
  await page.screenshot({ path: 'tools/test_autobuild_5000_fixed.png' });

  // Test 3000 zł
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);
  await page.click('button.quick-budget-btn[data-val="3000"]');
  await page.waitForTimeout(300);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1200);

  const total3000 = await page.locator('#total-price').innerText();
  console.log('--- 3000 zł TOTAL IN BROWSER ---: ', total3000);

  // Test 7500 zł
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);
  await page.click('button.quick-budget-btn[data-val="7500"]');
  await page.waitForTimeout(300);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1200);

  const total7500 = await page.locator('#total-price').innerText();
  console.log('--- 7500 zł TOTAL IN BROWSER ---: ', total7500);

  await page.screenshot({ path: 'tools/test_autobuild_7500_fixed.png' });
  await browser.close();
})();
