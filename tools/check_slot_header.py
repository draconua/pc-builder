with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

pos = css.find(".slot-header-row {")
if pos != -1:
    print(css[pos:pos+250])
