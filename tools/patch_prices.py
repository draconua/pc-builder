import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Price drops for last gen
js = js.replace("price: 1999", "price: 2199") # RTX 5090 is expensive
js = js.replace("price: 1599, tdp: 450, vram: 24, tier: 10, length: 340, specs: '24GB GDDR6X", "price: 1499, tdp: 450, vram: 24, tier: 10, length: 340, specs: '24GB GDDR6X") # RTX 4090 drop
js = js.replace("name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', price: 999", "name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', price: 899")
js = js.replace("name: 'NVIDIA GeForce RTX 4070 Super', brand: 'NVIDIA', price: 599", "name: 'NVIDIA GeForce RTX 4070 Super', brand: 'NVIDIA', price: 549")
js = js.replace("name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', price: 999", "name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', price: 849")
js = js.replace("name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', price: 399", "name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', price: 349")
js = js.replace("name: 'AMD Ryzen 5 7600', brand: 'AMD', price: 229", "name: 'AMD Ryzen 5 7600', brand: 'AMD', price: 189")

# Add RTX 5070 and Ryzen 9800X3D if missing
if 'gpu-rtx5070' not in js:
    rtx5070 = "    { id: 'gpu-rtx5070', name: 'NVIDIA GeForce RTX 5070', brand: 'NVIDIA', price: 649, tdp: 250, vram: 12, tier: 8, length: 280, specs: '12GB GDDR7, Next Gen 1440p', buyLinks: createBuyLinks('NVIDIA GeForce RTX 5070') },\n"
    js = js.replace("  gpu: [\n", "  gpu: [\n" + rtx5070)

if 'cpu-r7-9800x3d' not in js:
    r9800x3d = "    { id: 'cpu-r7-9800x3d', name: 'AMD Ryzen 7 9800X3D', brand: 'AMD', price: 449, socket: 'AM5', tdp: 120, maxTdp: 162, ramType: 'DDR5', cores: 8, freq: '4.7 GHz', tier: 10, specs: '8 Cores / 16 Threads, 4.7 GHz, 3D V-Cache, Zen 5, 120W, AM5', buyLinks: createBuyLinks('AMD Ryzen 7 9800X3D') },\n"
    js = js.replace("  cpu: [\n", "  cpu: [\n" + r9800x3d)

if 'mb-x870e-hero' not in js:
    mbx870e = "    { id: 'mb-x870e-hero', name: 'ASUS ROG Crosshair X870E Hero', brand: 'ASUS', price: 699, socket: 'AM5', ramType: 'DDR5', formFactor: 'ATX', specs: 'Flagship X870E, WiFi 7, 18+2+2 Power Stages', buyLinks: createBuyLinks('ASUS ROG Crosshair X870E Hero') },\n"
    js = js.replace("  motherboard: [\n", "  motherboard: [\n" + mbx870e)

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Prices and new parts updated")
