import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

interface Props<T extends { id: string }> {
  items: T[];
  onChange: (items: T[]) => void;
  make: () => T;
  /** singular name, e.g. "project" */
  noun: string;
  title: (item: T) => string;
  children: (item: T, patch: (p: Partial<T>) => void, index: number) => ReactNode;
}

/** One reusable editor for every repeatable section (education, projects, experience, certificates, achievements). */
export default function ListEditor<T extends { id: string }>({ items, onChange, make, noun, title, children }: Props<T>) {
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const patch = (i: number) => (p: Partial<T>) => onChange(items.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const a = [...items];
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };
  const icon = 'grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-ink/5 hover:text-ink disabled:opacity-30';
  return (
    <div className="space-y-4">
      {items.map((it, i) => {
        const open = !closed[it.id];
        return (
          <fieldset key={it.id} className="rounded-2xl border border-line bg-surface">
            <legend className="sr-only">{noun} {i + 1}</legend>
            <div className="flex items-center gap-1 px-3 py-2.5">
              <button type="button" aria-expanded={open} onClick={() => setClosed((c) => ({ ...c, [it.id]: open }))} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left font-medium hover:bg-ink/5">
                <ChevronDown size={16} aria-hidden="true" className={`flex-none transition ${open ? '' : '-rotate-90'}`} />
                <span className="truncate">{title(it).trim() || `New ${noun}`}</span>
              </button>
              <button type="button" className={icon} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${noun} up`}><ArrowUp size={15} /></button>
              <button type="button" className={icon} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${noun} down`}><ArrowDown size={15} /></button>
              <button type="button" className={`${icon} hover:!text-red-500`} onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${noun}`}><Trash2 size={15} /></button>
            </div>
            {open && <div className="space-y-4 border-t border-line p-4">{children(it, patch(i), i)}</div>}
          </fieldset>
        );
      })}
      {items.length === 0 && <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">Nothing here yet. If you have nothing to add, skip this step. The section is hidden from your portfolio automatically.</p>}
      <Button icon={<Plus size={16} />} onClick={() => onChange([...items, make()])}>Add {noun}</Button>
    </div>
  );
}
