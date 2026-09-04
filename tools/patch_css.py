import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update Shadows
css = css.replace(
    '--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);',
    '--shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);'
)
css = css.replace(
    '--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);',
    '--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);'
)
css = css.replace(
    '--shadow-drawer: -6px 0 24px rgba(0, 0, 0, 0.08);',
    '--shadow-drawer: -10px 0 40px rgba(0, 0, 0, 0.1);'
)

# 2. Add glassmorphism variables to :root
glass_vars = """
  /* Glassmorphism */
  --surface-glass: rgba(255, 255, 255, 0.75);
  --glass-blur: blur(16px);
  --glass-border: rgba(255, 255, 255, 0.4);
"""
css = css.replace('  /* Motion */', glass_vars + '\n  /* Motion */')

# Dark theme glassmorphism
dark_glass = """
  --surface-glass: rgba(20, 23, 28, 0.75);
  --glass-border: rgba(255, 255, 255, 0.05);
"""
css = css.replace('  --shadow-drawer: -6px 0 30px rgba(0, 0, 0, 0.8);\n}', '  --shadow-drawer: -12px 0 40px rgba(0, 0, 0, 0.8);\n' + dark_glass + '}')

# 3. Update ease curve for spring effect
css = css.replace('--ease: cubic-bezier(0.16, 1, 0.3, 1);', '--ease: cubic-bezier(0.175, 0.885, 0.32, 1.05);')
css = css.replace('--duration-normal: 0.2s;', '--duration-normal: 0.3s;')

# 4. Apply background radial gradient to body
def replace_body(m):
    return m.group(0).replace('background-color: var(--bg);', 'background-color: var(--bg);\n  background-image: radial-gradient(circle at 50% 0%, var(--bg-subtle) 0%, transparent 70%);')
css = re.sub(r'body\s*{[^}]+}', replace_body, css)

# 5. Apply glassmorphism to header, toolbar, drawer, modals
# Header:
css = re.sub(
    r'(\.header\s*{[^}]*)',
    r'\g<1>\n  background-color: var(--surface-glass);\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  position: sticky;\n  top: 0;\n  z-index: 50;\n  margin-top: -1.5rem;\n  padding-top: 1.5rem;',
    css
)
# Toolbar
css = re.sub(
    r'(\.toolbar\s*{[^}]*background-color:\s*)var\(--surface\);',
    r'\g<1>var(--surface-glass);\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  border: 1px solid var(--glass-border);',
    css
)
# Drawer
css = re.sub(
    r'(\.drawer\s*{[^}]*background-color:\s*)var\(--bg\);',
    r'\g<1>var(--surface-glass);\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  border-left: 1px solid var(--glass-border);',
    css
)
# Modals
css = re.sub(
    r'(\.modal\s*{[^}]*background-color:\s*)var\(--surface\);',
    r'\g<1>var(--surface-glass);\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  border: 1px solid var(--glass-border);',
    css
)

# 6. Add transform to slot-card:hover
css = css.replace(
    '.slot-card:hover {\n  border-color: var(--border-hover);\n}',
    '.slot-card:hover {\n  border-color: var(--border-hover);\n  transform: translateY(-2px) scale(1.01);\n  box-shadow: var(--shadow-md);\n}'
)

# 7. Add transform to part-card in drawer
css = css.replace(
    '.part-card:hover {\n  border-color: var(--border-hover);\n  box-shadow: var(--shadow-xs);\n}',
    '.part-card:hover {\n  border-color: var(--border-hover);\n  box-shadow: var(--shadow-sm);\n  transform: scale(1.015);\n}'
)

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated successfully")
