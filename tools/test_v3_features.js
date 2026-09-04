const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. Header Layout Check
  console.log('--- 1. HEADER VERIFICATION ---');
  const topHeaderVisible = await page.locator('.app-header-main').isVisible();
  const commandBarVisible = await page.locator('.app-command-bar').isVisible();
  console.log('Top Header visible:', topHeaderVisible);
  console.log('Command Bar visible:', commandBarVisible);

  // Check no horizontal scrollbar on viewport
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Viewport Width: ${clientWidth}px, Scroll Width: ${scrollWidth}px (Overflow: ${scrollWidth > clientWidth})`);

  // 2. Auto-Builder Platform Filters Check
  console.log('--- 2. AUTO-BUILDER PLATFORM FILTERS ---');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);

  // Click Intel and NVIDIA
  await page.click('button[data-cpu-brand="Intel"]');
  await page.waitForTimeout(100);
  await page.click('button[data-gpu-brand="NVIDIA"]');
  await page.waitForTimeout(100);

  // Click 5000 zł
  await page.click('.quick-budget-btn[data-val="5000"]');
  await page.waitForTimeout(100);

  // Take screenshot of open popover with new platform chips
  await page.screenshot({ path: 'v3_popover_platforms.png' });

  // Generate
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(600);

  const genCpu = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const genGpu = await page.locator('#slot-gpu .slot-selected-name').innerText();
  console.log('Generated CPU (should be Intel):', genCpu);
  console.log('Generated GPU (should be NVIDIA):', genGpu);

  // 3. CPU Analogs Check
  console.log('--- 3. CPU ANALOGS CHECK ---');
  const cpuAnalogsVisible = await page.locator('#cpu-analogs-box').isVisible();
  console.log('CPU Analogs Box visible:', cpuAnalogsVisible);
  const cpuAnalogChips = await page.locator('#cpu-analogs-list .analog-chip-btn').allInnerTexts();
  console.log('CPU Analog Chips:', cpuAnalogChips);

  // 4. Multi-Resolution FPS Matrix Check
  console.log('--- 4. MULTI-RES FPS MATRIX CHECK ---');
  const fpsTableVisible = await page.locator('#fps-table-container').isVisible();
  console.log('FPS Matrix Table visible:', fpsTableVisible);
  const rowCount = await page.locator('#fps-matrix-tbody tr').count();
  console.log('Games listed in FPS table:', rowCount);

  const sampleRow = await page.locator('#fps-matrix-tbody tr').first().innerText();
  console.log('Sample FPS row (Game | 1080p | 1440p | 4K):', sampleRow.replace(/\n/g, '  |  '));

  // Scroll to FPS table and screenshot
  await page.locator('#fps-panel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v3_fps_matrix.png' });

  // 5. Stage Screenshot (Light & Dark)
  await page.locator('.app-header-main').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'v3_stage_light.png' });

  await page.click('#theme-toggle');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v3_stage_dark.png' });

  console.log('ALL V3 TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
})();
