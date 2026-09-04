with open("css/style.css", "r", encoding="utf-8") as f:
    content = f.read()
import re
for match in re.finditer(r'\.retailer-dialog[^{]*\{[^}]*\}', content):
    print(match.group(0))
    print('-'*40)
for match in re.finditer(r'\.modal-dialog[^{]*\{[^}]*\}', content):
    print(match.group(0))
    print('-'*40)
