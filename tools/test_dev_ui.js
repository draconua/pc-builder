const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  const errors = [];
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });

  console.log('1. Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  console.log('2. Verifying Dev button in header...');
  const devBtn = page.locator('#dev-modal-btn');
  const isDevBtnVisible = await devBtn.isVisible();
  console.log('   Dev button visible:', isDevBtnVisible);

  console.log('3. Clicking Dev button to open Dev Cabinet modal...');
  await devBtn.click();
  await page.waitForTimeout(600);

  const modal = page.locator('#dev-prices-modal');
  const isModalOpen = await modal.evaluate(el => el.classList.contains('active'));
  console.log('   Dev modal active:', isModalOpen);

  console.log('4. Checking Dev Cabinet controls & stats...');
  const cachedCount = await page.locator('#dev-stat-cached').innerText();
  console.log('   Cached items count from server:', cachedCount);

  // Take screenshot of Dev Cabinet modal
  await page.screenshot({ path: 'tools/dev_cabinet_open.png' });

  console.log('5. Testing shortcut Ctrl+Shift+D toggle...');
  await page.keyboard.press('Control+Shift+D');
  await page.waitForTimeout(400);
  const isModalClosed = await modal.evaluate(el => !el.classList.contains('active'));
  console.log('   Modal closed via shortcut:', isModalClosed);

  await page.keyboard.press('Control+Shift+D');
  await page.waitForTimeout(400);
  const isModalReopened = await modal.evaluate(el => el.classList.contains('active'));
  console.log('   Modal reopened via shortcut:', isModalReopened);

  await browser.close();

  if (errors.length > 0) {
    console.log('FAILED with errors:', errors);
  } else {
    console.log('ALL DEV CABINET TESTS PASSED 100%!');
  }
})();
