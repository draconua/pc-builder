with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

idx = css.find(".hardware-guide-modal {")
if idx != -1:
    print(css[idx:idx+400])
