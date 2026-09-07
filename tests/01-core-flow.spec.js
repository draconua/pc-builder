import { test, expect } from '@playwright/test';

test.describe('PC Builder Core Flow', () => {
  test('should load the application and verify initial state', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PC Builder 2026/);
    await expect(page.locator('#total-price')).toContainText('0');
  });

  test('should apply a preset and update the price', async ({ page }) => {
    await page.goto('/');
    
    // Click budget preset
    await page.click('button.preset-btn[data-preset="budget"]');
    
    // Total price should update
    const priceText = page.locator('#total-price');
    await expect(priceText).not.toHaveText('0');
    await expect(priceText).not.toBeEmpty();
    
    // Verify progress text
    const progressText = page.locator('#progress-text');
    await expect(progressText).toContainText('/');
  });

  test('should manually select a CPU and update the slot', async ({ page }) => {
    await page.goto('/');
    
    // Click Select on CPU slot
    await page.click('#slot-cpu .select-btn');
    
    // Drawer should become visible
    const drawer = page.locator('#drawer');
    await expect(drawer).toHaveClass(/active/);
    
    // Click first component add button
    await drawer.locator('.select-part-btn').first().click();
    
    // Drawer should close
    await expect(drawer).not.toHaveClass(/active/);
    
    // CPU slot should show selected item
    await expect(page.locator('#slot-cpu .slot-selected')).toBeVisible();
    await expect(page.locator('#slot-cpu .slot-placeholder')).toBeHidden();
  });
});
