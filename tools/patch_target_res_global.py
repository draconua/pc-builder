with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Add top-level let selectedTargetRes = '1440p';
state_anchor = "let currentCurrency = 'PLN';"
if state_anchor in js:
    js = js.replace(state_anchor, state_anchor + "\nlet selectedTargetRes = '1440p';")
    print("Added top-level selectedTargetRes variable.")
else:
    print("WARNING: Could not find state_anchor.")

# Remove local declaration of selectedTargetRes around line 233
local_decl = "let selectedTargetRes = '1440p';"
# Only replace the second occurrence if there are two
pos1 = js.find(local_decl)
pos2 = js.find(local_decl, pos1 + len(local_decl))
if pos2 != -1:
    js = js[:pos2] + "// selectedTargetRes is global" + js[pos2 + len(local_decl):]
    print("Removed duplicate local declaration.")

# 2. In updateBottleneckPanel ensure safe fallback
js = js.replace(
    "const bottleneck = analyzeBottleneck(buildState.cpu, buildState.gpu, selectedTargetRes);",
    "const resVal = (typeof selectedTargetRes !== 'undefined') ? selectedTargetRes : '1440p';\n  const bottleneck = analyzeBottleneck(buildState.cpu, buildState.gpu, resVal);"
)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Saved app.js with top-level selectedTargetRes.")
