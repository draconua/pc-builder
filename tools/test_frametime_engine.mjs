const BENCHMARK_SPECS = [
  {
    game: 'Cyberpunk 2077 (Ray Tracing)',
    genre: 'Сюжетная / RT',
    gpuMs: { '1080p': 6.9, '1440p': 9.5, '4k': 17.2 },
    cpuMsBase: 5.5
  },
  {
    game: 'Black Myth: Wukong',
    genre: 'Unreal Engine 5',
    gpuMs: { '1080p': 6.6, '1440p': 9.1, '4k': 16.1 },
    cpuMsBase: 5.2
  },
  {
    game: 'Counter-Strike 2',
    genre: 'Киберспорт (CPU-bound)',
    gpuMs: { '1080p': 2.1, '1440p': 2.8, '4k': 4.3 },
    cpuMsBase: 1.8
  },
  {
    game: 'Baldur\'s Gate 3 (Act 3 City)',
    genre: 'RPG (Высокая нагрузка на CPU)',
    gpuMs: { '1080p': 5.7, '1440p': 7.1, '4k': 10.5 },
    cpuMsBase: 5.4
  },
  {
    game: 'Alan Wake 2',
    genre: 'Тяжелая графика / RT',
    gpuMs: { '1080p': 8.7, '1440p': 12.2, '4k': 20.8 },
    cpuMsBase: 6.8
  },
  {
    game: 'Red Dead Redemption 2',
    genre: 'Открытый мир (Ultra)',
    gpuMs: { '1080p': 5.4, '1440p': 7.0, '4k': 11.4 },
    cpuMsBase: 4.8
  },
  {
    game: 'Fortnite (UE5 Lumen Epic)',
    genre: 'Королевская битва',
    gpuMs: { '1080p': 4.0, '1440p': 5.7, '4k': 10.5 },
    cpuMsBase: 3.5
  }
];

function calcFrameTimeFPS(cpuScore, gpuScore, vram = 8) {
  return BENCHMARK_SPECS.map(spec => {
    const cpuMs = spec.cpuMsBase * (100 / cpuScore);

    const calcRes = (res) => {
      let gpuMs = spec.gpuMs[res] * (100 / gpuScore);
      // VRAM penalties at higher resolutions
      if (res === '4k' && vram < 12) gpuMs *= (vram <= 8 ? 1.25 : 1.10);
      if (res === '1440p' && vram < 8) gpuMs *= 1.15;

      const frameTime = Math.max(gpuMs, cpuMs * 0.90) + (Math.min(gpuMs, cpuMs) * 0.10);
      return Math.max(15, Math.round(1000 / frameTime));
    };

    return {
      game: spec.game,
      '1080p': calcRes('1080p'),
      '1440p': calcRes('1440p'),
      '4k': calcRes('4k')
    };
  });
}

console.log('=== 1. i3-12100F (cpuScore: 68) + RX 6600 (gpuScore: 26, 8GB) ===');
console.table(calcFrameTimeFPS(68, 26, 8));

console.log('=== 2. Ryzen 5 5600 (cpuScore: 71) + RTX 4060 (gpuScore: 34, 8GB) ===');
console.table(calcFrameTimeFPS(71, 34, 8));

console.log('=== 3. Ryzen 5 7600 (cpuScore: 84) + RTX 4070 Super (gpuScore: 64, 12GB) ===');
console.table(calcFrameTimeFPS(84, 64, 12));

console.log('=== 4. Ryzen 7 7800X3D (cpuScore: 100) + RTX 4090 (gpuScore: 100, 24GB) ===');
console.table(calcFrameTimeFPS(100, 100, 24));

console.log('=== 5. Ryzen 7 9800X3D (cpuScore: 108) + RTX 5090 (gpuScore: 135, 32GB) ===');
console.table(calcFrameTimeFPS(108, 135, 32));
