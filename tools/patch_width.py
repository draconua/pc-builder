import re

with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Make layout edge-to-edge / ultra wide
css = re.sub(r'max-width:\s*1440px;', 'max-width: 2400px;', css)
css = re.sub(r'max-width:\s*1620px;', 'max-width: 2400px;', css)
css = re.sub(r'max-width:\s*1720px;', 'max-width: 2400px;', css)
css = re.sub(r'max-width:\s*1720px\s*!important;', 'max-width: 2400px !important;', css)

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated layout to 2400px max-width")
