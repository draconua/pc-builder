# 1. Patch index.html
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace(
    "<h2>Актуализация цен в Польше (Ceneo.pl)</h2>",
    "<h2>Актуализация цен в Польше (Morele & Ceneo)</h2>"
)

old_field = """            <div class="dev-control-field">
              <label for="dev-category-select">Категория комплектующих:</label>"""

new_fields = """            <div class="dev-control-field" style="max-width: 280px;">
              <label for="dev-source-select">Источник (Магазин):</label>
              <select id="dev-source-select" class="dev-select">
                <option value="hybrid" selected>Morele + Ceneo (Умный гибрид ⭐)</option>
                <option value="morele">Morele.net (Прямой ритейлер)</option>
                <option value="ceneo">Ceneo.pl (Агрегатор 50+ магазинов)</option>
              </select>
            </div>
            <div class="dev-control-field">
              <label for="dev-category-select">Категория комплектующих:</label>"""

if old_field in html:
    html = html.replace(old_field, new_fields, 1)
    print("Added source selector to index.html.")

# Update diff table header
html = html.replace(
    "<th>Разница</th>\n                    <th>Ссылка</th>",
    "<th>Разница</th>\n                    <th>Магазин</th>\n                    <th>Ссылка</th>"
)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html.")

# 2. Patch js/app.js to pass source and display source
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace(
    "const category = catSelect ? catSelect.value : 'all';",
    "const category = catSelect ? catSelect.value : 'all';\n      const srcSelect = document.getElementById('dev-source-select');\n      const source = srcSelect ? srcSelect.value : 'hybrid';"
)

js = js.replace(
    "body: JSON.stringify({ category })",
    "body: JSON.stringify({ category, source })"
)

old_row = """          <tr>
            <td><strong>${escapeHtml(r.name)}</strong></td>
            <td><span class="slack-code-tag">${r.category}</span></td>
            <td>${r.oldPrice} zł</td>
            <td><strong>${r.newPrice} zł</strong></td>
            <td class="${diffClass}">${diffText}</td>
            <td><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="dev-table-link">Ceneo ↗</a></td>
          </tr>"""

new_row = """          <tr>
            <td><strong>${escapeHtml(r.name)}</strong></td>
            <td><span class="slack-code-tag">${r.category}</span></td>
            <td>${r.oldPrice} zł</td>
            <td><strong>${r.newPrice} zł</strong></td>
            <td class="${diffClass}">${diffText}</td>
            <td><span class="slack-code-tag" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">${r.source || 'Auto'}</span></td>
            <td><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="dev-table-link">${r.source || 'Магазин'} ↗</a></td>
          </tr>"""

if old_row in js:
    js = js.replace(old_row, new_row)
    print("Updated diff table row rendering in app.js.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated js/app.js.")
