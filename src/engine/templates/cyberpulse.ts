import type { TemplateDef } from '../../types/portfolio';

const template: TemplateDef = {
  id: 'cyberpulse',
  name: 'CyberPulse',
  category: 'Futuristic',
  theme: 'dark',
  accent: '#00f6ff',
  font: 'mono',
  hero: 'terminal',
  css: `
    body::before {
      content:"";
      position:fixed;
      inset:0;
      z-index:-1;
      background:linear-gradient(var(--bd) 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,var(--bd) 1px,transparent 1px) 0 0/44px 44px;
      animation:grid 6s linear infinite
    }

    body::after {
      content:"";
      display:none;
      position:fixed;
      left:0;
      right:0;
      top:-15%;
      height:15%;
      pointer-events:none;
      background:linear-gradient(transparent,color-mix(in srgb,var(--ac) 16%,transparent),transparent);
      animation:scan 7s linear infinite
    }

    .a2::after,.a3::after {
      display:block
    }

    h1 {
      position:relative;
      text-shadow:0 0 18px var(--ac)
    }

    .tag {
      color:var(--mu)
    }

    .glitch::before,.glitch::after {
      content:attr(data-t);
      position:absolute;
      left:0;
      top:0;
      opacity:0
    }

    .a3 .glitch::before {
      color:#ff2bd6;
      animation:gl 3s steps(1) infinite
    }

    .a3 .glitch::after {
      color:#7c4dff;
      animation:gl 3s .1s steps(1) infinite reverse
    }

    h2 {
      color:var(--ac);
      text-transform:uppercase;
      letter-spacing:.15em;
      font-size:1rem
    }

    h2::before {
      content:"// "
    }

    .card {
      background:color-mix(in srgb,var(--sf) 82%,transparent);
      border-color:var(--ac);
      box-shadow:0 0 14px color-mix(in srgb,var(--ac) 30%,transparent);
      transition:transform .25s
    }

    .card:hover {
      transform:translateY(-4px)
    }

    .term {
      border:1px solid var(--ac);
      border-radius:6px;
      padding:1rem;
      background:#000b;
      color:#7dffb2;
      display:inline-block
    }

    .role {
      display:inline-block;
      overflow:hidden;
      white-space:nowrap;
      max-width:100%;
      vertical-align:bottom;
      width:calc(var(--n)*1ch);
      color:#ff2bd6;
      animation:type 2.4s steps(var(--n)) both
    }

    .cur {
      display:inline-block;
      width:.6ch;
      height:1.1em;
      margin-left:.3ch;
      background:var(--ac);
      vertical-align:-.15em;
      animation:blink 1s steps(1) infinite
    }

    main section {
      animation:rise .8s both
    }

    @keyframes grid {
      to {
        background-position:0 44px,44px 0
      }
    }

    @keyframes scan {
      to {
        top:105%
      }
    }

    @keyframes blink {
      50% {
        opacity:0
      }
    }

    @keyframes type {
      from {
        width:0
      }
    }

    @keyframes rise {
      from {
        opacity:0;
        transform:translateY(16px)
      }
    }

    @keyframes gl {
      0%,92% {
        opacity:0;
        transform:none
      }
      93% {
        opacity:.8;
        transform:translate(-3px,1px)
      }
      96% {
        opacity:.8;
        transform:translate(3px,-1px)
      }
      100% {
        opacity:0
      }
    }
  `,
};

export default template;
