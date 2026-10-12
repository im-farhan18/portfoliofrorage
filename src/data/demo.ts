import type { PortfolioData, SectionKey, Settings } from '../types/portfolio';
import { SECTION_ORDER } from '../engine/options';
import { getTemplate } from '../engine/templates';

export const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const allSections = (): Record<SectionKey, boolean> =>
  Object.fromEntries(SECTION_ORDER.map((k) => [k, true])) as Record<SectionKey, boolean>;

export function settingsFor(templateId: string): Settings {
  const t = getTemplate(templateId);
  return { template: t.id, theme: t.theme, accentColor: t.accent, font: t.font, layout: 'balanced', animationLevel: 'standard', visibleSections: allSections() };
}

/** Switching template changes the design only. All student data is kept. */
export function applyTemplate(d: PortfolioData, templateId: string): PortfolioData {
  const t = getTemplate(templateId);
  return { ...d, settings: { ...d.settings, template: t.id, theme: t.theme, accentColor: t.accent, font: t.font } };
}

/** Same data, shown in another template's native look (used for gallery thumbnails). */
export function previewAs(d: PortfolioData, templateId: string): PortfolioData {
  const a = applyTemplate(d, templateId);
  return { ...a, settings: { ...a.settings, animationLevel: 'off' } };
}

export function emptyData(templateId = 'cyberpulse'): PortfolioData {
  return {
    profile: { name: '', title: '', tagline: '', bio: '', email: '', phone: '', location: '', profileImage: '', resume: '', resumeName: '' },
    about: { aboutMe: '', objective: '', introduction: '' },
    education: [], skills: [], projects: [], experience: [], certificates: [], achievements: [], socialLinks: [],
    settings: settingsFor(templateId),
  };
}

/** Fills gaps so portfolios saved by older versions never crash newer ones. */
export function mergeData(p: Partial<PortfolioData> | undefined): PortfolioData {
  const base = emptyData();
  const s = { ...base.settings, ...(p?.settings ?? {}) };
  return {
    ...base, ...p,
    profile: { ...base.profile, ...(p?.profile ?? {}) },
    about: { ...base.about, ...(p?.about ?? {}) },
    education: p?.education ?? [], skills: p?.skills ?? [], projects: p?.projects ?? [], experience: p?.experience ?? [],
    certificates: p?.certificates ?? [], achievements: p?.achievements ?? [], socialLinks: p?.socialLinks ?? [],
    settings: { ...s, visibleSections: { ...allSections(), ...(p?.settings?.visibleSections ?? {}) } },
  };
}

/** Fictional sample content (clearly labelled as sample). */
export function demoData(templateId = 'cyberpulse'): PortfolioData {
  const id = newId;
  return {
    ...emptyData(templateId),
    profile: {
      name: 'Alex Morgan', title: 'Frontend Developer', tagline: 'I turn ideas into fast, accessible interfaces.',
      bio: 'Sample data. Replace this with your own details.', email: 'alex.morgan@example.com', phone: '', location: 'Sample City',
      profileImage: '', resume: '', resumeName: '',
    },
    about: {
      introduction: 'Hi, I am Alex. Welcome to my portfolio.',
      aboutMe: 'I am a second-year BCA student who enjoys building responsive, accessible web pages and learning how the web works. (Sample text: replace it with your own.)',
      objective: 'To start a career as a frontend developer in a product-focused team and keep learning every day.',
    },
    education: [{ id: id(), institution: 'Sample University', degree: 'BCA', field: 'Computer Applications', startYear: '2024', endYear: '2027', grade: '', description: 'Focus on web technologies, programming and databases.' }],
    skills: [
      ...['HTML', 'CSS', 'JavaScript', 'React'].map((name) => ({ id: id(), name, category: 'Frontend' as const, level: null })),
      { id: id(), name: 'Node.js', category: 'Backend', level: null },
      { id: id(), name: 'SQL', category: 'Database', level: null },
      { id: id(), name: 'C++', category: 'Programming', level: null },
      { id: id(), name: 'Git', category: 'Tools', level: null },
    ],
    projects: [
      { id: id(), name: 'TaskBoard', shortDescription: 'Sample project: a simple kanban board that remembers your tasks.', detailedDescription: 'Sample details: drag-free columns, keyboard friendly, and saved in the browser.', technologies: 'HTML, CSS, JavaScript', githubUrl: 'https://github.com/', liveUrl: '', image: '', startDate: '2025-01', endDate: '2025-02' },
      { id: id(), name: 'WeatherNow', shortDescription: 'Sample project: a city weather dashboard that uses a public API.', detailedDescription: '', technologies: 'React, REST API', githubUrl: 'https://github.com/', liveUrl: 'https://example.com/', image: '', startDate: '2025-03', endDate: '2025-04' },
      { id: id(), name: 'ShopLite', shortDescription: 'Sample project: a small product catalogue with a shopping cart.', detailedDescription: '', technologies: 'React, Node.js, SQL', githubUrl: '', liveUrl: '', image: '', startDate: '2025-06', endDate: '' },
      { id: id(), name: 'CodeQuiz', shortDescription: 'Sample project: a quiz app for practising programming questions.', detailedDescription: '', technologies: 'TypeScript, React', githubUrl: 'https://github.com/', liveUrl: '', image: '', startDate: '2025-08', endDate: '2025-09' },
    ],
    experience: [{ id: id(), organization: 'Sample Web Club', role: 'Volunteer Web Developer', startDate: '2025-06', endDate: '2025-12', description: 'Sample entry: helped build and maintain the club website.', responsibilities: 'Built responsive pages with HTML and CSS\nFixed layout bugs reported by members', achievements: 'Delivered the event page on time' }],
    certificates: [
      { id: id(), name: 'Responsive Web Design (sample)', issuer: 'Sample Academy', issueDate: '2025-03', credentialId: '', credentialUrl: '', image: '' },
      { id: id(), name: 'JavaScript Fundamentals (sample)', issuer: 'Sample Academy', issueDate: '2025-07', credentialId: '', credentialUrl: '', image: '' },
    ],
    achievements: [{ id: id(), title: 'College Hackathon Participant (sample)', description: 'Sample entry: worked in a team to build a prototype in one day.', date: '2025-09', url: '' }],
    socialLinks: [
      { id: id(), platform: 'github', url: 'https://github.com/' },
      { id: id(), platform: 'linkedin', url: 'https://www.linkedin.com/' },
    ],
  };
}
