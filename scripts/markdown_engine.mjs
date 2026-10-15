// High-performance, zero-dependency Markdown engine for MESA Learn & Documentation
// Supports CommonMark subsets, GitHub Flavored Markdown (tables, checklists, autolinks, alerts),
// math equations, code blocks with copy buttons, and safe HTML sanitization.

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '') // strip html
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
}

export function renderInlineMarkdown(text = '', { base = './', route = (p) => `${base}${p}` } = {}) {
  let out = escapeHtml(text);

  // Inline math: $equation$ (not preceded or followed by digits)
  out = out.replace(/\$(.+?)\$/g, '<span class="math-inline" role="math">$1</span>');

  // Inline code: `code`
  out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Bold & Italic: ***text***
  out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold: **text** or __text__
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/(^|[^a-zA-Z0-9])_([^_]+)_(?![a-zA-Z0-9])/g, '$1<em>$2</em>');

  // Links: [text](href)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, href) => {
    const isExt = href.startsWith('http://') || href.startsWith('https://');
    if (isExt) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"><span>${linkText}</span><svg class="mesa-icon icon-external" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 5h6v6M19 5l-8 8"/><path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/></svg></a>`;
    }
    if (href.startsWith('#')) {
      return `<a href="${href}">${linkText}</a>`;
    }
    let target = href;
    let hash = '';
    if (target.includes('#')) {
      const parts = target.split('#');
      target = parts[0];
      hash = '#' + parts[1];
    }
    const cleanTarget = target.replace(/^\//, '');
    const finalHref = `${route(cleanTarget)}${hash}`;
    return `<a href="${finalHref}">${linkText}</a>`;
  });

  return out;
}

export function renderMarkdown(markdown = '', options = {}) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const headings = [];
  const htmlParts = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines = [];
  let inTable = false;
  let tableHeaders = [];
  let tableRows = [];
  let inList = false;
  let listType = 'ul'; // 'ul' or 'ol'
  let listItems = [];
  let inBlockquote = false;
  let quoteLines = [];
  let quoteAlert = null; // 'NOTE', 'WARNING', 'TIP', 'IMPORTANT'
  let codeBlockCounter = 0;

  function flushList() {
    if (!inList) return;
    const tag = listType;
    htmlParts.push(`<${tag}>${listItems.map((it) => `<li>${renderInlineMarkdown(it, options)}</li>`).join('')}</${tag}>`);
    inList = false;
    listItems = [];
  }

  function flushTable() {
    if (!inTable) return;
    let tHtml = '<div class="table-scroll"><table>';
    if (tableHeaders.length) {
      tHtml += `<thead><tr>${tableHeaders.map((th) => `<th scope="col">${renderInlineMarkdown(th, options)}</th>`).join('')}</tr></thead>`;
    }
    if (tableRows.length) {
      tHtml += `<tbody>${tableRows.map((row) => `<tr>${row.map((cell, idx) => `<${idx === 0 ? 'th scope="row"' : 'td'}>${renderInlineMarkdown(cell, options)}</${idx === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('')}</tbody>`;
    }
    tHtml += '</table></div>';
    htmlParts.push(tHtml);
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  }

  function flushQuote() {
    if (!inBlockquote) return;
    const content = quoteLines.map((l) => renderInlineMarkdown(l, options)).join('<br>');
    if (quoteAlert) {
      const alertClass = quoteAlert.toLowerCase();
      htmlParts.push(`<aside class="article-callout ${alertClass}"><strong>${quoteAlert}</strong><p>${content}</p></aside>`);
    } else {
      htmlParts.push(`<blockquote><p>${content}</p></blockquote>`);
    }
    inBlockquote = false;
    quoteLines = [];
    quoteAlert = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code Block Fence (```)
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        codeBlockCounter++;
        const targetId = `code-block-${codeBlockCounter}`;
        const escapedCode = escapeHtml(codeLines.join('\n'));
        const langClass = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
        htmlParts.push(
          `<div class="code-terminal"><div class="code-terminal-header"><span class="lang-tag">${escapeHtml(codeLang || 'text')}</span><button class="copy-button" type="button" data-copy-target="${targetId}">Copy</button></div><pre id="${targetId}"${langClass}><code>${escapedCode}</code></pre></div>`
        );
        inCodeBlock = false;
        codeLang = '';
        codeLines = [];
      } else {
        flushList();
        flushTable();
        flushQuote();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // 2. Math Block Equation ($$ ... $$)
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      flushList();
      flushTable();
      flushQuote();
      const mathBody = escapeHtml(trimmed.slice(2, -2).trim());
      htmlParts.push(`<div class="math-block" role="math" aria-label="Equation">${mathBody}</div>`);
      continue;
    }

    // 3. Tables (| cell | cell |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      flushQuote();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if delimiter row (|---|---|)
      const isDelimiter = cells.every((c) => /^:?-+:?$/.test(c));
      if (isDelimiter) {
        // Delimiter indicates previous row was headers
        if (!inTable && htmlParts.length && htmlParts[htmlParts.length - 1].startsWith('<p>')) {
          // already parsed header as paragraph
          htmlParts.pop();
        }
        inTable = true;
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // 4. Blockquotes and GitHub Alerts (> [!NOTE])
    if (trimmed.startsWith('>')) {
      flushList();
      flushTable();
      const quoteText = trimmed.replace(/^>\s?/, '');
      const alertMatch = quoteText.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

      if (!inBlockquote) {
        inBlockquote = true;
        if (alertMatch) {
          quoteAlert = alertMatch[1].toUpperCase();
          const remainder = quoteText.slice(alertMatch[0].length).trim();
          if (remainder) quoteLines.push(remainder);
        } else {
          quoteLines.push(quoteText);
        }
      } else {
        quoteLines.push(quoteText);
      }
      continue;
    } else if (inBlockquote && trimmed !== '') {
      // Continuation of quote without '>'
      quoteLines.push(trimmed);
      continue;
    } else if (inBlockquote && trimmed === '') {
      flushQuote();
      continue;
    }

    // 5. Headings (# H1, ## H2, ### H3, #### H4)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      flushTable();
      flushQuote();
      const level = headingMatch[1].length;
      if (level === 1 && options.skipH1) {
        continue;
      }
      const rawText = headingMatch[2].trim();
      const cleanText = rawText.replace(/[*_`]/g, '');
      const id = slugify(cleanText);
      headings.push({ level, title: cleanText, id });

      // Only levels 2, 3, 4 receive heading anchors
      if (level >= 2 && level <= 4) {
        const anchor = `<a class="heading-anchor" href="#${id}" aria-label="Link to section: ${escapeHtml(cleanText)}" title="Copy link to this section">#</a>`;
        htmlParts.push(`<h${level} id="${id}">${renderInlineMarkdown(rawText, options)}${anchor}</h${level}>`);
      } else {
        htmlParts.push(`<h${level}>${renderInlineMarkdown(rawText, options)}</h${level}>`);
      }
      continue;
    }

    // 6. Horizontal Rules (---, ***, ___)
    if (/^(---|---|\*\*\*|___)$/.test(trimmed)) {
      flushList();
      flushTable();
      flushQuote();
      htmlParts.push('<hr class="article-divider">');
      continue;
    }

    // 7. Unordered Lists (- item, * item)
    const ulMatch = line.match(/^(\s*)([-*])\s+(.+)$/);
    if (ulMatch) {
      flushTable();
      flushQuote();
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      const itemContent = ulMatch[3];
      // Check for GFM checklist [ ] or [x]
      const checkMatch = itemContent.match(/^\[([ xX])\]\s+(.+)$/);
      if (checkMatch) {
        const isChecked = checkMatch[1].toLowerCase() === 'x';
        listItems.push(`<input type="checkbox" disabled${isChecked ? ' checked' : ''}> <span>${checkMatch[2]}</span>`);
      } else {
        listItems.push(itemContent);
      }
      continue;
    }

    // 8. Ordered Lists (1. item)
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      flushTable();
      flushQuote();
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(olMatch[2]);
      continue;
    }

    // Empty line flushes lists
    if (trimmed === '') {
      flushList();
      flushTable();
      flushQuote();
      continue;
    }

    // 9. Images ![alt](src "caption")
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)$/);
    if (imgMatch) {
      flushList();
      flushTable();
      flushQuote();
      const alt = escapeHtml(imgMatch[1]);
      const src = escapeHtml(imgMatch[2]);
      const caption = imgMatch[3] ? `<figcaption>${escapeHtml(imgMatch[3])}</figcaption>` : '';
      htmlParts.push(`<figure class="article-image"><img src="${src}" alt="${alt}" loading="lazy">${caption}</figure>`);
      continue;
    }

    // 10. Paragraph
    flushList();
    flushTable();
    flushQuote();
    htmlParts.push(`<p>${renderInlineMarkdown(line, options)}</p>`);
  }

  flushList();
  flushTable();
  flushQuote();

  return {
    html: htmlParts.join('\n'),
    headings
  };
}

export function generateTableOfContents(headings = [], { label = 'On this page' } = {}) {
  const filtered = headings.filter((h) => h.level === 2 || h.level === 3);
  if (!filtered.length) return '';
  const items = filtered.map((h) => {
    const indentClass = h.level === 3 ? ' toc-sub' : '';
    return `<li class="toc-item${indentClass}"><a href="#${h.id}">${escapeHtml(h.title)}</a></li>`;
  }).join('');
  return `<nav class="article-toc" aria-label="${escapeHtml(label)}"><strong>${escapeHtml(label)}</strong><ol>${items}</ol></nav>`;
}
