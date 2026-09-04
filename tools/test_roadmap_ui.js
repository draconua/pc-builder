const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 }
  });

  const indexPath = path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');
  await page.goto('file:///' + indexPath);
  await page.waitForTimeout(1000); 
  
  // Take screenshot of empty state
  await page.screenshot({ path: 'tools/post_roadmap_empty.png' });

  // Click budget preset
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(1000);

  // Take screenshot of filled state
  await page.screenshot({ path: 'tools/post_roadmap_filled.png' });

  await browser.close();
  console.log("Screenshots saved.");
})();
