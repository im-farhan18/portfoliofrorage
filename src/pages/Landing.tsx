import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Download, Eye, Layers, Palette, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TemplateThumb from '../components/TemplateThumb';
import { btnClass } from '../components/ui/Button';
import { demoData } from '../data/demo';
import { TEMPLATES, getTemplate } from '../engine/templates';

const DEMO = demoData();
const ROTATE = ['cyberpulse', 'glassflow', 'aurora', 'minimal-pro'];
const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } } as const;

const FEATURES = [
  { Icon: Layers, title: `${TEMPLATES.length} different templates`, text: 'Cyberpunk, glass, minimal, corporate, terminal and more. Switch any time and your details never change.' },
  { Icon: Eye, title: 'Live preview on every device', text: 'Watch your portfolio update while you type. Check desktop, tablet and mobile before you share it.' },
  { Icon: Palette, title: 'Customize in seconds', text: 'Light or dark theme, accent colour, font, spacing and animation level. No design skills needed.' },
  { Icon: ShieldCheck, title: 'Zero JavaScript, verified', text: 'Your website is plain HTML and CSS. Every export is scanned for scripts before you can download it.' },
  { Icon: Download, title: 'HTML or ZIP, works offline', text: 'One file or a folder with images. Double-click index.html. No server and no build step.' },
  { Icon: Printer, title: 'Print-ready', text: 'Use the browser’s Print and Save as PDF to get a clean PDF version of your portfolio.' },
];
const HOW = [
  ['Fill in your details', 'A friendly step-by-step form for your profile, skills, projects and more.'],
  ['Choose a template', 'Browse real previews and pick the one that feels like you.'],
  ['Customize and preview', 'Adjust colours, fonts and animation. See every change instantly.'],
  ['Download and share', 'Get index.html or a ZIP. Upload it to any free static host.'],
];

function HeroMockup() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % ROTATE.length), 3800);
    return () => clearInterval(t);
  }, []);
  const id = ROTATE[i];
  const chip = 'absolute hidden animate-float items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-medium shadow-soft sm:flex';
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand/30 via-fuchsia-500/20 to-cyan-400/30 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-glow">
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 flex-1 truncate rounded-md bg-bg px-3 py-1 text-xs text-muted">my-portfolio / index.html</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <TemplateThumb data={DEMO} templateId={id} height={340} />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center text-sm text-muted">Template: <b className="text-ink">{getTemplate(id).name}</b></p>
      <div className={`${chip} -left-4 top-24`}><Check size={14} className="text-green-500" aria-hidden="true" /> Zero JavaScript</div>
      <div className={`${chip} -right-3 bottom-24 [animation-delay:-3s]`}><Download size={14} className="text-brand" aria-hidden="true" /> index.html + ZIP</div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-24 top-0 h-96 w-96 animate-drift rounded-full bg-brand/25 blur-3xl" />
            <div className="absolute right-0 top-40 h-96 w-96 animate-drift rounded-full bg-fuchsia-500/20 blur-3xl [animation-delay:-6s]" />
          </div>
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-14 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
            <div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium">
                <Sparkles size={14} className="text-brand" aria-hidden="true" /> Made for students. No coding needed.
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                Build a Portfolio <span className="gradient-text">Without Writing Code.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mt-5 max-w-xl text-lg text-muted">
                Choose a design. Fill in your details. Customize it. Publish it.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 flex flex-wrap gap-3">
                <Link to="/new" className={btnClass('primary', 'lg', 'group')}>Create My Portfolio <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden="true" /></Link>
                <Link to="/templates" className={btnClass('secondary', 'lg')}>Explore Templates</Link>
              </motion.div>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {['Static HTML + CSS', 'Zero JavaScript', 'Works offline', `${TEMPLATES.length} templates`].map((t) => (
                  <li key={t} className="flex items-center gap-1.5"><Check size={14} className="text-green-500" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
            <HeroMockup />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <motion.div {...reveal} className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything a student portfolio needs</h2>
            <p className="mt-3 text-muted">You write the content. PortfolioForge handles the code, the layout and the checks.</p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, text }, i) => (
              <motion.div key={title} {...reveal} transition={{ duration: 0.5, delay: i * 0.05 }} className="rounded-2xl border border-line bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand"><Icon size={22} aria-hidden="true" /></span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how" className="scroll-mt-20 border-y border-line bg-surface/50 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <motion.h2 {...reveal} className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">From zero to portfolio in minutes</motion.h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW.map(([t, d], i) => (
                <motion.li key={t} {...reveal} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative rounded-2xl border border-line bg-surface p-6">
                  <span className="gradient-text text-4xl font-extrabold">{i + 1}</span>
                  <h3 className="mt-2 font-semibold">{t}</h3>
                  <p className="mt-1.5 text-sm text-muted">{d}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section id="templates" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <motion.div {...reveal} className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Templates with real previews</h2>
              <p className="mt-2 text-muted">Every card below is a live render of the actual template.</p>
            </div>
            <Link to="/templates" className={btnClass('secondary')}>See all {TEMPLATES.length} <ArrowRight size={16} aria-hidden="true" /></Link>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {TEMPLATES.slice(0, 8).map((t, i) => (
              <motion.div key={t.id} {...reveal} transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}>
                <Link to={`/new?template=${t.id}`} className="group block overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition hover:-translate-y-1 hover:border-brand">
                  <TemplateThumb data={DEMO} templateId={t.id} height={170} />
                  <div className="flex items-center justify-between px-3.5 py-3">
                    <span className="text-sm font-semibold">{t.name}</span>
                    <span className="text-xs text-muted">{t.category}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <motion.div {...reveal} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-fuchsia-500 to-cyan-500 p-10 text-center text-white shadow-glow sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to show your work?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">Start with sample data, replace it with yours and download a portfolio you can open anywhere.</p>
            <Link to="/new" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand transition hover:scale-105">Create My Portfolio <ArrowRight size={18} aria-hidden="true" /></Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
