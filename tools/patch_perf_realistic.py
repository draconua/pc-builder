with open("js/performance.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace from BENCHMARK_GAMES to end of estimateAllFPS
target_start = code.find("const BENCHMARK_GAMES = [")
target_end = code.find("// Backward compatibility helper")

new_benchmark_block = """const BENCHMARK_GAMES = [
  { 
    game: 'Cyberpunk 2077 (Ray Tracing)', 
    genre: 'Сюжетная / RT',
    base: { '1080p': 145, '1440p': 105, '4k': 58 },
    cpuSens: 0.25
  },
  { 
    game: 'Black Myth: Wukong', 
    genre: 'Unreal Engine 5',
    base: { '1080p': 150, '1440p': 110, '4k': 62 },
    cpuSens: 0.20
  },
  { 
    game: 'Counter-Strike 2', 
    genre: 'Киберспорт (CPU-bound)',
    base: { '1080p': 480, '1440p': 360, '4k': 230 },
    cpuSens: 0.55
  },
  { 
    game: 'Baldur\\'s Gate 3 (Act 3 City)', 
    genre: 'RPG (Высокая нагрузка на CPU)',
    base: { '1080p': 175, '1440p': 140, '4k': 95 },
    cpuSens: 0.40
  },
  { 
    game: 'Alan Wake 2', 
    genre: 'Тяжелая графика / RT',
    base: { '1080p': 115, '1440p': 82, '4k': 48 },
    cpuSens: 0.15
  },
  { 
    game: 'Red Dead Redemption 2', 
    genre: 'Открытый мир (Ultra)',
    base: { '1080p': 185, '1440p': 142, '4k': 88 },
    cpuSens: 0.25
  },
  { 
    game: 'Fortnite (UE5 Lumen Epic)', 
    genre: 'Королевская битва',
    base: { '1080p': 250, '1440p': 175, '4k': 95 },
    cpuSens: 0.35
  }
];

const GPU_CURVE = {
  1: { '1080p': 0.24, '1440p': 0.14, '4k': 0.08 },
  2: { '1080p': 0.30, '1440p': 0.19, '4k': 0.11 },
  3: { '1080p': 0.40, '1440p': 0.27, '4k': 0.15 }, // RX 6600
  4: { '1080p': 0.48, '1440p': 0.35, '4k': 0.20 }, // RX 7600, RTX 4060
  5: { '1080p': 0.58, '1440p': 0.45, '4k': 0.28 }, // RTX 4060 Ti
  6: { '1080p': 0.68, '1440p': 0.56, '4k': 0.38 }, // RX 7700 XT
  7: { '1080p': 0.80, '1440p': 0.70, '4k': 0.52 }, // RTX 4070
  8: { '1080p': 0.89, '1440p': 0.82, '4k': 0.68 }, // RTX 4070 Super
  9: { '1080p': 0.95, '1440p': 0.92, '4k': 0.84 }, // RTX 4080 Super
  10: { '1080p': 1.00, '1440p': 1.00, '4k': 1.00 }, // RTX 4090
  11: { '1080p': 1.05, '1440p': 1.08, '4k': 1.15 }  // RTX 5090
};

const CPU_CURVE = {
  1: 0.55,
  2: 0.62,
  3: 0.70,
  4: 0.78, // i3-12100F
  5: 0.84, // i5-12400F, R5 5600
  6: 0.89, // i5-13400F, R5 7500F
  7: 0.93, // R5 7600, i5-13600K
  8: 0.96, // i7-14700K, R7 7700X
  9: 0.98,
  10: 1.00 // 7800X3D / 9800X3D
};

export function estimateAllFPS(cpuTier, gpuTier) {
  if (!cpuTier || !gpuTier) return [];

  const gScale = GPU_CURVE[gpuTier] || GPU_CURVE[5];
  const cScale = CPU_CURVE[cpuTier] || CPU_CURVE[5];

  return BENCHMARK_GAMES.map(g => {
    const cpuWeight1080 = g.cpuSens;
    const factor1080 = (gScale['1080p'] * (1 - cpuWeight1080)) + (cScale * gScale['1080p'] * cpuWeight1080 * 1.2);

    const cpuWeight1440 = g.cpuSens * 0.5;
    const factor1440 = (gScale['1440p'] * (1 - cpuWeight1440)) + (cScale * gScale['1440p'] * cpuWeight1440);

    const cpuWeight4k = g.cpuSens * 0.15;
    const factor4k = (gScale['4k'] * (1 - cpuWeight4k)) + (cScale * gScale['4k'] * cpuWeight4k);

    return {
      game: g.game,
      genre: g.genre,
      fps1080: Math.max(25, Math.round(g.base['1080p'] * factor1080)),
      fps1440: Math.max(18, Math.round(g.base['1440p'] * factor1440)),
      fps4k: Math.max(10, Math.round(g.base['4k'] * factor4k))
    };
  });
}

"""

code = code[:target_start] + new_benchmark_block + code[target_end:]

with open("js/performance.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated performance.js with realistic benchmark calibration!")
