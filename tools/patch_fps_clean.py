with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

start = js.find("function updateFpsPanel()")
end = js.find("// =============================================================\n// MONITOR RECOMMENDATION", start)

new_fps = """function updateFpsPanel() {
  const cpu = buildState.cpu;
  const gpu = buildState.gpu;

  const placeholder = document.getElementById('fps-placeholder');
  const tableContainer = document.getElementById('fps-table-container');
  const tbody = document.getElementById('fps-matrix-tbody');

  if (!cpu || !gpu) {
    if (placeholder) placeholder.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
    if (tbody) tbody.innerHTML = '';
    return;
  }

  if (placeholder) placeholder.classList.add('hidden');
  if (tableContainer) tableContainer.classList.remove('hidden');
  if (!tbody) return;

  const results = estimateAllFPS(cpu, gpu);
  
  tbody.innerHTML = results.map(r => `
    <tr>
      <td>
        <div class="game-cell">
          <span class="game-icon">${getGameIcon(r.game)}</span>
          <div class="game-info">
            <span class="game-name">${r.game}</span>
            <span class="game-genre">${r.genre}</span>
          </div>
        </div>
      </td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps1080)}">${r.fps1080} FPS</span></td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps1440)}">${r.fps1440} FPS</span></td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps4k)}">${r.fps4k} FPS</span></td>
    </tr>
  `).join('');
}

"""

if start != -1 and end != -1:
    js = js[:start] + new_fps + js[end:]
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Cleanly replaced updateFpsPanel.")
else:
    print("Could not find start or end positions:", start, end)
