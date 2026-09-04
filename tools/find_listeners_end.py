with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

pos = js.find("function setupEventListeners()")
# find the closing brace of setupEventListeners
brace = 0
in_func = False
for i in range(pos, len(js)):
    if js[i] == '{':
        brace += 1
        in_func = True
    elif js[i] == '}':
        brace -= 1
        if in_func and brace == 0:
            print("setupEventListeners ends at index", i)
            print(js[i-200:i+1])
            break
