import { test, expect } from '@playwright/test';

test.describe('Hardware Database Sanity', () => {
  test('should verify database is loaded and has correct categories', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mainSlots = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'psu', 'case'];

    for (const cat of mainSlots) {
      // Open drawer for each category
      await page.click(`#slot-${cat}`);
      
      const drawer = page.locator('#drawer');
      await expect(drawer).toHaveClass(/active/);

      // Ensure parts are rendered
      const parts = drawer.locator('.part-card');
      await expect(parts).not.toHaveCount(0);

      // Verify names don't contain dummy variants
      const count = await parts.count();
      for (let i = 0; i < count; i++) {
        await expect(parts.nth(i).locator('.part-name')).not.toHaveText(/Custom\s+(CPU|GPU|Motherboard|RAM|SSD|PSU)\s+Variant/i);
        await expect(parts.nth(i).locator('.part-name')).not.toHaveText(/\(Legacy\s+[2-9]\)/i);
      }
      
      // Close drawer by clicking overlay
      await page.click('#drawer-overlay', { force: true });
      await expect(drawer).not.toHaveClass(/active/);
    }
  });
});
