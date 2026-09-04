with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

pos = js.find("function updateUI()")
if pos != -1:
    print(js[pos:pos+700])
