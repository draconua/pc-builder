with open("js/performance.js", "r", encoding="utf-8") as f:
    perf = f.read()

new_synergy_logic = """/**
 * Analyze CPU / GPU balance with a positive, realistic Synergy Score (0-100%).
 * Evaluates real-world gaming synergy depending on relative tiers.
 * 
 * @param {number} cpuTier 1-10
 * @param {number} gpuTier 1-10
 * @param {string} resolution '1080p' | '1440p' | '4k'
 * @returns {{ score: number, type: 'perfect'|'balanced'|'cpu_bound'|'gpu_bound', label: string, advice: string }}
 */
export function analyzeBottleneck(cpuTier, gpuTier, resolution = '1440p') {
  if (!cpuTier || !gpuTier) return null;

  const diff = cpuTier - gpuTier;
  let score = 100;
  let type = 'perfect';
  let label = 'Идеальная синергия';
  let advice = 'Процессор и видеокарта раскрывают потенциал друг друга на 100%. Полный баланс системы.';

  // Resolution context:
  // At 4K, GPU tier matters far more, so lower CPU is less penalized.
  // At 1080p, CPU tier is critical for high FPS esports.
  const resWeight = resolution === '4k' ? 0.7 : resolution === '1080p' ? 1.3 : 1.0;

  if (diff === 0 || Math.abs(diff) <= 1) {
    score = 98 - Math.abs(diff) * 3;
    type = 'perfect';
    label = 'Идеальный баланс (Золотой стандарт)';
    advice = 'Флагманская связка без перекосов. Видеокарта и процессор загружаются равномерно во всех играх.';
  } else if (diff === -2) {
    // e.g. Tier 6 CPU + Tier 8 GPU
    score = Math.round(92 - 4 * resWeight);
    type = 'balanced';
    label = 'Отличный баланс для 1440p / 4K';
    advice = 'Небольшой перевес в сторону видеокарты — оптимально для современных тяжелых сюжетных игр.';
  } else if (diff <= -3) {
    // CPU significantly below GPU (e.g. i3 + 4070)
    const penalty = Math.min(38, Math.round(Math.abs(diff) * 9 * resWeight));
    score = Math.max(50, 95 - penalty);
    type = 'cpu_bound';
    label = `Упор в процессор (${Math.round(penalty)}%)`;
    advice = 'В динамичных сценах и онлайн-играх видеокарта может быть недогружена. Рекомендуется процессор классом выше.';
  } else if (diff === 2) {
    // CPU slightly above GPU
    score = 90;
    type = 'balanced';
    label = 'Сбалансировано с запасом по CPU';
    advice = 'Процессор имеет хороший задел на будущее. Идеально для стриминга и мультитаскинга.';
  } else if (diff >= 3) {
    // CPU far above GPU (e.g. i9 + 4060)
    const penalty = Math.min(35, Math.round(diff * 8));
    score = Math.max(55, 95 - penalty);
    type = 'gpu_bound';
    label = `Упор в графику (${Math.round(penalty)}%)`;
    advice = 'Процессор имеет избыточную мощность для этой видеокарты. Можно смело ставить более мощную GPU.';
  }

  return { score, type, label, advice };
}"""

import re
pattern = r'/\*\*.*?\*/\s*export function analyzeBottleneck\(cpuTier, gpuTier\)\s*\{.*?return\s*\{.*?\};\s*\}'
perf = re.sub(pattern, new_synergy_logic, perf, flags=re.DOTALL)

with open("js/performance.js", "w", encoding="utf-8") as f:
    f.write(perf)

print("Updated js/performance.js with realistic Synergy Index!")
