with open("js/app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

with open("js/compatibility.js", "r", encoding="utf-8") as f:
    compat_js = f.read()

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

print("Checking features in app.js:")
features = [
  'localStorage', 'url', 'hash', 'share', 'export', 'compare', 
  'timelapse', 'filter', 'sort', 'search', 'undo', 'redo'
]
for feat in features:
    matches = len(app_js.lower().split(feat)) - 1
    print(f" - {feat}: {matches} occurrences")

print("\nChecking compatibility rules in compatibility.js:")
rules = [
  'socket', 'ramType', 'formFactor', 'radiator', 'gpu.length', 'cooler.height', 'wattage'
]
for rule in rules:
    matches = len(compat_js.lower().split(rule.lower())) - 1
    print(f" - {rule}: {matches} occurrences")
