import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'devstack',
  name: 'DevStack',
  category: 'Developer',
  theme: 'dark',
  accent: '#38bdf8',
  font: 'mono',
  hero: 'standard',
  css: `
    body {
      background:var(--sf)
    }

    header {
      margin-top:1.25rem;
      padding:2.5rem 2rem;
      background:var(--bg);
      border:1px solid var(--bd);
      border-radius:24px
    }

    nav a {
      padding:.3rem .9rem;
      background:var(--bg);
      border:1px solid var(--bd);
      border-radius:99px;
      text-decoration:none
    }

    main {
      display:grid;
      grid-template-columns:repeat(6,1fr);
      gap:1rem
    }

    main section {
      grid-column:span 3;
      padding:1.5rem;
      background:var(--bg);
      border:1px solid var(--bd);
      border-radius:24px;
      transition:transform .25s,box-shadow .25s
    }

    main section:hover {
      transform:translateY(-3px);
      box-shadow:0 14px 34px #0002
    }

    #projects,main section:last-child {
      grid-column:1/-1
    }

    .card {
      border-radius:16px
    }

    .role {
      font-size:1.2rem
    }

    @media(max-width:760px) {
      main {
        display:block
      }
      main section {
        margin-bottom:1rem
      }
    }

    body {
      background:var(--bg)
    }

    header,main section {
      background:var(--sf)
    }

    h2::before {
      content:"<"
    }

    h2::after {
      content:" />"
    }

    .tags li {
      border-radius:6px;
      border-color:var(--ac);
      background:color-mix(in srgb,var(--ac) 14%,transparent)
    }
  `,
};

export default template;
