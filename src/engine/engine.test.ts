import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { TEMPLATES } from './templates';
import { renderPortfolio } from './render';
import { checkExport } from './check';
import { buildZipBytes, generatePortfolio } from './export';
import { formatCss } from './formatCss';
import { applyTemplate, demoData, emptyData } from '../data/demo';
import type { PortfolioData } from '../types/portfolio';

const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const minimal = (): PortfolioData => {
  const d = emptyData();
  d.profile.name = 'Sam Lee';
  d.profile.title = 'Student';
  d.skills = [{ id: '1', name: 'HTML', category: 'Frontend', level: null }];
  d.projects = [{ id: 'p', name: 'Site', shortDescription: '', detailedDescription: '', technologies: '', githubUrl: '', liveUrl: '', image: '', startDate: '', endDate: '' }];
  return d;
};
const full = (): PortfolioData => {
  const d = demoData();
  d.profile.profileImage = PNG;
  d.projects[0].image = PNG;
  d.certificates[0].image = PNG;
  d.skills[0].level = 80;
  return d;
};
const sets: [string, () => PortfolioData][] = [['full data', full], ['minimal data', minimal], ['empty data', () => emptyData()]];

describe('there are at least 15 templates', () => {
  it('has 15+ unique templates', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(15);
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(TEMPLATES.length);
  });
});

describe.each(TEMPLATES.map((t) => [t.id] as const))('template %s', (id) => {
  it.each(sets)('renders valid static output with %s', (_n, make) => {
    const d = applyTemplate(make(), id);
    for (const options of [{ assets: 'inline', css: 'inline' }, { assets: 'folder', css: 'external' }] as const) {
      const r = renderPortfolio(d, options);
      const failed = checkExport(r).filter((c) => !c.ok).map((c) => c.label);
      expect(failed).toEqual([]);
      expect(r.html).not.toMatch(/<script/i);
      expect(r.css).toContain('--ac:');
    }
  });
  it('hides empty sections instead of showing placeholders', () => {
    const html = renderPortfolio(applyTemplate(minimal(), id)).html;
    for (const s of ['experience', 'education', 'certificates', 'achievements']) expect(html).not.toContain(`id="${s}"`);
    expect(html).not.toMatch(/None|undefined|null/);
  });
});

describe('safety', () => {
  it('escapes HTML typed by the user', () => {
    const d = minimal();
    d.profile.name = '<script>alert(1)</script>';
    d.profile.tagline = '"><img src=x onerror=alert(1)>';
    const r = renderPortfolio(d);
    expect(r.html).not.toMatch(/<script/i);
    expect(r.html).toContain('&lt;script&gt;');
    expect(checkExport(r).every((c) => c.ok)).toBe(true);
  });
  it('drops javascript: and data: links', () => {
    const d = full();
    d.projects[0].githubUrl = 'javascript:alert(1)';
    d.socialLinks[0].url = 'data:text/html;base64,PHNjcmlwdD4=';
    const r = renderPortfolio(d);
    expect(r.html).not.toMatch(/javascript:/i);
    expect(r.html).not.toContain('data:text/html');
  });
});

describe('features', () => {
  it('keeps all data when the template changes', () => {
    const d = full();
    const a = renderPortfolio(applyTemplate(d, TEMPLATES[0].id)).html;
    const b = renderPortfolio(applyTemplate(d, TEMPLATES[5].id)).html;
    for (const text of ['Alex Morgan', 'TaskBoard', 'WeatherNow', 'Sample University', 'Responsive Web Design (sample)']) {
      expect(a).toContain(text);
      expect(b).toContain(text);
    }
  });
  it('respects hidden sections and animation level', () => {
    const d = full();
    d.settings.visibleSections.projects = false;
    d.settings.animationLevel = 'off';
    const html = renderPortfolio(d).html;
    expect(html).not.toContain('id="projects"');
    expect(html).toContain('<body class="a0">');
  });
  it('writes the accent colour and font into the CSS', () => {
    const d = full();
    d.settings.accentColor = '#ff0066';
    d.settings.font = 'serif';
    const css = renderPortfolio(d).css;
    expect(css).toContain('--ac:#ff0066');
    expect(css).toContain('Georgia');
  });
  it('ZIP has index.html, style.css and every referenced asset', async () => {
    const zip = await JSZip.loadAsync(await buildZipBytes(full()));
    const html = await zip.file('index.html')!.async('string');
    expect(zip.file('style.css')).toBeTruthy();
    const refs = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map((m) => m[1]);
    expect(refs.length).toBeGreaterThanOrEqual(3);
    for (const r of refs) expect(zip.file(r), r).toBeTruthy();
    expect(html).not.toMatch(/<script/i);
  });
  it('generatePortfolio passes every check', () => expect(generatePortfolio(full()).ok).toBe(true));
  it('formats CSS with balanced braces', () => {
    const css = formatCss('a{color:red;background:url(data:image/png;base64,AA==)}@media (x){b{c:d}}');
    expect((css.match(/{/g) ?? []).length).toBe((css.match(/}/g) ?? []).length);
    expect(css).toContain('url(data:image/png;base64,AA==)');
  });
});
