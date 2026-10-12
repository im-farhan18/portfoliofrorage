import type { AnimationLevel, Density, FontKey, SectionKey, SkillCategory, SocialPlatform } from '../types/portfolio';

export const FONT_STACKS: Record<FontKey, string> = {
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "Cascadia Code", Menlo, Consolas, monospace',
  rounded: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};
export const FONT_LABELS: Record<FontKey, string> = {
  sans: 'Modern sans', serif: 'Editorial serif', mono: 'Code mono', rounded: 'Friendly rounded',
};
export const GAPS: Record<Density, string> = { compact: '2.5rem', balanced: '4rem', spacious: '6rem' };
export const PALETTE: Record<'light' | 'dark', string> = {
  light: '--bg:#ffffff;--sf:#f4f5f9;--tx:#14151c;--mu:#5a6072;--bd:#dde0ea',
  dark: '--bg:#07080d;--sf:#10131e;--tx:#eef1fa;--mu:#9aa2ba;--bd:#252b42',
};
export const SECTION_ORDER: SectionKey[] = [
  'about', 'skills', 'projects', 'experience', 'education', 'certificates', 'achievements', 'contact',
];
export const SECTION_LABELS: Record<SectionKey, string> = {
  about: 'About', skills: 'Skills', projects: 'Projects', experience: 'Experience',
  education: 'Education', certificates: 'Certificates', achievements: 'Achievements', contact: 'Contact',
};
export const ANIMATION_LEVELS: AnimationLevel[] = ['off', 'subtle', 'standard', 'high'];
export const SKILL_CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'Programming', 'Database', 'Tools', 'Other'];
export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram', youtube: 'YouTube',
  twitter: 'X / Twitter', website: 'Website', other: 'Link',
};
export const ACCENT_PRESETS = [
  { name: 'Blue', value: '#3b82f6' }, { name: 'Purple', value: '#8b5cf6' }, { name: 'Cyan', value: '#06b6d4' },
  { name: 'Magenta', value: '#ec4899' }, { name: 'Green', value: '#22c55e' }, { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
];
