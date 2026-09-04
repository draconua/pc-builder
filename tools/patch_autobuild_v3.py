import re
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# We need to replace the loop inside generateAutoBuild
new_loop = """
    // Ensure performance.js functions are accessible if needed.
    // estimateAllFPS is imported, we can just use it to find the average FPS at targetRes.
    
    // Brute-force all valid CPU/GPU combos (takes <5ms in JS)
    for (const c of validCpus) {
      for (const g of validGpus) {
        const { buildObj, total } = assemble(c, g);
        
        if (total <= maxBudget) {
          const bottleneck = analyzeBottleneck(c, g, targetRes);
          
          // Reject combinations that are severely CPU-bound for gaming unless very low budget
          if (bottleneck && bottleneck.isCpuBound && budgetUSD > 600) {
            continue; 
          }
          
          // Calculate true gaming score using FPS engine
          const fpsMatrix = estimateAllFPS(c, g);
          const targetResKey = targetRes === '4k' ? 'fps4k' : targetRes === '1080p' ? 'fps1080' : 'fps1440';
          
          // Average FPS across all benchmarked games for the target resolution
          const avgFPS = fpsMatrix.reduce((sum, item) => sum + item[targetResKey], 0) / fpsMatrix.length;
          
          // Synergy penalty/bonus based on bottleneck engine (0.4 to 1.0)
          const synergyBonus = bottleneck ? (bottleneck.score / 100) : 1;
          
          // Final score is the true FPS normalized by how well they work together
          const finalScore = avgFPS * synergyBonus;

          if (finalScore > bestScore) {
            bestScore = finalScore;
            bestBuild = buildObj;
          }
        }
      }
    }
"""

# Try to find the old brute force loop
old_loop_match = re.search(r'// Brute-force all valid CPU/GPU combos[\s\S]*?if \(!bestBuild\)', js)
if old_loop_match:
    js = js.replace(old_loop_match.group(0), new_loop + "\n    if (!bestBuild)")
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Patched autobuild loop to use avgFPS * synergyBonus.")
else:
    print("Could not find the old loop.")
