import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract header, toolbar, main content, modals, drawer
header_match = re.search(r'<header class="header">.*?</header>', html, re.DOTALL)
toolbar_match = re.search(r'<div class="toolbar[^"]*">.*?</div>\s*<main', html, re.DOTALL)
drawer_match = re.search(r'<div class="drawer-overlay".*', html, re.DOTALL)

# Extract slots
slots = {}
for cat in ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'hdd', 'psu', 'case', 'monitor']:
    pattern = rf'<div class="slot-card" data-category="{cat}" id="slot-{cat}">.*?<!-- slot-actions -->\s*</div>\s*</div>\s*</div>'
    match = re.search(pattern, html, re.DOTALL)
    if not match: # fallback for generic capture
        match = re.search(rf'<div class="slot-card" data-category="{cat}".*?(?:</button>\s*</div>\s*</div>\s*</div>)', html, re.DOTALL)
    slots[cat] = match.group(0) if match else f"<!-- MISSING {cat} -->"

# Add GPU alternative container inside GPU slot
slots['gpu'] = slots['gpu'].replace('</div>\n          </div>', '</div>\n          <div id="gpu-alternatives" class="gpu-alternatives hidden"></div>\n          </div>')

# Extract panels
def get_panel(title_id):
    match = re.search(rf'<div class="panel(?:[^"]*)".*?data-i18n="{title_id}".*?(?=</div>\s*<div class="panel|</section>)', html, re.DOTALL)
    if match:
        s = match.group(0)
        # Fix trailing div closure if needed
        open_divs = s.count('<div')
        close_divs = s.count('</div')
        while close_divs < open_divs:
            s += '\n</div>'
            close_divs += 1
        return s
    return "<!-- MISSING PANEL -->"

panel_summary = re.search(r'<div class="panel summary-panel">.*?<div class="panel visualizer-panel">', html, re.DOTALL).group(0).replace('<div class="panel visualizer-panel">', '').strip()
open_d = panel_summary.count('<div')
close_d = panel_summary.count('</div')
if close_d < open_d: panel_summary += '\n</div>' * (open_d - close_d)

panel_vis = re.search(r'<div class="panel visualizer-panel">.*?<div class="panel" id="fps-panel">', html, re.DOTALL).group(0).replace('<div class="panel" id="fps-panel">', '').strip()
open_d = panel_vis.count('<div')
close_d = panel_vis.count('</div')
if close_d < open_d: panel_vis += '\n</div>' * (open_d - close_d)

panel_fps = re.search(r'<div class="panel" id="fps-panel">.*?<div class="panel" id="bottleneck-panel">', html, re.DOTALL).group(0).replace('<div class="panel" id="bottleneck-panel">', '').strip()
open_d = panel_fps.count('<div')
close_d = panel_fps.count('</div')
if close_d < open_d: panel_fps += '\n</div>' * (open_d - close_d)

panel_bot = re.search(r'<div class="panel" id="bottleneck-panel">.*?<div class="panel">\s*<span class="panel-title" data-i18n="dash.compat">', html, re.DOTALL).group(0).replace('<div class="panel">\n          <span class="panel-title" data-i18n="dash.compat">', '').strip()
open_d = panel_bot.count('<div')
close_d = panel_bot.count('</div')
if close_d < open_d: panel_bot += '\n</div>' * (open_d - close_d)

panel_compat = re.search(r'<div class="panel">\s*<span class="panel-title" data-i18n="dash.compat">.*?<div class="panel">\s*<span class="panel-title" data-i18n="dash.saved">', html, re.DOTALL).group(0).replace('<div class="panel">\n          <span class="panel-title" data-i18n="dash.saved">', '').strip()
open_d = panel_compat.count('<div')
close_d = panel_compat.count('</div')
if close_d < open_d: panel_compat += '\n</div>' * (open_d - close_d)

panel_saved = re.search(r'<div class="panel">\s*<span class="panel-title" data-i18n="dash.saved">.*?(?=</section>)', html, re.DOTALL).group(0).strip()
open_d = panel_saved.count('<div')
close_d = panel_saved.count('</div')
if close_d < open_d: panel_saved += '\n</div>' * (open_d - close_d)

new_main = f'''
  <main class="main-content">
    <div class="dashboard-top">
      <div class="col-left">
        {slots['cpu']}
        {slots['motherboard']}
        {slots['ram']}
        {slots['cooler']}
        {slots['gpu']}
      </div>
      <div class="col-center">
        {panel_summary}
        {panel_vis}
        {panel_bot}
      </div>
      <div class="col-right">
        {slots['ssd']}
        {slots['hdd']}
        {slots['psu']}
        {slots['case']}
        {slots['monitor']}
      </div>
    </div>
    
    <div class="dashboard-bottom">
      {panel_fps}
      {panel_compat}
      {panel_saved}
    </div>
  </main>
'''

head_part = html[:html.find('<main')]
tail_part = html[html.find('</main>')+7:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(head_part + new_main + tail_part)

print("HTML restructured")
