import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Laptop, Menu, Moon, Sun, X } from 'lucide-react';
import Logo from './Logo';
import { btnClass } from './ui/Button';
import { applyTheme, getStoredTheme, type UiTheme } from '../lib/theme';

const LINKS = [{ to: '/templates', label: 'Templates' }, { to: '/dashboard', label: 'My Portfolios' }];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<UiTheme>(getStoredTheme());
  const cycle = () => {
    const next: UiTheme = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
    setTheme(next);
    applyTheme(next);
  };
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Laptop;
  const link = ({ isActive }: { isActive: boolean }) => `rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-ink/5 ${isActive ? 'text-brand' : 'text-ink'}`;
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Logo />
        <nav aria-label="Main" className="ml-8 hidden items-center gap-1 md:flex">
          <a href="/#features" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5">Features</a>
          <a href="/#how" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5">How it works</a>
          {LINKS.map((l) => <NavLink key={l.to} to={l.to} className={link}>{l.label}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={cycle} aria-label={`Colour theme: ${theme}. Click to change.`} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface transition hover:border-brand">
            <Icon size={18} aria-hidden="true" />
          </button>
          <Link to="/new" className={btnClass('primary', 'md', 'hidden sm:inline-flex')}>Create My Portfolio</Link>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav aria-label="Mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line md:hidden">
            <div className="flex flex-col gap-1 p-3" onClick={() => setOpen(false)}>
              <a href="/#features" className="rounded-lg px-3 py-2 text-sm font-medium">Features</a>
              <a href="/#how" className="rounded-lg px-3 py-2 text-sm font-medium">How it works</a>
              {LINKS.map((l) => <NavLink key={l.to} to={l.to} className={link}>{l.label}</NavLink>)}
              <Link to="/new" className={btnClass('primary', 'md', 'mt-2')}>Create My Portfolio</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
