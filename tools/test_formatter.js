function formatProChatMessage(text) {
  if (!text) return '';
  
  // 1. Normalize line breaks (handle both actual newlines and literal \n sequences)
  let raw = text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');

  // 2. Identify component categories for custom badges/icons
  const categoryIcons = [
    { regex: /^(?:\d+\.\s*)?\*\*(?:Процессор|CPU):?\*\*/i, icon: '💻', cat: 'CPU' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Материнская плата|Плата|Motherboard):?\*\*/i, icon: '🖲️', cat: 'MB' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Кулер|Охлаждение|Cooler):?\*\*/i, icon: '❄️', cat: 'COOLER' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Оперативная память|ОЗУ|RAM):?\*\*/i, icon: '⚡', cat: 'RAM' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Видеокарта|GPU):?\*\*/i, icon: '🎮', cat: 'GPU' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:SSD|Накопитель|SSD накопитель):?\*\*/i, icon: '🚀', cat: 'SSD' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:HDD|Жесткий диск):?\*\*/i, icon: '💾', cat: 'HDD' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Блок питания|БП|PSU):?\*\*/i, icon: '🔌', cat: 'PSU' },
    { regex: /^(?:\d+\.\s*)?\*\*(?:Корпус|Case):?\*\*/i, icon: '📦', cat: 'CASE' }
  ];

  // Helper to format inline markdown (bold, italic, prices)
  function formatInline(str) {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="pro-strong">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(\d+[\s\u00A0]?(?:–|-)\s?\d+[\s\u00A0]?(?:PLN|zł))|(\b\d+[\s\u00A0]?(?:PLN|zł)\b)/gi, '<span class="pro-price-tag">$1$2</span>');
  }

  // Split into logical lines
  const lines = raw.split('\n');
  const htmlParts = [];
  let inSpecList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inSpecList) {
        htmlParts.push('</div>'); // close spec list container
        inSpecList = false;
      }
      continue;
    }

    // Check for Headers (### Title or ## Title)
    const headerMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headerMatch) {
      if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
      htmlParts.push(`<h4 class="pro-chat-heading">${formatInline(headerMatch[1])}</h4>`);
      continue;
    }

    // Check if line is a component recommendation (e.g. 1. **Процессор:** ...)
    let matchedCat = null;
    for (const c of categoryIcons) {
      if (c.regex.test(line)) {
        matchedCat = c;
        break;
      }
    }

    if (matchedCat) {
      if (!inSpecList) {
        htmlParts.push('<div class="pro-spec-grid">');
        inSpecList = true;
      }
      // Strip the leading "1. " if present
      const cleanLine = line.replace(/^\d+\.\s*/, '');
      htmlParts.push(`
        <div class="pro-spec-card">
          <div class="pro-spec-icon-badge" title="${matchedCat.cat}">${matchedCat.icon}</div>
          <div class="pro-spec-body">${formatInline(cleanLine)}</div>
        </div>
      `);
      continue;
    }

    // Check for regular bullet list (- item or * item or 1. item)
    const bulletMatch = line.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
      htmlParts.push(`
        <div class="pro-bullet-item">
          <span class="pro-bullet-dot">•</span>
          <span class="pro-bullet-text">${formatInline(bulletMatch[1])}</span>
        </div>
      `);
      continue;
    }

    // Regular paragraph
    if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
    htmlParts.push(`<p class="pro-chat-paragraph">${formatInline(line)}</p>`);
  }

  if (inSpecList) {
    htmlParts.push('</div>');
  }

  return htmlParts.join('\n');
}

const testSample = `Привет! Отличный и очень практичный запрос.\\n\\n### Оптимальная сборка за ~5000 PLN:\\n1. **Процессор:** AMD Ryzen 5 7500F (или Ryzen 5 7600) — лучший народный шестиядерник на AM5. (~750 PLN)\\n2. **Материнская плата:** MSI PRO B650M-P или Gigabyte B650M DS3H — надежные платы. (~580 PLN)\\n3. **Видеокарта:** Palit GeForce RTX 4060 Dual 8GB — Full HD на ультрах. (~1350 PLN)\\n\\n**Итоговая стоимость:** около 4290 – 4590 PLN.`;

console.log(formatProChatMessage(testSample));
