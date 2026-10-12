import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { btnClass } from '../components/ui/Button';

export default function NotFound({ title = 'Page not found', text = 'The page you are looking for does not exist.' }: { title?: string; text?: string }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="gradient-text text-6xl font-extrabold">404</p>
        <h1 className="mt-4 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-muted">{text}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/dashboard" className={btnClass('primary')}>My Portfolios</Link>
          <Link to="/" className={btnClass()}>Home</Link>
        </div>
      </main>
    </div>
  );
}
