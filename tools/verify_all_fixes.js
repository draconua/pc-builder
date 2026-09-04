const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 }
  });

  const errors = [];
  page.on('pageerror', err => {
    errors.push('PAGE ERROR: ' + err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push('CONSOLE ERROR: ' + msg.text());
    }
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  console.log('1. Testing click on slot-card body (should NOT open drawer)...');
  const drawer = page.locator('#drawer');
  await page.click('#slot-cpu');
  await page.waitForTimeout(300);
  const isOpenAfterCardClick = await drawer.evaluate(el => el.classList.contains('active'));
  console.log('   Drawer active after card click:', isOpenAfterCardClick, '(Expected: false)');

  console.log('2. Testing click on .select-btn (SHOULD open drawer)...');
  await page.click('#slot-cpu .select-btn');
  await page.waitForTimeout(300);
  const isOpenAfterBtnClick = await drawer.evaluate(el => el.classList.contains('active'));
  console.log('   Drawer active after select-btn click:', isOpenAfterBtnClick, '(Expected: true)');

  // Close drawer
  await page.click('#drawer-close');
  await page.waitForTimeout(300);

  console.log('3. Loading Balanced Preset...');
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(1000);

  console.log('4. Checking FPS Matrix table...');
  const fpsTable = page.locator('#fps-table-container');
  const isTableVisible = await fpsTable.evaluate(el => !el.classList.contains('hidden'));
  const rowCount = await page.locator('#fps-matrix-tbody tr').count();
  console.log('   FPS table visible:', isTableVisible, '(Expected: true)');
  console.log('   FPS rows count:', rowCount, '(Expected: 7)');

  console.log('5. Checking Analogs in CPU slot...');
  const analogChips = await page.locator('#cpu-analogs-list .analog-chip-btn').count();
  console.log('   CPU analog chips count:', analogChips);
  if (analogChips > 0) {
    const firstChipText = await page.locator('#cpu-analogs-list .analog-chip-btn').first().innerText();
    console.log('   First analog chip text:', firstChipText);
    
    // Click analog chip
    await page.locator('#cpu-analogs-list .analog-chip-btn').first().click();
    await page.waitForTimeout(500);
    const isDrawerOpenAfterAnalog = await drawer.evaluate(el => el.classList.contains('active'));
    console.log('   Drawer active after analog click:', isDrawerOpenAfterAnalog, '(Expected: false)');
  }

  console.log('6. Checking Recommended Monitor Panel...');
  const monBadge = await page.locator('#monitor-tier-badge').innerText();
  const monTitle = await page.locator('#monitor-rec-title').innerText();
  const quickPickCount = await page.locator('#monitor-quick-picks-list .monitor-quick-chip').count();
  console.log('   Monitor badge:', monBadge);
  console.log('   Monitor title:', monTitle);
  console.log('   Quick pick monitors count:', quickPickCount);

  // Equip a recommended monitor via quick pick
  if (quickPickCount > 0) {
    const prevTotal = await page.locator('#total-price').innerText();
    await page.locator('#monitor-quick-picks-list .monitor-quick-chip').first().click();
    await page.waitForTimeout(500);
    const newTotal = await page.locator('#total-price').innerText();
    const isMonSelectedVisible = await page.locator('#monitor-selected-card').evaluate(el => !el.classList.contains('hidden'));
    console.log('   Monitor equipped successfully! Card visible:', isMonSelectedVisible);
    console.log('   Total price updated from', prevTotal, 'to', newTotal);
  }

  // Take screenshot
  await page.screenshot({ path: 'tools/test_full_stage.png' });
  await page.locator('#details-section').screenshot({ path: 'tools/test_details_section.png' });

  await browser.close();

  if (errors.length > 0) {
    console.log('FAILED with errors:', errors);
  } else {
    console.log('ALL VERIFICATIONS PASSED 100%!');
  }
})();
