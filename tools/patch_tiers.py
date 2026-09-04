with open("js/data.js", "r", encoding="utf-8") as f:
    js = f.read()

# Update gaming tiers to realistic standards
js = js.replace("name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', price: 359, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 8, freq: '4.2 GHz', tier: 8", "name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', price: 359, socket: 'AM5', tdp: 120, ramType: 'DDR5', cores: 8, freq: '4.2 GHz', tier: 10")
js = js.replace("name: 'AMD Ryzen 5 7600', brand: 'AMD', price: 189, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '3.8 GHz', tier: 5", "name: 'AMD Ryzen 5 7600', brand: 'AMD', price: 189, socket: 'AM5', tdp: 65, ramType: 'DDR5', cores: 6, freq: '3.8 GHz', tier: 7")
js = js.replace("name: 'AMD Ryzen 5 7600X', brand: 'AMD', price: 199, socket: 'AM5', tdp: 105, ramType: 'DDR5', cores: 6, freq: '4.7 GHz', tier: 6", "name: 'AMD Ryzen 5 7600X', brand: 'AMD', price: 199, socket: 'AM5', tdp: 105, ramType: 'DDR5', cores: 6, freq: '4.7 GHz', tier: 7")

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(js)

with open("js/app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Fix adviceEl lookup
app_js = app_js.replace("const adviceEl = elements.bottleneckAdvice;", "const adviceEl = elements.bottleneckAdvice || document.getElementById('bottleneck-advice');")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(app_js)

print("Calibrated tiers and advice element lookup!")
