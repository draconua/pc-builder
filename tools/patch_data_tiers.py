with open("js/data.js", "r", encoding="utf-8") as f:
    js = f.read()

# Update budget CPU tiers
js = js.replace("name: 'Intel Core i3-12100F', brand: 'Intel', price: 85, socket: 'LGA1700', tdp: 58, maxTdp: 89, ramType: 'DDR4', cores: 4, freq: '3.3 GHz', tier: 1", "name: 'Intel Core i3-12100F', brand: 'Intel', price: 85, socket: 'LGA1700', tdp: 58, maxTdp: 89, ramType: 'DDR4', cores: 4, freq: '3.3 GHz', tier: 4")
js = js.replace("name: 'Intel Core i3-13100F', brand: 'Intel', price: 109, socket: 'LGA1700', tdp: 58, maxTdp: 89, ramType: 'DDR4', cores: 4, freq: '3.4 GHz', tier: 2", "name: 'Intel Core i3-13100F', brand: 'Intel', price: 109, socket: 'LGA1700', tdp: 58, maxTdp: 89, ramType: 'DDR4', cores: 4, freq: '3.4 GHz', tier: 4")
js = js.replace("name: 'Intel Core i5-12400F', brand: 'Intel', price: 129, socket: 'LGA1700', tdp: 65, maxTdp: 117, ramType: 'DDR4', cores: 6, freq: '2.5 GHz', tier: 3", "name: 'Intel Core i5-12400F', brand: 'Intel', price: 129, socket: 'LGA1700', tdp: 65, maxTdp: 117, ramType: 'DDR4', cores: 6, freq: '2.5 GHz', tier: 5")
js = js.replace("name: 'AMD Ryzen 5 5600', brand: 'AMD', price: 119, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.5 GHz', tier: 3", "name: 'AMD Ryzen 5 5600', brand: 'AMD', price: 119, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.5 GHz', tier: 5")
js = js.replace("name: 'AMD Ryzen 5 5600X', brand: 'AMD', price: 129, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.7 GHz', tier: 3", "name: 'AMD Ryzen 5 5600X', brand: 'AMD', price: 129, socket: 'AM4', tdp: 65, ramType: 'DDR4', cores: 6, freq: '3.7 GHz', tier: 5")

# Update GPU tiers
js = js.replace("name: 'AMD Radeon RX 6600', brand: 'AMD', price: 189, tdp: 132, vram: 8, tier: 2", "name: 'AMD Radeon RX 6600', brand: 'AMD', price: 189, tdp: 132, vram: 8, tier: 3")
js = js.replace("name: 'AMD Radeon RX 6600 XT', brand: 'AMD', price: 219, tdp: 160, vram: 8, tier: 3", "name: 'AMD Radeon RX 6600 XT', brand: 'AMD', price: 219, tdp: 160, vram: 8, tier: 4")

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated CPU and GPU tiers in js/data.js successfully!")
