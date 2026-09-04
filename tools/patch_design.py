import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Enhance the ambient background
light_bg = '''body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(at 0% 0%, rgba(100, 150, 255, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(255, 100, 200, 0.05) 0px, transparent 50%),
    radial-gradient(circle at 50% 50%, var(--bg-subtle) 0%, transparent 80%);
  background-attachment: fixed;'''
css = re.sub(r'body\s*\{\s*background-color:[^}]+\}', light_bg + '\n  color: var(--text-primary);\n  font-family: var(--font-sans);\n  min-height: 100vh;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  transition: background-color var(--duration-normal) var(--ease), color var(--duration-normal) var(--ease);\n}', css)

dark_bg_override = '''[data-theme="dark"] body {
  background-image: 
    radial-gradient(at 0% 0%, rgba(100, 150, 255, 0.12) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(255, 100, 200, 0.08) 0px, transparent 50%),
    radial-gradient(circle at 50% 50%, var(--bg-subtle) 0%, transparent 80%);
}'''
# inject dark bg override after dark theme block
css = css.replace('  --shadow-drawer: -12px 0 40px rgba(0, 0, 0, 0.8);\n  --surface-glass: rgba(20, 23, 28, 0.75);\n  --glass-border: rgba(255, 255, 255, 0.05);\n}', '  --shadow-drawer: -12px 0 40px rgba(0, 0, 0, 0.8);\n  --surface-glass: rgba(20, 23, 28, 0.75);\n  --glass-border: rgba(255, 255, 255, 0.05);\n}\n\n' + dark_bg_override)

# 2. Make slot cards pop at rest and add internal padding changes
# Find .slot-card
slot_card_update = '''
.slot-card {
  background-color: var(--surface-glass);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  transition: all var(--duration-normal) var(--ease);
  box-shadow: var(--shadow-sm); /* ADDED RESTING SHADOW */
}'''
css = re.sub(r'\.slot-card\s*\{[^}]+}', slot_card_update, css)

# 3. Increase padding and radii for modern look
css = css.replace('--radius-sm: 5px;', '--radius-sm: 8px;')
css = css.replace('--radius-md: 8px;', '--radius-md: 12px;')
css = css.replace('--radius-lg: 12px;', '--radius-lg: 16px;')

# 4. Make panel and checklist layout look separated
css = css.replace('.panel {\n  background-color: var(--surface);', '.panel {\n  background-color: var(--surface-glass);\n  backdrop-filter: var(--glass-blur);\n  box-shadow: var(--shadow-sm);')

# 5. Fix app layout max-width and padding to give cards breathing room
css = css.replace('max-width: 1380px;\n  margin: 0 auto;\n  padding: 1.5rem 1.75rem 4rem;', 'max-width: 1440px;\n  margin: 0 auto;\n  padding: 2rem 2.5rem 5rem;')

# 6. Change primary accent color to make it less flat black and more "deep"
css = css.replace('--accent: #111318;', '--accent: #0f172a;')
css = css.replace('--accent-hover: #272a30;', '--accent-hover: #1e293b;')

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Design Depth applied")
