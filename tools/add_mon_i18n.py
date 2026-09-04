with open("js/i18n.js", "r", encoding="utf-8") as f:
    js = f.read()

translations = {
    'ru': ("'dash.monitor.title': 'РЕКОМЕНДУЕМЫЙ МОНИТОР',", "ru: {"),
    'en': ("'dash.monitor.title': 'RECOMMENDED MONITOR',", "en: {"),
    'pl': ("'dash.monitor.title': 'ZALECANY MONITOR',", "pl: {"),
    'ua': ("'dash.monitor.title': 'РЕКОМЕНДОВАНИЙ МОНІТОР',", "ua: {")
}

for lang, (line, target) in translations.items():
    js = js.replace(target, target + "\n    " + line)

with open("js/i18n.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Added dash.monitor.title to all languages.")
