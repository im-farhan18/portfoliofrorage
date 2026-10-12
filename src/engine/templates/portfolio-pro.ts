import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'portfolio-pro',
  name: 'Portfolio Pro',
  category: 'Professional',
  theme: 'light',
  accent: '#0f766e',
  font: 'sans',
  hero: 'standard',
  css: `
    header {
      margin-top:2rem;
      padding-left:1.5rem;
      border-left:6px solid var(--ac)
    }

    .card {
      box-shadow:0 1px 3px #0001
    }

    main section>h2 {
      display:inline-block;
      padding-bottom:.2rem;
      border-bottom:2px solid var(--ac)
    }
  `,
};

export default template;
