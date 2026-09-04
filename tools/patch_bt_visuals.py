import re
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

new_track = """
            <!-- CPU ↔ GPU Visual Balance -->
            <div class="bottleneck-visual-row">
              <span class="bt-label">CPU</span>
              <div class="bottleneck-bar-track split-track">
                <div class="bottleneck-bar-fill cpu-fill" id="bottleneck-bar-cpu" style="width: 100%;"></div>
                <div class="bottleneck-bar-fill gpu-fill" id="bottleneck-bar-gpu" style="width: 100%;"></div>
                <div class="bt-divider"></div>
              </div>
              <span class="bt-label">GPU</span>
            </div>
"""

old_track = r'<div class="bottleneck-bar-track">\s*<div class="bottleneck-bar-fill" id="bottleneck-bar"[^>]*><\/div>\s*<\/div>'
html = re.sub(old_track, new_track, html)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

css = """
/* Visual Bottleneck Slider */
.bottleneck-visual-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}
.bt-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}
.split-track {
  flex: 1;
  display: flex;
  height: 8px;
  background: var(--bg-subtle);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.cpu-fill {
  background: #3b82f6; /* Blue for CPU */
  height: 100%;
  transition: width 0.4s var(--ease);
}
.gpu-fill {
  background: #10b981; /* Green for GPU */
  height: 100%;
  transition: width 0.4s var(--ease);
  margin-left: auto;
}
.bt-divider {
  position: absolute;
  left: 50%;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: var(--text-primary);
  opacity: 0.2;
}
"""

with open("css/style.css", "a", encoding="utf-8") as f:
    f.write("\n" + css)
    
print("Updated bottleneck visualizer HTML and CSS.")
