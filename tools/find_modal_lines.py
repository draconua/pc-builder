with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if ".hardware-guide-modal" in line or "#hardware-guide-overlay" in line:
        print(f"Line {idx+1}: {line.strip()[:90]}")
