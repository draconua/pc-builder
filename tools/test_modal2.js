const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);
  
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('pc-builder-theme', 'dark');
  });
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(500);

  // Click GPU search to open the retailers modal
  // Note: we'll run a script inside the page to trigger the modal opening manually
  await page.evaluate(() => {
    // find a valid gpu part and trigger modal
    const part = PC_PARTS.find(p => p.type === 'gpu');
    openRetailersModal(part);
  });
  await page.waitForTimeout(800);
  
  await page.screenshot({ path: 'modal_bg_dark.png' });
  
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('pc-builder-theme', 'light');
  });
  await page.waitForTimeout(800);
  
  await page.screenshot({ path: 'modal_bg_light.png' });
  await browser.close();
})();
