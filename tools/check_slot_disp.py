import re
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

start = js.find("function updateSlotDisplay(category, part)")
if start != -1:
    brace_count = 0
    in_func = False
    for i in range(start, len(js)):
        if js[i] == '{':
            brace_count += 1
            in_func = True
        elif js[i] == '}':
            brace_count -= 1
        
        if in_func and brace_count == 0:
            content = js[start:i+1]
            print(content[:800])
            print("...\n" + content[-800:])
            break
