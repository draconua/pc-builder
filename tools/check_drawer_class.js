const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  await page.click('#btn-hardware-guide');
  await page.waitForTimeout(400);

  await page.click('.guide-quick-pick-btn[data-guide-cat="gpu"]');
  await page.waitForTimeout(600);

  const isActive = await page.locator('#drawer.active').isVisible();
  console.log('Is #drawer.active visible?', isActive);

  const title = await page.locator('#drawer-title').innerText();
  console.log('Drawer title:', title);

  await browser.close();
})();
