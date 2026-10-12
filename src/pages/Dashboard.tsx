import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import TemplateThumb from '../components/TemplateThumb';
import { Button, btnClass } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { getTemplate } from '../engine/templates';
import { deleteRecord, duplicateRecord, listRecords } from '../lib/storage';
import type { PortfolioRecord } from '../types/portfolio';

const when = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function Dashboard() {
  const toast = useToast();
  const [items, setItems] = useState<PortfolioRecord[]>(() => listRecords());
  const [del, setDel] = useState<PortfolioRecord | null>(null);
  const refresh = () => setItems(listRecords());
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Portfolios</h1>
            <p className="mt-1 text-muted">Saved in this browser. Create as many as you like: developer, internship, creative…</p>
          </div>
          <Link to="/new" className={btnClass('primary')}><Plus size={16} aria-hidden="true" /> New portfolio</Link>
        </div>
        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-line p-14 text-center">
            <p className="text-lg font-semibold">No portfolios yet</p>
            <p className="mt-1 text-muted">Create your first one. It takes a few minutes.</p>
            <Link to="/new" className={btnClass('primary', 'md', 'mt-5')}>Create My Portfolio</Link>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <li key={r.id} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
                <Link to={`/builder/${r.id}`} aria-label={`Edit ${r.name}`} className="block"><TemplateThumb data={r.data} templateId={r.data.settings.template} height={180} /></Link>
                <div className="p-4">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="text-xs text-muted">{r.data.profile.name || 'No name yet'} · {getTemplate(r.data.settings.template).name} · Updated {when(r.updatedAt)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link to={`/builder/${r.id}`} className={btnClass('secondary', 'sm')}><Pencil size={14} aria-hidden="true" /> Edit</Link>
                    <Link to={`/view/${r.id}`} target="_blank" rel="noopener noreferrer" className={btnClass('secondary', 'sm')}><ExternalLink size={14} aria-hidden="true" /> Preview</Link>
                    <Button size="sm" icon={<Copy size={14} />} onClick={() => { duplicateRecord(r.id); refresh(); toast('Portfolio duplicated'); }}>Duplicate</Button>
                    <Button size="sm" variant="danger" icon={<Trash2 size={14} />} onClick={() => setDel(r)}>Delete</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete this portfolio?">
        <p className="mt-2 text-sm text-muted">“{del?.name}” will be removed from this browser. This cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={() => setDel(null)}>Cancel</Button>
          <Button variant="primary" className="!bg-red-500" onClick={() => { if (del) deleteRecord(del.id); setDel(null); refresh(); toast('Portfolio deleted'); }}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
