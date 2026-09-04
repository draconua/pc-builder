with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace("const games = estimateAllFPS(cpu.tier, gpu.tier);", "const games = estimateAllFPS(cpu, gpu);")
js = js.replace("const res = analyzeBottleneck(cpu.tier, gpu.tier, currentRes);", "const res = analyzeBottleneck(cpu, gpu);")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/app.js to pass full cpu and gpu objects to estimateAllFPS and analyzeBottleneck!")
