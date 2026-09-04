with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace updateBottleneckUI to connect with AI Synergy Engine
old_code = """  // selectedTargetRes is global from UI
  const resVal = (typeof selectedTargetRes !== 'undefined') ? selectedTargetRes : '1440p';
  const bottleneck = analyzeBottleneck(buildState.cpu, buildState.gpu, resVal);
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
  }"""

new_code = """  const resVal = (typeof selectedTargetRes !== 'undefined') ? selectedTargetRes : '1440p';
  const scoreBadge = document.getElementById('bottleneck-score-badge');
  const textEl = document.getElementById('bottleneck-text');
  const adviceEl = document.getElementById('bottleneck-advice');
  const cpuBar = document.getElementById('bottleneck-bar-cpu');
  const gpuBar = document.getElementById('bottleneck-bar-gpu');

  // 1. Instant Formula Preview (0ms latency so UI feels ultra-responsive)
  const instantBottleneck = analyzeBottleneck(buildState.cpu, buildState.gpu, resVal);
  if (instantBottleneck) {
    scoreBadge.textContent = instantBottleneck.score + '%';
    textEl.textContent = instantBottleneck.text;
    adviceEl.textContent = instantBottleneck.advice;
    applyBottleneckStyles(instantBottleneck.score, instantBottleneck.isCpuBound);
  }

  function applyBottleneckStyles(score, isCpuBound) {
    if (score >= 90) {
      cpuBar.style.width = '50%';
      gpuBar.style.width = '50%';
      scoreBadge.style.color = '#10b981';
      scoreBadge.style.background = 'rgba(16, 185, 129, 0.15)';
    } else if (isCpuBound) {
      const gpuUsage = Math.max(10, (score / 100) * 50);
      cpuBar.style.width = '50%';
      gpuBar.style.width = gpuUsage + '%';
      scoreBadge.style.color = '#f43f5e';
      scoreBadge.style.background = 'rgba(244, 63, 94, 0.15)';
    } else {
      const cpuUsage = Math.max(10, (score / 100) * 50);
      cpuBar.style.width = cpuUsage + '%';
      gpuBar.style.width = '50%';
      scoreBadge.style.color = '#f59e0b';
      scoreBadge.style.background = 'rgba(245, 158, 11, 0.15)';
    }
  }

  // 2. Fetch Deep AI Hardware Synergy in background
  const currentReqKey = `${buildState.cpu.id}_${buildState.gpu.id}_${resVal}`;
  window._lastSynergyKey = currentReqKey;

  fetch('/api/ai-synergy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cpu: buildState.cpu,
      gpu: buildState.gpu,
      motherboard: buildState.motherboard,
      ram: buildState.ram,
      resolution: resVal
    })
  })
  .then(res => res.json())
  .then(data => {
    // Ensure this response is still for the current build
    if (window._lastSynergyKey !== currentReqKey || !data.ok || !data.data) return;
    const ai = data.data;

    scoreBadge.textContent = ai.score + '%';
    textEl.innerHTML = `<span style="color: #60a5fa; font-weight: 600;">✨ Gemini AI:</span> ${escapeHtml(ai.status)}`;
    adviceEl.innerHTML = `<strong>${escapeHtml(ai.fpsPotential || '')}</strong> — ${escapeHtml(ai.commentary || '')}`;
    applyBottleneckStyles(ai.score, ai.bottleneckType === 'cpu');
  })
  .catch(() => {});"""

if old_code in js:
    js = js.replace(old_code, new_code, 1)
    print("Updated updateBottleneckUI with AI Synergy Engine.")
else:
    print("Warning: old_code not found.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
