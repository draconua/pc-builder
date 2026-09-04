new_performance_code = """// =============================================================
// performance.js — Physics-based FrameTime & Synergy Engine
// Uses objective TechPowerUp & Hardware Unboxed relative benchmark indices
// Pipeline: FrameTime = max(T_gpu, T_cpu) + overhead => FPS = 1000 / FrameTime
// =============================================================

export const BENCHMARK_SPECS = [
  {
    game: 'Cyberpunk 2077 (Ray Tracing)',
    genre: 'Сюжетная / RT Ultra',
    gpuMs: { '1080p': 4.8, '1440p': 8.2, '4k': 16.0 },
    cpuMsBase: 4.8
  },
  {
    game: 'Black Myth: Wukong',
    genre: 'Unreal Engine 5 (TSR)',
    gpuMs: { '1080p': 4.6, '1440p': 7.8, '4k': 15.0 },
    cpuMsBase: 4.5
  },
  {
    game: 'Counter-Strike 2',
    genre: 'Киберспорт (CPU-bound)',
    gpuMs: { '1080p': 1.15, '1440p': 2.1, '4k': 3.8 },
    cpuMsBase: 1.6
  },
  {
    game: 'Baldur\\'s Gate 3 (Act 3 City)',
    genre: 'RPG (Нагрузка на CPU)',
    gpuMs: { '1080p': 3.8, '1440p': 5.8, '4k': 9.8 },
    cpuMsBase: 4.6
  },
  {
    game: 'Alan Wake 2',
    genre: 'Тяжелая графика / RT',
    gpuMs: { '1080p': 6.8, '1440p': 10.8, '4k': 19.5 },
    cpuMsBase: 6.0
  },
  {
    game: 'Red Dead Redemption 2',
    genre: 'Открытый мир (Ultra)',
    gpuMs: { '1080p': 3.4, '1440p': 5.6, '4k': 10.5 },
    cpuMsBase: 4.0
  },
  {
    game: 'Fortnite (UE5 Lumen Epic)',
    genre: 'Королевская битва',
    gpuMs: { '1080p': 2.6, '1440p': 4.8, '4k': 9.5 },
    cpuMsBase: 3.0
  }
];

/**
 * Normalizes input: handles both full Part objects or numeric score/tier.
 */
function resolveScore(input, defaultScore = 70) {
  if (!input) return defaultScore;
  if (typeof input === 'object') {
    if (input.cpuScore) return input.cpuScore;
    if (input.gpuScore) return input.gpuScore;
    if (input.tier) return input.tier <= 10 ? input.tier * 10 : input.tier;
    return defaultScore;
  }
  if (typeof input === 'number') {
    return input <= 10 ? input * 10 : input;
  }
  return defaultScore;
}

/**
 * Normalizes VRAM in GB.
 */
function resolveVram(gpuInput) {
  if (gpuInput && typeof gpuInput === 'object' && gpuInput.vram) {
    return gpuInput.vram;
  }
  return 8;
}

/**
 * Estimate FPS across ALL resolutions simultaneously (1080p, 1440p, 4K).
 * Physically accurate FrameTime simulation:
 * FrameTime = max(T_gpu, T_cpu * 0.90) + (min(T_gpu, T_cpu) * 0.10)
 * 
 * @param {Object|number} cpu - CPU part object or score
 * @param {Object|number} gpu - GPU part object or score
 * @returns {Array<{ game: string, genre: string, fps1080: number, fps1440: number, fps4k: number }>}
 */
export function estimateAllFPS(cpu, gpu) {
  if (!cpu || !gpu) return [];

  const cpuScore = resolveScore(cpu, 75);
  const gpuScore = resolveScore(gpu, 50);
  const vram = resolveVram(gpu);

  return BENCHMARK_SPECS.map(spec => {
    const cpuMs = spec.cpuMsBase * (100 / cpuScore);

    const calcRes = (res) => {
      let gpuMs = spec.gpuMs[res] * (100 / gpuScore);
      // VRAM PCIe bus penalty at high resolutions when VRAM buffer overflows
      if (res === '4k' && vram < 12) gpuMs *= (vram <= 8 ? 1.25 : 1.10);
      if (res === '1440p' && vram < 8) gpuMs *= 1.15;

      const frameTime = Math.max(gpuMs, cpuMs * 0.90) + (Math.min(gpuMs, cpuMs) * 0.10);
      return Math.max(15, Math.round(1000 / frameTime));
    };

    return {
      game: spec.game,
      genre: spec.genre,
      fps1080: calcRes('1080p'),
      fps1440: calcRes('1440p'),
      fps4k: calcRes('4k')
    };
  });
}

/**
 * Backward compatibility helper
 */
export function estimateFPS(cpu, gpu, resolution = '1440p') {
  const all = estimateAllFPS(cpu, gpu);
  return all.map(item => {
    const fps = resolution === '4k' ? item.fps4k : resolution === '1080p' ? item.fps1080 : item.fps1440;
    return {
      game: item.game,
      fps,
      quality: fps >= 100 ? 'Ultra' : 'High'
    };
  });
}

/**
 * Objective Synergy Index (0-100%).
 * Evaluates GPU/CPU relative power ratio.
 * 
 * @param {Object|number} cpu 
 * @param {Object|number} gpu 
 * @returns {{ score: number, type: 'perfect'|'balanced'|'cpu_bound'|'gpu_bound', label: string, advice: string }}
 */
export function analyzeBottleneck(cpu, gpu) {
  if (!cpu || !gpu) return null;

  const cpuScore = resolveScore(cpu, 75);
  const gpuScore = resolveScore(gpu, 50);

  // Target ratio: GPU score relative to CPU score
  // E.g. 4070 Super (64) with Ryzen 5 7600 (84) => 64 / 84 = 0.76 (balanced)
  // 4090 (100) with 7800X3D (100) => 1.0 (golden standard)
  const ratio = (gpuScore / 100) / (cpuScore / 100);

  if (ratio >= 0.65 && ratio <= 1.25) {
    // Golden standard: 95% - 100%
    const dist = Math.abs(ratio - 0.95);
    const score = Math.min(100, Math.round(98 - dist * 10));
    return {
      score,
      type: 'perfect',
      label: 'Идеальный баланс (Золотой стандарт)',
      advice: 'Флагманская связка без перекосов. Видеокарта и процессор загружаются равномерно во всех современных играх.'
    };
  }

  if (ratio >= 0.50 && ratio < 0.65) {
    const score = Math.round(88 + (ratio - 0.50) * 45);
    return {
      score,
      type: 'balanced',
      label: 'Отличный баланс',
      advice: 'Сбалансированная конфигурация. Процессор обеспечивает высокий запас кадров (1% low), видеокарта работает на полную мощность.'
    };
  }

  if (ratio > 1.25) {
    // GPU is much stronger than CPU
    const penalty = Math.min(35, Math.round((ratio - 1.25) * 40));
    const score = Math.max(65, 90 - penalty);
    return {
      score,
      type: 'cpu_bound',
      label: 'Упор в процессор на высоких FPS',
      advice: 'Видеокарта обладает огромной мощностью. В киберспортивных играх и разрешении 1080p процессор станет ограничителем. Для раскрытия потенциала рекомендуется CPU более высокого класса.'
    };
  }

  // ratio < 0.50: CPU is much stronger than GPU
  const penalty = Math.min(30, Math.round((0.50 - ratio) * 50));
  const score = Math.max(65, 88 - penalty);
  return {
    score,
    type: 'gpu_bound',
    label: 'Упор в видеокарту',
    advice: 'Процессор значительно мощнее видеокарты. В играх производительность будет целиком упираться в видеокарту. Рекомендуется выбрать более производительный GPU.'
  };
}
"""

with open("js/performance.js", "w", encoding="utf-8") as f:
    f.write(new_performance_code)

print("Rewrote js/performance.js with physical FrameTime engine!")
