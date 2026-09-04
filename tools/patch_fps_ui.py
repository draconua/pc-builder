import re
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

new_logic = """
function getFpsColorClass(fps) {
  if (fps >= 144) return 'fps-tag-ultra'; // Green
  if (fps >= 60) return 'fps-tag-high'; // Blue
  if (fps >= 30) return 'fps-tag-medium'; // Yellow
  return 'fps-tag-low'; // Red
}

function getGameIcon(gameName) {
  const map = {
    'Cyberpunk 2077': '🏙️',
    'Black Myth: Wukong': '🐒',
    'Counter-Strike 2': '🎯',
    'Baldur\\'s Gate 3': '🎲',
    'Alan Wake 2': '🔦',
    'Red Dead Redemption 2': '🐎',
    'Fortnite': '🪂'
  };
  for (const [key, icon] of Object.entries(map)) {
    if (gameName.includes(key)) return icon;
  }
  return '🎮';
}

function updateFpsPanel() {
  const tbody = document.getElementById('fps-table-body');
  if (!tbody) return;

  if (!buildState.cpu || !buildState.gpu) {
    tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted" style="padding: 2rem;">Выберите CPU и GPU для симуляции FPS</td></tr>`;
    return;
  }

  const results = estimateAllFPS(buildState.cpu, buildState.gpu);
  
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
      <td><span class="fps-tag ${getFpsColorClass(r.fps1080)}">${r.fps1080}</span></td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps1440)}">${r.fps1440}</span></td>
      <td><span class="fps-tag ${getFpsColorClass(r.fps4k)}">${r.fps4k}</span></td>
    </tr>
  `).join('');
}
"""

js = re.sub(r'function updateFpsPanel\(\) \{[\s\S]*?(?=\nfunction )', new_logic, js)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

css = """
.game-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.game-icon {
  font-size: 1.2rem;
  background: var(--bg-subtle);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border);
}
"""

with open("css/style.css", "a", encoding="utf-8") as f:
    f.write("\n" + css)
print("Patched FPS Matrix UI.")
