import re
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

slots = re.findall(r'class="slot-num">([^<]+)<', html)
print("Slot numbers in stage:", slots)
