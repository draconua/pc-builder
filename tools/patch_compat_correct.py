with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

target = """    } else {
      const actionableIssues = [...errors, ...warnings];
      actionableIssues.forEach(s => {
        const li = document.createElement('li');
        const icon = s.type === 'error' ? '❌' : '⚠';
        li.className = s.type === 'error' ? 'compat-item compat-error' : 'compat-item compat-warning';
        li.innerHTML = `<span>${icon}</span><span>${s.message}</span>`;
        elements.compatibilityList.appendChild(li);
      });
    }"""

replacement = """    } else {
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

if target in js:
    js = js.replace(target, replacement)
    print("Replaced compatibility rendering with interactive solutions!")
else:
    print("Target string not matched verbatim!")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/app.js successfully!")
