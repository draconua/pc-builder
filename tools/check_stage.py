with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

print("has id=main-stage:", 'id="main-stage"' in html)
print("has id=stage:", 'id="stage"' in html)
print("has class=stage:", 'class="stage"' in html)
