const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Balanced preset
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(600);

  const priceWithMon = await page.locator('#total-price').innerText();
  console.log('Price with monitor:', priceWithMon);

  // Remove monitor
  await page.click('#btn-remove-monitor');
  await page.waitForTimeout(600);

  const priceWithoutMon = await page.locator('#total-price').innerText();
  console.log('Price without monitor:', priceWithoutMon);

  // Equip quick pick monitor
  await page.locator('#monitor-quick-picks-list .monitor-quick-chip').first().click();
  await page.waitForTimeout(600);

  const priceReEquipped = await page.locator('#total-price').innerText();
  console.log('Price with re-equipped monitor:', priceReEquipped);

  await page.screenshot({ path: 'tools/monitor_panel_verified.png' });
  await page.locator('#monitor-panel').screenshot({ path: 'tools/monitor_panel_card.png' });

  await browser.close();
})();
