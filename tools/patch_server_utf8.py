with open("tools/dev_server.js", "r", encoding="utf-8") as f:
    code = f.read()

old_parse = """function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}"""

new_parse = """function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}"""

if old_parse in code:
    code = code.replace(old_parse, new_parse, 1)
    print("Fixed UTF-8 in parseJsonBody in dev_server.js.")
else:
    print("Warning: old_parse not found.")

# Ensure all Content-Type headers have charset=utf-8
code = code.replace("'Content-Type': 'application/json'", "'Content-Type': 'application/json; charset=utf-8'")

with open("tools/dev_server.js", "w", encoding="utf-8") as f:
    f.write(code)
print("Updated dev_server.js successfully.")
