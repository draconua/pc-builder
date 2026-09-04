const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const indexPath = path.join(__dirname, '..', 'index.html').replace(/\\/g, '/');
  await page.goto('file:///' + indexPath);
  await page.waitForTimeout(2000); 
  
  // Click ultimate preset
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(1000);

  // Take full screenshot
  await page.screenshot({ path: 'tools/post_audit_polish_light.png', fullPage: true });

  // Switch to dark mode
  await page.click('.theme-toggle-btn');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tools/post_audit_polish_dark.png', fullPage: true });

  await browser.close();
  console.log("Screenshots saved.");
})();
