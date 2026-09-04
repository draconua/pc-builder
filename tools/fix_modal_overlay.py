# 1. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace('<div id="dev-prices-modal" class="modal">', '<div id="dev-prices-modal" class="modal-overlay hidden">')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html to use modal-overlay hidden.")

# 2. Update app.js
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace(
    "function openDevModal() {\n    devModal.classList.add('active');",
    "function openDevModal() {\n    devModal.classList.remove('hidden');\n    devModal.classList.add('active');"
)

js = js.replace(
    "function closeDevModal() {\n    devModal.classList.remove('active');",
    "function closeDevModal() {\n    devModal.classList.add('hidden');\n    devModal.classList.remove('active');"
)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated app.js openDevModal and closeDevModal.")
