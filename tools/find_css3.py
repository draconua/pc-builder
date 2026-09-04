with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

in_retailers = False
for i, line in enumerate(lines):
    if "#retailers-modal" in line or ".retailer" in line:
        start = max(0, i - 1)
        end = min(len(lines), i + 10)
        print("".join(lines[start:end]))
        print("-" * 40)
