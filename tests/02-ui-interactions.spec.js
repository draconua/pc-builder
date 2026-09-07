import { test, expect } from '@playwright/test';

test.describe('UI Interactions and Modals', () => {
  let errors = [];

  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('should toggle Pro Chat drawer', async ({ page }) => {
    const chatBtn = page.locator('#btn-pro-chat');
    const drawer = page.locator('#pro-chat-drawer');
    const closeBtn = page.locator('#pro-chat-close');

    await chatBtn.click();
    await expect(drawer).toBeVisible();

    await closeBtn.click();
    await expect(drawer).toBeHidden();
  });

  test('should toggle Guide modal', async ({ page }) => {
    const guideBtn = page.locator('#btn-hardware-guide');
    const modal = page.locator('#hardware-guide-modal');
    const closeBtn = page.locator('#hardware-guide-close');

    await guideBtn.click();
    await expect(modal).toBeVisible();

    await closeBtn.click();
    await expect(modal).toBeHidden();
  });

  test('should toggle Autobuild popover', async ({ page }) => {
    const autoBtn = page.locator('#btn-auto-builder');
    const popover = page.locator('#autobuild-popover');
    const closeBtn = page.locator('#autobuild-popover-close');

    await autoBtn.click();
    await expect(popover).toBeVisible();

    await closeBtn.click();
    await expect(popover).toBeHidden();
  });

  test('should change language and country without breaking', async ({ page }) => {
    const langSelect = page.locator('#lang-select');
    const countrySelect = page.locator('#country-select');

    if (await langSelect.count() > 0) {
      await langSelect.selectOption('en');
    }
    
    if (await countrySelect.count() > 0) {
      await countrySelect.selectOption('ua');
    }
    
    // Changing these usually triggers a reload or dynamic update, we just ensure no errors were pushed
    await expect(page.locator('body')).toBeVisible();
  });
});
