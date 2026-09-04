const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(800);
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(500);
  
  // Explicitly ensure dark mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('pc-builder-theme', 'dark');
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'dark_studio_ambient_real.png' });
  await browser.close();
})();
