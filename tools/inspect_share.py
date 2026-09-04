with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

import re
matches = re.findall(r'function\s+(?:share|save|confirmSave|export)[a-zA-Z0-9_]*\s*\(.*?\)\s*\{', js)
print("Matching functions:", matches)

# Find where share is implemented
idx = js.find("function shareBuild")
if idx != -1:
    print(js[idx:idx+800])
else:
    # search for share
    for line in js.splitlines():
        if 'share' in line.lower() and ('function' in line or 'eventlistener' in line):
            print(line)
