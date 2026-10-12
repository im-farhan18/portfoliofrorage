import type { PortfolioData } from '../types/portfolio';
import { checkExport, allPassed, type Check } from './check';
import { renderPortfolio, type RenderResult } from './render';
import { slug } from './sanitize';

export interface GeneratedPortfolio {
  single: RenderResult;   // one self-contained index.html
  folder: RenderResult;   // index.html + style.css + assets/
  checks: Check[];
  ok: boolean;
}

export function generatePortfolio(d: PortfolioData): GeneratedPortfolio {
  const single = renderPortfolio(d, { assets: 'inline', css: 'inline' });
  const folder = renderPortfolio(d, { assets: 'folder', css: 'external' });
  const checks = [...checkExport(single)];
  for (const c of checkExport(folder)) if (!checks.some((x) => x.label === c.label && x.ok === c.ok) && !c.ok) checks.push({ ...c, label: `${c.label} (ZIP version)` });
  return { single, folder, checks, ok: allPassed(checkExport(single)) && allPassed(checkExport(folder)) };
}

export function dataUrlToBytes(u: string): Uint8Array {
  const bin = atob(u.slice(u.indexOf(',') + 1));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function buildZipBytes(d: PortfolioData): Promise<Uint8Array> {
  const r = renderPortfolio(d, { assets: 'folder', css: 'external' });
  const { default: JSZip } = await import('jszip'); // loaded only when the user downloads a ZIP
  const zip = new JSZip();
  zip.file('index.html', r.html);
  zip.file('style.css', r.css);
  for (const a of r.assets) zip.file(a.path, dataUrlToBytes(a.dataUrl));
  zip.file('README.txt', 'Open index.html in any browser. This portfolio is plain HTML + CSS: no JavaScript, no build step, works offline.\nUpload the whole folder to any static host (GitHub Pages, Netlify, Vercel, …) to publish it.\n');
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

export const zipName = (d: PortfolioData): string => `${slug(d.profile.name) || 'my'}-portfolio.zip`;

/** For the "Inspect code" panel: shortens huge embedded images so the code stays readable. */
export function readableCode(text: string): string {
  return text.replace(/data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]{80,}/g, (m) => `${m.slice(0, m.indexOf(',') + 1)}…(${Math.round((m.length * 0.75) / 1024)} KB of image data)`);
}
