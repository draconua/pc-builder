import { test, expect } from '@playwright/test';

test.describe('Extra Features and Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should toggle theme', async ({ page }) => {
    const themeBtn = page.locator('#theme-toggle');
    const html = page.locator('html');
    
    const initialTheme = await html.getAttribute('data-theme');
    await themeBtn.click();
    
    await expect(html).not.toHaveAttribute('data-theme', initialTheme);
    const newTheme = await html.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(newTheme);
  });

  test('should change currency and update price display', async ({ page }) => {
    await page.click('.currency-btn[data-currency="USD"]');
    await expect(page.locator('#total-price')).toContainText('$');
    
    await page.click('.currency-btn[data-currency="PLN"]');
    await expect(page.locator('#total-price')).toContainText('zł');
  });

  test('should open dev prices modal and verify contents', async ({ page }) => {
    const devModalBtn = page.locator('#dev-modal-btn');
    const modal = page.locator('#dev-prices-modal');
    
    await devModalBtn.click();
    await expect(modal).toBeVisible();
    
    const allOption = page.locator('#dev-category-select option[value="all"]');
    await expect(allOption).toContainText('Вся база');
    
    await page.click('#dev-modal-close');
    await expect(modal).toBeHidden();
  });

  test('should activate schematic tools without errors', async ({ page }) => {
    const airflowTool = page.locator('#tool-schematic-airflow');
    if (await airflowTool.count() > 0) {
      await airflowTool.click();
      await expect(airflowTool).toHaveClass(/active/);
      await airflowTool.click();
      await expect(airflowTool).not.toHaveClass(/active/);
    }
  });

  test('should select GPU quick pick from hardware guide', async ({ page }) => {
    await page.click('#btn-hardware-guide');
    const modal = page.locator('#hardware-guide-modal');
    await expect(modal).toBeVisible();

    const gpuQuickPick = page.locator('.guide-quick-pick-btn[data-guide-cat="gpu"]');
    if (await gpuQuickPick.count() > 0) {
      await gpuQuickPick.click();
      await expect(modal).toBeHidden();
      await expect(page.locator('#drawer')).toHaveClass(/active/);
    }
  });
});
