const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[ERROR] ${err.message}`));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // 1. Capture initial view (empty state)
  await page.locator('.center-schematic').screenshot({ path: 'tools/diag_initial_center.png' });
  await page.screenshot({ path: 'tools/diag_initial_full.png' });

  // 1b. Test Ghost Slots in Empty State:
  console.log('Testing Ghost Slot Clicks in empty state...');
  for (const cat of ['gpu', 'cpu', 'motherboard']) {
    console.log(`Clicking #ghost-${cat} .ghost-label...`);
    await page.click(`#ghost-${cat} .ghost-label`);
    await page.waitForTimeout(300);
    const drawerOpen = await page.locator('#drawer').evaluate(el => el.classList.contains('active'));
    const drawerTitle = await page.locator('#drawer-title').textContent();
    console.log(`Ghost #${cat} click -> Drawer open: ${drawerOpen}, Title: "${drawerTitle}"`);
    if (drawerOpen) {
      await page.click('#drawer-close');
      await page.waitForTimeout(200);
    }
  }

  // 2. Inspect buttons in schematic toolbar
  const toolbarButtons = await page.$$eval('.btn-schematic-tool', buttons => {
    return buttons.map(b => {
      const rect = b.getBoundingClientRect();
      const style = window.getComputedStyle(b);
      return {
        id: b.id,
        text: b.innerText.trim(),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        display: style.display,
        visibility: style.visibility,
        pointerEvents: style.pointerEvents,
        cursor: style.cursor
      };
    });
  });
  console.log('Toolbar buttons:', JSON.stringify(toolbarButtons, null, 2));

  // 3. Test clicking each toolbar button
  for (const btn of ['tool-schematic-airflow', 'tool-schematic-xray', 'tool-schematic-rgb', 'tool-schematic-clearance', 'tool-schematic-scale']) {
    console.log(`Clicking #${btn}...`);
    await page.click(`#${btn}`);
    await page.waitForTimeout(300);
  }
  await page.locator('.center-schematic').screenshot({ path: 'tools/diag_all_tools_active.png' });

  // Turn off tools
  for (const btn of ['tool-schematic-airflow', 'tool-schematic-xray', 'tool-schematic-rgb', 'tool-schematic-clearance', 'tool-schematic-scale']) {
    await page.click(`#${btn}`);
    await page.waitForTimeout(100);
  }

  // 4. Load Balanced preset
  console.log('Loading balanced preset...');
  await page.click('[data-preset="balanced"]');
  await page.waitForTimeout(800);

  await page.locator('.center-schematic').screenshot({ path: 'tools/diag_balanced_center.png' });
  await page.screenshot({ path: 'tools/diag_balanced_full.png' });

  // 5. Test Hover and Card Highlighting on Installed Components
  console.log('Testing hover on #vis-gpu...');
  await page.hover('#vis-gpu');
  await page.waitForTimeout(300);

  const cardHighlighted = await page.locator('.slot-card[data-category="gpu"]').evaluate(el => el.classList.contains('highlight-from-schematic'));
  const hudVisible = await page.locator('#schematic-hud').evaluate(el => el.classList.contains('visible'));
  const hudTitle = await page.locator('#hud-title').textContent();
  console.log('Hover result -> Card highlighted:', cardHighlighted, 'HUD visible:', hudVisible, 'HUD title:', hudTitle);

  // 6. Test clicking HUD Inspector
  console.log('Clicking HUD inspector...');
  await page.click('#schematic-hud');
  await page.waitForTimeout(400);
  let drawerOpen = await page.locator('#drawer').evaluate(el => el.classList.contains('active'));
  let drawerTitle = await page.locator('#drawer-title').textContent();
  console.log('HUD click result -> Drawer open:', drawerOpen, 'Title:', drawerTitle);
  if (drawerOpen) {
    await page.click('#drawer-close');
    await page.waitForTimeout(300);
  }

  // 7. Test clicking #vis-gpu directly
  console.log('Clicking #vis-gpu directly...');
  await page.click('#vis-gpu');
  await page.waitForTimeout(400);
  drawerOpen = await page.locator('#drawer').evaluate(el => el.classList.contains('active'));
  drawerTitle = await page.locator('#drawer-title').textContent();
  console.log('Drawer opened after clicking #vis-gpu directly:', drawerOpen, 'Title:', drawerTitle);
  if (drawerOpen) {
    await page.click('#drawer-close');
    await page.waitForTimeout(300);
  }

  // 8. Test clicking #vis-motherboard directly
  console.log('Clicking #vis-motherboard directly...');
  await page.click('#vis-motherboard .mb-brand-plate');
  await page.waitForTimeout(400);
  drawerOpen = await page.locator('#drawer').evaluate(el => el.classList.contains('active'));
  drawerTitle = await page.locator('#drawer-title').textContent();
  console.log('Drawer opened after clicking #vis-motherboard directly:', drawerOpen, 'Title:', drawerTitle);
  if (drawerOpen) {
    await page.click('#drawer-close');
    await page.waitForTimeout(300);
  }

  // 9. Check light vs dark theme
  await page.click('#theme-toggle');
  await page.waitForTimeout(400);
  await page.locator('.center-schematic').screenshot({ path: 'tools/diag_balanced_dark_toggle.png' });
  await page.screenshot({ path: 'tools/diag_balanced_dark_full.png' });

  // 10. Check toasts content
  const toasts = await page.$$eval('.toast-item', list => list.map(t => ({
    title: t.querySelector('.toast-title')?.innerText || '',
    message: t.querySelector('.toast-message')?.innerText || ''
  })));
  console.log('Active toasts sample:', toasts.slice(0, 3));

  console.log('Console logs:', consoleLogs);
  await browser.close();
})();
