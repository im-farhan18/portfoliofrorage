import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'creative-grid',
  name: 'Creative Grid',
  category: 'Creative',
  theme: 'light',
  accent: '#ff4d6d',
  font: 'rounded',
  hero: 'standard',
  css: `
    .cards {
      display:block;
      columns:2 250px;
      column-gap:1rem
    }

    .card {
      break-inside:avoid;
      margin-bottom:1rem
    }

    h1 {
      font-size:clamp(3rem,11vw,8rem);
      line-height:.9;
      letter-spacing:-.04em
    }

    .card {
      border:2px solid var(--tx);
      border-radius:6px;
      box-shadow:6px 6px 0 var(--ac);
      transition:transform .25s
    }

    .card:nth-child(odd) {
      transform:rotate(-1deg)
    }

    .card:nth-child(even) {
      transform:rotate(1deg)
    }

    .card:hover {
      transform:none
    }

    main section>h2 {
      font-size:2rem
    }
  `,
};

export default template;
