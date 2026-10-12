import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'softtech',
  name: 'SoftTech',
  category: 'Creative',
  theme: 'light',
  accent: '#8b5cf6',
  font: 'rounded',
  hero: 'standard',
  css: `
    body {
      background:radial-gradient(52rem 38rem at 8% -8%,#c4b5fd99,transparent),radial-gradient(46rem 30rem at 100% 25%,#fbcfe899,transparent),radial-gradient(40rem 28rem at 35% 112%,#a5f3fc99,transparent),var(--bg);
      background-attachment:fixed
    }

    header {
      margin-top:1.5rem;
      padding:3rem 2rem;
      border-radius:28px;
      background:color-mix(in srgb,var(--tx) 7%,transparent);
      border:1px solid color-mix(in srgb,var(--tx) 16%,transparent)
    }

    .card {
      border:0;
      border-radius:28px;
      background:#ffffffaa;
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      box-shadow:0 12px 30px #8b5cf622;
      transition:transform .3s
    }

    .card:hover {
      transform:translateY(-4px)
    }
  `,
};

export default template;
