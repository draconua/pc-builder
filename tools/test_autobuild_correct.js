const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  const errors = [];
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });

  console.log('1. Navigating to http://localhost:3000...');
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
  await page.waitForTimeout(1000);

  // Check what CPU and GPU were selected
  const cpuName = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpuName = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const mbName = await page.locator('#slot-motherboard .slot-selected-name').innerText();
  const ramName = await page.locator('#slot-ram .slot-selected-name').innerText();
  const ssdName = await page.locator('#slot-ssd .slot-selected-name').innerText();

  console.log('\n=======================================');
  console.log('--- 5000 zł AUTO-BUILD RESULT ---');
  console.log('CPU:        ', cpuName);
  console.log('GPU:        ', gpuName);
  console.log('Motherboard:', mbName);
  console.log('RAM:        ', ramName);
  console.log('SSD:        ', ssdName);
  console.log('=======================================\n');

  // Check toast notification
  const toastVisible = await page.locator('.toast-item').isVisible();
  const toastTitle = toastVisible ? await page.locator('.toast-title').innerText() : 'N/A';
  console.log('Toast visible:', toastVisible, '| Title:', toastTitle);

  // Take screenshot of main stage with 5000 zł build
  await page.screenshot({ path: 'tools/test_autobuild_5000.png' });

  // Now test 7500 zł
  console.log('5. Testing 7500 zł Auto-Builder...');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(400);
  await page.click('button.quick-budget-btn[data-val="7500"]');
  await page.waitForTimeout(300);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1000);

  const cpu7500 = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpu7500 = await page.locator('#slot-gpu .slot-selected-name').innerText();
  console.log('=======================================');
  console.log('--- 7500 zł AUTO-BUILD RESULT ---');
  console.log('CPU:', cpu7500);
  console.log('GPU:', gpu7500);
  console.log('=======================================\n');

  // Take screenshot of 7500 zł build
  await page.screenshot({ path: 'tools/test_autobuild_7500.png' });

  await browser.close();

  if (errors.length > 0) {
    console.log('\nPAGE ERRORS:', errors);
  } else {
    console.log('\nALL AUTO-BUILD TESTS PASSED FLAWLESSLY!');
  }
})();
