with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

if "window.PARTS_DATABASE =" not in js:
    js += "\nwindow.PARTS_DATABASE = PARTS_DATABASE;\n"

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Exposed window.PARTS_DATABASE!")
