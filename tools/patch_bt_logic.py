import re
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

new_logic = """
function updateBottleneckPanel() {
  const resultDiv = document.getElementById('bottleneck-result');
  const placeholder = document.getElementById('bottleneck-placeholder');
  
  if (!buildState.cpu || !buildState.gpu) {
    resultDiv.classList.add('hidden');
    placeholder.classList.remove('hidden');
    return;
  }
  
  placeholder.classList.add('hidden');
  resultDiv.classList.remove('hidden');
  
  // selectedTargetRes is global from UI
  const bottleneck = analyzeBottleneck(buildState.cpu, buildState.gpu, selectedTargetRes);
  if (!bottleneck) return;
  
  const scoreBadge = document.getElementById('bottleneck-score-badge');
  const textEl = document.getElementById('bottleneck-text');
  const adviceEl = document.getElementById('bottleneck-advice');
  const cpuBar = document.getElementById('bottleneck-bar-cpu');
  const gpuBar = document.getElementById('bottleneck-bar-gpu');
  
  scoreBadge.textContent = bottleneck.score + '%';
  textEl.textContent = bottleneck.text;
  adviceEl.textContent = bottleneck.advice;
  
  // Visual split update
  if (bottleneck.score >= 95) {
    // Perfect synergy
    cpuBar.style.width = '50%';
    gpuBar.style.width = '50%';
    scoreBadge.style.color = '#10b981'; // Green
    scoreBadge.style.background = 'rgba(16, 185, 129, 0.15)';
  } else if (bottleneck.isCpuBound) {
    // CPU is weak, GPU is underutilized
    // Example: score 60. CPU is maxed (50%), GPU is starving (30%)
    const gpuUsage = Math.max(10, (bottleneck.score / 100) * 50);
    cpuBar.style.width = '50%';
    gpuBar.style.width = gpuUsage + '%';
    scoreBadge.style.color = '#f43f5e'; // Red
    scoreBadge.style.background = 'rgba(244, 63, 94, 0.15)';
  } else {
    // GPU is weak, CPU is underutilized
    const cpuUsage = Math.max(10, (bottleneck.score / 100) * 50);
    cpuBar.style.width = cpuUsage + '%';
    gpuBar.style.width = '50%';
    // Normal for gaming to be GPU bound, so yellow/orange
    scoreBadge.style.color = '#f59e0b';
    scoreBadge.style.background = 'rgba(245, 158, 11, 0.15)';
  }
}
"""

js = re.sub(r'function updateBottleneckPanel\(\) \{[\s\S]*?\}\n', new_logic + "\n", js)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Patched updateBottleneckPanel in app.js")
