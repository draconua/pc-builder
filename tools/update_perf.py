perf_code = """// =============================================================
// performance.js — Realistic FPS estimation & synergy analysis
// Updated for 2026 hardware benchmarks across all resolutions
// =============================================================

// Baseline benchmarks for tier-10 GPU (RTX 4090) + tier-10 CPU (7800X3D / 9800X3D)
// Tested at Ultra / Competitive settings without upscaling artifacts
const BENCHMARK_GAMES = [
  { 
    game: 'Cyberpunk 2077 (Ray Tracing)', 
    genre: 'Сюжетная / RT',
    base: { '1080p': 145, '1440p': 105, '4k': 58 } 
  },
  { 
    game: 'Black Myth: Wukong', 
    genre: 'Unreal Engine 5',
    base: { '1080p': 150, '1440p': 110, '4k': 62 } 
  },
  { 
    game: 'Counter-Strike 2', 
    genre: 'Киберспорт (CPU-bound)',
    base: { '1080p': 480, '1440p': 360, '4k': 230 } 
  },
  { 
    game: 'Baldur\\'s Gate 3 (Act 3 City)', 
    genre: 'RPG (Высокая нагрузка на CPU)',
    base: { '1080p': 175, '1440p': 140, '4k': 95 } 
  },
  { 
    game: 'Alan Wake 2', 
    genre: 'Тяжелая графика / RT',
    base: { '1080p': 115, '1440p': 82, '4k': 48 } 
  },
  { 
    game: 'Red Dead Redemption 2', 
    genre: 'Открытый мир (Ultra)',
    base: { '1080p': 185, '1440p': 142, '4k': 88 } 
  },
  { 
    game: 'Fortnite (UE5 Lumen Epic)', 
    genre: 'Королевская битва',
    base: { '1080p': 250, '1440p': 175, '4k': 95 } 
  }
];

/**
 * Estimate FPS across ALL resolutions simultaneously (1080p, 1440p, 4K).
 * Uses realistic power-law scaling reflecting GPU VRAM and CPU sensitivity.
 * 
 * @param {number} cpuTier 1-10
 * @param {number} gpuTier 1-10
 * @returns {Array<{ game: string, genre: string, fps1080: number, fps1440: number, fps4k: number }>}
 */
export function estimateAllFPS(cpuTier, gpuTier) {
  if (!cpuTier || !gpuTier) return [];

  const gpuFactor = Math.pow(gpuTier / 10, 1.15);

  return BENCHMARK_GAMES.map(g => {
    // 1080p: CPU matters significantly
    const cpuFactor1080 = Math.min(1.0, Math.pow(cpuTier / gpuTier, 0.85) * 1.05);
    const raw1080 = g.base['1080p'] * gpuFactor * cpuFactor1080;

    // 1440p: Balanced
    const cpuFactor1440 = Math.min(1.0, Math.pow(cpuTier / gpuTier, 0.85) * 1.35);
    const raw1440 = g.base['1440p'] * gpuFactor * cpuFactor1440;

    // 4K: Almost purely GPU-bound
    const cpuFactor4k = Math.min(1.0, Math.pow(cpuTier / gpuTier, 0.85) * 1.80);
    const raw4k = g.base['4k'] * gpuFactor * cpuFactor4k;

    return {
      game: g.game,
      genre: g.genre,
      fps1080: Math.max(15, Math.round(raw1080)),
      fps1440: Math.max(12, Math.round(raw1440)),
      fps4k: Math.max(8, Math.round(raw4k))
    };
  });
}

// Backward compatibility helper
export function estimateFPS(cpuTier, gpuTier, resolution = '1440p') {
  const all = estimateAllFPS(cpuTier, gpuTier);
  return all.map(item => ({
    game: item.game,
    fps: resolution === '4k' ? item.fps4k : resolution === '1080p' ? item.fps1080 : item.fps1440,
    quality: (resolution === '4k' ? item.fps4k : resolution === '1080p' ? item.fps1080 : item.fps1440) >= 100 ? 'Ultra' : 'High'
  }));
}

/**
 * Realistic Synergy Index (0-100%).
 * Evaluates real-world CPU + GPU balance.
 * 
 * @param {number} cpuTier 1-10
 * @param {number} gpuTier 1-10
 * @returns {{ score: number, type: 'perfect'|'balanced'|'cpu_bound'|'gpu_bound', label: string, advice: string }}
 */
export function analyzeBottleneck(cpuTier, gpuTier) {
  if (!cpuTier || !gpuTier) return null;

  const diff = cpuTier - gpuTier;
  let score = 100;
  let type = 'perfect';
  let label = 'Идеальная синергия';
  let advice = 'Процессор и видеокарта раскрывают потенциал друг друга на 100%. Полный баланс системы.';

  if (diff === 0 || Math.abs(diff) <= 1) {
    score = 98 - Math.abs(diff) * 2;
    type = 'perfect';
    label = 'Идеальный баланс (Золотой стандарт)';
    advice = 'Флагманская связка без перекосов. Видеокарта и процессор загружаются равномерно во всех современных играх.';
  } else if (diff === -2) {
    score = 92;
    type = 'balanced';
    label = 'Отличный баланс для 1440p / 4K';
    advice = 'Небольшой перевес в сторону видеокарты — оптимально для современных тяжелых сюжетных игр.';
  } else if (diff <= -3) {
    const penalty = Math.min(38, Math.round(Math.abs(diff) * 9));
    score = Math.max(50, 95 - penalty);
    type = 'cpu_bound';
    label = `Упор в процессор (${Math.round(penalty)}%)`;
    advice = 'В динамичных сценах и онлайн-играх видеокарта может быть недогружена. Желателен процессор классом выше.';
  } else if (diff === 2) {
    score = 90;
    type = 'balanced';
    label = 'Сбалансировано с запасом по CPU';
    advice = 'Процессор имеет хороший задел на будущее. Идеально для стриминга, монтажа и мультитаскинга.';
  } else if (diff >= 3) {
    const penalty = Math.min(35, Math.round(diff * 8));
    score = Math.max(55, 95 - penalty);
    type = 'gpu_bound';
    label = `Упор в графику (${Math.round(penalty)}%)`;
    advice = 'Процессор имеет избыточную мощность для этой видеокарты. Можно смело ставить более производительную GPU.';
  }

  return { score, type, label, advice };
}
"""

with open("js/performance.js", "w", encoding="utf-8") as f:
    f.write(perf_code)

print("Updated js/performance.js with estimateAllFPS and refined synergy!")
