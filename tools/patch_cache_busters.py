with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('href="css/style.css"', 'href="css/style.css?v=20260903_3"')
html = html.replace('src="js/app.js"', 'src="js/app.js?v=20260903_3"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Added cache busters to index.html")
