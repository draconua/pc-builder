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
  await page.click('#slot-gpu .slot-buy-link');
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'modal_bg_dark.png' });
  
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('pc-builder-theme', 'light');
  });
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'modal_bg_light.png' });
  await browser.close();
})();
