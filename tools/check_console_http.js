const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`PAGE ${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    console.log(`PAGE EXCEPTION: ${err.message}`);
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); 

  await browser.close();
})();
