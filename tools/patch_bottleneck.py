with open("js/performance.js", "r", encoding="utf-8") as f:
    perf = f.read()

import re

old_func = re.search(r'export function analyzeBottleneck\(cpu, gpu\) \{([\s\S]*?)\n\}', perf)

if old_func:
    new_func = """export function analyzeBottleneck(cpu, gpu, resolution = '1440p') {
  if (!cpu || !gpu) return null;

  const cpuScore = cpu.cpuScore || 50;
  const gpuScore = gpu.gpuScore || 50;

  // Base synergy ratio
  let ratio = (gpuScore / 100) / (cpuScore / 100);

  // Resolution scaling (Higher res = GPU is bottleneck, CPU matters less)
  if (resolution === '4K') {
    ratio = ratio * 0.75; // Reduces GPU score impact, making weaker CPUs seem fine
  } else if (resolution === '1080p') {
    ratio = ratio * 1.25; // Amplifies GPU score impact, requiring stronger CPUs
  }

  let text = '';
  let advice = '';
  let score = 0;
  let isGpuBound = false;
  let isCpuBound = false;

  if (ratio >= 0.65 && ratio <= 1.25) {
    text = "Идеальный баланс (Золотой стандарт)";
    advice = "Отличная связка. Процессор и видеокарта полностью раскрывают друг друга.";
    score = Math.floor(100 - Math.abs(1 - ratio) * 20); // 95-100%
  } else if (ratio > 1.25) {
    isCpuBound = true;
    text = "Узкое место: Процессор (Слишком слаб для этой видеокарты)";
    advice = "Процессор не будет успевать готовить кадры для видеокарты. Рекомендуется взять более мощный CPU.";
    score = Math.floor(Math.max(40, 100 - (ratio - 1) * 35));
  } else {
    isGpuBound = true;
    text = "Узкое место: Видеокарта (Процессор простаивает)";
    advice = "Процессор избыточен для этой видеокарты. Можно сэкономить на CPU или взять более мощную видеокарту.";
    score = Math.floor(Math.max(40, 100 - (1 - ratio) * 50));
  }

  return { text, advice, score, isGpuBound, isCpuBound, ratio };
}"""
    
    perf = perf.replace(old_func.group(0), new_func)
    
    with open("js/performance.js", "w", encoding="utf-8") as f:
        f.write(perf)
    print("Patched analyzeBottleneck to consider resolution.")
else:
    print("Failed to find analyzeBottleneck")
