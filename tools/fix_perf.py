with open("js/performance.js", "r", encoding="utf-8") as f:
    code = f.read()

# Keep everything up to return { score, type, label, advice };\n}
idx = code.find("return { score, type, label, advice };\n}")
if idx != -1:
    code = code[:idx + len("return { score, type, label, advice };\n}")]

with open("js/performance.js", "w", encoding="utf-8") as f:
    f.write(code + "\n")

print("Cleaned dead code from js/performance.js!")
