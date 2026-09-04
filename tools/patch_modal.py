with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

css = css.replace(".modal {", ".modal, .modal-dialog {")

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css")
