import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'orbit',
  name: 'Orbit',
  category: 'Futuristic',
  theme: 'dark',
  accent: '#7dd3fc',
  font: 'sans',
  hero: 'standard',
  css: `
    body {
      background:radial-gradient(60rem 40rem at 10% -10%,color-mix(in srgb,var(--ac) 45%,transparent),transparent),radial-gradient(50rem 30rem at 100% 20%,#00d4ff55,transparent),var(--bg);
      background-attachment:fixed
    }

    body::before {
      content:"";
      position:fixed;
      z-index:-1;
      top:40%;
      left:-8rem;
      width:26rem;
      height:26rem;
      border-radius:50%;
      background:var(--ac);
      filter:blur(110px);
      opacity:.25;
      animation:float 12s ease-in-out infinite alternate
    }

    h1 {
      background:linear-gradient(90deg,var(--tx),var(--ac));
      -webkit-background-clip:text;
      background-clip:text;
      color:transparent
    }

    nav a {
      padding:.35rem .9rem;
      border-radius:99px;
      color:var(--tx);
      text-decoration:none;
      background:color-mix(in srgb,var(--tx) 8%,transparent)
    }

    .card {
      background:color-mix(in srgb,var(--tx) 7%,transparent);
      backdrop-filter:blur(16px);
      -webkit-backdrop-filter:blur(16px);
      border:1px solid color-mix(in srgb,var(--tx) 16%,transparent);
      border-radius:20px;
      box-shadow:0 10px 40px #0004;
      transition:transform .3s
    }

    .card:hover {
      transform:translateY(-4px) scale(1.01)
    }

    main section {
      animation:rise .7s both
    }

    @keyframes float {
      to {
        transform:translate(8rem,-6rem)
      }
    }

    @keyframes rise {
      from {
        opacity:0;
        transform:translateY(12px)
      }
    }

    header {
      text-align:center
    }

    nav,.tags,.contact {
      justify-content:center
    }

    main section>h2 {
      text-align:center
    }

    body {
      background:radial-gradient(#fff 1px,transparent 1.5px) 0 0/90px 90px,radial-gradient(#9cf 1px,transparent 1.5px) 40px 55px/130px 130px,radial-gradient(60rem 40rem at 70% -10%,#4338ca77,transparent),#05060f;
      animation:tw 8s linear infinite
    }

    header {
      position:relative
    }

    header::after {
      content:"";
      position:absolute;
      right:3%;
      top:2rem;
      width:11rem;
      height:11rem;
      border:1px dashed var(--ac);
      border-radius:50%;
      opacity:.45;
      animation:spin 30s linear infinite
    }

    @keyframes tw {
      to {
        background-position:90px 90px,170px 185px,0 0,0 0
      }
    }

    @keyframes spin {
      to {
        transform:rotate(360deg)
      }
    }
  `,
};

export default template;
