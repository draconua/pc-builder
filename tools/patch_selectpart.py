with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Expose selectPart to window
if "window.selectPart =" not in js:
    js += "\nwindow.selectPart = selectPart;\n"

# Enhance getSuggestedFixesForIssue matching
old_check = "if (issueMsg.toLowerCase().includes('power supply') || issueMsg.toLowerCase().includes('wattage') || issueMsg.toLowerCase().includes('overload')) {"
new_check = "const lower = issueMsg.toLowerCase();\n  if (lower.includes('power') || lower.includes('psu') || lower.includes('wattage') || lower.includes('margin')) {"

js = js.replace(old_check, new_check)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Exposed window.selectPart and broadened power issue detection in js/app.js!")
