with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

pos = js.find("function openDrawer(")
if pos != -1:
    print(js[pos:pos+800])
