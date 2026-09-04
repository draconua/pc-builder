with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

css = css.replace("justify-content: space-between;\n  gap: 0.35rem;", "justify-content: flex-start;\n  gap: 0.4rem;")
css = css.replace(".stage-col-center {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  gap: 0.65rem;\n}", ".stage-col-center {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}")
css = css.replace("min-height: 250px;", "min-height: 220px;")
css = css.replace("#pc-svg {\n  max-height: 230px;", "#pc-svg {\n  max-height: 200px;")
css = css.replace("height: calc(100vh - 110px);\n  min-height: 580px;", "min-height: calc(100vh - 100px);")

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Polished spacing")
