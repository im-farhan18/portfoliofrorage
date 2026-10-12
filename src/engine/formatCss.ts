/** Tiny CSS pretty-printer so the exported stylesheet is readable (never minified). */
export function formatCss(src: string): string {
  let out = '';
  let depth = 0;
  let paren = 0;
  let quote = '';
  let skipSpace = true;
  const pad = () => '  '.repeat(depth);
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      out += c;
      if (c === '\\') out += src[++i] ?? '';
      else if (c === quote) quote = '';
      continue;
    }
    if (/\s/.test(c)) {
      if (!skipSpace && !out.endsWith(' ')) out += ' ';
      continue;
    }
    skipSpace = false;
    if (c === '"' || c === "'") { quote = c; out += c; continue; }
    if (paren === 0 && c === '{') { out = out.trimEnd() + ' {\n'; depth++; out += pad(); skipSpace = true; continue; }
    if (paren === 0 && c === ';') { out = out.trimEnd() + ';\n' + pad(); skipSpace = true; continue; }
    if (paren === 0 && c === '}') {
      out = out.trimEnd();
      depth = Math.max(0, depth - 1);
      out += '\n' + pad() + '}\n' + (depth === 0 ? '\n' : '') + pad();
      skipSpace = true;
      continue;
    }
    if (c === '(') paren++;
    else if (c === ')') paren = Math.max(0, paren - 1);
    out += c;
  }
  return out.trim() + '\n';
}
