with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('class="preset-btn auto-builder-pill"', 'class="auto-builder-pill"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Removed preset-btn class from btn-auto-builder in index.html")
