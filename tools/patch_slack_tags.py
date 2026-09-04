import re

with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace light mode slack-code-tag
pattern = r'\[data-theme="light"\] \.slack-code-tag \{[^}]*\}'
replacement = """[data-theme="light"] .slack-code-tag {
  background: #f4f5f7;
  color: #e01e5a; /* Authentic Slack Red */
  border: 1px solid #e3e5e8;
  box-shadow: none;
}"""

css = re.sub(pattern, replacement, css)

# And light mode hover
pattern_hover = r'\[data-theme="light"\] \.slack-code-tag:hover \{[^}]*\}'
replacement_hover = """[data-theme="light"] .slack-code-tag:hover {
  background: #eef0f3;
  border-color: #d1d5db;
  color: #c91951;
}"""

css = re.sub(pattern_hover, replacement_hover, css)

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated slack-code-tag for light mode to match actual Slack style")
