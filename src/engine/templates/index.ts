import type { TemplateCategory, TemplateDef } from '../../types/portfolio';
import cyberpulse from './cyberpulse';
import glassflow from './glassflow';
import aurora from './aurora';
import neonTerminal from './neon-terminal';
import nexus from './nexus';
import minimalPro from './minimal-pro';
import executive from './executive';
import bentoDev from './bento-dev';
import mono from './mono';
import creativeGrid from './creative-grid';
import devstack from './devstack';
import portfolioPro from './portfolio-pro';
import futura from './futura';
import softtech from './softtech';
import orbit from './orbit';
import sunsetGlass from './sunset-glass';
import oceanGlass from './ocean-glass';

/** Template registry. Add a file here + one line below to create a new template. */
export const TEMPLATES: TemplateDef[] = [
  cyberpulse,
  glassflow,
  aurora,
  neonTerminal,
  nexus,
  minimalPro,
  executive,
  bentoDev,
  mono,
  creativeGrid,
  devstack,
  portfolioPro,
  futura,
  softtech,
  orbit,
  sunsetGlass,
  oceanGlass,
];

export const CATEGORIES: ('All' | TemplateCategory)[] = ['All', 'Developer', 'Professional', 'Creative', 'Futuristic', 'Minimal'];

export function getTemplate(id: string): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
