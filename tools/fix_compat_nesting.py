with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Fix the closing div for compatibility-panel
old_chunk = """          <div id="compatibility-list" class="compatibility-list">
            <div class="compat-item info" data-i18n="dash.compat.empty">
              Выберите компоненты для проверки физической и электрической совместимости
            </div>
          </div>
        
        <!-- 3. Recommended Monitor Panel -->"""

new_chunk = """          <div id="compatibility-list" class="compatibility-list">
            <div class="compat-item info" data-i18n="dash.compat.empty">
              Выберите компоненты для проверки физической и электрической совместимости
            </div>
          </div>
        </div>

        <!-- 3. Recommended Monitor Panel -->"""

extra_closing = """            </div>
          </div>
        </div>

</div>

        <!-- Saved Builds -->"""

fixed_closing = """            </div>
          </div>
        </div>

        <!-- Saved Builds -->"""

if old_chunk in html:
    html = html.replace(old_chunk, new_chunk)
    print("Fixed opening of monitor panel outside compatibility panel.")
else:
    print("WARNING: old_chunk not found.")

if extra_closing in html:
    html = html.replace(extra_closing, fixed_closing)
    print("Removed extra closing div.")
else:
    # try normalized replacement
    html = html.replace("        </div>\n\n</div>\n\n        <!-- Saved Builds -->", "        </div>\n\n        <!-- Saved Builds -->")
    print("Replaced normalized extra closing div.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved index.html cleanly.")
