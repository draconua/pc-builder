const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. Test clicking Balanced Preset
  console.log('Testing click on Balanced preset...');
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(500);

  // Check if SSD is filled
  const ssdName = await page.locator('#slot-ssd .slot-selected-name').textContent();
  console.log('Balanced preset SSD slot:', ssdName ? ssdName : 'EMPTY!');

  // Check if GPU is filled
  const gpuName = await page.locator('#slot-gpu .slot-selected-name').textContent();
  console.log('Balanced preset GPU slot:', gpuName ? gpuName : 'EMPTY!');

  // Check if GPU analogs are visible
  const analogsVisible = await page.locator('#gpu-analogs-box').isVisible();
  console.log('GPU Analogs Box visible:', analogsVisible);
  if (analogsVisible) {
    const chipsText = await page.locator('#gpu-analogs-list').innerText();
    console.log('Analogs offered:', chipsText.replace(/\n/g, ' '));
  }

  // 2. Test clicking Ultimate Preset
  console.log('Testing click on Ultimate preset...');
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(500);

  const ultimateSsd = await page.locator('#slot-ssd .slot-selected-name').textContent();
  console.log('Ultimate preset SSD slot:', ultimateSsd ? ultimateSsd : 'EMPTY!');

  const ultimateGpu = await page.locator('#slot-gpu .slot-selected-name').textContent();
  console.log('Ultimate preset GPU slot:', ultimateGpu ? ultimateGpu : 'EMPTY!');

  // 3. Take screenshot of the single-screen viewport
  await page.screenshot({ path: 'single_screen_stage.png' });
  console.log('Screenshot saved to single_screen_stage.png');

  await browser.close();
})();
