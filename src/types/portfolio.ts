/** Strongly typed data model. Every template renders the same PortfolioData. */
export type ThemeMode = 'light' | 'dark' | 'auto';
export type Density = 'compact' | 'balanced' | 'spacious';
export type AnimationLevel = 'off' | 'subtle' | 'standard' | 'high';
export type FontKey = 'sans' | 'serif' | 'mono' | 'rounded';
export type SectionKey =
  | 'about' | 'skills' | 'projects' | 'experience'
  | 'education' | 'certificates' | 'achievements' | 'contact';
export type SkillCategory = 'Frontend' | 'Backend' | 'Programming' | 'Database' | 'Tools' | 'Other';
export type SocialPlatform = 'github' | 'linkedin' | 'instagram' | 'youtube' | 'twitter' | 'website' | 'other';
export type TemplateCategory = 'Developer' | 'Professional' | 'Creative' | 'Futuristic' | 'Minimal';

export interface Profile {
  name: string; title: string; tagline: string; bio: string;
  email: string; phone: string; location: string;
  /** data URL of the (resized) profile photo, or '' */
  profileImage: string;
  /** data URL of a PDF resume, or '' */
  resume: string;
  resumeName: string;
}
export interface About { aboutMe: string; objective: string; introduction: string }
export interface Education {
  id: string; institution: string; degree: string; field: string;
  startYear: string; endYear: string; grade: string; description: string;
}
export interface Skill { id: string; name: string; category: SkillCategory; level: number | null }
export interface Project {
  id: string; name: string; shortDescription: string; detailedDescription: string;
  /** comma separated */
  technologies: string; githubUrl: string; liveUrl: string; image: string;
  startDate: string; endDate: string;
}
export interface Experience {
  id: string; organization: string; role: string; startDate: string; endDate: string;
  description: string; /** one per line */ responsibilities: string; /** one per line */ achievements: string;
}
export interface Certificate {
  id: string; name: string; issuer: string; issueDate: string;
  credentialId: string; credentialUrl: string; image: string;
}
export interface Achievement { id: string; title: string; description: string; date: string; url: string }
export interface SocialLink { id: string; platform: SocialPlatform; url: string }

export interface Settings {
  template: string;
  theme: ThemeMode;
  accentColor: string;
  font: FontKey;
  layout: Density;
  animationLevel: AnimationLevel;
  visibleSections: Record<SectionKey, boolean>;
}

export interface PortfolioData {
  profile: Profile;
  about: About;
  education: Education[];
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  certificates: Certificate[];
  achievements: Achievement[];
  socialLinks: SocialLink[];
  settings: Settings;
}

/** A saved portfolio (one entry on the "My Portfolios" page). */
export interface PortfolioRecord {
  id: string; name: string; createdAt: string; updatedAt: string; data: PortfolioData;
}

export interface TemplateDef {
  id: string;
  name: string;
  category: TemplateCategory;
  /** default look applied when the template is chosen */
  theme: 'light' | 'dark';
  accent: string;
  font: FontKey;
  hero: 'standard' | 'terminal';
  /** template-specific CSS; shared tokens (--bg --sf --tx --mu --bd --ac) come from the base styles */
  css: string;
}
