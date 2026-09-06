import { test, expect } from '@playwright/test';

test.describe('Catalog and Button Interactivity Validation', () => {
  test('no custom dummy variants in catalog and all buttons are clickable', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Verify Presets
    for (const preset of ['budget', 'balanced', 'ultimate']) {
      await page.click(`button.preset-btn[data-preset="${preset}"]`);
      await page.waitForTimeout(300);
      const price = await page.locator('#total-price').innerText();
      expect(price).not.toMatch(/^0/);
    }

    // 2. Test Clear Build
    await page.click('#btn-clear');
    await page.waitForTimeout(300);
    const clearedPrice = await page.locator('#total-price').innerText();
    expect(clearedPrice).toMatch(/^0/);

    // 3. Verify ALL categories in Drawer have NO dummy custom items and buttons work
    const mainSlots = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case'];

    for (const cat of mainSlots) {
      // Click slot card to open drawer
      await page.click(`#slot-${cat}`);
      await page.waitForTimeout(300);
      await expect(page.locator('#drawer')).toHaveClass(/active/);

      // Check all rendered part names in drawer - none should be "Custom ... Variant"
      const names = await page.locator('#drawer .part-name').allInnerTexts();
      expect(names.length).toBeGreaterThan(0);
      for (const name of names) {
        expect(name).not.toMatch(/Custom\s+(CPU|GPU|Motherboard|RAM|SSD|PSU)\s+Variant/i);
        expect(name).not.toMatch(/\(Legacy\s+[2-9]\)/i);
      }

      // Test store price button on first item
      const storeBtn = page.locator('#drawer .part-store-btn').first();
      await storeBtn.click();
      await page.waitForTimeout(200);
      await expect(page.locator('#retailers-modal')).toBeVisible();
      await page.click('#retailers-modal-close');
      await page.waitForTimeout(200);

      // Select first part
      const selectBtn = page.locator('#drawer .select-part-btn').first();
      await selectBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('#drawer')).not.toHaveClass(/active/);

      // Verify slot shows selected part
      await expect(page.locator(`#slot-${cat} .slot-selected`)).toBeVisible();
      await expect(page.locator(`#slot-${cat} .slot-placeholder`)).toBeHidden();
    }

    // Test Monitor selection via monitor panel button
    await page.click('#btn-select-monitor');
    await page.waitForTimeout(300);
    await expect(page.locator('#drawer')).toHaveClass(/active/);
    const monNames = await page.locator('#drawer .part-name').allInnerTexts();
    expect(monNames.length).toBeGreaterThan(0);
    for (const name of monNames) {
      expect(name).not.toMatch(/Custom/i);
    }
    await page.locator('#drawer .select-part-btn').first().click();
    await page.waitForTimeout(300);
    await expect(page.locator('#drawer')).not.toHaveClass(/active/);

    // Verify all slots filled and price calculated
    const finalPrice = await page.locator('#total-price').innerText();
    expect(finalPrice).not.toMatch(/^0/);

    // 4. Test remove button on CPU slot
    await page.click('#slot-cpu .remove-btn');
    await page.waitForTimeout(200);
    await expect(page.locator('#slot-cpu .slot-placeholder')).toBeVisible();

    // 5. Test Drawer Search and Search Clear Button
    await page.click('#slot-cpu');
    await page.waitForTimeout(200);
    await page.fill('#parts-search', 'Ryzen');
    await page.waitForTimeout(200);
    await expect(page.locator('#search-clear-btn')).toBeVisible();
    await page.click('#search-clear-btn');
    await page.waitForTimeout(200);
    expect(await page.locator('#parts-search').inputValue()).toBe('');
    await expect(page.locator('#search-clear-btn')).toBeHidden();

    // 6. Test Drawer Pagination "Показать еще" button (CPU has 53 items > 30 page size)
    const loadMoreBtn = page.locator('#drawer .load-more-btn');
    if (await loadMoreBtn.isVisible()) {
      const countBefore = await page.locator('#drawer .part-card').count();
      expect(countBefore).toBe(30);
      await loadMoreBtn.click();
      await page.waitForTimeout(300);
      const countAfter = await page.locator('#drawer .part-card').count();
      expect(countAfter).toBeGreaterThan(countBefore);
    }
    await page.click('#drawer-close');
    await page.waitForTimeout(200);

    // 7. Test Save Modal: Open, Cancel, then Save Build
    await page.click('#btn-save');
    await page.waitForTimeout(200);
    await expect(page.locator('#save-modal')).toBeVisible();
    await page.click('#save-modal-cancel');
    await page.waitForTimeout(200);
    await expect(page.locator('#save-modal')).toBeHidden();

    // Now actually save a build so comparison modal has data
    await page.click('#btn-save');
    await page.waitForTimeout(200);
    await page.fill('#save-build-name', 'Dream PC 2026');
    await page.click('#save-modal-confirm');
    await page.waitForTimeout(300);
    await expect(page.locator('#save-modal')).toBeHidden();

    // 8. Test Export Modal: Open, check text for valid i18n, OK, Close
    await page.click('#btn-export');
    await page.waitForTimeout(200);
    await expect(page.locator('#export-modal')).toBeVisible();
    const exportText = await page.locator('#export-text').inputValue();
    expect(exportText).not.toContain('misc.of');
    expect(exportText).toMatch(/Items:\s*\d+\s+(из|of|z|з)\s+10/);
    await page.click('#export-modal-ok');
    await page.waitForTimeout(200);
    await expect(page.locator('#export-modal')).toBeHidden();

    // 9. Test Comparison Modal: Open and Close
    await page.click('#btn-compare');
    await page.waitForTimeout(200);
    await expect(page.locator('#comparison-modal')).toBeVisible();
    // Delete the saved build from within the comparison modal
    page.once('dialog', dialog => dialog.accept());
    await page.click('#comparison-modal .compare-delete-btn');
    await page.waitForTimeout(300);
    // When last build is deleted, modal must automatically close and not hang
    await expect(page.locator('#comparison-modal')).toBeHidden();

    // Save a new build so saved builds list has an entry
    await page.click('#btn-save');
    await page.waitForTimeout(200);
    await page.fill('#save-build-name', 'Re-saved 2026');
    await page.click('#save-modal-confirm');
    await page.waitForTimeout(300);
    await expect(page.locator('#save-modal')).toBeHidden();

    // Test CPU alternative analog chip click (if available)
    const cpuAnalogChip = page.locator('#cpu-analogs-box .analog-chip-btn').first();
    if (await cpuAnalogChip.isVisible()) {
      await cpuAnalogChip.click();
      await page.waitForTimeout(300);
      await expect(page.locator('#drawer')).not.toHaveClass(/active/);
      expect(await page.locator('#total-price').innerText()).not.toMatch(/^0/);
    }

    // Test 2D Schematic component click
    const svgCpu = page.locator('#pc-svg .vis-component[data-category="cpu"]');
    if (await svgCpu.isVisible()) {
      await svgCpu.click();
      await page.waitForTimeout(300);
      await expect(page.locator('#drawer')).toHaveClass(/active/);
      await page.click('#drawer-close');
      await page.waitForTimeout(200);
    }

    // 10. Test Hardware Guide Modal and Quick Pick Button
    await page.click('#btn-hardware-guide');
    await page.waitForTimeout(200);
    await expect(page.locator('#hardware-guide-modal')).toBeVisible();
    // Test quick pick for GPU from guide
    const gpuQuickPick = page.locator('.guide-quick-pick-btn[data-guide-cat="gpu"]');
    if (await gpuQuickPick.isVisible()) {
      await gpuQuickPick.click();
      await page.waitForTimeout(300);
      await expect(page.locator('#hardware-guide-modal')).toBeHidden();
      await expect(page.locator('#drawer')).toHaveClass(/active/);
      await page.click('#drawer-close');
      await page.waitForTimeout(200);
    } else {
      await page.click('#hardware-guide-close');
      await page.waitForTimeout(200);
    }

    // 11. Test Autobuild popover
    await page.click('#btn-auto-builder');
    await page.waitForTimeout(200);
    await expect(page.locator('#autobuild-popover')).toBeVisible();
    await page.click('button.quick-budget-btn[data-val="7500"]');
    await page.waitForTimeout(100);
    await page.click('#auto-build-confirm-btn');
    await page.waitForTimeout(400);
    await expect(page.locator('#autobuild-popover')).toBeHidden();

    // 12. Test Pro Chat Drawer
    await page.click('#btn-pro-chat');
    await page.waitForTimeout(200);
    await expect(page.locator('#pro-chat-drawer')).toBeVisible();
    await page.click('#pro-chat-close');
    await page.waitForTimeout(200);
    await expect(page.locator('#pro-chat-drawer')).toBeHidden();

    // 13. Test Schematic Tools
    const airflowTool = page.locator('#tool-schematic-airflow');
    if (await airflowTool.isVisible()) {
      await airflowTool.click();
      await page.waitForTimeout(100);
      await airflowTool.click();
      await page.waitForTimeout(100);
    }

    const xrayTool = page.locator('#tool-schematic-xray');
    if (await xrayTool.isVisible()) {
      await xrayTool.click();
      await page.waitForTimeout(100);
      await xrayTool.click();
      await page.waitForTimeout(100);
    }

    // 14. Test Theme Toggle
    await page.click('#theme-toggle');
    await page.waitForTimeout(100);
    const themeAfter = await page.getAttribute('html', 'data-theme');
    expect(['dark', 'light']).toContain(themeAfter);

    // 15. Test Currency Buttons
    await page.click('.currency-btn[data-currency="USD"]');
    await page.waitForTimeout(200);
    expect(await page.locator('#total-price').innerText()).toContain('$');
    await page.click('.currency-btn[data-currency="PLN"]');
    await page.waitForTimeout(200);
    expect(await page.locator('#total-price').innerText()).toContain('zł');

    // 16. Test Language Buttons
    for (const lang of ['en', 'pl', 'ua', 'ru']) {
      await page.click(`.lang-btn[data-lang="${lang}"]`);
      await page.waitForTimeout(200);
      expect(await page.getAttribute('html', 'lang')).toBe(lang);
    }

    expect(pageErrors.length).toBe(0);
  });

  test('hardware database is pristine: no custom variants, valid categories, valid specs', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const dbPath = path.resolve('data/hardware.json');
    const content = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(content);

    const requiredCategories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor'];
    for (const cat of requiredCategories) {
      expect(Array.isArray(db[cat])).toBe(true);
      expect(db[cat].length).toBeGreaterThan(10);

      for (const item of db[cat]) {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.price).toBeGreaterThan(0);
        expect(item.brand).toBeTruthy();
        // Crucial test: NO dummy or custom variant names!
        expect(item.name).not.toMatch(/custom\s+(cpu|gpu|motherboard|ram|ssd|psu|case|cooler|hdd|monitor)/i);
        expect(item.name).not.toMatch(/variant\s+\d+/i);
        expect(item.name).not.toMatch(/\(Legacy\s+[2-9]\)/i);
      }
    }
  });
});
