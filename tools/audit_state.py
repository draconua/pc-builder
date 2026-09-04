import os, json

def check_file(path, search_terms):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    print(f"=== {path} (size {len(content)} bytes) ===")
    for term in search_terms:
        found = term in content
        count = content.count(term)
        print(f"  '{term}': {'FOUND (' + str(count) + ')' if found else 'NOT FOUND'}")

check_file("index.html", [
    "btn-hardware-guide",
    "hardware-guide-modal",
    "faq-section",
    "app-footer",
    "slot-info-hint",
    "btn-scroll-top",
    "main-stage"
])

check_file("css/style.css", [
    ".hardware-guide-modal",
    "#hardware-guide-overlay",
    ".slot-info-hint",
    "#btn-scroll-top",
    ".faq-section",
    ".app-footer-main"
])

check_file("js/app.js", [
    "initHardwareGuide",
    "btn-scroll-top",
    "btn-hardware-guide",
    "hardware-guide-close"
])
