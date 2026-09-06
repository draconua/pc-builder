import { test, expect } from '@playwright/test';

test.describe('PC Builder Core Flow', () => {
  test('should load the application and apply a preset', async ({ page }) => {
    await page.goto('/');
    
    // Verify title
    await expect(page).toHaveTitle(/PC Builder 2026/);
    
    // Click budget preset
    await page.click('button.preset-btn[data-preset="budget"]');
    
    // Wait for components to populate
    await page.waitForTimeout(1000);
    
    // Verify total price is visible and updated
    const priceText = await page.locator('#total-price').innerText();
    expect(priceText.length).toBeGreaterThan(0);
    expect(priceText).not.toBe('0');
    
    // Verify progress shows 8/8 or 10/10 or similar
    const progressText = await page.locator('#progress-text').innerText();
    expect(progressText).toMatch(/\d+\s*\/\s*\d+/);
  });

  test('should manually select a CPU and update the slot', async ({ page }) => {
    await page.goto('/');
    
    // Click Select on CPU slot
    await page.click('#slot-cpu .select-btn');
    
    // Drawer should open
    await expect(page.locator('#drawer')).toBeVisible();
    
    // Click first component add button
    await page.locator('#drawer .select-part-btn').first().click();
    
    // Drawer should close
    await page.waitForTimeout(500);
    
    // CPU slot should show selected item
    await expect(page.locator('#slot-cpu .slot-selected')).toBeVisible();
    await expect(page.locator('#slot-cpu .slot-placeholder')).toBeHidden();
  });
});
