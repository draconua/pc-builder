with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

target = "if (activeCategory) renderPartsList();"
replacement = "if (activeCategory) renderPartsList();\n        if (window.syncAutobuildCurrency) window.syncAutobuildCurrency();"

if target in js:
    js = js.replace(target, replacement)
    print("Hooked syncAutobuildCurrency into currency click listener!")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
