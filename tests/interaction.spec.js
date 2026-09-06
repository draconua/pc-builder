import { test, expect } from '@playwright/test';

test('diagnose all interactive buttons and check behavior', async ({ page }) => {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('Console error: ' + msg.text());
  });
  page.on('pageerror', err => {
    errors.push('Page error: ' + err.message);
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  console.log('Testing Presets...');
  const budgetBtn = page.locator('button.preset-btn[data-preset="budget"]');
  await budgetBtn.click();
  await page.waitForTimeout(300);
  const priceVal = await page.locator('#total-price').innerText();
  console.log('Total price after budget preset:', priceVal);

  console.log('Testing Slot Select / Change...');
  const cpuSlot = page.locator('#slot-cpu');
  const cpuBtn = cpuSlot.locator('.change-btn, .select-btn');
  await cpuBtn.click();
  await page.waitForTimeout(300);
  const drawerVisible = await page.locator('#drawer').isVisible();
  console.log('Drawer visible after clicking CPU slot:', drawerVisible);

  console.log('Testing Drawer part select...');
  const firstPart = page.locator('#drawer .part-card').first();
  await firstPart.locator('.select-part-btn').click();
  await page.waitForTimeout(300);

  console.log('Testing View Toggle buttons (Schematic / Workbench)...');
  const viewSchematic = page.locator('#btn-view-schematic');
  if (await viewSchematic.count() > 0) {
    console.log('viewSchematic visible:', await viewSchematic.isVisible());
    await viewSchematic.click();
    await page.waitForTimeout(300);
  }
  const viewWorkbench = page.locator('#btn-view-workbench');
  if (await viewWorkbench.count() > 0) {
    console.log('viewWorkbench visible:', await viewWorkbench.isVisible());
    await viewWorkbench.click();
    await page.waitForTimeout(300);
  }

  console.log('Testing Autobuild Popover & Run...');
  const autobuildBtn = page.locator('#btn-auto-builder');
  await autobuildBtn.click();
  await page.waitForTimeout(300);
  const popoverVisible = await page.locator('#autobuild-popover').isVisible();
  console.log('Autobuild popover visible:', popoverVisible);
  const runAutobuildBtn = page.locator('#btn-run-autobuild');
  if (await runAutobuildBtn.isVisible()) {
    await runAutobuildBtn.click();
    await page.waitForTimeout(500);
    console.log('Autobuild ran successfully');
  }

  console.log('Testing Guide Modal...');
  const guideBtn = page.locator('#btn-hardware-guide');
  await guideBtn.click();
  await page.waitForTimeout(300);
  const guideModalVisible = await page.locator('#hardware-guide-modal').isVisible();
  console.log('Guide modal visible:', guideModalVisible);
  await page.locator('#hardware-guide-close').click();
  await page.waitForTimeout(300);
  console.log('Guide modal closed:', !(await page.locator('#hardware-guide-modal').isVisible()));

  console.log('Testing Pro Chat Drawer...');
  const chatBtn = page.locator('#btn-pro-chat');
  await chatBtn.click();
  await page.waitForTimeout(300);
  console.log('Chat drawer visible:', await page.locator('#pro-chat-drawer').isVisible());
  await page.locator('#pro-chat-close').click();
  await page.waitForTimeout(300);

  console.log('Testing Theme Toggle...');
  const themeToggle = page.locator('#theme-toggle');
  if (await themeToggle.count() > 0) {
    await themeToggle.click();
    await page.waitForTimeout(100);
  }

  console.log('Testing Language Selector...');
  const langSelect = page.locator('#lang-select');
  if (await langSelect.count() > 0) {
    await langSelect.selectOption('en');
    await page.waitForTimeout(300);
  }

  console.log('Testing Country Selector...');
  const countrySelect = page.locator('#country-select');
  if (await countrySelect.count() > 0) {
    await countrySelect.selectOption('ua');
    await page.waitForTimeout(300);
  }

  console.log('Testing Clear Build...');
  const clearBtn = page.locator('#btn-clear');
  await clearBtn.click();
  await page.waitForTimeout(300);

  console.log('All errors collected:', errors);
  expect(errors.length).toBe(0);
});
