// =============================================================
// performance.js — Physics-based FrameTime & Synergy Engine
// Uses objective TechPowerUp & Hardware Unboxed relative benchmark indices
// Pipeline: FrameTime = max(T_gpu, T_cpu) + overhead => FPS = 1000 / FrameTime
// =============================================================

import { t } from './i18n.js';

export const BENCHMARK_SPECS = [
  {
    game: 'Cyberpunk 2077 (Ray Tracing)',
    genre: 'Сюжетная / RT Ultra',
    genreKey: 'game.genre.story',
    gpuMs: { '1080p': 4.8, '1440p': 8.2, '4k': 16.0 },
    cpuMsBase: 4.8
  },
  {
    game: 'Black Myth: Wukong',
    genre: 'Unreal Engine 5 (TSR)',
    genreKey: 'Unreal Engine 5 (TSR)',
    gpuMs: { '1080p': 4.6, '1440p': 7.8, '4k': 15.0 },
    cpuMsBase: 4.5
  },
  {
    game: 'Counter-Strike 2',
    genre: 'Киберспорт (CPU-bound)',
    genreKey: 'game.genre.esports',
    gpuMs: { '1080p': 1.15, '1440p': 2.1, '4k': 3.8 },
    cpuMsBase: 1.6
  },
  {
    game: 'Baldur\'s Gate 3 (Act 3 City)',
    genre: 'RPG (Нагрузка на CPU)',
    genreKey: 'game.genre.rpg',
    gpuMs: { '1080p': 3.8, '1440p': 5.8, '4k': 9.8 },
    cpuMsBase: 4.6
  },
  {
    game: 'Alan Wake 2',
    genre: 'Тяжелая графика / RT',
    genreKey: 'game.genre.heavy_rt',
    gpuMs: { '1080p': 6.8, '1440p': 10.8, '4k': 19.5 },
    cpuMsBase: 6.0
  },
  {
    game: 'Red Dead Redemption 2',
    genre: 'Открытый мир (Ultra)',
    genreKey: 'game.genre.open_world',
    gpuMs: { '1080p': 3.4, '1440p': 5.6, '4k': 10.5 },
    cpuMsBase: 4.0
  },
  {
    game: 'Fortnite (UE5 Lumen Epic)',
    genre: 'Королевская битва',
    genreKey: 'game.genre.battle_royale',
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

    const genreResolved = (spec.genreKey && t(spec.genreKey) !== spec.genreKey) ? t(spec.genreKey) : spec.genre;
    return {
      game: spec.game,
      genre: genreResolved,
      genreKey: spec.genreKey,
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
export function analyzeBottleneck(cpu, gpu, resolution = '1440p') {
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
    text = t('bottleneck.cpu_bottleneck', { lossPct });
    advice = t('bottleneck.cpu_advice', { resolution, lossPct });
  } else if (isGpuBound) {
    const lossPct = Math.round(avgGpuLoss * 100);
    // Being GPU bound in gaming is NORMAL, unless the CPU is massively overkill
    if (lossPct > 15) {
      text = t('bottleneck.gpu_bottleneck', { lossPct });
      advice = t('bottleneck.gpu_advice', { resolution, lossPct });
    } else {
      text = t('bottleneck.balanced_gpu');
      advice = t('bottleneck.balanced_gpu_advice', { resolution });
      score = Math.max(90, score + 10); // Boost score for normal GPU bottleneck
    }
  } else {
    text = t('bottleneck.balanced_gold');
    advice = t('bottleneck.balanced_gold_advice', { resolution });
    score = 100;
  }

  // Calculate legacy ratio for fallback
  const cpuScoreVal = cpu.cpuScore || 50;
  const gpuScoreVal = gpu.gpuScore || 50;
  let ratio = (gpuScoreVal / 100) / (cpuScoreVal / 100);
  if (resolution === '4k' || resolution === '4K') ratio *= 0.75;
  else if (resolution === '1080p') ratio *= 1.25;

  return { text, advice, score, isGpuBound, isCpuBound, ratio };
}
