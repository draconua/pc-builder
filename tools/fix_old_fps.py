with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

old_func = """// Update FPS Estimations
function updateFpsPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  if (!cpu || !gpu) {
    elements.fpsPlaceholder.classList.remove('hidden');
    elements.fpsGrid.classList.add('hidden');
    return;
  }

  elements.fpsPlaceholder.classList.add('hidden');
  elements.fpsGrid.classList.remove('hidden');
  elements.fpsGrid.innerHTML = '';

  const res = elements.fpsResolution.value;
  const list = estimateFPS(cpu.tier, gpu.tier, res);

  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'fps-item';
    const tierKey = item.quality.toLowerCase();
    const tierClass = `fps-tier-${tierKey}`;
    const tierLabel = t(`fps.tier.${tierKey}`);
    div.innerHTML = `
      <div class="fps-left">
        <span class="fps-game">${item.game}</span>
        <span class="fps-tier-badge ${tierClass}">${tierLabel}</span>
      </div>
      <span class="fps-val">${item.fps} FPS</span>
    `;
    elements.fpsGrid.appendChild(div);
  });
}"""

new_func = """// Update FPS Panel (All 3 Resolutions Simultaneously)
function updateFpsPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  const placeholder = document.getElementById('fps-placeholder');
  const tableContainer = document.getElementById('fps-table-container');
  const tbody = document.getElementById('fps-matrix-tbody');

  if (!cpu || !gpu) {
    if (placeholder) placeholder.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    return;
  }

  if (placeholder) placeholder.classList.add('hidden');
  if (tableContainer) tableContainer.classList.remove('hidden');
  if (!tbody) return;

  const games = estimateAllFPS(cpu.tier, gpu.tier);

  const getBadgeClass = (fps) => {
    if (fps >= 120) return 'fps-tag-ultra';
    if (fps >= 75) return 'fps-tag-high';
    if (fps >= 60) return 'fps-tag-medium';
    return 'fps-tag-low';
  };

  tbody.innerHTML = games.map(g => `
    <tr>
      <td class="col-game">
        <div class="game-meta">
          <strong class="game-name">${g.game}</strong>
          <span class="game-genre">${g.genre}</span>
        </div>
      </td>
      <td class="col-res">
        <span class="fps-badge ${getBadgeClass(g.fps1080)}">${g.fps1080} FPS</span>
      </td>
      <td class="col-res">
        <span class="fps-badge ${getBadgeClass(g.fps1440)}">${g.fps1440} FPS</span>
      </td>
      <td class="col-res">
        <span class="fps-badge ${getBadgeClass(g.fps4k)}">${g.fps4k} FPS</span>
      </td>
    </tr>
  `).join('');
}"""

js = js.replace(old_func, new_func)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Replaced old updateFpsPanel with multi-resolution matrix renderer!")
