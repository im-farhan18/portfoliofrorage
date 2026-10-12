import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Logo({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2 font-bold tracking-tight" aria-label="PortfolioForge home">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-fuchsia-500 text-white shadow-glow">
        <Zap size={16} aria-hidden="true" />
      </span>
      <span className={compact ? 'hidden sm:inline' : ''}>
        Portfolio<span className="gradient-text">Forge</span>
      </span>
    </Link>
  );
}
