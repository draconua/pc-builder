with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

old_func = """  function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {
    const ratePLN = EXCHANGE_RATES['PLN'] || 4.05;
    const budgetPLN = Math.round(budgetUSD * ratePLN);

    // Use our Curated Baseline Archetypes + Smart Step-Up Upgrade Engine
    const result = buildFromCurated(budgetPLN, PARTS_DATABASE, {
      cpuBrand,
      gpuBrand,
      targetRes
    });

    buildState = result.build;
    updateUI();

    // Show a sleek notification of the curated archetype applied
    const upgradesText = result.upgrades && result.upgrades.length > 0 
      ? `<br><span style="font-size: 0.75rem; color: #10b981;">Улучшения на остаток: ${result.upgrades.join('; ')}</span>`
      : '';

    showToast({
      title: `✨ База: ${result.tier.title}`,
      htmlMessage: `${escapeHtml(result.tier.description)}${upgradesText}`,
      type: 'success',
      duration: 6500
    });
}"""

new_func = """  async function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {
    const ratePLN = EXCHANGE_RATES['PLN'] || 4.05;
    const budgetPLN = Math.round(budgetUSD * ratePLN);

    // Show temporary thinking toast while AI reasons
    const thinkingToast = showToast({
      title: '✨ Gemini AI подбирает ПК...',
      message: 'Анализируем 200+ деталей и балансируем связку под ваш бюджет...',
      type: 'info',
      duration: 12000
    });

    try {
      // 1. Try Gemini AI Backend
      const response = await fetch('/api/ai-autobuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetPLN, targetRes, cpuBrand, gpuBrand })
      });

      const res = await response.json();

      if (res.ok && res.data && res.data.cpu) {
        // Hydrate parts from PARTS_DATABASE
        const aiParts = res.data;
        const findP = (cat, id) => (PARTS_DATABASE[cat] || []).find(p => p.id === id);

        const newBuild = {
          cpu: findP('cpu', aiParts.cpu),
          gpu: findP('gpu', aiParts.gpu),
          motherboard: findP('motherboard', aiParts.motherboard),
          ram: findP('ram', aiParts.ram),
          cooler: findP('cooler', aiParts.cooler),
          psu: findP('psu', aiParts.psu),
          case: findP('case', aiParts.case),
          ssd: findP('ssd', aiParts.ssd),
          hdd: null,
          monitor: null
        };

        // If AI picked valid core parts, apply it!
        if (newBuild.cpu && newBuild.gpu) {
          buildState = newBuild;
          updateUI();

          showToast({
            title: `🧠 Gemini AI: ${escapeHtml(aiParts.verdictTitle || 'Оптимальная связка')}`,
            htmlMessage: `<span style="color: #60a5fa; font-size: 0.8rem;">⚡ Собрано нейросетью под ${budgetPLN} zł:</span><br>${escapeHtml(aiParts.reasoning || '')}`,
            type: 'success',
            duration: 8000
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Gemini AI Auto-Build failed, switching to Curated Fallback:', e);
    }

    // 2. Fallback to Curated Baseline Archetypes
    const result = buildFromCurated(budgetPLN, PARTS_DATABASE, {
      cpuBrand,
      gpuBrand,
      targetRes
    });

    buildState = result.build;
    updateUI();

    const upgradesText = result.upgrades && result.upgrades.length > 0 
      ? `<br><span style="font-size: 0.75rem; color: #10b981;">Улучшения на остаток: ${result.upgrades.join('; ')}</span>`
      : '';

    showToast({
      title: `✨ База: ${result.tier.title}`,
      htmlMessage: `${escapeHtml(result.tier.description)}${upgradesText}`,
      type: 'success',
      duration: 6500
    });
}"""

if old_func in js:
    js = js.replace(old_func, new_func, 1)
    print("Updated generateAutoBuild with Gemini AI integration.")
else:
    print("Warning: old_func not found.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
