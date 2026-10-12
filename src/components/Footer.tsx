import { Link } from 'react-router-dom';
import Logo from './Logo';

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
      <p className="border-t border-line py-4 text-center text-xs text-muted">Sample content in templates is fictional demo data.</p>
    </footer>
  );
}
