with open("js/app.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Add cache buster to imports at the top
code = code.replace("from './data.js';", "from './data.js?v=20260903_2';")
code = code.replace("from './compatibility.js';", "from './compatibility.js?v=20260903_2';")
code = code.replace("from './i18n.js';", "from './i18n.js?v=20260903_2';")
code = code.replace("from './performance.js';", "from './performance.js?v=20260903_2';")
code = code.replace("from './storage.js';", "from './storage.js?v=20260903_2';")

# 2. Add GPU Analogs update logic inside updateUI()
gpu_analogs_snippet = """
  // 1.1 GPU Analogs / Alternatives
  const analogsBox = document.getElementById('gpu-analogs-box');
  const analogsList = document.getElementById('gpu-analogs-list');
  if (analogsBox && analogsList) {
    if (buildState.gpu) {
      const currentGpu = buildState.gpu;
      // Search for up to 3 direct alternatives with similar tier (+-1) and similar price
      const alternatives = PARTS_DATABASE.gpu.filter(g => 
        g.id !== currentGpu.id &&
        Math.abs(g.tier - currentGpu.tier) <= 1 &&
        g.price >= currentGpu.price * 0.70 &&
        g.price <= currentGpu.price * 1.35
      ).slice(0, 3);

      if (alternatives.length > 0) {
        analogsList.innerHTML = alternatives.map(alt => {
          const shortName = alt.name
            .replace('NVIDIA GeForce ', '')
            .replace('AMD Radeon ', '')
            .replace('Intel Arc ', '');
          return `<button type="button" class="analog-chip-btn" data-id="${alt.id}">
            <span>${shortName}</span>
            <span class="analog-chip-price">${formatPrice(alt.price)}</span>
          </button>`;
        }).join('');
        
        // Attach click handlers
        analogsList.querySelectorAll('.analog-chip-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const partId = btn.getAttribute('data-id');
            const newPart = PARTS_DATABASE.gpu.find(p => p.id === partId);
            if (newPart) {
              pushHistory();
              buildState.gpu = newPart;
              updateUI();
            }
          });
        });

        analogsBox.classList.remove('hidden');
      } else {
        analogsBox.classList.add('hidden');
      }
    } else {
      analogsBox.classList.add('hidden');
    }
  }
"""

target = "elements.totalPrice.textContent = formatPrice(totalPrice);"
if target in code:
    code = code.replace(target, gpu_analogs_snippet + "\n  " + target)
    print("Injected GPU analogs snippet into app.js")
else:
    print("Target not found in app.js")

# 3. Robust preset loading: Ensure it handles all categories with defensive lookup
load_preset_old = """  Object.keys(buildState).forEach(cat => {
    const partId = preset.parts[cat];
    if (partId) {
      buildState[cat] = PARTS_DATABASE[cat].find(p => p.id === partId) || null;
    } else {
      buildState[cat] = null;
    }
  });"""

load_preset_new = """  CATEGORIES.forEach(cat => {
    const partId = preset.parts ? preset.parts[cat] : null;
    if (partId && PARTS_DATABASE[cat]) {
      const found = PARTS_DATABASE[cat].find(p => p.id === partId);
      buildState[cat] = found || null;
      if (!found) {
        console.warn(`[Preset Warning] Part ID "${partId}" not found in database for category "${cat}".`);
      }
    } else {
      buildState[cat] = null;
    }
  });"""

if load_preset_old in code:
    code = code.replace(load_preset_old, load_preset_new)
    print("Replaced loadPreset with robust defensive logic")
else:
    # Try finding with regex if formatting differs
    import re
    code = re.sub(r'Object\.keys\(buildState\)\.forEach\(cat\s*=>\s*\{.*?buildState\[cat\]\s*=\s*null;\s*\}\s*\}\);', load_preset_new, code, flags=re.DOTALL)
    print("Replaced loadPreset with regex")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated app.js successfully!")
