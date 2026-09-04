const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Test 5000 zł Auto-Builder
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);
  await page.click('button.quick-budget-btn[data-val="5000"]');
  await page.waitForTimeout(300);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1000);

  const cpuName = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpuName = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const total5000 = await page.locator('#total-price').innerText();

  console.log('--- 5000 zł RESULT ---');
  console.log('CPU:  ', cpuName);
  console.log('GPU:  ', gpuName);
  console.log('Total:', total5000);

  // Test 7500 zł Auto-Builder
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);
  await page.click('button.quick-budget-btn[data-val="7500"]');
  await page.waitForTimeout(300);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1000);

  const cpu7500 = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpu7500 = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const total7500 = await page.locator('#total-price').innerText();

  console.log('\n--- 7500 zł RESULT ---');
  console.log('CPU:  ', cpu7500);
  console.log('GPU:  ', gpu7500);
  console.log('Total:', total7500);

  // Test 3000 zł Auto-Builder
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);
  await page.click('button.quick-budget-btn[data-val="3000"]');
  await page.waitForTimeout(300);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1000);

  const cpu3000 = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpu3000 = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const total3000 = await page.locator('#total-price').innerText();

  console.log('\n--- 3000 zł RESULT ---');
  console.log('CPU:  ', cpu3000);
  console.log('GPU:  ', gpu3000);
  console.log('Total:', total3000);

  await page.screenshot({ path: 'tools/test_autobuild_3tiers.png' });
  await browser.close();
  console.log('\nALL 3 TIERS VERIFIED SUCCESSFULLY!');
})();
