const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const indexPath = path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');
  await page.goto('file:///' + indexPath);
  await page.waitForTimeout(1000); 
  
  // Click auto builder to open it
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(1000);

  // Take full screenshot
  await page.screenshot({ path: 'tools/post_fix_popover.png' });
  await browser.close();
  console.log("Screenshot saved.");
})();
