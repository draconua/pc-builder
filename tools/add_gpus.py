with open("js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

new_gpus = """
    // RX 9000 (RDNA 4)
    { id: 'gpu-rx9070', name: 'AMD Radeon RX 9070', brand: 'AMD', price: 549, tdp: 250, vram: 16, tier: 8, gpuScore: 73, length: 280, specs: '16GB GDDR6, 1440p High-End / 4K Entry', buyLinks: createBuyLinks('AMD Radeon RX 9070') },
    { id: 'gpu-rx9070xt', name: 'AMD Radeon RX 9070 XT', brand: 'AMD', price: 649, tdp: 275, vram: 16, tier: 9, gpuScore: 82, length: 300, specs: '16GB GDDR6, 4K High / Ray Tracing', buyLinks: createBuyLinks('AMD Radeon RX 9070 XT') },
"""

content = content.replace("gpu: [", "gpu: [" + new_gpus)

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Added RX 9070 and RX 9070 XT")
