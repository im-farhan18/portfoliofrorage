import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FilePlus2, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ui/Toast';
import { demoData, emptyData } from '../data/demo';
import { getTemplate } from '../engine/templates';
import { createRecord, getRecord } from '../lib/storage';

export default function NewPortfolio() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const toast = useToast();
  const tpl = getTemplate(params.get('template') ?? 'cyberpulse');
  const start = (sample: boolean) => {
    const rec = createRecord(sample ? demoData(tpl.id) : emptyData(tpl.id), 'My Portfolio');
    if (!getRecord(rec.id)) { toast('Your browser blocked saving. Turn off private browsing and try again.', 'error'); return; }
    nav(`/builder/${rec.id}`);
  };
  const card = 'group rounded-2xl border border-line bg-surface p-7 text-left shadow-soft transition hover:-translate-y-1 hover:border-brand focus-visible:-translate-y-1';
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">How would you like to start?</h1>
        <p className="mt-2 text-muted">Template: <b className="text-ink">{tpl.name}</b>. You can change it any time. <Link to="/templates" className="text-brand underline">Choose another</Link></p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <button type="button" className={card} onClick={() => start(true)}>
            <Sparkles className="text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Start with sample data</h2>
            <p className="mt-1 text-sm text-muted">See a finished portfolio straight away, then replace the sample text with your own. Best for first-timers.</p>
          </button>
          <button type="button" className={card} onClick={() => start(false)}>
            <FilePlus2 className="text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">Start from scratch</h2>
            <p className="mt-1 text-sm text-muted">Begin with an empty portfolio and fill in your own details step by step.</p>
          </button>
        </div>
      </main>
    </div>
  );
}
