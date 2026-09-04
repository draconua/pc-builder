with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Update updateBottleneckPanel in app.js
old_bottleneck_panel = """// Update Bottleneck analysis (Two-Sided)
function updateBottleneckPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  if (!cpu || !gpu) {
    elements.bottleneckPlaceholder.classList.remove('hidden');
    elements.bottleneckResult.classList.add('hidden');
    return;
  }

  elements.bottleneckPlaceholder.classList.add('hidden');
  elements.bottleneckResult.classList.remove('hidden');

  const res = analyzeBottleneck(cpu.tier, gpu.tier);
  const fill = elements.bottleneckBar;
  const text = elements.bottleneckText;
  const adviceEl = elements.bottleneckAdvice;

  if (res.type === 'balanced') {
    fill.style.left = '40%';
    fill.style.width = '20%';
    fill.style.backgroundColor = 'var(--success)';
    text.textContent = t('dash.bottleneck.balanced');
  } else if (res.type === 'cpu') {
    const w = Math.min(48, Math.max(10, res.percentage));
    fill.style.left = `${50 - w}%`;
    fill.style.width = `${w}%`;
    fill.style.backgroundColor = res.severity === 'high' ? 'var(--error)' : 'var(--warning)';
    text.textContent = `${t('dash.bottleneck.cpu')} (${res.percentage}%)`;
  } else {
    const w = Math.min(48, Math.max(10, res.percentage));
    fill.style.left = '50%';
    fill.style.width = `${w}%`;
    fill.style.backgroundColor = res.severity === 'high' ? 'var(--error)' : 'var(--warning)';
    text.textContent = `${t('dash.bottleneck.gpu')} (${res.percentage}%)`;
  }

  if (adviceEl) {
    adviceEl.textContent = res.advice || '';
  }
}"""

new_bottleneck_panel = """// Update Bottleneck & Synergy Analysis (Positive 0-100% Index)
function updateBottleneckPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  if (!cpu || !gpu) {
    elements.bottleneckPlaceholder.classList.remove('hidden');
    elements.bottleneckResult.classList.add('hidden');
    return;
  }

  elements.bottleneckPlaceholder.classList.add('hidden');
  elements.bottleneckResult.classList.remove('hidden');

  const currentRes = elements.fpsResolution ? elements.fpsResolution.value : '1440p';
  const res = analyzeBottleneck(cpu.tier, gpu.tier, currentRes);
  if (!res) return;

  const fill = elements.bottleneckBar;
  const text = elements.bottleneckText;
  const adviceEl = elements.bottleneckAdvice;
  const scoreBadge = document.getElementById('bottleneck-score-badge');

  if (scoreBadge) {
    scoreBadge.textContent = `${res.score}%`;
    scoreBadge.className = `bottleneck-score-badge ${res.type}`;
  }

  fill.style.left = '0';
  fill.style.width = `${res.score}%`;
  
  if (res.score >= 88) {
    fill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
  } else if (res.score >= 70) {
    fill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
  } else {
    fill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
  }

  text.textContent = res.label;
  if (adviceEl) {
    adviceEl.textContent = res.advice || '';
  }
}"""

import re
pattern_b = r'// Update Bottleneck analysis.*?if \(adviceEl\) \{\s*adviceEl\.textContent = res\.advice \|\| \'\';\s*\}\s*\}'
js = re.sub(pattern_b, new_bottleneck_panel, js, flags=re.DOTALL)

# 2. Update generateAutoBuild to support targetRes
pattern_ab = r'function generateAutoBuild\(budgetUSD\)\s*\{'
replacement_ab = "function generateAutoBuild(budgetUSD, targetRes = '1440p') {"
js = re.sub(pattern_ab, replacement_ab, js)

# Target-specific shares
old_shares = """    let gpu = sortedGpus.find(g => g.price <= maxBudget * 0.44) || sortedGpus[sortedGpus.length - 1];
    let cpu = sortedCpus.find(c => c.price <= maxBudget * 0.23) || sortedCpus[sortedCpus.length - 1];"""

new_shares = """    // Dynamically adjust CPU vs GPU budget split according to target resolution:
    // 1080p: CPU heavy (36% GPU / 26% CPU)
    // 1440p: Balanced (43% GPU / 22% CPU)
    // 4k: GPU heavy (50% GPU / 18% CPU)
    const gpuShare = targetRes === '4k' ? 0.50 : targetRes === '1080p' ? 0.36 : 0.43;
    const cpuShare = targetRes === '4k' ? 0.18 : targetRes === '1080p' ? 0.26 : 0.22;

    let gpu = sortedGpus.find(g => g.price <= maxBudget * gpuShare) || sortedGpus[sortedGpus.length - 1];
    let cpu = sortedCpus.find(c => c.price <= maxBudget * cpuShare) || sortedCpus[sortedCpus.length - 1];"""

js = js.replace(old_shares, new_shares)

# 3. Hook up resChips properly in setupEventListeners
res_chips_hook = """    // Resolution chips switching
    let selectedTargetRes = '1440p';
    resChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        resChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedTargetRes = chip.getAttribute('data-res');
      });
    });

    // Generate action
    if (autoBuildConfirmBtn) {
      autoBuildConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawBudget = budgetRange ? parseInt(budgetRange.value, 10) : (currentCurrency === 'PLN' ? 5000 : 1200);
        // Convert to USD for internal calculation
        const rate = currentCurrency === 'PLN' ? (EXCHANGE_RATES.PLN || 4.05) : 1;
        const budgetUSD = Math.round(rawBudget / rate);
        
        pushHistory();
        generateAutoBuild(budgetUSD, selectedTargetRes);
        if (elements.fpsResolution) {
          elements.fpsResolution.value = selectedTargetRes;
          updateFpsPanel();
        }
        autobuildPopover.classList.add('hidden');
      });
    }"""

old_res_hook = """    // Generate action
    if (autoBuildConfirmBtn) {
      autoBuildConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawBudget = budgetRange ? parseInt(budgetRange.value, 10) : (currentCurrency === 'PLN' ? 5000 : 1200);
        // Convert to USD for internal calculation
        const rate = currentCurrency === 'PLN' ? (EXCHANGE_RATES.PLN || 4.05) : 1;
        const budgetUSD = Math.round(rawBudget / rate);
        
        pushHistory();
        generateAutoBuild(budgetUSD);
        autobuildPopover.classList.add('hidden');
      });
    }"""

if old_res_hook in js:
    js = js.replace(old_res_hook, res_chips_hook)
    print("Replaced auto-build confirm hook and wired up resChips successfully!")
else:
    print("Old res hook not found verbatim, checking regex...")
    pattern_rh = r'// Generate action\s*if \(autoBuildConfirmBtn\)\s*\{.*?autobuildPopover\.classList\.add\(\'hidden\'\);\s*\}\);\s*\}'
    js = re.sub(pattern_rh, res_chips_hook, js, flags=re.DOTALL)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/app.js with Synergy Index & Res-Chip listeners!")
