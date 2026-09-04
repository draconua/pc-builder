const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Open modal
  await page.click('#dev-modal-btn');
  await page.waitForTimeout(500);

  // Click Apply button
  console.log('Clicking Apply button...');
  await page.click('#btn-apply-prices');
  await page.waitForTimeout(600);

  // Verify toast appeared
  const toast = page.locator('.toast-item');
  const isToastVisible = await toast.isVisible();
  console.log('Toast visible:', isToastVisible);
  const toastTitle = await page.locator('.toast-title').innerText();
  const toastMsg = await page.locator('.toast-message').innerText();
  console.log('Toast Title:', toastTitle);
  console.log('Toast Message:', toastMsg);

  // Take screenshot of modal with the stylish toast banner
  await page.screenshot({ path: 'tools/test_toast_notification.png' });

  await browser.close();
  console.log('Toast verification completed successfully.');
})();
