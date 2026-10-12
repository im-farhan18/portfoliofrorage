import type { RenderResult } from './render';

export interface Check { label: string; ok: boolean }

/**
 * Static-export validation. Runs on the real generated output before anything can be downloaded.
 * The generated portfolio must be HTML + CSS only: no scripts, no inline handlers, no broken assets.
 */
export function checkExport(r: RenderResult): Check[] {
  const html = r.html;
  const noValues = html.replace(/"[^"]*"/g, '""');
  const refs = [...html.matchAll(/\b(?:src|href)="(assets\/[^"]+)"/g)].map((m) => m[1]);
  const assetsOk =
    r.options.assets === 'folder'
      ? refs.every((p) => r.assets.some((a) => a.path === p)) && r.assets.length === new Set(refs).size
      : refs.length === 0;
  return [
    { label: 'Contains your portfolio content', ok: /<h1[^>]*>[^<]+/.test(html) },
    { label: 'Styles are included', ok: r.css.length > 300 && (r.options.css === 'external' ? html.includes('href="style.css"') : html.includes('<style>')) },
    { label: 'No <script> tags', ok: !/<script/i.test(html) },
    { label: 'No javascript: links', ok: !/\b(?:href|src|action)\s*=\s*["']?\s*javascript:/i.test(html) },
    { label: 'No inline event handlers (onclick, onload, …)', ok: !/<[^>]*\son[a-z]+\s*=/i.test(noValues) },
    { label: 'No frames, plugins or external files', ok: !/<(?:iframe|object|embed|frame)\b/i.test(html) && !/\s(?:src)="https?:/i.test(html) && !/@import/i.test(r.css) },
    { label: 'Images and files are all included', ok: assetsOk },
    { label: 'Semantic structure (header, nav, main, footer)', ok: ['<header>', '<main>', '<footer>'].every((t) => html.includes(t)) },
  ];
}

export const allPassed = (checks: Check[]): boolean => checks.every((c) => c.ok);
