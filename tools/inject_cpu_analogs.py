with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

cpu_analogs_block = """  // 1.2 CPU Analogs / Alternatives
  const cpuAnalogsBox = document.getElementById('cpu-analogs-box');
  const cpuAnalogsList = document.getElementById('cpu-analogs-list');
  if (cpuAnalogsBox && cpuAnalogsList) {
    if (buildState.cpu) {
      const currentCpu = buildState.cpu;
      // Find up to 3 direct CPU alternatives: competitor brand if possible, or same tier +-1 and price +-35%
      const alternatives = PARTS_DATABASE.cpu.filter(c => {
        if (c.id === currentCpu.id) return false;
        const isOtherBrand = c.brand !== currentCpu.brand;
        const tierDiff = Math.abs((c.tier || 5) - (currentCpu.tier || 5));
        const priceRatio = c.price / currentCpu.price;
        return (isOtherBrand && tierDiff <= 1) || (tierDiff === 0 && priceRatio >= 0.70 && priceRatio <= 1.35);
      }).slice(0, 3);

      if (alternatives.length > 0) {
        cpuAnalogsList.innerHTML = alternatives.map(alt => {
          const shortName = alt.name.replace('AMD ', '').replace('Intel ', '');
          return `<button type="button" class="analog-chip-btn" data-id="${alt.id}">
            <span>${shortName}</span>
            <span class="analog-chip-price">${formatPrice(alt.price)}</span>
          </button>`;
        }).join('');

        cpuAnalogsList.querySelectorAll('.analog-chip-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const partId = btn.getAttribute('data-id');
            const newCpu = PARTS_DATABASE.cpu.find(p => p.id === partId);
            if (newCpu) {
              pushHistory();
              buildState.cpu = newCpu;
              if (buildState.motherboard && buildState.motherboard.socket !== newCpu.socket) {
                buildState.motherboard = null;
              }
              updateUI();
            }
          });
        });

        cpuAnalogsBox.classList.remove('hidden');
      } else {
        cpuAnalogsBox.classList.add('hidden');
      }
    } else {
      cpuAnalogsBox.classList.add('hidden');
    }
  }
"""

target = "  elements.totalPrice.textContent = formatPrice(totalPrice);"
js = js.replace(target, cpu_analogs_block + "\n" + target)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Injected CPU analogs block into updateUI in js/app.js!")
