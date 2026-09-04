with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

css = css.replace("min-height: 72px;", "min-height: 62px;")
css = css.replace("padding: 0.6rem 0.85rem;", "padding: 0.45rem 0.75rem;")
css = css.replace("gap: 0.5rem;\n}", "gap: 0.35rem;\n}")
css = css.replace("max-height: 270px;", "max-height: 230px;")
css = css.replace(".main-stage {\n  display: grid;\n  grid-template-columns: 330px 1fr 330px;\n  gap: 1rem;\n  padding: 0.75rem 1.25rem;", ".main-stage {\n  display: grid;\n  grid-template-columns: 330px 1fr 330px;\n  gap: 0.85rem;\n  padding: 0.5rem 1.25rem;")

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Polished compactness for perfect 100vh fit")
