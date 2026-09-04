with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Add import for buildFromCurated
old_import = "import { estimateAllFPS, estimateFPS, analyzeBottleneck } from './performance.js?v=20260903_v6';"
new_import = "import { estimateAllFPS, estimateFPS, analyzeBottleneck } from './performance.js?v=20260903_v6';\nimport { buildFromCurated, CURATED_BASELINES } from './autobuild.js?v=20260903_v7';"

if old_import in js:
    js = js.replace(old_import, new_import, 1)
    print("Added autobuild.js import.")
else:
    print("WARNING: old_import not found!")

# 2. Replace generateAutoBuild implementation
old_func_start = "  function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {"
pos_start = js.find(old_func_start)
if pos_start != -1:
    pos_end = js.find("buildState = bestBuild;\n    updateUI();\n}", pos_start)
    if pos_end != -1:
        end_len = len("buildState = bestBuild;\n    updateUI();\n}")
        new_func = """  function generateAutoBuild(budgetUSD, targetRes = '1440p', cpuBrand = 'all', gpuBrand = 'all') {
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
      message: `${result.tier.description}${upgradesText}`,
      type: 'success',
      duration: 6000
    });
}"""
        js = js[:pos_start] + new_func + js[pos_end + end_len:]
        print("Replaced generateAutoBuild with Curated Baseline Engine.")
    else:
        print("WARNING: pos_end not found.")
else:
    print("WARNING: pos_start not found.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated js/app.js successfully.")
