// Let's model real relative scaling for GPU & CPU tiers
// Tier 1 to 10:
// GPU scaling:
// Tier 10 (RTX 4090): 1.00
// Tier 9 (RTX 4080S / 7900XTX): 0.80
// Tier 8 (4070 Ti S / 7900XT): 0.68
// Tier 7 (4070 Super / 7800XT): 0.58
// Tier 6 (4070 / 7700XT): 0.48
// Tier 5 (4060 Ti / 6750XT): 0.40
// Tier 4 (4060 / 6600XT / 7600): 0.33
// Tier 3 (RX 6600 / 3050): 0.28  -> at 1080p
// Tier 2 (Arc A580 / 1660S): 0.23
// Tier 1 (RX 6500 XT): 0.16

const GPU_TIER_SCALE = {
  1: 0.18,
  2: 0.24,
  3: 0.32,  // RX 6600
  4: 0.40,  // RX 6600 XT, RTX 4060
  5: 0.48,  // RTX 4060 Ti
  6: 0.58,  // RTX 4070
  7: 0.70,  // RTX 4070 Super
  8: 0.80,  // RTX 4070 Ti Super
  9: 0.90,  // RTX 4080 Super
  10: 1.00  // RTX 4090
};

// CPU scaling:
// Even an entry modern CPU (i3-12100F, Tier 3) can deliver 65-75% of max frames in esports!
const CPU_TIER_SCALE_1080P = {
  1: 0.45,
  2: 0.52,
  3: 0.65,  // i3-12100F
  4: 0.72,  // i5-12400F, R5 5600
  5: 0.78,  // i5-13400F
  6: 0.85,  // i5-13600K, R5 7600
  7: 0.90,  // R7 7700X
  8: 0.94,  // i7-14700K
  9: 0.97,  // 7800X3D
  10: 1.00  // 9800X3D
};

// CS2 Base for Tier 10: 480 FPS (1080p), 360 FPS (1440p), 230 FPS (4K)
// For i3-12100F (tier 3) + RX 6600 (tier 3):
// CS2 is esports, highly CPU bound at 1080p.
// Let's calculate:
const cs2_1080p = 480 * Math.min(GPU_TIER_SCALE[3] * 1.5, CPU_TIER_SCALE_1080P[3]);
console.log('CS2 1080p for i3-12100F + RX 6600:', Math.round(cs2_1080p), 'FPS');

// Cyberpunk 2077 (base 145 at 1080p):
const cp_1080p = 145 * (GPU_TIER_SCALE[3] * 1.1) * (0.6 + CPU_TIER_SCALE_1080P[3] * 0.4);
console.log('Cyberpunk 1080p for i3-12100F + RX 6600:', Math.round(cp_1080p), 'FPS');
