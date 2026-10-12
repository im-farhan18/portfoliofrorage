import type { PortfolioData } from '../types/portfolio';
import { FONT_STACKS, GAPS, PALETTE } from './options';
import { safeColor } from './sanitize';
import { formatCss } from './formatCss';
import { getTemplate } from './templates';

/** Shared base styles. Template CSS is appended after these and may override anything. */
const BASE = `
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--tx);font:1rem/1.65 var(--font)}
a{color:var(--ac)}
h1,h2,h3{line-height:1.15;margin:0 0 .5rem}
h1{font-size:clamp(2.2rem,7vw,4.5rem)}
img{max-width:100%;height:auto}
header,main,footer,nav{max-width:1000px;margin:0 auto;padding:0 1.25rem}
header{padding-top:var(--gap);padding-bottom:1rem}
main section{padding:calc(var(--gap)/2) 0}
nav{display:flex;flex-wrap:wrap;gap:1rem;padding-top:.75rem;padding-bottom:.75rem}
.tags{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.4rem}
.tags li{padding:.15rem .7rem;border:1px solid var(--bd);border-radius:99px;font-size:.85rem}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
.card{background:var(--sf);border:1px solid var(--bd);border-radius:12px;padding:1.2rem}
.sub{color:var(--ac);margin:0}
.meta{color:var(--mu);font-size:.85rem;margin:0}
.links a{margin-right:1rem}
.contact{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.5rem 1.5rem}
.avatar{display:inline-block;vertical-align:bottom;width:clamp(96px,18vw,160px);height:clamp(96px,18vw,160px);object-fit:cover;border-radius:50%;margin-bottom:1.25rem;border:3px solid var(--ac);box-shadow:0 8px 30px color-mix(in srgb,var(--ac) 35%,transparent)}
.thumb{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:8px;margin:0 0 .8rem}
.list{margin:.3rem 0 .6rem;padding-left:1.1rem}
.meters{list-style:none;padding:0;margin:.6rem 0 0}
.meters li{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.25rem;margin:.55rem 0;font-size:.9rem}
.bar{flex-basis:100%;height:5px;border-radius:5px;background:var(--bd);overflow:hidden}
.bar i{display:block;height:100%;background:var(--ac)}
details summary{cursor:pointer;color:var(--ac)}
:focus-visible{outline:2px solid var(--ac);outline-offset:3px}
footer{padding-top:2rem;padding-bottom:3rem;color:var(--mu);font-size:.85rem}
`;

/** Animation levels: 0 off · 1 subtle (no ambient loops) · 2 standard · 3 high. Plus reduced-motion and print. */
const MOTION = `
.a0,.a0 *,.a0::before,.a0::after,.a0 *::before,.a0 *::after{animation:none!important;transition:none!important}
.a1::before,.a1::after,.a1 header::before,.a1 header::after{animation:none!important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media print{
body::before,body::after,header::before,header::after,nav{display:none!important}
body{background:#fff!important;color:#000!important}
.card{background:#fff!important;box-shadow:none!important;backdrop-filter:none!important;break-inside:avoid}
a{color:#000}
}
`;

/** Builds the full stylesheet for a portfolio: theme tokens + base + template + motion/print rules. */
export function buildCss(d: PortfolioData): string {
  const s = d.settings;
  const t = getTemplate(s.template);
  const palette =
    s.theme === 'auto'
      ? `:root{${PALETTE.light}}\n@media (prefers-color-scheme:dark){:root{${PALETTE.dark}}}`
      : `:root{${PALETTE[s.theme]}}`;
  const tokens = `:root{--ac:${safeColor(s.accentColor)};--font:${FONT_STACKS[s.font]};--gap:${GAPS[s.layout]}}`;
  return formatCss([palette, tokens, BASE, t.css, MOTION].join('\n'));
}
