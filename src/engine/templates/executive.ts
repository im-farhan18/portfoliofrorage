import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'executive',
  name: 'Executive',
  category: 'Professional',
  theme: 'light',
  accent: '#1e3a8a',
  font: 'serif',
  hero: 'standard',
  css: `
    header {
      padding-top:calc(var(--gap)*1.2);
      border-bottom:2px solid var(--tx)
    }

    h1 {
      letter-spacing:-.03em
    }

    .role {
      font-size:1.3rem
    }

    .tag {
      color:var(--mu)
    }

    nav {
      border-bottom:1px solid var(--bd)
    }

    nav a {
      color:var(--tx);
      font-size:.8rem;
      text-transform:uppercase;
      letter-spacing:.12em
    }

    main section {
      display:grid;
      grid-template-columns:minmax(120px,200px) 1fr;
      gap:2rem;
      border-top:1px solid var(--bd);
      animation:rise .6s both
    }

    main section:first-child {
      border:0
    }

    main section>h2 {
      font-size:.8rem;
      text-transform:uppercase;
      letter-spacing:.15em;
      color:var(--mu)
    }

    .cards {
      grid-template-columns:1fr
    }

    .card {
      background:none;
      border:0;
      border-bottom:1px solid var(--bd);
      border-radius:0;
      padding:0 0 1.2rem
    }

    @keyframes rise {
      from {
        opacity:0
      }
    }

    @media(max-width:640px) {
      main section {
        display:block
      }
    }

    header {
      border-bottom:0;
      border-top:8px solid var(--ac);
      background:var(--sf)
    }

    h1 {
      font-size:clamp(2rem,5vw,3.4rem)
    }
  `,
};

export default template;
