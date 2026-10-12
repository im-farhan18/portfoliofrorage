# PortfolioForge

**A no-code portfolio generator for students.** Fill in a guided form, pick a template, customize the look, preview it live and download a professional portfolio website.

The key rule of the project: **PortfolioForge (the builder) is a modern React app, but the portfolio it generates is plain HTML + CSS with zero JavaScript.** It opens offline by double-clicking `index.html`.

## Run it in VS Code

1. Install [Node.js](https://nodejs.org) 18 or newer (LTS recommended). Check with `node -v`.
2. In VS Code: **File → Open Folder…** and choose this `portfolioforge` folder. Accept the "install recommended extensions" prompt (Tailwind CSS IntelliSense, Prettier).
3. Open the terminal (**Ctrl + `**) and run:

```bash
npm install
npm run dev
```

4. Open the address shown in the terminal (normally <http://localhost:5173>).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the app with hot reload |
| `npm run build` | Type-check and create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript check only |
| `npm test` | Run all tests (template engine + UI flows) |

## Problem and solution

In the Advanced Web Technology subject students are expected to have a professional portfolio, but many cannot build one because it needs HTML, CSS, JavaScript, responsive design and hosting skills. PortfolioForge removes that barrier: the student only fills in a form.

## Features

- Landing page, **template gallery with live mini-previews**, filters (Developer, Professional, Creative, Futuristic, Minimal)
- **17 genuinely different templates** (CyberPulse, Glassflow, Aurora, Neon Terminal, Nexus, Minimal Pro, Executive, Bento Dev, Mono, Creative Grid, DevStack, Portfolio Pro, Futura, SoftTech, Orbit, Sunset Glass, Ocean Glass)
- 12-step wizard with progress, autosave and "Saved just now"
- Profile photo, project and certificate images, PDF resume
- Skills with optional proficiency, repeatable education / projects / experience / certificates / achievements (with move up/down)
- Live preview with desktop / tablet / mobile sizes (the preview iframe has **no script permission**, like the real output)
- Customization: theme (light, dark, auto), accent colour, font, spacing, animation level (off, subtle, standard, high), show/hide sections
- Validation with friendly messages; empty sections disappear automatically
- **Static export**: single `index.html`, or ZIP with `index.html` + `style.css` + `assets/`
- **Automatic no-JavaScript check** on every export (no `<script>`, no `javascript:` links, no inline handlers, no remote files, all assets present)
- "Inspect generated code" (HTML / CSS), print-friendly CSS (browser Print → Save as PDF)
- "My Portfolios": create, duplicate, delete, full-page preview (saved in the browser)
- Accessible: semantic HTML, labels, visible focus, `prefers-reduced-motion`, keyboard friendly

## Tech stack

| Part | Technology |
| --- | --- |
| Builder UI | React 18, TypeScript, Vite, Tailwind CSS, React Router, Framer Motion, Lucide icons |
| Export | JSZip (loaded only when a ZIP is requested) |
| Tests | Vitest, Testing Library, jsdom |
| **Generated portfolio** | **HTML5 + CSS3 only** |

Brand icons are not imported from an icon pack. The generated portfolio uses plain text links for social profiles.

## Architecture

```text
PortfolioData (typed model)  ──►  Template registry (17 TemplateDef)
        │                                   │
        └────────────►  renderPortfolio()  ◄┘      src/engine/render.ts
                              │
                     buildCss()  +  checkExport()    css.ts / check.ts
                              │
              ┌───────────────┴────────────────┐
        single index.html              index.html + style.css + assets/ (ZIP)
```

- **One data model, many templates.** Switching a template never touches the student's data (`applyTemplate`).
- A template is one small file in `src/engine/templates/` (metadata + CSS). Shared markup lives in `render.ts`.
- All user text is escaped; only `http(s)` links and `data:image` / `data:application/pdf` URLs are allowed.
- Images are resized in the browser and stored as WebP (JPEG fallback). In the ZIP they become real files in `assets/`.

### Add a new template

1. Copy any file in `src/engine/templates/` (for example `mono.ts`) and change `id`, `name`, `category`, colours and `css`.
2. Import it and add it to the list in `src/engine/templates/index.ts`.
3. Run `npm test`. Every template is automatically tested with full, minimal and empty data.

## Folder structure

```text
src/
  types/        data model (PortfolioData, TemplateDef, ...)
  data/         demo data, defaults, template switching helpers
  engine/       render, css, check, export, formatCss, templates/
  lib/          storage, validation, image + download helpers, hooks
  components/   ui/ (Button, Field, Modal, Toast, Tabs), steps/, gallery, preview
  pages/        Landing, Templates, NewPortfolio, Dashboard, Builder, View
```

## Data storage

Portfolios are saved in the browser (`localStorage`) so no account or server is needed. Photos are shrunk before saving. If the browser storage is full the editor shows a clear message.

## Deployment

`npm run build` creates a static `dist/` folder. Deploy it to Netlify, Vercel or any static host. Because the app uses client-side routes, configure a rewrite of all paths to `index.html` (Netlify: `/* /index.html 200`).

## Environment variables

None are needed for the current version. `.env.example` lists the variables planned for the backend. Never commit `.env`.

## Roadmap

- Backend: Node.js + Express + PostgreSQL + Prisma (users, portfolios and their sections as relational tables)
- Sign up / login, cloud save, publish with a shareable URL, QR code
- More templates, analytics, AI-assisted writing help

## Project documentation note

When writing the field-project report, keep real observations separate from synthetic test data. The demo portfolio ("Alex Morgan") is fictional sample data. Do not report survey numbers unless you actually collected them.

## Screenshots

Add screenshots to `docs/screenshots/` and link them here.

## License

MIT, see `LICENSE`.
