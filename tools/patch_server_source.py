with open("tools/dev_server.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace(
    "const category = params.category || 'all';",
    "const category = params.category || 'all';\n        const source = params.source || 'hybrid';"
)

js = js.replace(
    "runScraper(partsToScrape, { category })",
    "runScraper(partsToScrape, { category, source })"
)

with open("tools/dev_server.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated dev_server.js with source parameter support.")
