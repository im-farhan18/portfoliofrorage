import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Logo from './Logo';

/* ───── Apni details yahan bharo. Jis link mein "YOUR" bacha hoga wo footer mein dikhega hi nahi. ───── */
const DEV = {
  name: 'Farhan Khan',
  role: 'BCA Student • C++ DSA Learner',
  photo: '/developer.jpg',
  email: 'khanfarhan2358@gmail.com',
  github: 'https://github.com/im-farhan18',
  linkedin: 'https://www.linkedin.com/in/farhan-khan-9b68743a2/',
  instagram: 'https://www.instagram.com/im.farhan.18/',
};

const CONTACTS = [
  { label: 'Email', href: `mailto:${DEV.email}`, external: false },
  { label: 'GitHub', href: DEV.github, external: true },
  { label: 'LinkedIn', href: DEV.linkedin, external: true },
  { label: 'Instagram', href: DEV.instagram, external: true },
].filter((c) => !c.href.includes('YOUR'));

const pill =
  'inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-brand hover:text-ink';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-sm text-muted">A no-code portfolio builder for students. Every portfolio it creates is plain HTML and CSS with zero JavaScript.</p>
        </div>
        <nav aria-label="Footer" className="flex gap-5 text-sm text-muted">
          <Link to="/templates" className="hover:text-ink">Templates</Link>
          <Link to="/dashboard" className="hover:text-ink">My Portfolios</Link>
          <Link to="/new" className="hover:text-ink">Create</Link>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 text-center sm:flex-row sm:text-left">
          <div className="flex-none rounded-2xl border border-line bg-gradient-to-b from-brand/25 to-surface p-1.5 shadow-soft">
            <img
              src={DEV.photo}
              alt={`${DEV.name}, developer of PortfolioForge`}
              width={172}
              height={196}
              loading="lazy"
              className="h-24 w-[72px] rounded-xl object-cover object-top"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Meet the developer</p>
            <p className="text-base font-bold">{DEV.name}</p>
            <p className="text-sm text-muted">{DEV.role}</p>
            {CONTACTS.length > 0 && (
              <ul aria-label="Contact" className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {CONTACTS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      className={pill}
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {c.label === 'Email' && <Mail size={14} aria-hidden="true" />}
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <p className="border-t border-line py-4 text-center text-xs text-muted">
      <b>  © 2026 {DEV.name}. All rights reserved.</b><br></br><i> Sample content in templates is fictional demo data.</i>
      </p>
    </footer>
  );
}
