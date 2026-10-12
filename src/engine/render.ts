import type { PortfolioData, SectionKey } from '../types/portfolio';
import { ANIMATION_LEVELS, PLATFORM_LABELS, SECTION_LABELS, SECTION_ORDER, SKILL_CATEGORIES } from './options';
import { esc, isEmail, safeImage, safePdf, safeUrl, slug, splitLines, splitList } from './sanitize';
import { buildCss } from './css';
import { getTemplate } from './templates';

export interface RenderOptions {
  /** inline: images are embedded as data URLs · folder: images are written to assets/ */
  assets: 'inline' | 'folder';
  /** inline: <style> inside index.html · external: separate style.css */
  css: 'inline' | 'external';
}
export interface AssetFile { path: string; dataUrl: string }
export interface RenderResult { html: string; css: string; assets: AssetFile[]; options: RenderOptions }

const ind = (s: string, n = 1): string => s.split('\n').map((l) => (l ? '  '.repeat(n) + l : l)).join('\n');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function fmtDate(v: string): string {
  const m = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec((v ?? '').trim());
  return m ? `${MONTHS[Number(m[2]) - 1] ?? ''} ${m[1]}`.trim() : (v ?? '').trim();
}
export function range(a: string, b: string, open = 'Present'): string {
  const x = fmtDate(a);
  const y = fmtDate(b);
  return x ? `${x} – ${y || open}` : y;
}
const hasText = (o: object): boolean =>
  Object.entries(o).some(([k, v]) => k !== 'id' && typeof v === 'string' && v.trim() !== '');
const clamp = (n: number | null): number => Math.max(0, Math.min(100, Math.round(n ?? 0)));
const paras = (t: string): string[] =>
  (t ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`);
const bullets = (title: string, t: string): string[] => {
  const l = splitLines(t);
  return l.length ? [`<p><strong>${esc(title)}</strong></p>`, `<ul class="list">\n${l.map((x) => `  <li>${esc(x)}</li>`).join('\n')}\n</ul>`] : [];
};
const extLink = (label: string, url: string): string =>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

interface CardParts {
  image?: string; alt?: string; title?: string; sub?: string; meta?: string; text?: string;
  tags?: string[]; extra?: string[]; links?: [string, string][];
}
function card(c: CardParts): string {
  const parts: string[] = [];
  if (c.image) parts.push(`<img class="thumb" src="${esc(c.image)}" alt="${esc(c.alt)}" loading="lazy">`);
  if (c.title) parts.push(`<h3>${esc(c.title)}</h3>`);
  if (c.sub) parts.push(`<p class="sub">${esc(c.sub)}</p>`);
  if (c.meta) parts.push(`<p class="meta">${esc(c.meta)}</p>`);
  if (c.text) parts.push(...paras(c.text));
  if (c.tags?.length) parts.push(`<ul class="tags">\n${c.tags.map((t) => `  <li>${esc(t)}</li>`).join('\n')}\n</ul>`);
  parts.push(...(c.extra ?? []));
  const ls = (c.links ?? []).filter(([, u]) => safeUrl(u));
  if (ls.length) parts.push(`<p class="links">\n${ls.map(([l, u]) => `  ${extLink(l, safeUrl(u))}`).join('\n')}\n</p>`);
  return `<article class="card">\n${ind(parts.join('\n'))}\n</article>`;
}
const cards = (list: string[]): string => (list.length ? `<div class="cards">\n${ind(list.join('\n'))}\n</div>` : '');

function makeAssets(mode: RenderOptions['assets']) {
  const files: AssetFile[] = [];
  const add = (dataUrl: string, base: string): string => {
    if (mode === 'inline') return dataUrl;
    const mime = dataUrl.slice(5, dataUrl.indexOf(';'));
    const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'application/pdf' ? 'pdf' : mime.split('/')[1];
    const path = `assets/${base}.${ext}`;
    files.push({ path, dataUrl });
    return path;
  };
  return { files, add };
}

interface Sec { id: SectionKey; title: string; body: string }

function aboutHtml(d: PortfolioData): string {
  const a = d.about;
  const main = a.aboutMe.trim() || d.profile.bio.trim();
  const out = [
    ...(a.introduction.trim() ? [`<p class="lead">${esc(a.introduction.trim())}</p>`] : []),
    ...paras(main),
    ...(a.objective.trim() ? [`<h3>Career objective</h3>`, ...paras(a.objective)] : []),
  ];
  return out.join('\n');
}

function skillsHtml(d: PortfolioData): string {
  const list = SKILL_CATEGORIES.map((cat) => ({ cat, items: d.skills.filter((s) => s.category === cat && s.name.trim()) })).filter((g) => g.items.length);
  return cards(
    list.map((g) => {
      const meters = g.items.filter((s) => s.level != null);
      const extra = meters.length
        ? [`<ul class="meters">\n${meters.map((s) => `  <li><span>${esc(s.name)}</span><span class="bar" role="img" aria-label="${esc(s.name)} proficiency ${clamp(s.level)} percent"><i style="width:${clamp(s.level)}%"></i></span></li>`).join('\n')}\n</ul>`]
        : [];
      return card({ title: g.cat, tags: g.items.filter((s) => s.level == null).map((s) => s.name.trim()), extra });
    }),
  );
}

function contactHtml(d: PortfolioData, resumeHref: string): string {
  const p = d.profile;
  const items: string[] = [];
  if (isEmail(p.email)) items.push(`<a href="mailto:${esc(p.email.trim())}">${esc(p.email.trim())}</a>`);
  const tel = p.phone.replace(/[^\d+]/g, '');
  if (tel.length >= 6) items.push(`<a href="tel:${esc(tel)}">${esc(p.phone.trim())}</a>`);
  if (p.location.trim()) items.push(`<span>${esc(p.location.trim())}</span>`);
  if (resumeHref) items.push(`<a href="${esc(resumeHref)}" download="${esc(slug(p.resumeName.replace(/\.pdf$/i, '')) || 'resume')}.pdf">Download resume (PDF)</a>`);
  for (const l of d.socialLinks) {
    const u = safeUrl(l.url);
    if (!u) continue;
    let label = PLATFORM_LABELS[l.platform] ?? 'Link';
    if (l.platform === 'other') {
      try { label = new URL(u).hostname.replace(/^www\./, ''); } catch { /* keep generic label */ }
    }
    items.push(extLink(label, u));
  }
  return items.length ? `<ul class="contact">\n${items.map((x) => `  <li>${x}</li>`).join('\n')}\n</ul>` : '';
}

function buildSections(d: PortfolioData, add: (u: string, b: string) => string, resumeHref: string): Sec[] {
  const out: Sec[] = [];
  const push = (id: SectionKey, body: string) => {
    if (d.settings.visibleSections[id] !== false && body) out.push({ id, title: SECTION_LABELS[id], body });
  };
  const bodies: Record<SectionKey, string> = {
    about: aboutHtml(d),
    skills: skillsHtml(d),
    projects: cards(
      d.projects.map((p, i) => ({ p, i })).filter(({ p }) => hasText(p)).map(({ p, i }) => {
        const img = safeImage(p.image);
        return card({
          image: img ? add(img, `project-${i + 1}`) : '', alt: `Screenshot of ${p.name || 'the project'}`,
          title: p.name.trim(), meta: range(p.startDate, p.endDate), text: p.shortDescription,
          tags: splitList(p.technologies),
          extra: p.detailedDescription.trim()
            ? [`<details>\n  <summary>More about this project</summary>\n${ind(paras(p.detailedDescription).join('\n'))}\n</details>`]
            : [],
          links: [['GitHub', p.githubUrl], ['Live demo', p.liveUrl]],
        });
      }),
    ),
    experience: cards(
      d.experience.filter(hasText).map((x) =>
        card({
          title: x.role.trim() || x.organization.trim(), sub: x.role.trim() ? x.organization.trim() : '',
          meta: range(x.startDate, x.endDate), text: x.description,
          extra: [...bullets('Responsibilities', x.responsibilities), ...bullets('Achievements', x.achievements)],
        }),
      ),
    ),
    education: cards(
      d.education.filter(hasText).map((x) => {
        const head = [x.degree.trim(), x.field.trim()].filter(Boolean).join(' — ');
        return card({
          title: head || x.institution.trim(), sub: head ? x.institution.trim() : '',
          meta: [range(x.startYear, x.endYear), x.grade.trim() && `Grade: ${x.grade.trim()}`].filter(Boolean).join(' · '),
          text: x.description,
        });
      }),
    ),
    certificates: cards(
      d.certificates.map((c, i) => ({ c, i })).filter(({ c }) => hasText(c)).map(({ c, i }) => {
        const img = safeImage(c.image);
        return card({
          image: img ? add(img, `certificate-${i + 1}`) : '', alt: `Certificate: ${c.name || 'certificate'}`,
          title: c.name.trim(), sub: c.issuer.trim(),
          meta: [fmtDate(c.issueDate), c.credentialId.trim() && `ID: ${c.credentialId.trim()}`].filter(Boolean).join(' · '),
          links: [['Verify credential', c.credentialUrl]],
        });
      }),
    ),
    achievements: cards(
      d.achievements.filter(hasText).map((a) =>
        card({ title: a.title.trim(), meta: fmtDate(a.date), text: a.description, links: [['Learn more', a.url]] }),
      ),
    ),
    contact: contactHtml(d, resumeHref),
  };
  for (const id of SECTION_ORDER) push(id, bodies[id]);
  return out;
}

function heroHtml(d: PortfolioData, avatar: string): string {
  const p = d.profile;
  const raw = p.name.trim() || 'Your Name';
  const name = esc(raw);
  const title = esc(p.title.trim());
  const tag = esc(p.tagline.trim());
  const img = avatar
    ? `  <img class="avatar" src="${esc(avatar)}" alt="Photo of ${esc(p.name.trim() || 'the portfolio owner')}" width="160" height="160">\n`
    : '';
  if (getTemplate(d.settings.template).hero === 'terminal') {
    const n = Math.max(1, p.title.trim().length);
    return `<header>\n${img}  <p class="term">$ whoami<br>&gt; ${name}<br>$ cat role.txt</p>\n  <h1 class="glitch" data-t="${name}">${name}</h1>\n  <p><span class="role" style="--n:${n}">${title}</span><span class="cur"></span></p>\n${tag ? `  <p class="tag">${tag}</p>\n` : ''}</header>`;
  }
  return `<header>\n${img}  <h1>${name}</h1>\n${title ? `  <p class="sub role">${title}</p>\n` : ''}${tag ? `  <p class="tag">${tag}</p>\n` : ''}</header>`;
}

function favicon(name: string, accent: string): string {
  const letters = name.split(/\s+/).map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'P';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${accent}"/><text x="32" y="42" font-size="28" font-family="Arial" font-weight="700" text-anchor="middle" fill="#fff">${letters}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** The heart of PortfolioForge: PortfolioData + template + settings  ->  static HTML and CSS. */
export function renderPortfolio(
  d: PortfolioData,
  options: RenderOptions = { assets: 'inline', css: 'inline' },
): RenderResult {
  const assets = makeAssets(options.assets);
  const p = d.profile;
  const photo = safeImage(p.profileImage);
  const avatar = photo ? assets.add(photo, 'profile') : '';
  const pdf = safePdf(p.resume);
  const resumeHref = pdf ? assets.add(pdf, 'resume') : '';
  const sections = buildSections(d, assets.add, resumeHref);
  const css = buildCss(d);

  const name = p.name.trim() || 'Your Name';
  const title = [name, p.title.trim()].filter(Boolean).join(' — ');
  const desc = (p.tagline.trim() || p.bio.trim() || `Portfolio of ${name}`).slice(0, 160);
  const head = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    '<meta property="og:type" content="website">',
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<link rel="icon" href="${favicon(name, d.settings.accentColor.match(/^#[0-9a-f]{6}$/i) ? d.settings.accentColor : '#6d5efc')}">`,
    options.css === 'inline' ? `<style>\n${ind(css.trimEnd())}\n</style>` : '<link rel="stylesheet" href="style.css">',
  ].join('\n');

  const nav = sections.length
    ? `<nav aria-label="Sections">\n${sections.map((s) => `  <a href="#${s.id}">${esc(s.title)}</a>`).join('\n')}\n</nav>`
    : '';
  const main = `<main>\n${ind(sections.map((s) => `<section id="${s.id}">\n  <h2>${esc(s.title)}</h2>\n${ind(s.body)}\n</section>`).join('\n\n'))}\n</main>`;
  const footer = `<footer>\n  <p>© ${new Date().getFullYear()} ${esc(name)} · Static HTML + CSS portfolio made with PortfolioForge</p>\n</footer>`;
  const level = Math.max(0, ANIMATION_LEVELS.indexOf(d.settings.animationLevel));

  const html = [
    '<!DOCTYPE html>', '<html lang="en">', '<head>', ind(head), '</head>',
    `<body class="a${level}">`, heroHtml(d, avatar), nav, main, footer, '</body>', '</html>',
  ].filter(Boolean).join('\n') + '\n';

  return { html, css, assets: assets.files, options };
}
