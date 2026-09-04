with open("js/app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "return;" in line or "return " in line or line.strip() == "return":
        # Check if inside a function by indentation or let node parse it
        pass

# Let's run node on a wrapped script to pinpoint syntax error
import subprocess
res = subprocess.run(["node", "-e", "import('./js/app.js')"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
