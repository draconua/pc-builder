with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Helper function to get suggested fixes for any issue
compat_helper = """
// Calculate 1-Click Interactive Fixes for Compatibility Issues
function getSuggestedFixesForIssue(issueMsg, build) {
  const fixes = [];

  // 1. Power Supply / Wattage Issue
  if (issueMsg.toLowerCase().includes('power supply') || issueMsg.toLowerCase().includes('wattage') || issueMsg.toLowerCase().includes('overload')) {
    let estTdp = 100;
    if (build.cpu) estTdp += (build.cpu.maxTdp || build.cpu.tdp || 65);
    if (build.gpu) estTdp += (build.gpu.tdp || 150);
    const targetWattage = Math.max(750, Math.ceil((estTdp * 1.3) / 50) * 50);

    const candidates = PARTS_DATABASE.psu
      .filter(p => p.wattage >= targetWattage)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (candidates.length > 0) {
      fixes.push({
        title: `⚡ Заменить на БП достаточной мощности (${targetWattage}W+):`,
        category: 'psu',
        parts: candidates
      });
    }
  }

  // 2. CPU / Motherboard Socket Mismatch
  if (issueMsg.includes('Socket Mismatch') && build.cpu && build.motherboard) {
    const mbOptions = PARTS_DATABASE.motherboard
      .filter(m => m.socket === build.cpu.socket)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (mbOptions.length > 0) {
      fixes.push({
        title: `⚡ Совместимые материнские платы под ${build.cpu.name} (${build.cpu.socket}):`,
        category: 'motherboard',
        parts: mbOptions
      });
    }

    const cpuOptions = PARTS_DATABASE.cpu
      .filter(c => c.socket === build.motherboard.socket)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (cpuOptions.length > 0) {
      fixes.push({
        title: `⚡ Либо процессоры под сокет ${build.motherboard.socket}:`,
        category: 'cpu',
        parts: cpuOptions
      });
    }
  }

  // 3. Memory Standard Mismatch (DDR4 vs DDR5)
  if (issueMsg.includes('Memory Standard Mismatch') && build.motherboard) {
    const ramOptions = PARTS_DATABASE.ram
      .filter(r => r.type === build.motherboard.ramType)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (ramOptions.length > 0) {
      fixes.push({
        title: `⚡ Подходящая оперативная память (${build.motherboard.ramType}):`,
        category: 'ram',
        parts: ramOptions
      });
    }
  }

  // 4. GPU Clearance / Case Size
  if (issueMsg.includes('GPU Clearance') && build.gpu) {
    const caseOptions = PARTS_DATABASE.case
      .filter(c => !c.maxGpuLength || c.maxGpuLength >= build.gpu.length)
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (caseOptions.length > 0) {
      fixes.push({
        title: `⚡ Просторные корпуса под видеокарту (${build.gpu.length}мм):`,
        category: 'case',
        parts: caseOptions
      });
    }
  }

  // 5. Cooler Socket / TDP Issue
  if (issueMsg.includes('Cooler') && build.cpu) {
    const coolerOptions = PARTS_DATABASE.cooler
      .filter(k => (k.maxTdp || 150) >= (build.cpu.maxTdp || build.cpu.tdp || 65))
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);

    if (coolerOptions.length > 0) {
      fixes.push({
        title: `⚡ Эффективное охлаждение под ${build.cpu.name}:`,
        category: 'cooler',
        parts: coolerOptions
      });
    }
  }

  return fixes;
}
"""

# Insert compat_helper right before updateUI
ui_idx = js.find("function updateUI()")
if ui_idx != -1:
    js = js[:ui_idx] + compat_helper + "\n" + js[ui_idx:]

# Replace compatibility rendering block in updateUI
old_compat_render = """    if (errors.length === 0 && warnings.length === 0) {
      elements.compatibilityList.innerHTML = `
        <li class="compat-item compat-success">
          <span>✓</span>
          <span>${t('dash.compat.ok')}</span>
        </li>
      `;
    } else {
      const actionableIssues = [...errors, ...warnings];
      actionableIssues.forEach(s => {
        const li = document.createElement('li');
        const icon = s.type === 'error' ? '❌' : '⚠';
        li.className = s.type === 'error' ? 'compat-item compat-error' : 'compat-item compat-warning';
        li.innerHTML = `<span>${icon}</span><span>${s.message}</span>`;
        elements.compatibilityList.appendChild(li);
      });
    }"""

new_compat_render = """    if (errors.length === 0 && warnings.length === 0) {
      elements.compatibilityList.innerHTML = `
        <li class="compat-item compat-success">
          <span>✓</span>
          <span>${t('dash.compat.ok')}</span>
        </li>
      `;
    } else {
      const actionableIssues = [...errors, ...warnings];
      actionableIssues.forEach(s => {
        const li = document.createElement('li');
        const icon = s.type === 'error' ? '❌' : '⚠';
        li.className = s.type === 'error' ? 'compat-item compat-error' : 'compat-item compat-warning';
        
        // Calculate 1-click suggested fixes
        const fixes = getSuggestedFixesForIssue(s.message, buildState);
        let solutionsHtml = '';

        if (fixes.length > 0) {
          solutionsHtml = `
            <div class="compat-solutions-wrapper">
              ${fixes.map(f => `
                <div class="compat-fix-group">
                  <span class="compat-fix-title">${f.title}</span>
                  <div class="compat-fix-chips">
                    ${f.parts.map(p => `
                      <button type="button" class="compat-fix-btn" data-category="${f.category}" data-part-id="${p.id}" title="${p.specs}">
                        <span class="compat-fix-name">${p.name}</span>
                        <span class="compat-fix-price">${formatPrice(p.price)}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        }

        li.innerHTML = `
          <div class="compat-msg-row">
            <span class="compat-icon">${icon}</span>
            <span class="compat-text">${s.message}</span>
          </div>
          ${solutionsHtml}
        `;
        elements.compatibilityList.appendChild(li);
      });

      // Bind 1-click swap buttons inside compatibility panel
      elements.compatibilityList.querySelectorAll('.compat-fix-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const cat = btn.getAttribute('data-category');
          const partId = btn.getAttribute('data-part-id');
          const newPart = PARTS_DATABASE[cat]?.find(x => x.id === partId);
          if (newPart) {
            pushHistory();
            buildState[cat] = newPart;
            // Clean incompatible paired components if needed
            if (cat === 'cpu' && buildState.motherboard && buildState.motherboard.socket !== newPart.socket) {
              buildState.motherboard = null;
            }
            if (cat === 'motherboard' && buildState.ram && buildState.ram.type !== newPart.ramType) {
              buildState.ram = null;
            }
            updateUI();
          }
        });
      });
    }"""

import re
pattern_cr = r'    if \(errors\.length === 0 && warnings\.length === 0\)\s*\{.*?elements\.compatibilityList\.appendChild\(li\);\s*\}\s*\}'
js = re.sub(pattern_cr, new_compat_render, js, flags=re.DOTALL)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Injected 1-Click Interactive Compatibility Resolver into js/app.js!")
