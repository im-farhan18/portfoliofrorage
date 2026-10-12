import type { PortfolioData } from '../../types/portfolio';
import type { StepKey } from '../../lib/validate';

export interface StepMeta { key: StepKey; title: string; hint: string; optional?: boolean }

export const STEPS: StepMeta[] = [
  { key: 'template', title: 'Template', hint: 'Pick a look. You can switch at any time and your details stay.' },
  { key: 'profile', title: 'Profile', hint: 'The basics visitors see first.' },
  { key: 'about', title: 'About', hint: 'A short introduction and what you are good at.' },
  { key: 'education', title: 'Education', hint: 'Your college, school or courses.' },
  { key: 'skills', title: 'Skills', hint: 'Add the tools and languages you know.' },
  { key: 'projects', title: 'Projects', hint: 'Your best work. Recruiters usually open this first.' },
  { key: 'experience', title: 'Experience', hint: 'Internships, jobs or volunteering. None yet? Skip this step.', optional: true },
  { key: 'certificates', title: 'Certificates', hint: 'Courses and certifications you completed.', optional: true },
  { key: 'achievements', title: 'Achievements', hint: 'Awards, hackathons, rankings.', optional: true },
  { key: 'links', title: 'Social links', hint: 'Where people can find you online.' },
  { key: 'customize', title: 'Customize', hint: 'Theme, accent colour, font, spacing and animation.' },
  { key: 'publish', title: 'Generate', hint: 'Create your static portfolio and download it.' },
];

export function isComplete(key: StepKey, d: PortfolioData): boolean {
  switch (key) {
    case 'profile': return !!d.profile.name.trim() && !!d.profile.title.trim();
    case 'about': return !!(d.about.aboutMe.trim() || d.profile.bio.trim());
    case 'education': return d.education.some((x) => x.institution.trim());
    case 'skills': return d.skills.length > 0;
    case 'projects': return d.projects.some((x) => x.name.trim());
    case 'experience': return d.experience.length > 0;
    case 'certificates': return d.certificates.length > 0;
    case 'achievements': return d.achievements.length > 0;
    case 'links': return d.socialLinks.some((l) => l.url.trim());
    default: return false;
  }
}
