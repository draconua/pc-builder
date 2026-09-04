with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

pos = css.find('[data-theme="dark"]')
print(css[pos:pos+1200])
