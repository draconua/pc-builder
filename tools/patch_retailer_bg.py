with open("css/style.css", "a", encoding="utf-8") as f:
    f.write("""
/* Store Aggregator Modal Background */
.retailer-dialog {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

[data-theme="dark"] .retailer-dialog {
  background: #0d121c; /* Deep dark background */
  border: 1px solid #243044;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
}

.retailer-modal-header {
  padding: 1.25rem 1.4rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}

[data-theme="dark"] .retailer-modal-header {
  background: #131a27;
  border-bottom-color: #243044;
}

.retailer-modal-body {
  padding: 1.25rem 1.4rem;
  background: transparent;
}
""")
print("Added retailer-dialog specific styles")
