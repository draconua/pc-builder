import { test, expect } from '@playwright/test';

test.describe('Localization Coverage Suite (RU / EN / PL / UA)', () => {

  test('should display accurate Polish (PL) translations across all key sections', async ({ page }) => {
    await page.goto('/');

    // Switch to Polish
    const plBtn = page.locator('.lang-btn[data-lang="pl"]');
    await plBtn.click();
    await expect(plBtn).toHaveClass(/active/);

    // 1. Preset buttons in Polish
    const budgetBtn = page.locator('.preset-btn[data-preset="budget"]');
    const balancedBtn = page.locator('.preset-btn[data-preset="balanced"]');
    const ultimateBtn = page.locator('.preset-btn[data-preset="ultimate"]');

    await expect(budgetBtn).toHaveText('Budżetowa');
    await expect(balancedBtn).toHaveText('Optymalna');
    await expect(ultimateBtn).toHaveText('Maksymalna');

    // 2. Click a preset to populate parts and calculate FPS & bottleneck
    await balancedBtn.click();
    await page.waitForTimeout(500);

    // 3. FPS Benchmark table genres in Polish
    const fpsRows = page.locator('#fps-matrix-tbody tr');
    await expect(fpsRows.first()).toBeVisible();
    
    // Check that game genres do NOT contain Russian 'сюжетная'
    const genreBadges = page.locator('.game-genre');
    const count = await genreBadges.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const genreText = await genreBadges.nth(i).textContent();
      expect(genreText.toLowerCase()).not.toContain('сюжетная');
      expect(genreText.toLowerCase()).not.toContain('киберспорт');
    }

    // Verify at least one Polish genre label exists
    const allGenresText = await genreBadges.allTextContents();
    const hasPolishGenre = allGenresText.some(t => 
      t.includes('Fabuła') || t.includes('Esport') || t.includes('świat') || t.includes('Battle') || t.includes('grafika')
    );
    expect(hasPolishGenre).toBe(true);

    // 4. Bottleneck panel verdict in Polish
    const bottleneckText = page.locator('#bottleneck-text');
    await expect(bottleneckText).toBeVisible();
    const btContent = await bottleneckText.textContent();
    expect(btContent.toLowerCase()).not.toContain('идеальный баланс');
    expect(btContent.toLowerCase()).not.toContain('золотой стандарт');
    expect(btContent).toMatch(/Wąskie gardło|Karta graficzna|procesor|balans|standard|Optymaln/i);

    // 5. Pro Chat Consultant in Polish
    const chatBtn = page.locator('#btn-pro-chat');
    await chatBtn.click();
    const chatDrawer = page.locator('#pro-chat-drawer');
    await expect(chatDrawer).toBeVisible();

    const welcomeTitle = page.locator('[data-i18n="ai.chat.welcome_title"]');
    await expect(welcomeTitle).toHaveText(/Cześć|Jestem Twoim/i);

    const firstChip = page.locator('.pro-prompt-chip').first();
    const chipText = await firstChip.textContent();
    expect(chipText).not.toContain('Оптимизировать');
    expect(chipText).toMatch(/Biały|cichy|Optymalizuj|balans|Sprawdź|PC/i);

    // Close chat
    await page.locator('#pro-chat-close').click();

    // 6. FAQ Section in Polish
    const firstFaqQ = page.locator('.faq-q-text').first();
    const faqText = await firstFaqQ.textContent();
    expect(faqText).not.toContain('Как проверяется');
    expect(faqText).toMatch(/kompatybilność|części|podzespoł/i);

    // 7. Legal Disclaimer Footer in Polish
    const legalTitle = page.locator('[data-i18n="footer.disclaimer.title"]');
    await expect(legalTitle).toHaveText(/Zastrzeżenie prawne|Informacja prawna/i);

    const legalDesc = page.locator('[data-i18n="footer.disclaimer.desc"]');
    const legalText = await legalDesc.textContent();
    expect(legalText).not.toContain('является независимым');
    expect(legalText).toContain('narzędzie');
  });

  test('should display accurate English (EN) translations', async ({ page }) => {
    await page.goto('/');

    // Switch to English
    const enBtn = page.locator('.lang-btn[data-lang="en"]');
    await enBtn.click();
    await expect(enBtn).toHaveClass(/active/);

    // Preset buttons in English
    await expect(page.locator('.preset-btn[data-preset="budget"]')).toHaveText('Budget');
    await expect(page.locator('.preset-btn[data-preset="balanced"]')).toHaveText('Optimal');
    await expect(page.locator('.preset-btn[data-preset="ultimate"]')).toHaveText('Ultimate');

    // Apply preset
    await page.locator('.preset-btn[data-preset="balanced"]').click();
    await page.waitForTimeout(500);

    // FPS Genres in English
    const genreBadges = page.locator('.game-genre');
    const allGenres = await genreBadges.allTextContents();
    const hasEnglishGenre = allGenres.some(t => 
      t.includes('Story') || t.includes('eSports') || t.includes('Open World') || t.includes('Battle') || t.includes('Graphics')
    );
    expect(hasEnglishGenre).toBe(true);

    // Bottleneck in English
    const bottleneckText = page.locator('#bottleneck-text');
    await expect(bottleneckText).toBeVisible();
    const btContent = await bottleneckText.textContent();
    expect(btContent).toMatch(/Bottleneck|balance|standard|GPU|CPU|Optimal/i);

    // FAQ in English
    const firstFaqQ = page.locator('.faq-q-text').first();
    await expect(firstFaqQ).toHaveText(/How (does the algorithm calculate|is compatibility verified)/i);

    // Legal Footer in English
    const legalTitle = page.locator('[data-i18n="footer.disclaimer.title"]');
    await expect(legalTitle).toHaveText(/Legal Disclaimer/i);
  });

  test('should display accurate Ukrainian (UA) translations', async ({ page }) => {
    await page.goto('/');

    // Switch to Ukrainian
    const uaBtn = page.locator('.lang-btn[data-lang="ua"]');
    await uaBtn.click();
    await expect(uaBtn).toHaveClass(/active/);

    // Preset buttons in Ukrainian
    await expect(page.locator('.preset-btn[data-preset="budget"]')).toHaveText('Бюджетна');
    await expect(page.locator('.preset-btn[data-preset="balanced"]')).toHaveText('Оптимальна');
    await expect(page.locator('.preset-btn[data-preset="ultimate"]')).toHaveText('Максимальна');

    // Apply preset
    await page.locator('.preset-btn[data-preset="balanced"]').click();
    await page.waitForTimeout(500);

    // FPS Genres in Ukrainian
    const genreBadges = page.locator('.game-genre');
    const allGenres = await genreBadges.allTextContents();
    const hasUaGenre = allGenres.some(t => 
      t.includes('Сюжетна') || t.includes('Кіберспорт') || t.includes('Відкритий') || t.includes('Королівська') || t.includes('Важка')
    );
    expect(hasUaGenre).toBe(true);

    // Bottleneck in Ukrainian
    const bottleneckText = page.locator('#bottleneck-text');
    await expect(bottleneckText).toBeVisible();
    const btContent = await bottleneckText.textContent();
    expect(btContent).toMatch(/Вузьке місце|Відеокарта|баланс|стандарт|GPU|процесор|Ідеальний/i);

    // Legal Footer in Ukrainian
    const legalTitle = page.locator('[data-i18n="footer.disclaimer.title"]');
    await expect(legalTitle).toHaveText(/Правове застереження|Правове повідомлення/i);
  });

  test('should display accurate Russian (RU) translations without regressions', async ({ page }) => {
    await page.goto('/');

    // Switch to Russian
    const ruBtn = page.locator('.lang-btn[data-lang="ru"]');
    await ruBtn.click();
    await expect(ruBtn).toHaveClass(/active/);

    // Preset buttons in Russian
    await expect(page.locator('.preset-btn[data-preset="budget"]')).toHaveText('Бюджетная');
    await expect(page.locator('.preset-btn[data-preset="balanced"]')).toHaveText('Оптимальная');
    await expect(page.locator('.preset-btn[data-preset="ultimate"]')).toHaveText('Максимальная');

    // Apply preset
    await page.locator('.preset-btn[data-preset="balanced"]').click();
    await page.waitForTimeout(500);

    // FPS Genres in Russian
    const genreBadges = page.locator('.game-genre');
    const allGenres = await genreBadges.allTextContents();
    const hasRuGenre = allGenres.some(t => 
      t.includes('Сюжетная') || t.includes('Киберспорт') || t.includes('Открытый') || t.includes('Королевская') || t.includes('Тяжелая')
    );
    expect(hasRuGenre).toBe(true);
  });
});
