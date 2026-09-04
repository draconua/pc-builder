fps_code = """
/**
 * Estimate FPS for selected CPU + GPU tier at a given resolution.
 * Uses realistic power-law scaling to reflect diminishing returns at lower tiers.
 * 
 * @param {number} cpuTier  1-10
 * @param {number} gpuTier  1-10
 * @param {string} resolution  '1080p' | '1440p' | '4k'
 * @returns {{ game: string, fps: number, quality: 'Ultra'|'High'|'Medium'|'Playable' }[]}
 */
export function estimateFPS(cpuTier, gpuTier, resolution = '1080p') {
  if (!cpuTier || !gpuTier) return [];

  // Non-linear GPU scaling: lower tiers fall off steeper on demanding resolutions
  const gpuFactor = Math.pow(gpuTier / 10, 1.15);

  // CPU sensitivity: at 1080p CPU matters heavily, at 4K it is almost purely GPU-bound
  const sensitivity = resolution === '4k' ? 1.8 : resolution === '1440p' ? 1.35 : 1.05;
  const cpuFactor = Math.min(1.0, Math.pow(cpuTier / gpuTier, 0.85) * sensitivity);

  return GAMES.map(g => {
    const raw = g.base[resolution] * gpuFactor * cpuFactor;
    // Elden Ring has a hardcoded engine cap of 60 FPS
    const cap = g.game === 'Elden Ring' ? 60 : 999;
    const finalFps = Math.max(15, Math.min(Math.round(raw), cap));

    let quality = 'Playable';
    if (finalFps >= 120) quality = 'Ultra';
    else if (finalFps >= 75) quality = 'High';
    else if (finalFps >= 45) quality = 'Medium';

    return {
      game: g.game,
      fps: finalFps,
      quality
    };
  });
}
"""

with open("js/performance.js", "r", encoding="utf-8") as f:
    code = f.read()

target = "export function analyzeBottleneck"
code = code.replace(target, fps_code + "\n" + target)

with open("js/performance.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Restored export function estimateFPS in js/performance.js!")
