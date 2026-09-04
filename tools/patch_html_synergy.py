with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update bottleneck gauge in index.html
old_bottleneck_html = """            <div class="bottleneck-labels-row">
              <span class="bottleneck-side-label">CPU Bound</span>
              <span class="bottleneck-side-label">Balanced</span>
              <span class="bottleneck-side-label">GPU Bound</span>
            </div>
            <div class="bottleneck-bar-track">
              <div class="bottleneck-center-line"></div>
              <div class="bottleneck-bar-fill" id="bottleneck-bar" style="width: 50%;"></div>
            </div>
            <div class="bottleneck-info-box">
              <span id="bottleneck-text" class="bottleneck-text">Synergy</span>
              <p id="bottleneck-advice" class="bottleneck-advice"></p>
            </div>"""

new_bottleneck_html = """            <div class="bottleneck-labels-row">
              <span class="bottleneck-side-label">Баланс и синергия системы</span>
              <span id="bottleneck-score-badge" class="bottleneck-score-badge">98%</span>
            </div>
            <div class="bottleneck-bar-track">
              <div class="bottleneck-bar-fill" id="bottleneck-bar" style="width: 98%;"></div>
            </div>
            <div class="bottleneck-info-box">
              <span id="bottleneck-text" class="bottleneck-text">Идеальный баланс (Золотой стандарт)</span>
              <p id="bottleneck-advice" class="bottleneck-advice"></p>
            </div>"""

html = html.replace(old_bottleneck_html, new_bottleneck_html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated bottleneck HTML in index.html")
