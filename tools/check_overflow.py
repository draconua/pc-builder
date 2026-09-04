with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

for rule in [".slot-card {", ".slot-body {"]:
    pos = css.find(rule)
    if pos != -1:
        print(rule)
        print(css[pos:pos+250])
