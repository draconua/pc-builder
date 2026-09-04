import re
with open("js/performance.js", "r", encoding="utf-8") as f:
    perf = f.read()

new_func = """export function analyzeBottleneck(cpu, gpu, resolution = '1440p') {
  if (!cpu || !gpu) return null;

  // Use the simulation engine directly to compute FPS limits
  const actualFPS = estimateFPS(cpu, gpu, resolution);
  const noCpuBottleneckFPS = estimateFPS({ cpuScore: 250 }, gpu, resolution);
  const noGpuBottleneckFPS = estimateFPS(cpu, { gpuScore: 250, vram: 24 }, resolution);

  let totalLossDueToCpu = 0;
  let totalLossDueToGpu = 0;
  let gamesCount = actualFPS.length;

  for (let i = 0; i < gamesCount; i++) {
     const actual = actualFPS[i].fps;
     const maxIfCpuInfinite = noCpuBottleneckFPS[i].fps;
     const maxIfGpuInfinite = noGpuBottleneckFPS[i].fps;

     totalLossDueToCpu += Math.max(0, (maxIfCpuInfinite - actual) / maxIfCpuInfinite);
     totalLossDueToGpu += Math.max(0, (maxIfGpuInfinite - actual) / maxIfGpuInfinite);
  }

  const avgCpuLoss = totalLossDueToCpu / gamesCount;
  const avgGpuLoss = totalLossDueToGpu / gamesCount;

  // Thresholds: if a component causes more than 8% frame loss compared to an infinite counterpart
  const isCpuBound = avgCpuLoss > 0.08 && avgCpuLoss > avgGpuLoss;
  const isGpuBound = avgGpuLoss > 0.08 && avgGpuLoss > avgCpuLoss;

  const maxLoss = Math.max(avgCpuLoss, avgGpuLoss);
  
  // Calculate synergy score. Perfect synergy means loss is minimal for BOTH.
  // If one component is dragging the other down by 20%, score drops.
  let score = Math.max(40, 100 - Math.round(maxLoss * 150));
  if (score > 100) score = 100;

  let text = '';
  let advice = '';
  
  if (isCpuBound) {
    const lossPct = Math.round(avgCpuLoss * 100);
    text = `Узкое место: Процессор (Потеря ~${lossPct}%)`;
    advice = `На ${resolution} процессор не успевает за видеокартой. Вы теряете около ${lossPct}% потенциального FPS.`;
  } else if (isGpuBound) {
    const lossPct = Math.round(avgGpuLoss * 100);
    // Being GPU bound in gaming is NORMAL, unless the CPU is massively overkill
    if (lossPct > 15) {
      text = `Узкое место: Видеокарта (Потеря ~${lossPct}%)`;
      advice = `На ${resolution} упор идёт в видеокарту. Процессор способен на большее, можно взять GPU мощнее.`;
    } else {
      text = "Отличный баланс (Упор в GPU)";
      advice = `Оптимальная связка для ${resolution}. Система работает сбалансированно.`;
      score = Math.max(90, score + 10); // Boost score for normal GPU bottleneck
    }
  } else {
    text = "Идеальный баланс (Золотой стандарт)";
    advice = `Отличная синергия на ${resolution}. Процессор и видеокарта раскрывают друг друга.`;
    score = 100;
  }

  // Calculate legacy ratio for fallback
  const cpuScoreVal = cpu.cpuScore || 50;
  const gpuScoreVal = gpu.gpuScore || 50;
  let ratio = (gpuScoreVal / 100) / (cpuScoreVal / 100);
  if (resolution === '4k' || resolution === '4K') ratio *= 0.75;
  else if (resolution === '1080p') ratio *= 1.25;

  return { text, advice, score, isGpuBound, isCpuBound, ratio };
}"""

old_func = re.search(r'export function analyzeBottleneck\(cpu, gpu[\s\S]*?\}\n?', perf)
if old_func:
    perf = perf.replace(old_func.group(0), new_func + "\n")
    with open("js/performance.js", "w", encoding="utf-8") as f:
        f.write(perf)
    print("Rewrote analyzeBottleneck to use true FPS simulation.")
else:
    print("Could not find analyzeBottleneck")
