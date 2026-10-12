import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'futura',
  name: 'Futura',
  category: 'Futuristic',
  theme: 'dark',
  accent: '#a78bfa',
  font: 'sans',
  hero: 'standard',
  css: `
    body {
      background:radial-gradient(52rem 38rem at 8% -8%,#a78bfa44,transparent),radial-gradient(46rem 30rem at 100% 25%,#22d3ee33,transparent),radial-gradient(40rem 28rem at 35% 112%,#a78bfa44,transparent),var(--bg);
      background-attachment:fixed
    }

    h1,h2 {
      text-transform:uppercase;
      letter-spacing:.12em
    }

    h1 {
      font-weight:300
    }

    .card {
      background:color-mix(in srgb,var(--tx) 5%,transparent);
      border:1px solid var(--ac);
      border-radius:0;
      clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px));
      transition:background .3s
    }

    .card:hover {
      background:color-mix(in srgb,var(--ac) 14%,transparent)
    }

    .tags li {
      border-radius:0
    }
  `,
};

export default template;
