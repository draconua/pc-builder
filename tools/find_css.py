with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "retailer" in line or "modal" in line:
        start = max(0, i - 1)
        end = min(len(lines), i + 5)
        print("".join(lines[start:end]))
        print("-" * 40)
        break # Just first one to see
