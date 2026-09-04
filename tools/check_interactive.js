const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000); 

  try {
     // Check if button works
     await page.click('.theme-toggle-btn');
     console.log("SUCCESS: Interactive elements are working.");
  } catch(e) {
     console.log("FAIL: " + e.message);
  }

  await browser.close();
})();
