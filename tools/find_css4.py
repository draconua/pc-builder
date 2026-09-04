with open("css/style.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if ".modal, .modal-dialog {" in line:
        start = max(0, i)
        end = min(len(lines), i + 20)
        print("".join(lines[start:end]))
        print("-" * 40)
        break
