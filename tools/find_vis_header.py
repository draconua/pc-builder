with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
pos = html.find("id=\"visualizer-section\"")
if pos == -1:
    pos = html.find("vis-badge")
if pos == -1:
    pos = html.find("vis-case-frame")
    print(html[pos-500:pos+200])
else:
    print(html[pos-200:pos+400])
