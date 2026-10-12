import type { PortfolioData } from '../types/portfolio';
import { isEmail } from '../engine/sanitize';

export type StepKey =
  | 'template' | 'profile' | 'about' | 'education' | 'skills' | 'projects'
  | 'experience' | 'certificates' | 'achievements' | 'links' | 'customize' | 'publish';
export interface Issue { path: string; step: StepKey; message: string }

const isUrl = (s: string): boolean => /^https?:\/\/[^\s"'<>]+\.[^\s"'<>]+$/i.test(s.trim());
const blank = (o: object): boolean =>
  !Object.entries(o).some(([k, v]) => !['id', 'category', 'level', 'platform'].includes(k) && typeof v === 'string' && v.trim() !== '');
const URL_MSG = 'Start the link with https:// (for example https://github.com/you).';

/** Client-side validation. Keys look like "projects.0.githubUrl" so each field can show its own message. */
export function fieldErrors(d: PortfolioData): Record<string, string> {
  const e: Record<string, string> = {};
  const p = d.profile;
  if (!p.name.trim()) e['profile.name'] = 'Please enter your full name.';
  if (!p.title.trim()) e['profile.title'] = 'Add a professional title, for example “Frontend Developer”.';
  if (p.email.trim() && !isEmail(p.email)) e['profile.email'] = 'This email address looks incomplete.';
  if (p.phone.trim() && !/^[+()\d\s-]{6,20}$/.test(p.phone.trim())) e['profile.phone'] = 'Use digits, spaces, + or - only.';

  d.education.forEach((x, i) => {
    if (blank(x)) return;
    if (!x.institution.trim()) e[`education.${i}.institution`] = 'Add the name of your college or school.';
    for (const f of ['startYear', 'endYear'] as const) if (x[f].trim() && !/^\d{4}$/.test(x[f].trim())) e[`education.${i}.${f}`] = 'Use a 4-digit year, for example 2026.';
    if (/^\d{4}$/.test(x.startYear) && /^\d{4}$/.test(x.endYear) && x.endYear < x.startYear) e[`education.${i}.endYear`] = 'The end year cannot be before the start year.';
  });
  d.projects.forEach((x, i) => {
    if (blank(x)) return;
    if (!x.name.trim()) e[`projects.${i}.name`] = 'Give this project a name.';
    for (const f of ['githubUrl', 'liveUrl'] as const) if (x[f].trim() && !isUrl(x[f])) e[`projects.${i}.${f}`] = URL_MSG;
    if (x.startDate && x.endDate && x.endDate < x.startDate) e[`projects.${i}.endDate`] = 'The end date cannot be before the start date.';
  });
  d.experience.forEach((x, i) => {
    if (blank(x)) return;
    if (!x.organization.trim() && !x.role.trim()) e[`experience.${i}.organization`] = 'Add the organization or your role.';
    if (x.startDate && x.endDate && x.endDate < x.startDate) e[`experience.${i}.endDate`] = 'The end date cannot be before the start date.';
  });
  d.certificates.forEach((x, i) => {
    if (blank(x)) return;
    if (!x.name.trim()) e[`certificates.${i}.name`] = 'Give this certificate a name.';
    if (x.credentialUrl.trim() && !isUrl(x.credentialUrl)) e[`certificates.${i}.credentialUrl`] = URL_MSG;
  });
  d.achievements.forEach((x, i) => {
    if (blank(x)) return;
    if (!x.title.trim()) e[`achievements.${i}.title`] = 'Give this achievement a title.';
    if (x.url.trim() && !isUrl(x.url)) e[`achievements.${i}.url`] = URL_MSG;
  });
  d.socialLinks.forEach((x, i) => {
    if (x.url.trim() && !isUrl(x.url)) e[`socialLinks.${i}.url`] = URL_MSG;
  });
  return e;
}

export function stepOf(path: string): StepKey {
  const k = path.split('.')[0];
  return k === 'socialLinks' ? 'links' : (k as StepKey);
}
export const issuesOf = (d: PortfolioData): Issue[] =>
  Object.entries(fieldErrors(d)).map(([path, message]) => ({ path, step: stepOf(path), message }));
