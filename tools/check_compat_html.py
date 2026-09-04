with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

pos = html.find('id="compatibility-panel"')
print(html[pos-100:pos+1500])
