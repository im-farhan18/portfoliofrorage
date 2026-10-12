import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { renderPortfolio } from '../engine/render';
import { getRecord } from '../lib/storage';
import NotFound from './NotFound';

/** Full-page view of the generated portfolio (the same static HTML that gets exported). */
export default function View() {
  const { id = '' } = useParams();
  const rec = useMemo(() => getRecord(id), [id]);
  const html = useMemo(() => (rec ? renderPortfolio(rec.data).html : ''), [rec]);
  if (!rec) return <NotFound title="Portfolio not found" text="This portfolio is not saved in this browser." />;
  return (
    <div className="fixed inset-0 bg-white">
      <iframe title={`${rec.name} portfolio`} srcDoc={html} sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" className="h-full w-full border-0" />
      <Link to={`/builder/${id}`} className="fixed bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/80 px-4 py-2 text-sm font-medium text-white shadow-soft backdrop-blur transition hover:bg-black">
        <ArrowLeft size={16} aria-hidden="true" /> Back to editor
      </Link>
    </div>
  );
}
