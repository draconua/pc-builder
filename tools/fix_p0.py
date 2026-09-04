import re

# 1. Fix CSS
with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Remove dangling [data-theme="dark"] or [data-theme="light"] that are alone on a line
# and followed by whitespace or comments. We can just use a regex.
css = re.sub(r'^\[data-theme="(?:dark|light)"\]\s*$', '', css, flags=re.MULTILINE)

# Fix .main-stage !important rule at the bottom
# We will wrap it in a media query
bad_stage = """
.main-stage {
    width: 100% !important;
    max-width: 100% !important;
    padding: 1.25rem 2.2rem !important;
    display: grid !important;
    grid-template-columns: minmax(380px, 1fr) minmax(460px, 1.35fr) minmax(380px, 1fr) !important;
    gap: 1.8rem !important;
}
"""

fixed_stage = """
@media (min-width: 1151px) {
  .main-stage {
      width: 100% !important;
      max-width: 100% !important;
      padding: 1.25rem 2.2rem !important;
      display: grid !important;
      grid-template-columns: minmax(380px, 1fr) minmax(460px, 1.35fr) minmax(380px, 1fr) !important;
      gap: 1.8rem !important;
  }
}
"""
css = css.replace(bad_stage.strip(), fixed_stage.strip())

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)
print("Fixed CSS syntax and responsiveness.")


# 2. Fix HTML
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# It's specifically in the CPU block. Let's find it.
# We know the bug is `data-i18n="slot.gpu.analogs"` being used twice, once in cpu and once in gpu.
# The CPU one is the first one. Let's just do a specific replace.
cpu_html = html.split('id="slot-gpu"')[0]
gpu_html = 'id="slot-gpu"' + html.split('id="slot-gpu"')[1]

cpu_html = cpu_html.replace('data-i18n="slot.gpu.analogs"', 'data-i18n="slot.cpu.analogs"')
html = cpu_html + gpu_html

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Fixed HTML i18n key.")
