import re
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# find index of "function generateAutoBuild"
start = js.find("function generateAutoBuild")
if start != -1:
    # simple brace matching
    brace_count = 0
    in_func = False
    for i in range(start, len(js)):
        if js[i] == '{':
            brace_count += 1
            in_func = True
        elif js[i] == '}':
            brace_count -= 1
        
        if in_func and brace_count == 0:
            print(js[start:i+1])
            break
