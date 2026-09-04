with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

target = "  // Update store hub button texts\n  document.querySelectorAll('.store-hub-text').forEach(el => {\n    el.textContent = t('slot.comparePrices') || 'Цены в магазинах';\n  });"

replacement = """  // Update store hub button texts
  document.querySelectorAll('.store-hub-text').forEach(el => {
    el.textContent = t('slot.comparePrices') || 'Цены в магазинах';
  });

  // Explicitly update schematic title
  const schTitle = document.querySelector('.schematic-title');
  if (schTitle) schTitle.textContent = t('dash.visualizer.title');

  // Explicitly update CPU & GPU analogs titles
  const cpuAnTitle = document.querySelector('#cpu-analogs-box .analogs-title');
  if (cpuAnTitle) cpuAnTitle.textContent = t('slot.cpu.analogs');

  const gpuAnTitle = document.querySelector('#gpu-analogs-box .analogs-title');
  if (gpuAnTitle) gpuAnTitle.textContent = t('slot.gpu.analogs');"""

js = js.replace(target, replacement)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated app.js with explicit translation hooks for schematic and analogs titles!")
